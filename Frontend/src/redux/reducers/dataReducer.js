import {
  SET_TUTURUS,
  LIKE_TUTURU,
  UNLIKE_TUTURU,
  LOADING_DATA,
  DELETE_TUTURU,
  POST_TUTURU,
} from "../types";

const initialState = {
  tuturus: [],
  tuturu: {},
  loading: false,
};

let index;

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
      index = state.tuturus.findIndex((tuturu) => tuturu.tuturuId === action.payload.tuturuId);
      state.tuturus[index] = action.payload;
      return {
        ...state,
      };
    case DELETE_TUTURU:
      index = state.tuturus.findIndex((tuturu) => tuturu.tuturuId === action.payload);
      state.tuturus.splice(index, 1);
      return {
        ...state,
      };
    case POST_TUTURU:
      return {
        ...state,
        tuturus: [action.payload, ...state.tuturus],
      };
    default:
      return state;
  }
}
