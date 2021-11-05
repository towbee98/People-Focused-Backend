import "core-js";


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
