/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const previousPageBtn = document.querySelector(".previous-page");
const nextPageBtn = document.querySelector(".next-page");
const jobContainer = document.querySelector(".job-container");
let previousPage = previousPageBtn.attributes.page.textContent;
let nextPage = nextPageBtn.attributes.page.textContent;

previousPageBtn.addEventListener("click", async (e) => {
  try{
    e.preventDefault();

  }catch(error){

  }
});

nextPageBtn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    // eslint-disable-next-line no-unused-vars
    const result = await axios({
      method: "GET",
      url: "/api/v1/jobs",
      params: {
        page: 2,
      },
    });
    const jobs = result.data.data;
    if (jobs) {
      jobContainer.innerHTML = "";
      const jobItem = document.createElement("div");
      jobSingle.setAttribute(
        "class",
        "col-lg-6 col-md-6 col-sm-6 col-xs-12"
      );
      for (i = 0; i < jobs.length; i++) {
        jobItem.innerHTML += `<div class="job-post-block">
        <div class="job-post-content">
        <a href="#" job_id="${jobs[i]._id}">
        <h3 class="job-post-title">${jobs[i].title}</h3>
        </a>
        <p>${jobs[i].organisation.name}</p>
        <p>
        <span class="job-location-icon">
        <i class="fa fa-map-marker"> </i>
        <span>${jobs[i].location.State}</span>
        </span>
        </p>
        </div>
        <div class="job-post-meta"></div>
        </div>
        </div>
         `;
        jobContainer.appendChild(jobItem);
      }
    }
  } catch (error) {
    console.log(error.response);
  }
});
