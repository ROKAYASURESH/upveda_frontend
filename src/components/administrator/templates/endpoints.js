import api from "../../../api/axiosInstance.js";

export const getTemplatesList = (params) => api.get("templates/", { params });
export const saveTemplates = (params) => api.post("templates/", params);
export const updateTemplates = (params) =>
  api.put(`/templates/${params.id}/`, params);
export const deleteTemplates = (params) =>
  api.delete(`/templates/${params.id}/`, { params });
export const getTemplatesById = (id) => api.get(`/templates/${id}/`);
