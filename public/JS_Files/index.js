//import "core-js";
import "regenerator-runtime/runtime";
import {
  login,
  signUp,
  forgotPassword,
  resetPassword,
  postJobHandler,
  postJob
} from "./login.js";

if (
  document.querySelector(".previous-page") ||
  document.querySelector(".next-page")
) {
  const previousPageBtn = document.querySelector(".previous-page");
  const nextPageBtn = document.querySelector(".next-page");
  const jobContainer = document.querySelector(".job-container");
  const pageOne = document.querySelector(".pagination").children[1];
  const pageTwo = document.querySelector(".pagination").children[2];
  const pageThree = document.querySelector(".pagination").children[3];
  const previousPage = previousPageBtn.attributes.page.textContent;
  const nextPage = nextPageBtn.attributes.page.textContent;
  const paginationBtns = [pageOne, pageTwo, pageThree];

  // This function changes the page based on user's click
  const changePage = (wantedPage) => {
    window.location.assign(
      `http://localhost:3001/Jobs?page=${Number(wantedPage)}`
    );
  };
  // eslint-disable-next-line array-callback-return
  // this refers to all the button pages in the list
  // eslint-disable-next-line array-callback-return
  paginationBtns.map((el) => {
    el.addEventListener("click", async (event) => {
      try {
        event.preventDefault();
        await changePage(el.textContent);
      } catch (error) {
        console.log(error.response);
      }
    });
  });
  previousPageBtn.addEventListener("click", async (e) => {
    try {
      e.preventDefault();
      await changePage(previousPage);
    } catch (error) {
      console.log(error.response);
    }
  });
  nextPageBtn.addEventListener("click", async (e) => {
    try {
      e.preventDefault();
      await changePage(nextPage);
    } catch (error) {
      console.log(error.response);
    }
  });
}

if (document.querySelector(".apply")) {
  document.querySelectorAll(".apply").forEach((el) => {
    el.addEventListener("click", (e) => {
      // e.preventDefault();

      console.log("apply button was clicked");
    });
  });
}

if (document.forms.login) {
  document.forms[0][2].addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.forms.login.elements.email.value;
    const password = document.forms.login.elements.password.value;
    await login(email, password);
  });
}

if (document.forms.signUp) {
  document
    .querySelector("#submit-job-details")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const firstname = document.forms.signUp.elements.firstname.value;
      const lastname = document.forms.signUp.elements.lastname.value;
      const email = document.forms.signUp.elements.email.value;
      const password = document.forms.signUp.elements.password.value;
      const passwordConfirm =
        document.forms.signUp.elements.passwordConfirm.value;
      const role = document.forms.signUp.elements.role.value;
      const userDetails = {
        firstname,
        lastname,
        email,
        password,
        passwordConfirm,
        role
      };
      await signUp(userDetails);
    });
}

if (document.forms.forgetPassword) {
  document.forms[0][1].addEventListener("click", async (e) => {
    e.preventDefault();
    const userEmail = document.forms.forgetPassword.elements.email.value;
    await forgotPassword(userEmail);
  });
}

if (document.forms.resetPassword) {
  //console.log(location.pathname.split('/')[2]);
  document.forms[0][2].addEventListener("click", async (e) => {
    e.preventDefault();
    const newPassword = document.forms.resetPassword.elements.password.value;
    const newPasswordConfirm =
      document.forms.resetPassword.elements.passwordConfirm.value;
    const passwordDetails = { newPassword, newPasswordConfirm };
    const resetToken = location.pathname.split("/")[2];
    await resetPassword(passwordDetails, resetToken);
  });
}

if (document.querySelector(".post-a-job")) {
  document.querySelector(".post-a-job").addEventListener("click", async (e) => {
    e.preventDefault();
    await postJobHandler();
  });
}

if (document.forms.uploadJob) {
  document.forms.uploadJob[45].addEventListener("click", async (e) => {
    e.preventDefault();
    const companyName = document.forms.uploadJob.elements.companyName.value;
    const companyEmail = document.forms.uploadJob.elements.companyEmail.value;
    const companyDescription =
      document.forms.uploadJob.elements.companyDescription.value;
    const category = document.forms.uploadJob.category.value;
    const jobTitle = document.forms.uploadJob.elements.jobTitle.value;
    const jobSummary = document.forms.uploadJob.elements.jobSummary.value;
    const address = document.forms.uploadJob.elements.address.value;
    const city = document.forms.uploadJob.elements.city.value;
    const country = document.forms.uploadJob.elements.country.value;
    const jobLink1 = document.forms.uploadJob.elements.linkToJob1.value;
    const jobLink2 = document.forms.uploadJob.elements.linkToJob2.value;
    const jobLink3 = document.forms.uploadJob.elements.linkToJob3.value;
    const Remote = document.forms.uploadJob.remote.value;
    const numberOfHires = document.forms.uploadJob.hire.value;
    const phone = document.forms.uploadJob.phone.value;
    const employmentType = document.forms.uploadJob.employType.value;
    const contractTypes = [...document.forms.uploadJob.elements.contractTypes]
      .filter((contractType) => {
        return contractType.checked;
      })
      .map((contractType) => contractType.value);
    const minSalary = document.forms.uploadJob.minimum.value;
    const maxSalary = document.forms.uploadJob.maximum.value;
    const SalaryBasis = document.forms.uploadJob.salaryBasis.value;
    const submitCV = document.forms.uploadJob.submitCV.value;
    const applicationDeadline =
      document.forms.uploadJob.applicationDeadline.value;
    const updateEmail = document.forms.uploadJob.updateEmail.value;
    const minimumEducation = document.forms.uploadJob.minimumEducation.value;
    const experienceLevel = document.forms.uploadJob.experienceLevel.value;
    const experienceLength = document.forms.uploadJob.experienceLength.value;
    const jobDescription = document.forms.uploadJob.jobDescription.value;
    const jobDetails = {
      title: jobTitle,
      organisation: {
        name: companyName,
        description: companyDescription,
        email: companyEmail
      },
      location: {
        address,
        city,
        country
      },
      linksToJob: {
        link1: jobLink1,
        link2: jobLink2,
        link3: jobLink3
      },
      contractTypes,
      Remote,
      numberOfHires,
      phone,
      employmentType,
      Category: {
        name: category
      },
      "Job Summary": jobSummary,
      Salary: {
        min: minSalary,
        max: maxSalary,
        SalaryBasis
      },
      submitCV,
      Deadline: applicationDeadline,
      sendUpdatesToEmail: updateEmail,
      "Minimum Qualification": minimumEducation,
      "Experience Level": experienceLevel,
      "Experience Length": experienceLength,
      "Job Description": jobDescription
    };
    await postJob(jobDetails);
  });
}

if (document.forms.applyForJob) {
  console.log(document.forms.applyForJob);
  console.log(location.href);
  document.forms.applyForJob[4].addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.forms.applyForJob.Name.value;
    const email = document.forms.applyForJob.Email.value;
    const cv = document.forms.applyForJob.CV.value;
    const experience = document.forms.applyForJob.experience.value;
    const details = {
      name,
      email,
      cv,
      experience
    };
    console.log(details);
  });
}
