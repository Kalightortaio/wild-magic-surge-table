const SHEET_HTML_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTgzBVIVNvzDAE9I7BmVg7sbCANY7Yr-KYsr-pY5zf_xEYLL-qYHGebadNYv4GG22JaRGimGDCYhlO/pubhtml?gid=0&single=true&widget=false&chrome=false";

document.addEventListener("DOMContentLoaded", showRandomRow);

async function showRandomRow () {
  try {
    const html  = await fetch(SHEET_HTML_URL).then(r => r.text());
    const temp  = document.createElement("div");
    temp.innerHTML = html;

    const allRows = temp.querySelectorAll("table.waffle tbody tr");

    const dataRows = Array.from(allRows).filter(r => {
      const firstTd = r.querySelector("td");
      return firstTd && /^\d+$/.test(firstTd.textContent.trim());
    });

    const row = dataRows[Math.floor(Math.random() * dataRows.length)];

    const tds = row.querySelectorAll("td");
    const rollHTML   = tds[0].innerHTML.trim();
    const effectHTML = tds[1].innerHTML.trim();

    document.getElementById("entry").innerHTML =
      `<strong>${rollHTML}</strong> &mdash; ${effectHTML}`;
  }
  catch (e) {
    console.error(e);
    document.getElementById("entry").textContent =
      "Couldn't load the surge table.";
  }
}