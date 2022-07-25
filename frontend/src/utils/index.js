import moment from "moment";
import { UserPool } from "../configs";

const regEx = {
  email:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const dateFormat = (date, format) => moment(date).format(format);

const isEmailValid = (email) => regEx.email.test(email);

const isPasswordValid = (password, cpassword) => {
  //for confirm password
  if (cpassword && password === cpassword) {
    return true;
  }

  //for password
  if (password.length >= 8) {
    return true;
  }

  return false;
};

export const formValidator = (valueType, inputValue, dependantValue) => {
  if (!inputValue) return false;

  switch (valueType) {
    case "email":
      return isEmailValid(inputValue);

    case "password":
      return isPasswordValid(inputValue);

    case "cpassword":
      if (!dependantValue) return false;
      return isPasswordValid(inputValue, dependantValue);

    default:
      return true;
  }
};

export const formValidationMsgs = (valueType, inputValue) => {
  if (!inputValue) {
    return "This field is required";
  }

  switch (valueType) {
    case "email":
      return "Email format is invalid";

    case "password":
      return "Password must have atleast eight characters";

    case "cpassword":
      return "Password and confirm password does not match";

    default:
      return "Invalid input";
  }
};

export const getLoggedInUser = async () => {
  const user = UserPool.getCurrentUser();
  let userSession = null;
  if (user) {
    user.getSession((err, session) => {
      if (session?.idToken?.payload) {
        userSession = session.idToken.payload;
      }
    });
  }

  return userSession;
};

export const logoutCognitoUser = () => {
  const user = UserPool.getCurrentUser();

  if (user) {
    user.signOut();
  }
};
