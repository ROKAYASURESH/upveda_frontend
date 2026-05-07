import api from "../../../api/axiosInstance.js";

export const getMenuList = (params) => api.get("menus/", { params });
export const saveMenu = (params) => api.post("menus/", params);
export const updateMenu = (params) => api.put(`/menus/${params.id}/`, params);
export const deleteMenu = (params) => api.delete(`menus/${params.id}/delete/`, { params });

