const SHEET_HTML_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgzBVIVNvzDAE9I7BmVg7sbCANY7Yr-KYsr-pY5zf_xEYLL-qYHGebadNYv4GG22JaRGimGDCYhlO/pubhtml?gid=0&single=true&widget=false&chrome=false";

let dataRows = [];

async function loadData () {
  const html = await fetch(SHEET_HTML_URL).then(r => r.text());

  const temp = document.createElement("div");
  temp.innerHTML = html;

  const rows = temp.querySelectorAll("table.waffle tbody tr");

  dataRows = Array.from(rows).filter(r => {
    const firstTd = r.querySelector("td");
    return firstTd && /^\d+$/.test(firstTd.textContent.trim());
  });
}

function showRandom () {
  if (!dataRows.length) return;

  const row = dataRows[Math.floor(Math.random() * dataRows.length)];
  const tds = row.querySelectorAll("td");

  const roll   = tds[0].innerHTML.trim();
  const effect = tds[1].innerHTML.trim();

  document.getElementById("entry").innerHTML =
    `<strong>${roll}</strong> — ${effect}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  showRandom();

  document.getElementById("reroll").addEventListener("click", showRandom);
});

const dice = document.getElementById("reroll");

dice.addEventListener("click", () => {
  dice.classList.add("rolling");
  showRandom();
  playDiceSound(); 
});

dice.addEventListener("animationend", () => {
  dice.classList.remove("rolling");
});

dice.addEventListener("contextmenu", e => e.preventDefault());