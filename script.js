const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const clearButton = document.getElementById("clear-button");
const chips = document.querySelectorAll(".chip");
const results = document.getElementById("results");
const status = document.getElementById("status");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");

async function search(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

  try {
    status.textContent = "Searching for “" + query + "”…";

    const response = await fetch(url);
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();

    const items = data.query && data.query.pages ? Object.values(data.query.pages) : [];
    render(items, query);
  } catch (error) {
    console.error("Search failed:", error);
    status.textContent = "Something went wrong while searching.";
  }
}

function render(items, query) {
  results.innerHTML = "";

  const usable = items.filter((item) => item.imageinfo && item.imageinfo[0]);

  if (usable.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = "No results for “" + query + "”. Try another word.";
    results.appendChild(message);
  } else {
    usable.forEach((item) => {
      const info = item.imageinfo[0];

      const card = document.createElement("a");
      card.className = "card";
      card.href = info.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      const img = document.createElement("img");
      img.src = info.thumburl || info.url;
      img.alt = item.title;

      const caption = document.createElement("p");
      caption.textContent = item.title.replace(/^File:/, "").replace(/\.[^.]+$/, "");

      card.appendChild(img);
      card.appendChild(caption);
      results.appendChild(card);
    });
  }

  status.textContent = "";
  resultCount.textContent = "Showing " + usable.length + " result" + (usable.length === 1 ? "" : "s") + " for “" + query + "”";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  search(query);
});

clearButton.addEventListener("click", () => {
  input.value = "";
  input.focus();
  results.innerHTML = "";
  results.appendChild(emptyState);
  status.textContent = "";
  resultCount.textContent = "Showing 0 results";
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const query = chip.dataset.query;
    input.value = query;
    search(query);
  });
});
