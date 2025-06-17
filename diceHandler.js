const SHEET_HTML_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgzBVIVNvzDAE9I7BmVg7sbCANY7Yr-KYsr-pY5zf_xEYLL-qYHGebadNYv4GG22JaRGimGDCYhlO/pubhtml?gid=0&single=true&widget=false&chrome=false";

let dataRows = [];
const MAX_RECENT_ROLLS = 2;
const recentRolls = [];

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

function imageForRoll(num){
  return `/resources/artbox/roll_${num}.png`;
}

function swapImage(src){
  const frame = document.getElementById("art-frame");
  const old   = frame.querySelector(".roll-img");

  const fresh = document.createElement("img");
  fresh.className = "roll-img";
  fresh.src       = src;
  fresh.onerror   = () => { fresh.src = "/resources/ui/placeholder.png"; };

  fresh.onload    = () => {
    fresh.style.opacity = 1;
    if (old) old.style.opacity = 0;
  };

  fresh.addEventListener("transitionend", () => {
    if (old && old.parentNode){
      old.parentNode.removeChild(old);
    }
  });

  frame.appendChild(fresh);
}

function pickRoll () {
  const candidates = dataRows.map(r => Number(r.firstChild.textContent.trim()));
  const pool = candidates.filter(n => !recentRolls.includes(n));
  const roll =
        pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : candidates[Math.floor(Math.random() * candidates.length)];
  recentRolls.push(roll);
  if (recentRolls.length > MAX_RECENT_ROLLS) recentRolls.shift();
  return roll;
}

function showRoll () {
  if (!dataRows.length) return;

  const row =  dataRows[pickRoll()];
  const tds = row.querySelectorAll("td");

  const roll   = tds[0].innerHTML.trim();
  const effect = tds[1].innerHTML.trim();

  document.getElementById("entry").innerHTML =
    `<strong>${roll}</strong> — ${effect}`;

  const img   = document.getElementById("roll-img");
  const path  = imageForRoll(roll);

  swapImage(imageForRoll(roll));
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  showRoll();

  document.getElementById("reroll").addEventListener("click", showRoll);
});

const dice = document.getElementById("reroll");

dice.addEventListener("click", () => {
  dice.classList.add("rolling");
  showRoll();
  playDiceSound(); 
});

dice.addEventListener("animationend", () => {
  dice.classList.remove("rolling");
});

dice.addEventListener("contextmenu", e => e.preventDefault());