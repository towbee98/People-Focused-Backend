import axios from "axios";
import { displayMessage } from "./display";
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password
      }
    });
    return displayMessage(res.data.status, "Login Successful");
  } catch (err) {
    if (err.response) {
      console.log("true");
      console.log(err.response.statusCode);
      return displayMessage("error", err.response.data.message);
    }
    if (err.request) {
      console.log(err);
      console.log(err.request);
    }
    console.log(err);
    return displayMessage("error", err.message);
  }
};

export const signUp = async (userDetails) => {
  try {
    console.log(userDetails);
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        firstname: userDetails.firstname,
        lastName: userDetails.lastname,
        email: userDetails.email,
        password: userDetails.password,
        passwordConfirm: userDetails.passwordConfirm,
        role: userDetails.role
      }
    });
    return displayMessage(res.data.status, res.data.data.message);
  } catch (err) {
    if (err.response) {
      console.log(err.response);
      return displayMessage("error", err.response.data.message);
    }
    return displayMessage("error", err.message);
  }
};

export const forgotPassword = async (userEmail) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/forgotPassword",
      data: {
        email: userEmail
      }
    });
    //console.log(res);
    // console.log(res.data.status,res.data.message);
    return displayMessage(res.data.status, res.data.message);
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response);
      return displayMessage("error", err.response.data.message);
    }
    if (err.request) {
      console.log(err.request);
    }
    return displayMessage("error", err.message);
  }
};

export const resetPassword = async (passwordDetails, resetToken) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/resetPassword/${resetToken}`,
      data: {
        password: passwordDetails.newPassword,
        passwordConfirm: passwordDetails.newPasswordConfirm
      }
    });
    return displayMessage(res.data.status, res.data.message);
  } catch (err) {
    console.log(err);
    if (err.response) {
      console.log(err.response);
      return displayMessage("error", err.response.data.message);
    }
    if (err.request) {
      console.log(err.request);
    }
    return displayMessage("error", err.message);
  }
};

export const postJobHandler = async () => {
  try {
    await axios.get("/postJob");
    return location.assign(`${location.protocol}//${location.host}/postJob`);
  } catch (err) {
    console.log(err);
    if (err.response) {
      return displayMessage("error", err.response.data.message);
    } else if (err.request) {
      return displayMessage("error", err.request.response);
    }
    //console.log(err)
    return displayMessage("error", err.message);
  }
};
