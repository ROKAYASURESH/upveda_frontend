import { getMenuList, saveMenu, updateMenu, deleteMenu } from './endpoints.js';
import { useState, useEffect, useCallback } from 'react';
import showDeleteConfirmation from '../../../hooks/showDeleteConfirmation.js';
import Pagination from '../../common/Pagination.jsx';
import Breadcrum from '../../common/Breadcrum.jsx';
import { useLoading } from '../../../context/LoadingContext.jsx';
import AddModalBtn from '../../buttons/AddModalBtn.jsx';
import DeleteBtn from '../../buttons/DeleteBtn.jsx';
import EditModalBtn from '../../buttons/EditModalBtn.jsx';
import axios from "axios";
import debounce from 'lodash/debounce';
import { useSelector, useDispatch } from "react-redux";
import permission from '../../../services/permission.js';
import SearchSelect from '../../common/SearchSelect.jsx';
import { fetchMenus as fetchMenusAction } from '../../../store/slices/menuSlice.js';

export default function MenuIndex() {
  const [errors, setErrors] = useState({});
  const { data } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const [sortColumn, setSortColumn] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');


  const [titleName, setTitleName] = useState([]);
  const [searchTitleOption, setSearchTitleOption] = useState([]);


  const [searchParent, setSearchParent] = useState('');
  const [position, setPosition] = useState([]);

  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);

  const [pagination, setPagination] = useState({
    total_pages: 1,
    current_page: 1,
    per_page: 50,
    total_items: 50,
  });

  const [form, setForm] = useState({
    parent: '',
    title: '',
    slug: '',
    url: '',
    icon: null,
    created_date: '',
    publish: false,
    position: null
  });

  const [isEdit, setIsEdit] = useState(false);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_BASE_URL + '/menus/parents/')
      .then((response) => setParentOptions(response.data))
      .catch((error) => console.error('Error fetching parent menus:', error));
  }, []);

  const fetchMenus = useCallback(() => {
    setIsLoading(true);
    getMenuList({
      page: pagination.current_page,
      per_page: pagination.per_page,
      sort_column: sortColumn,
      sort_order: sortOrder,
    })
      .then((res) => {
        setMenus(res.data.menus);
        setFilteredMenus(res.data.menus);
        setPagination((prev) => ({
          ...prev,
          total_items: res.data.pagination.total,
          total_pages: res.data.pagination.total_pages,
        }));
      })
      .finally(() => setIsLoading(false));
  }, [pagination.current_page, pagination.per_page, sortColumn, sortOrder]);

  const searchMenus = useCallback(
    debounce(() => {
      const filters = {
        parent_id: searchParent,
      };
      getMenuList(filters)
        .then((res) => setFilteredMenus(res.data.menus))
        .catch((error) => console.error('Error fetching search results:', error));
    }, 500),
    [searchParent]
  );

  // useEffect(() => {
  //   if (searchParent) {
  //     searchMenus(); // Only triggers if `searchParent` changes
  //   }
  // }, [searchParent]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleSort = (column) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const getSortIcon = (column) => {
    if (column === sortColumn) {
      return sortOrder === 'asc' ? '▲' : '▼';
    }
    return '';
  };

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!form.title) formErrors.title = 'Title is required';
    return formErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsLoading(true);
    const action = isEdit ? updateMenu : saveMenu;
    action({ ...form, icon: form.icon || 'fa fa-th-list' })
      .then(() => {
        setForm({
          parent: '',
          title: '',
          slug: '',
          url: '',
          icon: '',
          created_date: '',
          publish: false,
          position: '',
        });
        fetchMenus();
        dispatch(fetchMenusAction());
        setIsEdit(false);

        const modal = window.bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
        modal.hide();
      })
      .finally(() => setIsLoading(false));
  };

  const handleEdit = (menu) => {
    setForm({ ...menu });
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    setIsLoading(true);
    showDeleteConfirmation().then((res) => {
      if (res.isConfirmed) {
        deleteMenu({ id }).then(() => fetchMenus());
      }
    }).finally(() => setIsLoading(false));
  };

  // !
  const getSearchParams = () => ({
    title: titleName.map(item => item.id),
  });

  const searchDatas = () => {
    const searchParams = getSearchParams();

    setIsLoading(true);
    getMenuList({
      ...searchParams,
      parent_id: searchParent, // Ensures `searchParent` is included
    })
      .then((res) => {
        setFilteredMenus(res.data.menus);
        setPagination((prev) => ({
          ...prev,
          total_items: res.data.pagination.total,
          total_pages: res.data.pagination.total_pages,
        }));
      })
      .catch((error) => console.error("Error fetching search results:", error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearSearch = () => {
    setSearchParent('');
    setTitleName([]);
    setSearchTitleOption([]);
    setFilteredMenus(menus); // Reset to full menu list
  };



  const handleCloseModal = () => {
    setForm({
      parent: '',
      title: '',
      slug: '',
      url: '',
      icon: null,
      created_date: '',
      publish: false,
      position: ''
    });
    setErrors({});
    setIsEdit(false);
    fetchMenus();
  };

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div>
          <Breadcrum breadcrumbs={[{ name: 'Dashboard', url: '/' }, { name: 'Menu', url: '/menus' }]} />
          <h2 className="h4">All Menus</h2>
        </div>
        <AddModalBtn menu="menu" btnName="Add Menu" />
      </div>

      {permission(data, 'menu', 'Search') && (
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
              <form className="row g-3">
                <div className="col-md-4">
                  <select value={searchParent} onChange={(e) => setSearchParent(e.target.value)} className="form-select">
                    <option value="">Select Parent</option>
                    {parentOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">

                  <SearchSelect
                    name="title"
                    type="titles"
                    value={titleName}
                    options={searchTitleOption}
                    setOptions={setSearchTitleOption}
                    isMulti={true}
                    onChange={(selected) => {
                      if (!selected) {

                        setTitleName([]);
                        return;
                      }

                      setTitleName(selected);
                    }} label="title" track_by="id" placeholder="Search Title Name" readonly={false} />

                </div>

                <div className="d-flex justify-content-end  py-3">
                  <button type="button" className="btn btn-primary me-2" onClick={searchDatas}>Search </button>
                  <button type="button" className="btn btn-secondary" onClick={clearSearch}>Clear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="card card-body border-0 shadow table-wrapper ">
        <div className='table-responsive'>
          <table className="table table-hover mb-3">
            <thead>
              <tr>
                <th>Actions</th>
                <th onClick={() => handleSort('id')}>S.No {getSortIcon('id')}</th>
                <th onClick={() => handleSort('parent')}>Parent {getSortIcon('parent')}</th>
                <th onClick={() => handleSort('title')}>Title {getSortIcon('title')}</th>
                <th onClick={() => handleSort('position')}>position {getSortIcon('position')}</th>
                <th onClick={() => handleSort('url')}>URL {getSortIcon('url')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenus.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No records found</td>
                </tr>
              ) : (
                filteredMenus.map((menu, index) => (
                  <tr key={menu.id}>
                    <td>
                      <EditModalBtn menu={'menu'} onClick={() => handleEdit(menu)} />
                      <DeleteBtn menu={'menu'} onClick={() => handleDelete(menu.id)} />
                    </td>
                    <td>{index + ((pagination.current_page - 1) * pagination.per_page + 1)}</td>
                    <td>{menu.parent_title || 'No Parent'}</td>
                    <td>{menu.title}</td>
                    <td>{menu.position}</td>
                    <td>{menu.url}</td>
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
          onPageChange={(page) => setPagination((prev) => ({ ...prev, current_page: page }))}
          onPerPageChange={(perPage) => setPagination((prev) => ({ ...prev, per_page: perPage }))}
        />
      </div>

      {/* Add/Edit Modal */}
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog" style={{ maxWidth: '600px' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{isEdit ? "Edit Menu" : 'New Menu'}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="parent" className="form-label">Parent</label>
                  <select id="parent" name="parent" value={form.parent} onChange={handleChange} className='form-select'>
                    <option value="">Select Parent</option>
                    {parentOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.title}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="url" className="form-label">URL</label>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    className='form-control'
                  />
                </div>


                <div className="mb-3">
                  <label htmlFor="position" className="form-label">position</label>
                  <input
                    type="number"
                    className="form-control"
                    id="position"
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                  />
                </div>


                <div className="mb-3">
                  <label htmlFor="icon" className="form-label">Icon</label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    className='form-control'
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Save'}</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


// Comment First then code 