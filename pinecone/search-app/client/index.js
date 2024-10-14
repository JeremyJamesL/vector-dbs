const searchBar = document.querySelector("#search-box");
const hits = document.querySelector("#hits");
const categoryFilters = document.querySelector(".filters__categories");
const devOrProd = "DEV";

const callPinecone = async (query, filterVal) => {
  const encodedQuery = encodeURIComponent(query);
  const encodedFilter = encodeURIComponent(filterVal);
  const rootURL =
    devOrProd == "PROD"
      ? "https://semantic-search.jezl.xyz"
      : "http://localhost:3000";

  const urlString =
    encodedFilter !== "undefined"
      ? `${rootURL}/get-results?q=${encodedQuery}&filter=${encodedFilter}`
      : `${rootURL}/get-results?q=${encodedQuery}`;

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
      <div class="card bg-base-100 py-2 shadow-xl">
        <figure>
          <img
            src="${result.image}"
            alt="Shoes"
            class="max-h-[175px]" />

        </figure>
        <div class="card-body justify-end  p-2">
          <h2 class="font-medium text-md">${result.name}!</h2>
        </div>
      </div>
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
    hits.innerHTML = "";
    categoryFilters.innerHTML = "";
    ("Start typing more than 5 character to get results...");
    return;
  }
  callPinecone(searchQuery);
});

categoryFilters.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter__value")) return;

  const filterValue = e.target.textContent.trim();

  callPinecone(searchBar.value, filterValue);
});
