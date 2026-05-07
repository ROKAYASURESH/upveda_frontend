import api from "../../../api/axiosInstance.js";

export const changePassword = (params) => api.post("change-password/", params);
export const getUserProfile = async () => {
  const response = await api.get("user-profile/");
  return response.data;
};
