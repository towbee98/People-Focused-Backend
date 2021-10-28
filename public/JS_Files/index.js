/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
const previousPageBtn = document.querySelector(".previous-page");
const nextPageBtn = document.querySelector(".next-page");
const jobContainer = document.querySelector(".job-container");
// const paginationBtns = document.querySelector(".pagination").children;
// console.log(paginationBtn);
// eslint-disable-next-line prefer-const
const pageOne = document.querySelector(".pagination").children[1];
const pageTwo = document.querySelector(".pagination").children[2];
const pageThree = document.querySelector(".pagination").children[3];
const previousPage = previousPageBtn.attributes.page.textContent;
const paginationBtns = [pageOne, pageTwo, pageThree];
// eslint-disable-next-line prefer-const
let nextPage = nextPageBtn.attributes.page.textContent;
console.log(previousPage, nextPage);
// This function changes the page based on user's click
const changePage = async (wantedPage) => {
  console.log(wantedPage);
  window.location.assign(
    `http://localhost:3001/Jobs?page=${Number(wantedPage)}`
  );
};
// eslint-disable-next-line array-callback-return
// this refers to all the button pages in the list
// eslint-disable-next-line array-callback-return
paginationBtns.map((el) => {
  el.addEventListener("click", async (event) => {
    event.preventDefault();
    await changePage(el.textContent);
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
