require("regenerator-runtime/runtime");
var $8FRzj$axios = require("axios");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
//import "core-js";


const $899bd9a256d8633b$export$6558b1f3861b096 = (status, message)=>{
    if (status === "success") {
        document.querySelector(".alert-success").firstElementChild.textContent = message;
        document.querySelector(".alert-success").style.display = "inline";
        document.querySelector(".alert-danger").style.display = "none";
    } else {
        document.querySelector(".alert-danger").firstElementChild.textContent = message;
        document.querySelector(".alert-success").style.display = "none";
        document.querySelector(".alert-danger").style.display = "inline";
    }
};


const $8f45758255368642$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await (0, ($parcel$interopDefault($8FRzj$axios)))({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)(res.data.status, "Login Successful");
    } catch (err) {
        if (err.response) {
            console.log("true");
            console.log(err.response.statusCode);
            return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.response.data.message);
        }
        if (err.request) console.log(err.request);
        console.log(err);
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.message);
    }
};
const $8f45758255368642$export$cf64224bcd829024 = async (userDetails)=>{
    try {
        console.log(userDetails);
        const res = await (0, ($parcel$interopDefault($8FRzj$axios)))({
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
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)(res.data.status, res.data.data.message);
    } catch (err) {
        if (err.response) {
            console.log(err.response);
            return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.response.data.message);
        }
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.message);
    }
};
const $8f45758255368642$export$66791fb2cfeec3e = async (userEmail)=>{
    try {
        const res = await (0, ($parcel$interopDefault($8FRzj$axios)))({
            method: "POST",
            url: "/api/v1/users/forgotPassword",
            data: {
                email: userEmail
            }
        });
        //console.log(res);
        // console.log(res.data.status,res.data.message);
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)(res.data.status, res.data.message);
    } catch (err) {
        console.log(err);
        if (err.response) {
            console.log(err.response);
            return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.response.data.message);
        }
        if (err.request) console.log(err.request);
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.message);
    }
};
const $8f45758255368642$export$dc726c8e334dd814 = async (passwordDetails, resetToken)=>{
    try {
        const res = await (0, ($parcel$interopDefault($8FRzj$axios)))({
            method: "PATCH",
            url: `/api/v1/users/resetPassword/${resetToken}`,
            data: {
                password: passwordDetails.newPassword,
                passwordConfirm: passwordDetails.newPasswordConfirm
            }
        });
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)(res.data.status, res.data.message);
    } catch (err) {
        console.log(err);
        if (err.response) {
            console.log(err.response);
            return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.response.data.message);
        }
        if (err.request) console.log(err.request);
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.message);
    }
};
const $8f45758255368642$export$b0b036793f958293 = async ()=>{
    try {
        await (0, ($parcel$interopDefault($8FRzj$axios))).get("/postJob");
        return location.assign(`${location.protocol}//${location.host}/postJob`);
    } catch (err) {
        // console.log(err);
        if (err.response) return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.response.data.message);
        else if (err.request) return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.request.response);
        //console.log(err)
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.message);
    }
};
const $8f45758255368642$export$9a74f7f5b6e31fbc = async ()=>{};
const $8f45758255368642$export$12b282d6eb79104e = async (jobDetails)=>{
    try {
        const res = await (0, ($parcel$interopDefault($8FRzj$axios)))({
            method: "POST",
            url: `/api/v1/jobs`,
            data: jobDetails
        });
        console.log(res);
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)(res.data.status, "Job successfully posted.");
    } catch (err) {
        console.log(err.message);
        if (err.response) {
            console.log(err.response);
            return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.response.data.message);
        }
        if (err.request) console.log(err.request);
        return (0, $899bd9a256d8633b$export$6558b1f3861b096)("error", err.message);
    }
};


