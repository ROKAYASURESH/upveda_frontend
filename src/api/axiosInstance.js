import axios from "axios";
import { toast, Bounce } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL + "/",
  timeout: 300000,
});

let accessToken = localStorage.getItem("access_token");
if (accessToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Bounce,
};

api.interceptors.request.use(
  (config) => {
    let access_token = localStorage.getItem("access_token");
    config.headers.Authorization = `Bearer ${access_token}`;
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => {
    toast.error("Process error: " + error.message, toastConfig);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.message) {
      toast.success(response.data.message, toastConfig);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      toast.error(
        `Error: ${error.response.data.message || error.response.statusText}`,
        toastConfig
      );
    } else if (error.request) {
      toast.error("No response from server. Please try again.", toastConfig);
    } else {
      toast.error("Error: " + error.message, toastConfig);
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      toast.error(
        `Error: ${error.response.data.message || error.response.statusText}`,
        toastConfig
      );
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default api;
