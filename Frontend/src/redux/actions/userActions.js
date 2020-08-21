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
    let res = await axios.post("/login", userData);

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
    let res = await axios.post("/signup", newUserData);
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
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });

    let res = await axios.get("/user");
    dispatch({ type: SET_USER, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

export const uploadImage = (formData) => async (dispatch) => {
  dispatch({ type: LOADING_USER });
  await axios.post("/user/image", formData).catch((err) => console.log(err));
  dispatch(getUserData());
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

export const editUserDetails = (userDetails) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_USER });
    await axios.post("/user", userDetails);
    dispatch(getUserData());
  } catch (err) {
    console.log(err);
  }
};
