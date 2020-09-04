const isEmpty = (string) => {
  return string.trim() === ``;
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(emailRegEx);
};

exports.validateSignupData = (signupData) => {
  let errors = {};

  if (isEmpty(signupData.email)) errors.email = `Must not be empty`;
  else if (!isEmail(signupData.email)) errors.email = `Must be a valid email address`;

  if (isEmpty(signupData.password)) errors.password = `Must not be empty`;
  if (isEmpty(signupData.userHandle)) errors.userHandle = `Must not be empty`;
  if (signupData.password !== signupData.confirmPassword) errors.password = `Passwords must match`;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (user) => {
  let errors = {};

  if (isEmpty(user.email)) errors.email = `Must not be empty`;
  if (isEmpty(user.password)) errors.password = `Must not be empty`;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetails = (userData) => {
  let userDetails = {};

  if (!isEmpty(userData.bio.trim())) userDetails.bio = userData.bio;
  if (!isEmpty(userData.website.trim())) {
    //https://webapp.com
    if (userData.website.trim().substring(0, 4) !== "http")
      userDetails.website = `http://${userData.website.trim()}`;
    else userDetails.website = userData.website;
  }
  if (!isEmpty(userData.location.trim())) userDetails.location = userData.location;

  return userDetails;
};
