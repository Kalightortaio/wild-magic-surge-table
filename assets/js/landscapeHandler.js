function syncEntryHeight(){
  const sub   = document.getElementById('subContainer');
  const art  = document.getElementById('artBox');
  const entry = document.getElementById('entry');
  const dir = getComputedStyle(sub).flexDirection;

  if (dir === 'row') {
    entry.style.maxHeight = art.getBoundingClientRect().height + 'px';
  } else {
    entry.style.maxHeight = '';
  }
}

window.addEventListener('load', syncEntryHeight);
window.addEventListener('resize', syncEntryHeight);