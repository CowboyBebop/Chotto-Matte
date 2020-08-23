import { SET_TUTURUS, LIKE_TUTURU, UNLIKE_TUTURU, LOADING_DATA } from "../types";

const initialState = {
  tuturus: [],
  tuturu: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_TUTURUS:
      return {
        ...state,
        tuturus: action.payload,
        loading: false,
      };
    case LIKE_TUTURU:
    case UNLIKE_TUTURU:
      let index = state.tuturus.findIndex((tuturu) => tuturu.tuturuId === action.payload.tuturuId);
      state.tuturus[index] = action.payload;
      return {
        ...state,
      };
    default:
      return state;
  }
}
