const searchBar = document.querySelector("#search-box");
const hits = document.querySelector("#hits");
const categoryFilters = document.querySelector(".filters__categories");

const callPinecone = async (query, filterVal) => {
  const encodedQuery = encodeURIComponent(query);
  const encodedFilter = encodeURIComponent(filterVal);

  const urlString =
    encodedFilter !== "undefined"
      ? `http://localhost:3000/get-results?q=${encodedQuery}&filter=${encodedFilter}`
      : `http://localhost:3000/get-results?q=${encodedQuery}`;

  const response = await fetch(urlString);
  const data = await response.json();
  updateHits(data);
  updateFilters(data);
};

const updateHits = (results) => {
  hits.innerHTML = "";

  let html = results
    .map((result) => {
      return `
        <li class="text-center border-2 p-3">
           <img src=${result.image} class="max-w-[150px] h-auto mb-5 m-auto"/>
           <h2 class="text-bold">${result.name}</h2>
        </li>
       `;
    })
    .join("");

  hits.insertAdjacentHTML("beforeend", html);
};

const updateFilters = (results) => {
  categoryFilters.innerHTML = "";

  const filterValues = Array.from(
    new Set(results.map((el) => el.primaryCategory))
  );

  const html = filterValues
    .map((filter) => {
      return `
      <li class="filter__value cursor-pointer">
        ${filter}
      </li>
    `;
    })
    .join("");

  categoryFilters.insertAdjacentHTML("afterbegin", html);
};

searchBar.addEventListener("input", async (e) => {
  const searchQuery = e.target.value;

  if (searchQuery.length <= 5) {
    hits.innerHTML = "Start typing more than 5 character to get results...";
    categoryFilters.innerHTML = "";
    return;
  }

  callPinecone(searchQuery);
});

categoryFilters.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter__value")) return;

  const filterValue = e.target.textContent.trim();

  callPinecone(searchBar.value, filterValue);
});
