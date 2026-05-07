import api from "../../../api/axiosInstance.js";

export const getUserList = (params) => api.get("users/", { params });
export const saveUser = (params) => api.post("users/", params);
export const updateUser = (params) =>api.put(`/users/${params.id}/`, params);
export const deleteUser = (params) =>api.delete(`/users/${params.id}/`, { params });
export const getUserById = (id) => api.get(`/users/${id}/`);
export const getRoleList = (params) => api.get("users/");
