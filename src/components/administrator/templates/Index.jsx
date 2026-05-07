import { useState, useEffect, useCallback } from 'react';
import { useSelector } from "react-redux"
import { useLoading } from '../../../context/LoadingContext.jsx';
import Breadcrum from '../../common/Breadcrum.jsx';
import Pagination from '../../common/Pagination.jsx';
import showDeleteConfirmation from '../../../hooks/showDeleteConfirmation.js';
import AddBtn from '../../buttons/AddBtn.jsx';
import EditBtn from '../../buttons/EditBtn.jsx';
import DeleteBtn from '../../buttons/DeleteBtn.jsx';
import permission from '../../../services/permission.js';
import { getTemplatesList, deleteTemplates } from "./endpoints";

export default function Index() {
    const { data } = useSelector((state) => state.data);
    const [sortColumn, setSortColumn] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState({
        name: ''
    });
    const [fromDate, setFromDate] = useState('');

    const handleSort = (column) => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newSortOrder);
    };
    const getSortIcon = (column) => {
        if (column === sortColumn) {
            return sortOrder === 'asc' ? ' ▲' : '▼';
        }
        return '';
    };
    const { setIsLoading } = useLoading();
    const initialPagination = {
        total_pages: 10,
        current_page: 1,
        per_page: 50,
        total_items: 50,
    };
    const breadcrumbs = [
        { 'name': 'Dashboard', 'url': '/' },
        { 'name': 'Templates', 'url': '/templates' }
    ];
    const [pagination, setPagination] = useState(initialPagination);
    const [datas, setDatas] = useState([]);
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            current_page: newPage,
        }));
    };
    const handlePerPageChange = (perPage) => {
        setPagination((prevState) => ({ ...prevState, per_page: perPage, current_page: 1 }));
    };
    const fetchDatas = useCallback(() => {
        setIsLoading(true);
        getTemplatesList({
            page: pagination.current_page,
            per_page: pagination.per_page,
            sort_column: sortColumn,
            sort_order: sortOrder,
        }).then(res => {
            setDatas(res.data.templates);
            setPagination((prev) => ({
                ...prev,
                total_items: res.data.pagination.total,
                total_pages: res.data.pagination.total_pages,
            }));
        }).finally(() => {
            setIsLoading(false);
        })
    }, [pagination.current_page, pagination.per_page, sortColumn, sortOrder]);
    const searchDatas = () => {
        const searchParams = searchTerm;
        setIsLoading(true);
        getTemplatesList(searchParams).then(res => {
            setDatas(res.data.templates);
            setPagination((prev) => ({
                ...prev,
            }));
        }).finally(() => {
            setIsLoading(false);
        });
    };
    const clearSearch = () => {
        setIsLoading(true);
        setSearchTerm({ name: '' });
        getTemplatesList().then(res => {
            setDatas(res.data.templates);
            setPagination((prev) => ({
                ...prev,
                total_items: res.data.pagination.total,
                total_pages: res.data.pagination.total_pages,
            }));
        }).finally(() => {
            setIsLoading(false);
        });
    };
    const handleDelete = (id) => {
        setIsLoading(true);
        showDeleteConfirmation().then((res) => {
            if (res.isConfirmed) {
                deleteTemplates({ id: id }).then((res) => {
                    fetchDatas();
                });
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchDatas();
    }, []);

    return (
        <div>

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                    <Breadcrum breadcrumbs={breadcrumbs} />
                    <h2 className="h4">Templates</h2>
                </div>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <AddBtn menu={'templates'} btnName={'Add Template'} url={'/templates/create'} />
                </div>
            </div>

            {permission(data, 'templates', 'Search') &&
                (<div className='card card-body'>
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
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        placeholder="Search Name"
                                        className="form-control"
                                        value={searchTerm.name}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button className="btn btn-primary mx-2" type="button" onClick={() => searchDatas()}>
                                        Search
                                    </button>
                                    <button className="btn btn-warning" type="button" onClick={() => clearSearch()}>
                                        clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
            }

            <div className="card card-body border-0 shadow table-wrapper table-responsive">
                <table className="table table-hover mb-3">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('id')}># {getSortIcon('id')}</th>
                            <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.map((data, index) => (
                            <tr key={index}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>
                                    <EditBtn menu={'templates'} url={'/templates/edit/' + data.id} />
                                    <DeleteBtn menu={'templates'} onClick={() => handleDelete(data.id)} />
                                </td>
                            </tr>
                        ))}
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
    )
}