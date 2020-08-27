import {
  SET_TUTURUS,
  LOADING_DATA,
  LIKE_TUTURU,
  UNLIKE_TUTURU,
  DELETE_TUTURU,
  LOADING_UI,
  SET_ERRORS,
  POST_TUTURU,
  CLEAR_ERRORS,
  SET_TUTURU,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
} from "../types";
import axios from "axios";

// Get all screams
export const getTuturus = () => async (dispatch) => {
  dispatch({ type: LOADING_DATA });
  try {
    let res = await axios.get("/tuturus");
    dispatch({ type: SET_TUTURUS, payload: res.data });
  } catch (err) {
    console.log(err);
    dispatch({ type: SET_TUTURUS, payload: [] });
  }
};

export const getTuturu = (tuturuId) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  try {
    let res = await axios.get(`/tuturu/${tuturuId}`);
    dispatch({ type: SET_TUTURU, payload: res.data });
    dispatch({ type: STOP_LOADING_UI });
  } catch (err) {
    console.log(err);
  }
};

// Like a tuturu post
export const likeTuturu = (tuturuId) => async (dispatch) => {
  let res = await axios
    .post(`https://europe-west3-chotto-matte.cloudfunctions.net/api/tuturu/${tuturuId}/like`)
    .catch((err) => console.log(err));
  dispatch({ type: LIKE_TUTURU, payload: res.data });
};

// Unlike a tuturu post
export const unlikeTuturu = (tuturuId) => async (dispatch) => {
  let res = await axios
    .post(`https://europe-west3-chotto-matte.cloudfunctions.net/api/tuturu/${tuturuId}/unlike`)
    .catch((err) => console.log(err));
  dispatch({ type: UNLIKE_TUTURU, payload: res.data });
};

export const deleteTuturu = (tuturuId) => async (dispatch) => {
  await axios
    .delete(`https://europe-west3-chotto-matte.cloudfunctions.net/api/tuturu/${tuturuId}`)
    .catch((err) => console.log(err));
  dispatch({ type: DELETE_TUTURU, payload: tuturuId });
};

export const postTuturu = (newTuturu) => async (dispatch) => {
  dispatch({ type: LOADING_UI });

  axios
    .post("/tuturu", newTuturu)
    .then((res) => {
      dispatch({
        type: POST_TUTURU,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const postComment = (tuturuId, commentData) => async (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/tuturu/${tuturuId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
