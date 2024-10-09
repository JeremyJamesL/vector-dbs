const searchBar = document.querySelector("#search-box");
const hits = document.querySelector("#hits");

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

searchBar.addEventListener("input", async (e) => {
  const searchQuery = e.target.value;
  if (searchQuery.length <= 5) return;
  else {
    const response = await fetch(
      `http://localhost:3000/get-results?q=${searchQuery}`
    );
    const data = await response.json();
    updateHits(data);
  }
});
