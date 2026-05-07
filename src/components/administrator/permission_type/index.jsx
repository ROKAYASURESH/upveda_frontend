import { getPermissionList, savePermission, updatePermission, deletePermission } from './endpoints.js';
import { useState, useEffect, useCallback } from 'react';
import showDeleteConfirmation from '../../../hooks/showDeleteConfirmation.js';
import Pagination from '../../common/Pagination.jsx';
import Breadcrum from '../../common/Breadcrum.jsx';
import { useLoading } from '../../../context/LoadingContext.jsx';
import AddModalBtn from '../../buttons/AddModalBtn.jsx';
import DeleteBtn from '../../buttons/DeleteBtn.jsx';
import EditModalBtn from '../../buttons/EditModalBtn.jsx';
import { useSelector } from "react-redux";
import permission from '../../../services/permission.js';
import debounce from 'lodash/debounce';
import SearchSelect from '../../common/SearchSelect.jsx';
export default function PermissionTypeIndex() {
  const [errors, setErrors] = useState({});
  const { data } = useSelector((state) => state.data);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // const [searchName, setSearchName] = useState('');
  const [searchNames, setSearchNames] = useState([]);
  const [searchNameOption, setSearchNameOption] = useState([]);

  const [searchCreatedAt, setSearchCreatedAt] = useState('');
  const [searchisActive, setSearchisActive] = useState('');

  const [isLoading, setIsLoading] = useState(false); 
  const { setIsLoading: setGlobalLoading } = useLoading();


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

  const initialForm = {
    name: '',
    created_at: '',
    is_active: false,
  };

  const initialPagination = {
    total_pages: 10,
    current_page: 1,
    per_page: 50,
    total_items: 50,
  };

  const breadcrumbs = [
    { 'name': 'Dashboard', 'url': '/' },
    { 'name': 'Permission Type', 'url': '/permissions' }
  ];

  const [pagination, setPagination] = useState(initialPagination);
  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      current_page: newPage,
    }));
  };

  const handlePerPageChange = (perPage) => {
    setPagination((prevState) => ({ ...prevState, per_page: perPage, current_page: 1 }));
  };

  const fetchPermissions = useCallback(() => {
    setGlobalLoading(true);
    getPermissionList({
      page: pagination.current_page,
      per_page: pagination.per_page,
      sort_column: sortColumn,
      sort_order: sortOrder,
    }).then((res) => {
      setPermissions(res.data.permissions);
      setPagination((prev) => ({
        ...prev,
        total_items: res.data.pagination.total,
        total_pages: res.data.pagination.total_pages,
      }));
    }).finally(() => {
      setGlobalLoading(false);
    });
  }, [pagination.current_page, pagination.per_page, sortColumn, sortOrder]);

  const searchPermissions = useCallback(
    debounce(() => {
      setIsLoading(true);
      const filters = {
        // name: searchName,
        created_at: searchCreatedAt ? new Date(searchCreatedAt).toISOString().split('T')[0] : '',
        is_active: searchisActive !== '' ? searchisActive : undefined,
      };

      getPermissionList({
        ...filters,
        page: pagination.current_page,
        per_page: pagination.per_page,
        sort_column: sortColumn,
        sort_order: sortOrder,
      })
        .then((res) => {
          setPermissions(res.data.permissions);
          setPagination((prev) => ({
            ...prev,
            total_items: res.data.pagination.total,
            total_pages: res.data.pagination.total_pages,
          }));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300),
    [ searchCreatedAt, searchisActive, pagination.current_page, pagination.per_page, sortColumn, sortOrder]
  );

  useEffect(() => {
    if ( searchCreatedAt || searchisActive !== '') {
      searchPermissions(); 
    } else {
      fetchPermissions(); 
    }
  }, [searchCreatedAt, searchisActive, searchPermissions, fetchPermissions]);


  const handleIsActiveChange = (event) => {
    const value = event.target.value;
    setSearchisActive(value); 
  };
  
  const validateForm = () => {
    const formErrors = {};
    if (!form.name) {
      formErrors.name = "Name is required";
    } else if (form.name.length > 50) {
      formErrors.name = "Name cannot exceed 50 characters";
    }
    return formErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    // setGlobalLoading(true);
    if (!isEdit) {
      savePermission(form).then(() => {
        setForm(initialForm);
        fetchPermissions();
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
        modal.hide();
      }).finally(() => {
        // setGlobalLoading(false);
      });
    } else {
      updatePermission(form)
        .then(() => {
          setForm(initialForm);
          fetchPermissions();
          const modal = window.bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
          modal.hide();
        })
        .finally(() => {
          // setGlobalLoading(false);
          setIsEdit(false);
        });
    }
  };

  const handleClearSearch = () => {
    setSearchNames('');
    setSearchCreatedAt('');
    setSearchisActive('');
    fetchPermissions();
  };

  const handleEdit = (permission) => {
    setForm({ ...permission });
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    // setGlobalLoading(true);
    showDeleteConfirmation().then((res) => {
      if (res.isConfirmed) {
        deletePermission({ id }).then(() => {
          fetchPermissions();
        });
      }
    }).finally(() => {
      // setGlobalLoading(false);
      setIsEdit(false);
    });
  };

  const handleCloseModal = () => {
    setForm(initialForm);
    setErrors({});
    setIsEdit(false);
    fetchPermissions();
  };

  // !
  const getSearchParams = () => ({
    name: searchNames.map(item => item.id),
  });
  const searchDatas = () => {
      const searchParams = getSearchParams();
  
      setIsLoading(false);
      getPermissionList(searchParams)
        .then((res) => {
          setPermissions(res.data.permissions);
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
      setSearchNames([]);
      fetchPermissions();
    };

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrum breadcrumbs={breadcrumbs} />
          <h2 className="h4">All Permission Types</h2>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <AddModalBtn menu={'permissions'} btnName={'Add Permission'} />
        </div>
      </div>

      {permission(data, 'permission-types', 'Search') && (
        <div className='card card-body'>
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
              <form method="get" onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-4">
                <SearchSelect
                    name="name"
                    type="names"
                    value={searchNames}
                    options={searchNameOption}
                    setOptions={setSearchNameOption}
                    isMulti={true}
                    onChange={(selected) => {
                      if (!selected) {

                        setSearchNames([]);
                        return;
                      }

                      setSearchNames(selected);
                    }} label="name" track_by="id" placeholder="Search Name" readonly={false} />
                </div>
                <div className="col-md-4">
                  {/* <select
                    className="form-control"
                    value={searchisActive}
                    onChange={handleIsActiveChange}
                  >
                    <option value="">All</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select> */}
                </div>
                <div className="d-flex justify-content-end py-3">
                  <button type="button" className="btn btn-primary me-2" onClick={searchDatas}>
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={clearSearch}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      <div className="card card-body border-0 shadow table-wrapper">
        <div className='table-responsive'>
          <table className="table table-hover mb-3">
            <thead>
              <tr>
                <th>Action</th>
                <th onClick={() => handleSort('id')}>S.No {getSortIcon('id')}</th>
                <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
                <th onClick={() => handleSort('is_active')}>Is Role Active? {getSortIcon('is_active')}</th>
              </tr>
            </thead>
            <tbody>
              {permissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No records found</td>
                </tr>
              ) : (
                permissions.map((permission, index) => (
                  <tr key={permission.id}>
                    <td>
                      <EditModalBtn menu={'permissions'} onClick={() => handleEdit(permission)} />
                      <DeleteBtn menu={'permissions'} onClick={() => handleDelete(permission.id)} />
                    </td>
                    <td>{index + 1}</td>
                    <td>{permission.name}</td>
                    <td>{permission.is_active ? 'True' : 'False'}</td>
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
      </div>

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                {isEdit ? 'Edit Permission' : 'New Permission'}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={handleCloseModal} />
            </div>
            <div className="modal-body">
              <form method="post" onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name" value={form.name || ''} onChange={handleChange} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="is_active">Active</label>
                  <input type="checkbox" name="is_active" className="form-check-input mx-2" id="is_active" checked={form.is_active || false} onChange={handleChange} />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-gray-800">
                    {isEdit ? 'Update' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close"
                    onClick={handleCloseModal}>Close</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
