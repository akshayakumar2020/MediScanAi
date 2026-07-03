import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import doctorService from '../services/doctorService';

export const fetchDoctors = createAsyncThunk('doctors/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await doctorService.getAll(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctors');
  }
});

export const fetchDoctorById = createAsyncThunk('doctors/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await doctorService.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctor');
  }
});

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    doctors: [],
    currentDoctor: null,
    loading: false,
    error: null,
    totalPages: 0,
  },
  reducers: {
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => { state.loading = true; })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.doctors = action.payload;
        } else {
          state.doctors = action.payload.content || action.payload;
          state.totalPages = action.payload.totalPages || 0;
        }
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDoctorById.pending, (state) => { state.loading = true; })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
