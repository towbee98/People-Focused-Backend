export const displayMessage = (status, message) => {
  if (status === "success") {
    document.querySelector(".alert-success").firstElementChild.textContent =
      message;
    document.querySelector(".alert-success").style.display = "inline";
    document.querySelector(".alert-danger").style.display = "none";
  } else {
    document.querySelector(".alert-danger").firstElementChild.textContent =
      message;
    document.querySelector(".alert-success").style.display = "none";
    document.querySelector(".alert-danger").style.display = "inline";
  }
};
