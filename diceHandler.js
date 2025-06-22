const SHEET_HTML_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgzBVIVNvzDAE9I7BmVg7sbCANY7Yr-KYsr-pY5zf_xEYLL-qYHGebadNYv4GG22JaRGimGDCYhlO/pubhtml?gid=0&single=true&widget=false&chrome=false";

let dataRows = [];

async function loadData () {
  const html = await fetch(SHEET_HTML_URL).then(r => r.text());
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const rows = temp.querySelectorAll("table.waffle tbody tr");

  dataRows = Array.from(rows).filter(r => {
    const td = r.querySelector("td");
    return td && /^\d+$/.test(td.textContent.trim());
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

function showRoll () {
  if (!dataRows.length) return;

  const row =  dataRows[Math.floor(Math.random() * dataRows.length)];
  const tds = row.querySelectorAll("td");

  const roll   = tds[0].innerHTML.trim();
  const effect = tds[1].innerHTML.trim();

  document.getElementById("entry").innerHTML =
    `<strong>${roll}</strong> — ${effect}`;

  swapImage(imageForRoll(roll));
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  showRoll();
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