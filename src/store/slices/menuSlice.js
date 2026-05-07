import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSidebar } from "../../api/endpoints";

export const fetchMenus = createAsyncThunk("menu/fetchMenus", async () => {
  const response = await getSidebar();
  return response.data;
});

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menus: [],
    loading: false,
  },
  reducers: {
    updateMenus: (state, action) => {
      state.menus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.menus = action.payload;
        state.loading = false;
      })
      .addCase(fetchMenus.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateMenus } = menuSlice.actions;
export default menuSlice.reducer;
