//  role dropdown 
import { getRoleList, saveRole, updateRole, deleteRole } from './endpoints.js';
import { useState, useEffect, useCallback } from 'react';
import showDeleteConfirmation from '../../../hooks/showDeleteConfirmation.js';
import Pagination from '../../common/Pagination.jsx';
import Breadcrum from '../../common/Breadcrum.jsx';
import { useLoading } from '../../../context/LoadingContext.jsx';
import AddModalBtn from '../../buttons/AddModalBtn.jsx';
import DeleteBtn from '../../buttons/DeleteBtn.jsx';
import EditModalBtn from '../../buttons/EditModalBtn.jsx';
import axios from "axios";
import { useSelector } from "react-redux"
import permission from '../../../services/permission.js';

// !
import SearchSelect from '../../common/SearchSelect.jsx';
// !
import { getDropdown } from "../../../api/endpoints.js";
import Select from 'react-select';

export default function RoleIndex() {
  const { data } = useSelector((state) => state.data);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  const [roleName, setRoleName] = useState('');
  const [searchDescriptions, setSearchDescriptions] = useState('');
  const [searchHomePage, setSearchHomePage] = useState('');
  const [searchisRole, setSearchisRole] = useState('');


  // !
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");

  const [searchRoleNameOption, setSearchRoleNameOption] = useState([]);
  const { setIsLoading } = useLoading();
  const initialForm = {
    role_name: '',
    descriptions: '',
    home_page: '',
    isRole: false,
    role_type: '',
    parents: [],
  };
  const role_types = [
    { label: 'Head Office', value: 'HO' },
    { label: 'Branch Office', value: 'BO' },
  ]

  const initialPagination = {
    total_pages: 10,
    current_page: 1,
    per_page: 50,
    total_items: 50,
  };

  const breadcrumbs = [
    { 'name': 'Dashboard', 'url': '/' },
    { 'name': 'Roles', 'url': '/roles' }
  ];


  const [pagination, setPagination] = useState(initialPagination);

  const [roles, setRoles] = useState([]);
  const [roleOpt, setRoleOpt] = useState([]);
  const [filteredRoleOpt, setFilteredRoleOpt] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);

  const formatOptionLabel = ({ label, depth }) => (
    <div style={{ paddingLeft: `${depth * 20}px` }}>
      {label}
    </div>
  );

  // Fetch dropdown data (roles and menus) from the API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        const response = await getDropdown({ menus: true });
        const roles = await getDropdown({ roles_for_role: true });
        setMenus(response.data.menus.map((item) => ({ value: item.id, label: item.title })));
        setRoleOpt(roles.data.roles);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, [setIsLoading]);

  useEffect(() => {
    if (!form.parents || !roleOpt) return;

    const getAllDescendants = (parentValue) => {
      return roleOpt
        .filter((role) => role.parent === parentValue)
        .reduce((acc, role) => {
          acc.push(role.value);
          const childRoles = getAllDescendants(role.value);
          return acc.concat(childRoles);
        }, []);
    };
    const selectedParentValues = form.parents.map((parent) => parent.value);
    const descendantsToRemove = selectedParentValues.flatMap((parentValue) =>
      getAllDescendants(parentValue)
    );
    const newFilteredRoleOpt = roleOpt.filter(
      (role) => !descendantsToRemove.includes(role.value)
    );
    setFilteredRoleOpt(newFilteredRoleOpt);
  }, [form.parents, roleOpt]);


  // 
  const handleSort = (column) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const getSortIcon = (column) => {
    if (column === sortColumn) {
      return sortOrder === 'asc' ? '▼' : '▲';
    }
    return '';
  };



  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((prevform) => ({
      ...prevform,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      current_page: newPage,
    }));
  };

  // per_page-----
  const handlePerPageChange = (perPage) => {
    setPagination((prevState) => ({ ...prevState, per_page: perPage, current_page: 1 }));
  };


  const fetchRoles = useCallback(() => {
    setIsLoading(true);
    getRoleList({
      page: pagination.current_page,
      per_page: pagination.per_page,
      sort_column: sortColumn,
      sort_order: sortOrder,

    }).then((res) => {
      setRoles(res.data.roles);
      setPagination((prev) => ({
        ...prev,
        total_items: res.data.pagination.total,
        total_pages: res.data.pagination.total_pages,
      }));
    }).finally(() => {
      setIsLoading(false);
    });
  }, [pagination.current_page, pagination.per_page, sortColumn, sortOrder]);


  // Function to get search parameters
  const getSearchParams = () => ({
    role_name: roleName.map(item => item.id),
    descriptions: searchDescriptions,
    home_page: searchHomePage,
    isRole: searchisRole !== '' ? searchisRole : undefined,
  });

  const searchDatas = () => {
    const searchParams = getSearchParams();

    setIsLoading(false);
    getRoleList(searchParams)
      .then((res) => {
        setRoles(res.data.roles);
        setPagination((prev) => ({
          ...prev,
          total_items: res.data.pagination.total,
          total_pages: res.data.pagination.total_pages,
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };


  const clearSearch = () => {
    setRoleName([]);
    setSearchDescriptions('');
    setSearchHomePage('');
    setSearchisRole('');

    fetchRoles();
  };


  const handleIsActiveChange = (event) => {
    const value = event.target.value;
    setSearchisRole(value === 'True' ? true : value === 'False' ? false : '');
  };


  const handleSubmit = (event) => {

    event.preventDefault();
    const formData = {
      ...form,
      parents: form.parents.map((item) => item.value),
    };

    setIsLoading(true);

    const saveOrUpdate = isEdit ? updateRole : saveRole;
    saveOrUpdate(formData)
      .then(() => {
        setForm({ role_name: '', descriptions: '', home_page: '', isRole: false });
        setSelectedMenu('');
        setIsEdit(false);
        setForm(initialForm)
        getDropdown({ roles_for_role: true }).then((res) => {
          setRoleOpt(res.data.roles)
        });
        fetchRoles();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = (role) => {
    let role_data = { ...role }
    role_data.parents = roleOpt.filter((item) => role_data.parents.includes(item.value));
    setForm({ ...role_data });
    setSelectedMenu(role_data.home_page);
    setIsEdit(true);
  };


  const handleDelete = (id) => {
    setIsLoading(true);
    showDeleteConfirmation().then((res) => {
      if (res.isConfirmed) {
        deleteRole({ id: id }).then((res) => {
          fetchRoles();
        });
      }
    }).finally(() => {
      setIsLoading(false);
      setIsEdit(false);
    });
  };

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (roleName || searchDescriptions || searchHomePage || searchisRole) searchDatas();
  }, [roleName, searchDescriptions, searchHomePage, searchisRole]);


  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrum breadcrumbs={breadcrumbs} />
          <h2 className="h4">All Roles</h2>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <AddModalBtn menu={'roles'} btnName={'Add Role'} />
        </div>
      </div>

      {permission(data, 'roles', 'Search') &&
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
              <form method="get" className="row g-3">
                <div className="col-md-3">
                  <SearchSelect
                    name="role_name"
                    type="role_names"
                    value={roleName}
                    options={searchRoleNameOption}
                    setOptions={setSearchRoleNameOption}
                    isMulti={true}
                    onChange={(selected) => {
                      if (!selected) {

                        setRoleName([]);
                        return;
                      }

                      setRoleName(selected);
                    }} label="role_name" track_by="id" placeholder="Search Role Name" readonly={false} />
                </div>
                <div className="d-flex justify-content-end  py-3">
                  <button type="submit" className="btn btn-primary me-2" onClick={searchDatas}>Search </button>

                  <button className="btn btn-secondary" type="submit" onClick={clearSearch}>
                    clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>)
      }

      <div className="card card-body border-0 shadow table-wrapper">
        <div className='table-responsive'>
          <table className="table table-hover mb-3">
            <thead>
              <tr>
                <th>Action</th>
                <th onClick={() => handleSort('id')}>S.No {getSortIcon('id')}</th>
                <th onClick={() => handleSort('role_name')}>Role {getSortIcon('role_name')}</th>
                <th onClick={() => handleSort('role_type')}>Type {getSortIcon('role_type')}</th>
                <th onClick={() => handleSort('descriptions')}>Parent {getSortIcon('descriptions')}</th>
                <th onClick={() => handleSort('home_page')}>Home Page {getSortIcon('home_page')}</th>
                <th onClick={() => handleSort('isRole')}>Is Role Active? {getSortIcon('isRole')}</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No records found</td>
                </tr>
              ) : (
                roles.map((role, index) => (
                  <tr key={role.id}>
                    <td>
                      <EditModalBtn menu={'roles'} onClick={() => handleEdit(role)} />
                      <DeleteBtn menu={'roles'} onClick={() => handleDelete(role.id)} />
                    </td>
                    <td>{index + ((pagination.current_page - 1) * pagination.per_page + 1)}</td>
                    <td>{role.role_name}</td>
                    <td>{role_types.find((item) => item.value === role.role_type)?.label}</td>
                    <td>{(roleOpt || []).filter((item) => role.parents.includes(item.value)).map((item) => item.name).join(', ')}</td>
                    <td>{role.home_page_title}</td>
                    <td>{role.isRole ? 'True' : 'False'}</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          total_pages={pagination.total_pages}
          current_page={pagination.current_page}
          per_page={pagination.per_page}
          total_items={pagination.total_items}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
        <div className="modal fade" id="staticBackdrop" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  {isEdit ? "Edit Roles" : 'New Roles'}
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setForm(initialForm)} />
              </div>
              <div className="modal-body">
                <form method="post" onSubmit={handleSubmit}>
                  <div className="form-group mb-4">
                    <label htmlFor="role_type">Role Type</label>
                    <Select
                      id="role_type"
                      className={`basic-multi-select ${form.role_type && !form.role_type.length && 'is-invalid'}`}
                      classNamePrefix="select"
                      name="role_type"
                      value={role_types.find((option) => option.value === form.role_type)}
                      options={role_types}
                      onChange={(option) =>
                        setForm({ ...form, role_type: option.value })
                      }
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="parents">Parent Role</label>
                    <Select
                      id="parents"
                      className={`basic-multi-select`}
                      classNamePrefix="select"
                      name="parents"
                      value={form.parents}
                      formatOptionLabel={formatOptionLabel}
                      options={filteredRoleOpt}
                      onChange={(option) =>
                        setForm({ ...form, parents: option })
                      }
                      isMulti
                      closeMenuOnSelect={false}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="role_name">Role Name<span className="text-danger">*</span></label>
                    <input type="text" name="role_name" className="form-control" id="role_name" value={form.role_name || ''} onChange={handleChange}></input>
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="descriptions">Descriptions <span className="text-danger">*</span></label>
                    <input type="text" name="descriptions" className="form-control" id="descriptions" value={form.descriptions || ''} onChange={handleChange}></input>
                  </div>

                  <div className='form-group mb-4'>
                    <label htmlFor="home_page">Home Page</label>
                    <Select
                      id="home_page"
                      className={`basic-multi-select ${form.home_page && !form.home_page.length && 'is-invalid'}`}
                      classNamePrefix="select"
                      name="home_page"
                      value={menus.find((option) => option.value === form.home_page)}
                      options={menus}
                      onChange={(option) =>
                        setForm({ ...form, home_page: option.value })
                      }
                    />
                  </div>


                  <div className="form-group mb-4">
                    <label htmlFor="isRole">Is Role Active</label>
                    <input type="checkbox" name="isRole" className="form-check-input mx-2" id="isRole" checked={form.isRole || false} onChange={handleChange}></input>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-gray-800" data-bs-dismiss="modal">
                      {isEdit ? 'Update' : 'Save'}
                    </button>

                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close" onClick={() => setForm(initialForm)}>Close</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}