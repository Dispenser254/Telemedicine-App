import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPatients: [],
  error: null,
  loading: false,
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    fetchAllPatientRecordsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAllPatientRecordsSuccess: (state, action) => {
      state.allPatients = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchAllPatientRecordsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deletePatientRecordsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deletePatientRecordsSuccess: (state, action) => {
      state.allPatients = state.allPatients.filter(
        (patient) => patient._id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
    deletePatientRecordsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAllPatientRecordsFailure,
  fetchAllPatientRecordsStart,
  fetchAllPatientRecordsSuccess,
  deletePatientRecordsFailure,
  deletePatientRecordsStart,
  deletePatientRecordsSuccess,
} = patientSlice.actions;

export default patientSlice.reducer;
