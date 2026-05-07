import { useState, useEffect, useCallback } from 'react';
import showDeleteConfirmation from '../../../hooks/showDeleteConfirmation.js';
import Pagination from '../../common/Pagination.jsx';
import Breadcrum from '../../common/Breadcrum.jsx';
import { useLoading } from '../../../context/LoadingContext.jsx';
import AddBtn from '../../buttons/AddBtn.jsx';
import EditBtn from '../../buttons/EditBtn.jsx';
import DeleteBtn from '../../buttons/DeleteBtn.jsx';
import { getUserList, deleteUser } from './endpoints';
import { useSelector } from "react-redux";
import permission from '../../../services/permission.js';
import SearchSelect from '../../common/SearchSelect.jsx';
// import { searchLastName } from '../../../api/endpoints.js';

export default function UserIndex() {
    const { data } = useSelector((state) => state.data);
    const [sortColumn, setSortColumn] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');
    const [userName, setUserName] = useState([]); // For multi-select usernames
    const [searchUserNameOption, setSearchUserNameOption] = useState([]);

    const [lastName, setLastName] = useState([]);
    const [searchLastNameOption, setsearchLastNameOption] = useState([]);

    const [firstName, setFirstName] = useState([]);
    const [searchFirstNameOption, setSearchFirstNameOption] = useState([]);

    // const [lastName, setLastName] = useState('');
    const [isActive, setIsActive] = useState('');
    const [datas, setDatas] = useState([]);
    const [pagination, setPagination] = useState({
        total_pages: 1,
        current_page: 1,
        per_page: 50,
        total_items: 50,
    });

    const { setIsLoading } = useLoading();
    const [isSearching, setIsSearching] = useState(false);

    const handleSort = (column) => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newSortOrder);
        setIsLoading(true);
    };

    const getSortIcon = (column) => {
        if (column === sortColumn) {
            return sortOrder === 'asc' ? '▲' : '▼';
        }
        return '';
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, current_page: newPage }));
        setIsLoading(true);
    };

    const handlePerPageChange = (perPage) => {
        setPagination((prevState) => ({ ...prevState, per_page: perPage, current_page: 1 }));
        setIsLoading(true);
    };

    const fetchDatas = useCallback(async () => {
        const params = {
            page: pagination.current_page,
            per_page: pagination.per_page,
            sort_column: sortColumn,
            sort_order: sortOrder,
            username: userName.map((user) => user.id).join(','),
            first_name: firstName.map((user) => user.id).join(','),
            last_name: lastName.map((user) => user.id).join(','),
        };

        if (isActive) {
            params.is_active = isActive;
        }

        try {
            if (isSearching) {
                setIsLoading(true);
            }

            const res = await getUserList(params);
            const users = res.data?.user_roles || [];
            const paginationData = res.data?.pagination || {};
            setDatas(users);
            setPagination((prev) => ({
                ...prev,
                total_items: paginationData.total || 0,
                total_pages: paginationData.total_pages || 1,
            }));
        } catch (error) {
            console.error('Error fetching user list:', error);
            setDatas([]);
            setPagination({
                total_pages: 1,
                current_page: 1,
                per_page: 50,
                total_items: 50,
            });
        } finally {
            setIsSearching(false);
            setIsLoading(false);
        }
    }, [
        pagination.current_page,
        pagination.per_page,
        sortColumn,
        sortOrder,
        userName,
        firstName,
        lastName,
        isActive,
        isSearching,
        setIsLoading,
    ]);

    const getSearchParams = () => ({
        username: userName.map((user) => user.id).join(','),
        last_name: lastName.map((user) => user.id).join(','),
        first_name: firstName.map((user) => user.id).join(','),
        // first_name: firstName,
        // last_name: lastName,
        is_active: isActive,
    });

    const searchDatas = () => {
        const searchParams = getSearchParams();
        setIsLoading(true);
        getUserList(searchParams)
            .then((res) => {
                if (res.data) {
                    setDatas(res.data.user_roles || []);
                    setPagination((prev) => ({
                        ...prev,
                        total_items: res.data.pagination?.total || 0,
                        total_pages: res.data.pagination?.total_pages || 1,
                    }));
                } else {
                    console.error('No data returned from the server.');
                }
            })
            .catch((error) => {
                console.error('Error during search:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const clearSearch = () => {
        setUserName([]);
        setFirstName([]);
        setLastName([]);
        setIsActive('');
        setPagination((prev) => ({ ...prev, current_page: 1 }));
        fetchDatas();
    };

    const handleDelete = (id) => {
        showDeleteConfirmation().then(async (res) => {
            if (res.isConfirmed) {
                setIsLoading(true);
                try {
                    await deleteUser({ id });
                    fetchDatas();
                } catch (error) {
                    console.error('Error deleting user:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    useEffect(() => {
        fetchDatas();
    }, [fetchDatas]);

    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div>
                    <Breadcrum breadcrumbs={[{ name: 'Dashboard', url: '/' }, { name: 'Users', url: '/user' }]} />
                    <h2 className="h4">User Management</h2>
                </div>
                <div className="btn-toolbar">
                    <AddBtn menu={'user'} btnName={'Add User'} url={'/user/create'} />
                </div>
            </div>

            {permission(data, 'user', 'Search') && (
                <div className="card card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="col-lg-10 col-md-9">
                            <h4>Search</h4>
                        </div>
                        <div className="col-lg-2 col-md-3 text-end">
                            <button id="toggleButton" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" style={{ border: '#F2F4F6', background: 'white' }}>
                                <i id="toggleIcon" className="fa fa-chevron-down" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                    <div className="collapse" id="collapseExample">
                        <div className="card card-body">
                            <form className="row g-3">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <SearchSelect
                                            name="username"
                                            type="usernames"
                                            value={userName}
                                            options={searchUserNameOption}
                                            setOptions={setSearchUserNameOption}
                                            isMulti={true}
                                            onChange={(selected) => setUserName(selected || [])}
                                            label="username"
                                            track_by="id"
                                            placeholder="Search Username"
                                            readonly={false}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <SearchSelect
                                            name="first_name"
                                            type="first_names"
                                            value={firstName}
                                            options={searchFirstNameOption}
                                            setOptions={setSearchFirstNameOption}
                                            isMulti={true}
                                            onChange={(selected) => setFirstName(selected || [])}
                                            label="first_name"
                                            track_by="id"
                                            placeholder="Search First Name"
                                            readonly={false}
                                        />
                                    </div>
                                    <div className="col-md-3">


                                        <SearchSelect
                                            name="last_name"
                                            type="last_names"
                                            value={lastName}
                                            options={searchLastNameOption}
                                            setOptions={setsearchLastNameOption}
                                            isMulti={true}
                                            onChange={(selected) => setLastName(selected || [])}
                                            label="last_name"
                                            track_by="id"
                                            placeholder="Search Last Name"
                                            readonly={false}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <select
                                            className="form-control"
                                            value={isActive}
                                            onChange={(e) => setIsActive(e.target.value)}
                                        >
                                            <option value="">All</option>
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end py-3">
                                    <button type="button" className="btn btn-primary me-2" onClick={searchDatas}>
                                        Search
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={clearSearch}>
                                        Clear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="card card-body border-0 shadow table-wrapper table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Actions</th>
                            <th onClick={() => handleSort('id')}>S.No {getSortIcon('id')}</th>
                            <th onClick={() => handleSort('username')}>Username {getSortIcon('username')}</th>
                            <th onClick={() => handleSort('first_name')}>First Name {getSortIcon('first_name')}</th>
                            <th onClick={() => handleSort('last_name')}>Last Name {getSortIcon('last_name')}</th>
                            <th onClick={() => handleSort('role')}>Role {getSortIcon('role')}</th>
                            <th onClick={() => handleSort('parents')}>Parents {getSortIcon('parents')}</th>
                            <th onClick={() => handleSort('is_active')}>Active {getSortIcon('is_active')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            datas.map((data, index) => (
                                <tr key={data.id}>
                                    <td>
                                        <EditBtn menu={'user'} url={`/user/${data.id}`} />
                                        <DeleteBtn menu={'user'} onClick={() => handleDelete(data.id)} />
                                    </td>
                                    <td>{index + ((pagination.current_page - 1) * pagination.per_page + 1)}</td>
                                    <td>{data.username}</td>
                                    <td>{data.first_name}</td>
                                    <td>{data.last_name}</td>
                                    <td>{data.roles.map((role) => role.role__role_name).join(', ')}</td>
                                    <td>{data.parents.map((parent) => `${parent.first_name} ${parent.last_name}`).join(', ')}</td>
                                    <td>{data.is_active ? 'True' : 'False'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination
                    total_pages={pagination.total_pages}
                    current_page={pagination.current_page}
                    per_page={pagination.per_page}
                    total_items={pagination.total_items}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </div>
    );
}
