import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import reportReducer from './reportSlice';
import doctorReducer from './doctorSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
    doctors: doctorReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
