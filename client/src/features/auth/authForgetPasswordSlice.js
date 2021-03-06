import { createSlice } from '@reduxjs/toolkit';
import refractioApi from '../../common/refractioApi';

// initial state
export const initialState = {
  loading: false,
  error: null,
  forgetPassword: null,
};

// our slice
const authForgetPasswordSlice = createSlice({
  name: 'authForgetPassword',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setForgetPassword: (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.forgetPassword = payload;
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.forgetPassword = null;
    },
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.forgetPassword = null;
    },
  },
});
// export the actions
export const {
  setLoading,
  setForgetPassword,
  setError,
  reset,
} = authForgetPasswordSlice.actions;

export const authForgetPasswordSelector = (state) => state.authForgetPassword;

// export the default reducer
export default authForgetPasswordSlice.reducer;

// forget password
export const userForgetPassword = (email) => async (dispatch) => {
  try {
    dispatch(setLoading());
    let { data: response } = await refractioApi.post('/users/forget-password', {
      email,
    });
    dispatch(setForgetPassword(response.success));
  } catch (error) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : error.message;
    dispatch(setError(errorMessage));
  }
};

export const resetForgetPassword = () => (dispatch) => {
  dispatch(reset());
};
