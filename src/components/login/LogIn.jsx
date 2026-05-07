import { useState } from 'react';
import api from '../../api/axiosInstance.js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from "../loading/LoadingOverlay.js";
import { useAuth } from '../../context/AuthContext.jsx';

export default function LogIn() {
    const { login } = useAuth();
    const [form, setForm] = useState({
        username: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prevform) => ({ ...prevform, [name]: value }));
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        api.post('token/', form).then(response => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem("must_redirect", true);
            login();
        }).catch(error => {
            console.error("Error fetching data:", error);
        }).finally(res => {
            setIsLoading(false);
        })
    };

    return (
        <main>
            <LoadingOverlay isLoading={isLoading} />
            <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
                <div className="container">
                    <div className="row justify-content-center form-bg-image">
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                                <div className="text-center text-md-center mb-4 mt-md-0">
                                    <h1 className="mb-0 h3">Sign In</h1>
                                </div>
                                <form className="mt-4" onSubmit={handleSubmit}>
                                    <div className="form-group mb-4">
                                        <label htmlFor="email">Your Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text" id="basic-addon1">
                                                <svg
                                                    className="icon icon-xs text-gray-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                name="username"
                                                value={form.username}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Username"
                                                id="email"
                                                autoFocus=""
                                                required=""
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-group mb-4">
                                            <label htmlFor="password">Your Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text" id="basic-addon2">
                                                    <svg
                                                        className="icon icon-xs text-gray-600"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={form.password}
                                                    onChange={handleChange}
                                                    placeholder="Password"
                                                    className="form-control"
                                                    id="password"
                                                    required=""
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-top mb-4">
                                            <div className="form-check">
                                            </div>
                                            <div>
                                                {/* <a
                                                    href="./forgot-password.html"
                                                    className="small text-right"
                                                >
                                                    Lost password?
                                                </a> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-gray-800">
                                            Sign in
                                        </button>
                                    </div>
                                </form>
                                <div className="d-flex justify-content-center align-items-center mt-4">
                                    {/* <span className="fw-normal">
                                        Not registered?
                                        <a href="./sign-up.html" className="fw-bold">
                                            Create account
                                        </a>
                                    </span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </main>
    )
}