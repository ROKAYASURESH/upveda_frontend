import React, { useState, useEffect, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { getDropdown } from "../../../api/endpoints.js";
import Breadcrum from "../../common/Breadcrum.jsx";
import { useLoading } from "../../../context/LoadingContext.jsx";

function PermissionsForm() {
    const { setIsLoading } = useLoading();

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [permissionTypes, setPermissionTypes] = useState([]);
    const [menus, setMenus] = useState([]);
    const [permissions, setPermissions] = useState({});

    // Fetch initial data
    useEffect(() => {
        setIsLoading(true);
        async function fetchData() {
            try {
                const roleData = await getDropdown({ role: true, menus: true });
                const processedMenus = processMenus(roleData.data.menus);
                setRoles(roleData.data.roles);
                setMenus(processedMenus);

                const permissionTypesRes = await api.get("permission-typess/");
                setPermissionTypes(permissionTypesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to fetch data. Please refresh the page.");
            }
        }
        fetchData();
    }, []);


    // Process menus into a hierarchical structure
    const processMenus = (menuList) => {
        const menuMap = {};
        menuList.forEach((menu) => {
            if (!menu.parent_id) {
                menuMap[menu.id] = { ...menu, children: [] };
            } else {
                menuMap[menu.parent_id]?.children.push(menu);
            }
        });

        setIsLoading(false); // Set loading to false after processing the menus
        return Object.values(menuMap);
    };
    /******  e6b38408-c4a9-4b57-9302-981848d6c8b0  *******/

    // Breadcrumbs for navigation
    const breadcrumbs = [
        { name: "Dashboard", url: "/" },
        { name: "Set Permission", url: "/set-permission" },
    ];

    // Handle role selection
    const handleRoleChange = async (e) => {
        setIsLoading(true);
        const roleId = e.target.value;
        setSelectedRole(roleId);

        if (roleId) {
            try {
                const res = await api.get(`permissions/${roleId}/`);
                const permissionsMap = {};
                res.data.permissions.forEach((perm) => {
                    permissionsMap[`${perm.menu}_${perm.permission_type}`] =
                        perm.has_permission;
                });
                setPermissions(permissionsMap);
            } catch (error) {
                console.error("Error fetching role permissions:", error);
                alert("Failed to fetch permissions. Please try again.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setPermissions({});
        }
    };

    // Handle row checkbox change (select/deselect all checkboxes in a row)
    const handleRowCheckboxChange = (menuId, isChecked) => {
        const updatedPermissions = { ...permissions };

        // Toggle all permissions for the menu row
        permissionTypes.forEach((type) => {
            updatedPermissions[`${menuId}_${type.id}`] = isChecked;
        });

        setPermissions(updatedPermissions);
    };

    // Handle individual permission change
    const handlePermissionChange = (menuId, permissionTypeId, isChecked) => {
        setPermissions((prev) => ({
            ...prev,
            [`${menuId}_${permissionTypeId}`]: isChecked,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        try {
            const payload = {
                role_id: selectedRole,
                permissions,
            };
            await api.post("permissions/", payload);
        } catch (error) {
            console.error("Error saving permissions:", error);
            alert("An error occurred while saving permissions. Please try again.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    // Memoize menus for better performance
    const processedMenus = useMemo(() => menus, [menus]);

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="d-block mb-4 mb-md-0">
                    <Breadcrum breadcrumbs={breadcrumbs} />
                    <h2 className="h4">Set Permissions</h2>
                </div>
            </div>
            <div className="card card-body" style={{ maxHeight: "500px" }}>
                <form>
                    <label className="col-6">
                        Role:
                        <select
                            onChange={handleRoleChange}
                            value={selectedRole ?? ""}
                            className="form-select"
                            disabled={roles.length === 0}
                        >
                            <option value="">---Select a Role---</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                    </label>
                </form>

                {selectedRole ? (
                    <>
                        <form className="table-responsive">
                            <table className="table table-hover">
                                <thead className="position-sticky top-0" style={{ backgroundColor: "white", zIndex: 1 }}>
                                    <tr>
                                        <th>Menu</th>
                                        {permissionTypes.map((type) => (
                                            <th key={type.id}>{type.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedMenus.map((menu) => (
                                        <React.Fragment key={menu.id}>
                                            {/* Parent Menu */}
                                            <tr>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input parent-master"
                                                        id={`parent_${menu.id}`}
                                                        checked={permissionTypes.every(
                                                            (type) =>
                                                                permissions[`${menu.id}_${type.id}`] ?? false
                                                        )}
                                                        onChange={(e) =>
                                                            handleRowCheckboxChange(menu.id, e.target.checked)
                                                        }
                                                    />
                                                    <label htmlFor={`parent_${menu.id}`}>
                                                        <strong>{menu.title}</strong>
                                                    </label>
                                                </td>
                                                {permissionTypes.map((type) => (
                                                    <td key={type.id}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input parent-child"
                                                            checked={
                                                                permissions[`${menu.id}_${type.id}`] ?? false
                                                            }
                                                            onChange={(e) =>
                                                                handlePermissionChange(
                                                                    menu.id,
                                                                    type.id,
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                ))}
                                            </tr>

                                            {/* Child Menus */}
                                            {menu.children?.map((childMenu) => (
                                                <tr key={childMenu.id}>
                                                    <td style={{ paddingLeft: "40px" }}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input child-master"
                                                            id={`child_${childMenu.id}`}
                                                            checked={permissionTypes.every(
                                                                (type) => permissions[`${childMenu.id}_${type.id}`] ?? false
                                                            )}
                                                            onChange={(e) =>
                                                                handleRowCheckboxChange(childMenu.id, e.target.checked)
                                                            }
                                                        />
                                                        <label htmlFor={`child_${childMenu.id}`}>
                                                            - {childMenu.title}
                                                        </label>
                                                    </td>
                                                    {permissionTypes.map((type) => (
                                                        <td key={type.id}>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input child-child"
                                                                checked={permissions[`${childMenu.id}_${type.id}`] ?? false}
                                                                onChange={(e) =>
                                                                    handlePermissionChange(childMenu.id, type.id, e.target.checked)
                                                                }
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </form>
                        <div>
                            <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                                Save
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Please select a role to view and edit permissions.</p>
                )}
            </div >
        </>
    );
}

export default PermissionsForm;
