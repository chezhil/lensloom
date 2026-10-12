const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const clearButton = document.getElementById("clear-button");
const chips = document.querySelectorAll(".chip");
const results = document.getElementById("results");
const status = document.getElementById("status");
const resultCount = document.getElementById("result-count");

const DEFAULT_TITLE = document.title;
const SKELETON_COUNT = 6;

function showIdle() {
  status.textContent = "";
  resultCount.textContent = "Showing 0 results";
  results.innerHTML = "";
  const message = document.createElement("p");
  message.id = "empty-state";
  message.className = "empty-state";
  message.textContent = "Search to see results";
  results.appendChild(message);
}

function showLoading(query) {
  status.innerHTML = '<span class="spinner"></span> Searching for “' + query + '”…';
  resultCount.textContent = "";
  results.innerHTML = "";
  for (let i = 0; i < SKELETON_COUNT; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "card skeleton";
    results.appendChild(skeleton);
  }
}

function showEmpty(query) {
  status.textContent = "";
  resultCount.textContent = "Showing 0 results for “" + query + "”";
  results.innerHTML = "";
  const message = document.createElement("p");
  message.className = "empty-state";
  message.textContent = "No results for “" + query + "”. Try another word.";
  results.appendChild(message);
}

function showError() {
  status.textContent = "";
  resultCount.textContent = "";
  results.innerHTML = "";
  const message = document.createElement("p");
  message.className = "empty-state error-state";
  message.textContent = "Something went wrong. Please check your connection and try again.";
  results.appendChild(message);
}

function showResults(items, query) {
  results.innerHTML = "";

  items.forEach((item, index) => {
    const info = item.imageinfo[0];

    const card = document.createElement("a");
    card.className = "card";
    card.href = info.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.style.animationDelay = (index * 40) + "ms";

    const img = document.createElement("img");
    img.src = info.thumburl || info.url;
    img.alt = item.title;

    const caption = document.createElement("p");
    caption.textContent = item.title.replace(/^File:/, "").replace(/\.[^.]+$/, "");

    card.appendChild(img);
    card.appendChild(caption);
    results.appendChild(card);
  });

  status.textContent = "";
  resultCount.textContent = "Showing " + items.length + " result" + (items.length === 1 ? "" : "s") + " for “" + query + "”";
}

async function search(query) {
  document.title = query + " — " + DEFAULT_TITLE;
  showLoading(query);

  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();

    const pages = data.query && data.query.pages ? Object.values(data.query.pages) : [];
    const items = pages.filter((item) => item.imageinfo && item.imageinfo[0]);

    if (items.length === 0) {
      showEmpty(query);
    } else {
      showResults(items, query);
    }
  } catch (error) {
    console.error("Search failed:", error);
    showError();
  }
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
  document.title = DEFAULT_TITLE;
  showIdle();
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const query = chip.dataset.query;
    input.value = query;
    search(query);
  });
});
