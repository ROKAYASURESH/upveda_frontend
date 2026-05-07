import api from "../../../api/axiosInstance.js";


export const getRoleList = (params) => api.get("roles/", { params });
export const saveRole = (params) => api.post("roles/", params);
export const updateRole = (params) => api.put(`/roles/${params.id}/`, params);
export const deleteRole = (params) => api.delete(`roles/${params.id}/delete/`, { params });
export const getHomeList = (params) => api.get("roles/");
