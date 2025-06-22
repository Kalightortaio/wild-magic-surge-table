const search = document.getElementById("search");
const modal = document.getElementById("searchModal");
const searchBox = document.getElementById("searchBox");

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
      modal.style.visibility = "hidden";
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

search.addEventListener("click", () => {
  modal.style.visibility = modal.style.visibility === "hidden" ? "visible" : "hidden";
});

search.addEventListener("contextmenu", e => e.preventDefault());

window.addEventListener("keydown", e=> {
  if(e.key==="Escape") modal.style.visibility = "hidden";
});

window.addEventListener("keydown", e=> {
  if (e.ctrlKey && e.key === "f") { 
    e.preventDefault();
    modal.style.visibility = "visible";
  }
});