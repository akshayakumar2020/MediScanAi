import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    sidebarMobileOpen: false,
    theme: 'light',
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileSidebar: (state) => {
      state.sidebarMobileOpen = !state.sidebarMobileOpen;
    },
    closeMobileSidebar: (state) => {
      state.sidebarMobileOpen = false;
    },
  },
});

export const { toggleSidebar, toggleMobileSidebar, closeMobileSidebar } = uiSlice.actions;
export default uiSlice.reducer;
