import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrum from "../../common/Breadcrum.jsx";
import { useLoading } from "../../../context/LoadingContext.jsx";
import { saveUser, updateUser, getUserById } from "./endpoints";
import { getDropdown } from "../../../api/endpoints";
import Select from "react-select";
import SearchSelect from "../../common/SearchSelect.jsx";

export default function UserForm() {
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone_number: "",
        role: [],
        is_active: true,
        parents: [],

    });

    const { setIsLoading } = useLoading();
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [roleOpt, setRoleOpt] = useState([]);
    const [filteredRoleOpt, setFilteredRoleOpt] = useState([]);
    const [users, setUsers] = useState([]);

    const breadcrumbs = [
        { name: "Dashboard", url: "/" },
        { name: "User", url: "/user" },
        { name: id ? "Edit User" : "Create User", url: "#" },
    ];

    // Fetch roles for the dropdown
    const fetchDropdownData = async () => {
        setIsLoading(true);
        setLoadingRoles(true);
        try {
            const response = await getDropdown({ role: true });
            setRoles(response.data.roles || []);
            const roles = await getDropdown({ roles_for_role: true });
            setRoleOpt(roles.data.roles);
            const users = await getDropdown({ parent_users: true });
            setUsers(users.data.users.map(user => ({ value: user.id, label: `${user.first_name} ${user.last_name}` })));

            // if (formData.role && formData.role.length > 0) {
            //     const selectedRoles = formData.role.map(role => role.value);
            //     console.log(roles.filter(role => selectedRoles.includes(role.value)))
            //     setFormData((prevFormData) => ({ ...prevFormData, role: roles.filter(role => selectedRoles.includes(role.value)) }));
            // }
        } catch (err) {
            console.error("Failed to fetch dropdown data:", err);
            setError("Failed to load roles. Please try again.");
        } finally {
            setIsLoading(false);
            setLoadingRoles(false);
        }
    };

    const fetchUserByRole = async () => {
        setIsLoading(true);
        try {
            if (!formData.role || !formData.role.length) {
                const response = await getDropdown({ parent_users: true });
                setUsers(response.data.users.map(user => ({ value: user.id, label: `${user.first_name} ${user.last_name}` })));
            } else {
                const response = await getDropdown({ users_by_roles: true, role_ids: formData.role.map(role => role.parent) });
                setUsers(response.data.users.map(user => ({ value: user.id, label: `${user.first_name} ${user.last_name}` })) || []);
            }

        } catch (err) {
            console.error("Failed to fetch dropdown data:", err);
            setError("Failed to load users. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!formData.role || !roleOpt) return;

        const getAllDescendants = (parentValue) => {
            return roleOpt
                .filter((role) => role.parent === parentValue)
                .reduce((acc, role) => {
                    acc.push(role.value);
                    const childRoles = getAllDescendants(role.value);
                    return acc.concat(childRoles);
                }, []);
        };
        const selectedParentValues = formData.role.map((parent) => parent.value);
        const descendantsToRemove = selectedParentValues.flatMap((parentValue) =>
            getAllDescendants(parentValue)
        );
        const newFilteredRoleOpt = roleOpt.filter(
            (role) => !descendantsToRemove.includes(role.value)
        );
        setFilteredRoleOpt(newFilteredRoleOpt);
        fetchUserByRole();
    }, [formData.role, roleOpt]);

    const formatOptionLabel = ({ label, depth }) => (
        <div style={{ paddingLeft: `${depth * 20}px` }}>
            {label}
        </div>
    );

    // Fetch user data if editing
    const fetchUserData = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await getUserById(id);
            setFormData({
                username: response.data.user.username || "",
                first_name: response.data.user.first_name || "",
                last_name: response.data.user.last_name || "",
                email: response.data.user.email || "",
                password: "",
                confirmPassword: "",
                role: response.data.role?.filter(role => !filteredRoleOpt.some(filteredRole => filteredRole.value === role.id)) || [],
                parents: response.data.parents || [],
                phone_number: response.data.phone_number || '',
                is_active: response.data.user.is_active !== undefined ? response.data.user.is_active : false,
            });
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user details.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        if (roles.length > 0) {
            fetchUserData();
        }
    }, [roles]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,  // Handles checkbox changes
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        // Prepare the payload
        const payload = {
            id: id,
            user: {
                id: id,
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                is_active: formData.is_active,
            },
            role: formData.role.map((role) => role.value),
            parents: formData.parents.map((parent) => parent.value),
            is_dsr_account_status: formData.is_active,
            phone_number: formData.phone_number,
        };

        try {
            if (id) {
                const response = await updateUser(payload);
            } else {
                const response = await saveUser(payload);
            }
            navigate("/user");
        } catch (err) {
            console.error("Error saving user:", err);
            setError(err.response?.data?.message || "Failed to save user.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div>
                    <Breadcrum breadcrumbs={breadcrumbs} />
                    <h2 className="h4">{id ? "Edit User" : "Create User"}</h2>
                </div>
            </div>

            <div className="card border-0 shadow components-section">
                <div className="card-body">
                    {loadingRoles ? (
                        <p>Loading roles...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-4">
                                {[{ label: "Username", name: "username", type: "text", required: true },
                                { label: "First Name", name: "first_name", type: "text", required: true },
                                { label: "Last Name", name: "last_name", type: "text", required: true },
                                { label: "Email", name: "email", type: "email", required: true },
                                { label: "Phone Number", name: "phone_number", type: "text", required: false },
                                { label: "Password", name: "password", type: "password", required: !id },
                                { label: "Confirm Password", name: "confirmPassword", type: "password", required: !id },
                                ].map((field) => (
                                    <div className="col-lg-4 col-sm-6" key={field.name}>
                                        <div className="mb-4">
                                            <label htmlFor={field.name}>
                                                {field.label} {field.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                className="form-control"
                                                id={field.name}
                                                value={formData[field.name]}
                                                required={field.required}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Role Dropdown */}
                                <div className="col-lg-4 col-sm-6">
                                    <div className="mb-4">
                                        <label htmlFor="role">Role <span className="text-danger">*</span></label>
                                        <Select
                                            id="role"
                                            className={`basic-multi-select`}
                                            classNamePrefix="select"
                                            name="role"
                                            value={formData.role}
                                            formatOptionLabel={formatOptionLabel}
                                            options={filteredRoleOpt}
                                            onChange={(option) =>
                                                setFormData({ ...formData, role: option })
                                            }
                                            isMulti
                                            closeMenuOnSelect={false}
                                        />
                                    </div>
                                </div>

                                {/* Parent User Dropdown */}
                                <div className="col-lg-4 col-sm-6">
                                    <div className="mb-4">
                                        <label htmlFor="parents">Parent User</label>
                                        <Select
                                            isMulti
                                            options={users}
                                            value={formData.parents}
                                            onChange={(selectedOptions) => {
                                                setFormData({
                                                    ...formData,
                                                    parents: selectedOptions || [],
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <p className="text-danger">{error}</p>
                                <button type="submit" className="btn btn-gray-800">Save</button>
                                <button
                                    type="button"
                                    className="btn btn-secondary mx-2"
                                    onClick={() => navigate("/user")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
