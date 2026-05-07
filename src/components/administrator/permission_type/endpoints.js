import api from "../../../api/axiosInstance.js";

export const getPermissionList = (params) => api.get("permission-types/", { params });
export const savePermission = (params) => api.post("permission-types/", params);
export const updatePermission = (params) => api.put(`/permission-types/${params.id}/`, params);
export const deletePermission = (params) => api.delete(`permission-types/${params.id}/delete/`, { params });
