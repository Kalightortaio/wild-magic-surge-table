const info = document.getElementById("info");
const search = document.getElementById("search");
const modal = document.getElementById("searchModal");
const searchBox = document.getElementById("searchBox");

const isOpen  = () =>  modal.classList.contains("show");
const isInfo  = () =>  modal.classList.contains("info");
const open    = () =>  modal.classList.add("show");
const close   = () =>  modal.classList.remove("show", "info");
const setInfo = () =>  modal.classList.add("info");
const clrInfo = () =>  modal.classList.remove("info");

let surgeCache = [];
let minRoll = 0;
let maxRoll = 0;

function buildSurgeCache() {
  surgeCache = dataRows.map(r=> {
    const tds  = r.querySelectorAll("td");
    return {
      roll: Number(tds[0].textContent.trim()),
      text: tds[1].textContent.trim(),
      row : r
    };
  });
}

function setRollBounds() {
  const first = dataRows[0].querySelector("td").textContent.trim();
  const last  = dataRows[dataRows.length - 1].querySelector("td").textContent.trim();
  minRoll = Number(first);
  maxRoll = Number(last);
}

function filterSurges(q) {
  const term = q.trim().toLowerCase();
  if(!term) return [];

  if (/^\d+$/.test(term)) {
    const n = Number(term);
    if (n >= minRoll && n <= maxRoll) {
      const hit = surgeCache.find(s => s.roll === n);
      return hit ? [hit] : [];
    }
    return [];
  }

  return surgeCache.filter(s => s.text.toLowerCase().includes(term));
}

function showSuggestions(list) {
  const ul = document.getElementById("searchResults");
  ul.innerHTML = "";

  if(!list.length) { ul.hidden = true; return; }

  list.forEach(s=> {
    const li = document.createElement("li");
    li.textContent = `${s.roll} — ${s.text.slice(0,140)}…`;
    li.addEventListener("click", ()=> {
      loadSurge(s);
      close();
    });
    ul.appendChild(li);
  });
  ul.hidden = false;
  ul.scrollTop = 0;
}

function loadSurge(s) {
  const tds = s.row.querySelectorAll("td");
  document.getElementById("entry").innerHTML =
     `<strong>${s.roll}</strong> — ${tds[1].innerHTML.trim()}`;
  swapImage( imageForRoll(s.roll) );
}

document.addEventListener("DOMContentLoaded", async ()=> {
  await loadData();
  buildSurgeCache();
  setRollBounds();
});

searchBox.addEventListener("input", e=> {
  showSuggestions( filterSurges(e.target.value) );
});

info.addEventListener("click", () => {
  if (!isOpen()) {
    setInfo();
    open();
    return;
  }
  if (isInfo()) {
    close();
  } else {
    setInfo();
  }
});

search.addEventListener("click", () => {
  if (!isOpen()) {
    clrInfo();
    open();
    return;
  }
  if (isInfo()) {
    clrInfo();
  } else {
    close();
  }
});

info.addEventListener("contextmenu", e => e.preventDefault());
search.addEventListener("contextmenu", e => e.preventDefault());

window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    close();
    return;
  }
  if (e.ctrlKey && e.key === "f") {
    e.preventDefault();
    clrInfo();
    open();
    searchBox.focus();
  }
});