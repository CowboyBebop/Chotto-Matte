import {
  SET_TUTURUS,
  SET_TUTURU,
  LIKE_TUTURU,
  UNLIKE_TUTURU,
  LOADING_DATA,
  DELETE_TUTURU,
  POST_TUTURU,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  tuturus: [],
  tuturu: {},
  loading: false,
};

let index;

export default function (action, state = initialState) {
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
    case SET_TUTURU:
      return {
        ...state,
        tuturu: action.payload,
      };
    case LIKE_TUTURU:
    case UNLIKE_TUTURU:
      index = state.tuturus.findIndex((tuturu) => tuturu.tuturuId === action.payload.tuturuId);
      state.tuturus[index] = action.payload;
      if (state.tuturu.tuturuId === action.payload.tuturuId) {
        state.tuturu = action.payload;
      }
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
    case SUBMIT_COMMENT:
      return {
        ...state,
        tuturu: {
          ...state.tuturu,
          comments: [action.payload, ...state.tuturu.comments],
        },
      };

    default:
      return state;
  }
}
