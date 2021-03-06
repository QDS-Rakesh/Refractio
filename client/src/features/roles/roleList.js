import { createSlice } from '@reduxjs/toolkit';
import refractioApi from '../../common/refractioApi';

// initial state
export const initialState = {
  loading: false,
  error: null,
  roles: [],
};

// our slice
const roleListSlice = createSlice({
  name: 'roleList',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setRoleList: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.roles = payload;
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});
// export the actions
export const { setLoading, setRoleList, setError } = roleListSlice.actions;

// export the selector (".items" being same as in slices/index.js's "items: something")
export const roleListSelector = (state) => state.roleList;

// export the default reducer
export default roleListSlice.reducer;

// fetch all roles
export const fetchRoles = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    let { data: response } = await refractioApi.get('/roles');
    dispatch(setRoleList(response.data));
  } catch (error) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : error.message;
    dispatch(setError(errorMessage));
  }
};
