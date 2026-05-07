import api from "./axiosInstance";

export const getSidebar = (param) => api.get(`sidebar-menu/`);

export const getDropdown = (params) => api.get("dropdown/", { params });
export const searchRoleName = (searchTerm) =>
  api.get("dropdown/", { params: { role_names: true, query: searchTerm } });
export const searchUserName = (searchTerm) =>
  api.get("dropdown/", { params: { usernames: true, query: searchTerm } });
export const searchLastName = (searchTerm) =>
  api.get("dropdown/", { params: { last_names: true, query: searchTerm } });
export const searchFirstName = (searchTerm) =>
  api.get("dropdown/", { params: { first_names: true, query: searchTerm } });
export const searchChildUser = (searchTerm) =>
  api.get("dropdown/", { params: { child_users: true, query: searchTerm } });
