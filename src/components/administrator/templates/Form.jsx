import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrum from '../../common/Breadcrum.jsx';
import { useLoading } from '../../../context/LoadingContext.jsx';
import { saveTemplates, updateTemplates, getTemplatesById } from "./endpoints";
import MyComponent from '../../common/Editor.jsx';

export default function Form() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const breadcrumbs = [
        { 'name': 'Dashboard', 'url': '/' },
        { 'name': 'Templates', 'url': '/templates' },
        { 'name': 'Template Form', 'url': '#' },
    ];

    useEffect(() => {
        if (id) {
            getTemplatesById(id).then((res) => {
                setFormData(res.data);
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = formData;
        if (id) {
            updateTemplates({ id, ...payload }).then((res) => {
                navigate('/templates');
            });
        } else {
            saveTemplates(payload).then((res) => {
                navigate('/templates');
            });
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                    <Breadcrum breadcrumbs={breadcrumbs} />
                    <h2 className="h4">Template Form</h2>
                </div>
                <div className="btn-toolbar mb-2 mb-md-0">
                </div>
            </div>

            <div className="card border-0 shadow components-section">
                <div className='card-body'>
                    <form onSubmit={handleSubmit}>
                        <div className="row mb4">
                            <div className="col-lg-4 col-sm-6">
                                <div className="mb-4">
                                    <label htmlFor="name">Name <span className="text-danger">*</span></label>
                                    <input type="text" name="name" className={`form-control ${!formData.name && 'is-invalid'}`} id="name" value={formData.name} required onChange={handleChange} />
                                    {!formData.name && <div className="invalid-feedback">Please provide value.</div>}
                                </div>
                            </div>
                        </div>
                        <div className="row mb4">
                            <div className="col">
                                <div className="mb-4">
                                    <label htmlFor="description">Description <span className="text-danger">*</span></label>
                                    <MyComponent value={formData.description} onChange={(value) => setFormData((prevFormData) => ({ ...prevFormData, description: value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <button type="submit" className="btn btn-gray-800">
                                Save
                            </button>
                            <button type="button" className="btn btn-gray-800 mx-2" onClick={() => navigate('/templates')}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}
