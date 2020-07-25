import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_ERRORS,
  SET_USER,
  LOADING_UI,
  LOADING_USER,
  CLEAR_ERRORS,
} from "../types";

import axios from "axios";

export const loginUser = (userData, history) => async (dispatch) => {
  dispatch({ type: LOADING_UI });

  try {
    let res = await axios.post(
      "https://europe-west3-chotto-matte.cloudfunctions.net/api/login",
      userData
    );

    setAuthorizationHeader(res.data.token);

    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });

    history.push("/");
  } catch (err) {
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data,
    });
  }
};

export const signupUser = (newUserData, history) => async (dispatch) => {
  dispatch({ type: LOADING_UI });

  try {
    let res = await axios.post(
      "https://europe-west3-chotto-matte.cloudfunctions.net/api/signup",
      newUserData
    );
    setAuthorizationHeader(res.data.token);

    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });

    history.push("/");
  } catch (err) {
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common("Authorization");
  dispatch({ type: SET_AUTHENTICATED });
};

export const getUserData = () => async (dispatch) => {
  try {
    let res = await axios.get("/user");
    dispatch({ type: SET_USER, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
