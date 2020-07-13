const isEmpty = (string) => {
  if (string.trim() === ``) return true;
  else return false;
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

exports.validateSignupData = (signupData) => {
  let errors = {};

  if (isEmpty(signupData.email)) errors.email = `Must not be empty`;
  else if (!isEmail(signupData.email))
    errors.email = `Must be a valid email address`;

  if (isEmpty(signupData.password)) errors.password = `Must not be empty`;
  if (isEmpty(signupData.userHandle)) errors.userHandle = `Must not be empty`;
  if (signupData.password !== signupData.confirmPassword)
    errors.password = `Passwords must match`;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (user) => {
  let errors = {};

  if (isEmpty(user.email)) errors.email = `Must not be empty`;
  if (isEmpty(user.password)) errors.password = `Must not be empty`;

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
