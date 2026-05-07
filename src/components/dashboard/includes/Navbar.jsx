import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import api from '../../../api/axiosInstance';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function Navbar() {
    const { logout } = useAuth();
    const { data } = useSelector((state) => state.data);
    const navigate = useNavigate();  // Initialize useNavigate

    // Redirect logic for home page after login
    useEffect(() => {
        if (JSON.parse(localStorage.getItem('must_redirect'))) {
            if (data && data.home_page) {
                localStorage.setItem('must_redirect', false);
                window.location.href = data.home_page;
            }
        }
    }, [data]);

    // Handle Logout
    const handleLogout = (event) => {
        event.preventDefault();
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            console.error('No refresh token found!');
            return false;
        }

        try {
            api.post('/logout/', { refresh_token: refreshToken }).then(res => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('must_redirect');
                window.location.href = "/login";
            });
            return true;
        } catch (error) {
            return false;
        }
    };

    // Handle navigation to Password Change page
    const handleChangePassword = () => {
        navigate("/change-password");  // Navigate to the password change page
    };

    return (
        <nav className="navbar navbar-top navbar-expand navbar-dashboard navbar-dark ps-0 pe-2 pb-0">
            <div className="container-fluid px-0">
                <div className="d-flex justify-content-between w-100" id="navbarSupportedContent">
                    <div className="d-flex align-items-center">
                    </div>
                    <ul className="navbar-nav align-items-center">
                        <li className="nav-item dropdown ms-lg-3">
                            <a
                                className="nav-link dropdown-toggle pt-1 px-0"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div className="media d-flex align-items-center">
                                    <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                                        <span className="mb-0 font-small fw-bold text-gray-900">
                                            {data && data.user ? data.user.username : null}
                                        </span>
                                    </div>
                                </div>
                            </a>
                            <div className="dropdown-menu dashboard-dropdown dropdown-menu-end mt-2 py-1">
                                {/* <a className="dropdown-item d-flex align-items-center" href="#">
                                    <svg
                                        className="dropdown-icon text-gray-400 me-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    My Profile
                                </a> */}

                                {/* Add a new item for Password Change */}
                                <button
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={handleChangePassword}  // Navigate to password change
                                >
                                    <svg
                                        className="dropdown-icon text-gray-400 me-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                     My Profile
                                </button>

                                <div role="separator" className="dropdown-divider my-1" />
                                <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                                    <svg
                                        className="dropdown-icon text-danger me-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
