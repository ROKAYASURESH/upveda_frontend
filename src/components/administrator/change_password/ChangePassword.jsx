import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "./endpoints";
import UserProfile from "./UserProfile";
import Breadcrum from "../../common/Breadcrum.jsx";
import { useLoading } from "../../../context/LoadingContext.jsx";
const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { isLoading, setIsLoading } = useLoading();
    const navigate = useNavigate();

    const breadcrumbs = [
        { name: "Dashboard", url: "/" },
        { name: "My Profile", url: "/change-password" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const response = await changePassword({
                old_password: oldPassword,
                new_password: newPassword,
                confirm_new_password: confirmNewPassword,
            });

            setMessage(response.data.message);
            setError("");
            localStorage.removeItem("token");

            setTimeout(() => {
                setIsLoading(false);
                navigate("/login");
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.detail || "Error changing password");
            setMessage("");
        } finally {
            if (!message) setIsLoading(false);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-md-0">
                    <Breadcrum breadcrumbs={breadcrumbs} />
                    <h2 className="h4">My Profile</h2>
                </div>
            </div>

            <div className="container card card-body">
                <div className="row">

                    <div className="col-lg-5 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5>My Profile</h5>
                            </div>
                            <div className="card-body">
                                <UserProfile />
                            </div>
                        </div>
                    </div>


                    <div className="col-lg-7">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Change Password</h5>

                            </div>
                            <div>
                                {error && <div className="alert alert-danger mt-3">{error}</div>}
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label className="fw-bold">Current Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Current Password"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="fw-bold">New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="New Password"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="fw-bold">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            placeholder="Confirm Password"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary float-end"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                Changing...
                                            </span>
                                        ) : (
                                            "Change Password"
                                        )}
                                    </button>
                                </form>

                                {message && <div className="alert alert-success mt-3">{message}</div>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
