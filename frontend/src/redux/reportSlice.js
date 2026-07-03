import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from '../services/reportService';

export const fetchReports = createAsyncThunk('reports/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await reportService.getAll(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch reports');
  }
});

export const fetchReportById = createAsyncThunk('reports/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await reportService.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch report');
  }
});

export const uploadReport = createAsyncThunk('reports/upload', async (formData, { rejectWithValue }) => {
  try {
    const res = await reportService.upload(formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Upload failed');
  }
});

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    currentReport: null,
    loading: false,
    uploadLoading: false,
    error: null,
    totalPages: 0,
    totalElements: 0,
  },
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearReportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => { state.loading = true; })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.reports = action.payload;
        } else {
          state.reports = action.payload.content || action.payload;
          state.totalPages = action.payload.totalPages || 0;
          state.totalElements = action.payload.totalElements || 0;
        }
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReportById.pending, (state) => { state.loading = true; })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadReport.pending, (state) => { state.uploadLoading = true; })
      .addCase(uploadReport.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.reports = [action.payload, ...state.reports];
      })
      .addCase(uploadReport.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentReport, clearReportError } = reportSlice.actions;
export default reportSlice.reducer;