if (document.querySelector(".previous-page") || document.querySelector(".next-page")) {
    const previousPageBtn = document.querySelector(".previous-page");
    const nextPageBtn = document.querySelector(".next-page");
    const jobContainer = document.querySelector(".job-container");
    const pageOne = document.querySelector(".pagination").children[1];
    const pageTwo = document.querySelector(".pagination").children[2];
    const pageThree = document.querySelector(".pagination").children[3];
    const previousPage = previousPageBtn.attributes.page.textContent;
    const nextPage = nextPageBtn.attributes.page.textContent;
    const paginationBtns = [
        pageOne,
        pageTwo,
        pageThree
    ];
    // This function changes the page based on user's click
    const changePage = (wantedPage)=>{
        console.log(wantedPage);
        console.log(window.location.origin);
        window.location.assign(`${window.location.origin}/Jobs?page=${Number(wantedPage)}`);
    };
    // eslint-disable-next-line array-callback-return
    // this refers to all the button pages in the list
    // eslint-disable-next-line array-callback-returnh
    paginationBtns.map((el)=>{
        el.addEventListener("click", async (event)=>{
            try {
                event.preventDefault();
                changePage(el.textContent);
            } catch (error) {
                console.log(error.response);
            }
        });
    });
    previousPageBtn.addEventListener("click", async (e)=>{
        try {
            e.preventDefault();
            await changePage(previousPage);
        } catch (error) {
            console.log(error.response);
        }
    });
    nextPageBtn.addEventListener("click", async (e)=>{
        try {
            e.preventDefault();
            await changePage(nextPage);
        } catch (error) {
            console.log(error.response);
        }
    });
}
if (document.querySelector(".apply")) document.querySelectorAll(".apply").forEach((el)=>{
    el.addEventListener("click", (e)=>{
        // e.preventDefault();
        console.log("apply button was clicked");
    });
});
if (document.forms.login) document.forms[0][2].addEventListener("click", async (e)=>{
    e.preventDefault();
    const email = document.forms.login.elements.email.value;
    const password = document.forms.login.elements.password.value;
    await (0, $8f45758255368642$export$596d806903d1f59e)(email, password);
});
if (document.forms.signUp) document.querySelector("#submit-job-details").addEventListener("click", async (e)=>{
    e.preventDefault();
    const firstname = document.forms.signUp.elements.firstname.value;
    const lastname = document.forms.signUp.elements.lastname.value;
    const email = document.forms.signUp.elements.email.value;
    const password = document.forms.signUp.elements.password.value;
    const passwordConfirm = document.forms.signUp.elements.passwordConfirm.value;
    const role = document.forms.signUp.elements.role.value;
    const userDetails = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        role: role
    };
    await (0, $8f45758255368642$export$cf64224bcd829024)(userDetails);
});
if (document.forms.forgetPassword) document.forms[0][1].addEventListener("click", async (e)=>{
    e.preventDefault();
    const userEmail = document.forms.forgetPassword.elements.email.value;
    await (0, $8f45758255368642$export$66791fb2cfeec3e)(userEmail);
});
if (document.forms.resetPassword) //console.log(location.pathname.split('/')[2]);
document.forms[0][2].addEventListener("click", async (e)=>{
    e.preventDefault();
    const newPassword = document.forms.resetPassword.elements.password.value;
    const newPasswordConfirm = document.forms.resetPassword.elements.passwordConfirm.value;
    const passwordDetails = {
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm
    };
    const resetToken = location.pathname.split("/")[2];
    await (0, $8f45758255368642$export$dc726c8e334dd814)(passwordDetails, resetToken);
});
if (document.querySelector(".post-a-job")) document.querySelector(".post-a-job").addEventListener("click", async (e)=>{
    e.preventDefault();
    await (0, $8f45758255368642$export$b0b036793f958293)();
});
if (document.forms.uploadJob) document.forms.uploadJob[45].addEventListener("click", async (e)=>{
    e.preventDefault();
    const companyName = document.forms.uploadJob.elements.companyName.value;
    const companyEmail = document.forms.uploadJob.elements.companyEmail.value;
    const companyDescription = document.forms.uploadJob.elements.companyDescription.value;
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
    const contractTypes = [
        ...document.forms.uploadJob.elements.contractTypes
    ].filter((contractType)=>{
        return contractType.checked;
    }).map((contractType)=>contractType.value);
    const minSalary = document.forms.uploadJob.minimum.value;
    const maxSalary = document.forms.uploadJob.maximum.value;
    const SalaryBasis = document.forms.uploadJob.salaryBasis.value;
    const submitCV = document.forms.uploadJob.submitCV.value;
    const applicationDeadline = document.forms.uploadJob.applicationDeadline.value;
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
            address: address,
            city: city,
            country: country
        },
        linksToJob: {
            link1: jobLink1,
            link2: jobLink2,
            link3: jobLink3
        },
        contractTypes: contractTypes,
        Remote: Remote,
        numberOfHires: numberOfHires,
        phone: phone,
        employmentType: employmentType,
        Category: {
            name: category
        },
        "Job Summary": jobSummary,
        Salary: {
            min: minSalary,
            max: maxSalary,
            SalaryBasis: SalaryBasis
        },
        submitCV: submitCV,
        Deadline: applicationDeadline,
        sendUpdatesToEmail: updateEmail,
        "Minimum Qualification": minimumEducation,
        "Experience Level": experienceLevel,
        "Experience Length": experienceLength,
        "Job Description": jobDescription
    };
    await (0, $8f45758255368642$export$12b282d6eb79104e)(jobDetails);
});
if (document.forms.applyForJob) {
    console.log(document.forms.applyForJob);
    console.log(location.href);
    document.forms.applyForJob[4].addEventListener("click", (event)=>{
        event.preventDefault();
        const name = document.forms.applyForJob.Name.value;
        const email = document.forms.applyForJob.Email.value;
        const cv = document.forms.applyForJob.CV.value;
        const experience = document.forms.applyForJob.experience.value;
        const details = {
            name: name,
            email: email,
            cv: cv,
            experience: experience
        };
        console.log(details);
    });
}


//# sourceMappingURL=bundle.js.map
