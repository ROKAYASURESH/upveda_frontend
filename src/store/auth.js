import {
  createSlice,
  createAsyncThunk,
  configureStore,
} from "@reduxjs/toolkit";
import api from "../api/axiosInstance.js";
import menuReducer from "./slices/menuSlice.js";

export const fetchUserRolesPermissions = createAsyncThunk(
  "data/fetchUserRolesPermissions",
  async () => {
    const response = await api.get("/user-roles-permissions/");
    return response.data;
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: null,
    loading: false,
    error: null,
    must_redirect: localStorage.getItem("must_redirect"),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRolesPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRolesPermissions.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserRolesPermissions.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    menu: menuReducer,
  },
});

export default store;
