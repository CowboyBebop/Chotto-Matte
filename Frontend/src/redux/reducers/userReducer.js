import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  LOADING_USER,
  LIKE_TUTURU,
  UNLIKE_TUTURU,
  MARK_NOTIFICATIONS_READ,
} from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
};

export default function (action, state = initialState) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case LIKE_TUTURU:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.userHandle,
            tuturuId: action.payload.tuturuId,
          },
        ],
      };
    case UNLIKE_TUTURU:
      return {
        ...state,
        likes: [...state.likes.filter((like) => like.tuturuId !== action.payload.tuturuId)],
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((notif) => (notif.read = true));
      return {
        ...state,
      };
    default:
      return state;
  }
}
