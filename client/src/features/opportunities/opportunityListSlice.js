import { createSlice } from '@reduxjs/toolkit';
import refractioApi from '../../common/refractioApi';

// initial state
export const initialState = {
  loading: false,
  error: null,
  opportunities: [],
  completedOpportunities: [],
};

// our slice
const opportunityListSlice = createSlice({
  name: 'opportunityList',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setOpportunityList: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.opportunities = payload;
      state.completedOpportunities = payload.filter(
        (a) => a.status.toLowerCase() === 'completed'
      );
    },
    setError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});
// export the actions
export const {
  setLoading,
  setOpportunityList,
  setError,
} = opportunityListSlice.actions;

// export the selector (".items" being same as in slices/index.js's "items: something")
export const opportunityListSelector = (state) => state.opportunityList;

// export the default reducer
export default opportunityListSlice.reducer;

// fetch all opportunities
export const fetchOpportunities = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    let { data: response } = await refractioApi.get('/opportunities');
    // setTimeout(() => {
    dispatch(setOpportunityList(response.data));
    // }, 1500);
  } catch (error) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : error.message;
    dispatch(setError(errorMessage));
  }
};
