import { createSlice } from '@reduxjs/toolkit';
import refractioApi from '../../common/refractioApi';

// initial state
export const initialState = {
  loading: false,
  error: null,
  success: false,
};

// our slice
const resendInviteMemberSlice = createSlice({
  name: 'resendInviteMember',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    setSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.success = payload;
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});
// export the actions
export const {
  setLoading,
  setSuccess,
  setError,
  reset,
} = resendInviteMemberSlice.actions;

// export the selector (".items" being same as in slices/index.js's "items: something")
export const resendInviteMemberSelector = (state) => {
  return state.resendInviteMember;
};

// export the default reducer
export default resendInviteMemberSlice.reducer;

// fetch all opportunities
export const resendInviteMember = (member) => async (dispatch) => {
  try {
    dispatch(setLoading());
    await refractioApi.put(`/users/resend-invite-account/${member}`);
    dispatch(setSuccess(true));
  } catch (error) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : error.message;
    dispatch(setError(errorMessage));
  }
};

export const resetResendInvite = () => async (dispatch) => {
  dispatch(reset());
};
