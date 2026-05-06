function sair() {
    window.location.href = "index.html";
}
fetch("search-index.json")
  .then(r => r.json())
  .then(init);

function init(index) {
  const input = document.getElementById("pesquisa");
  const wrap = input.parentElement;

  const drop = document.createElement("div");
  drop.className = "search-dropdown";
  wrap.appendChild(drop);

  const list = document.getElementById("lista-resultados");
  if (list) list.innerHTML = index.map(e => itemHTML(e, null)).join("");

  function itemHTML(e, q) {
    const hash = e.anchor ? "#" + e.anchor : "";
    const query = q ? "?q=" + encodeURIComponent(q) : "";
    const href = e.file + query + hash;
    
    const icon = e.icon || "<i class='search-icon-default'>📄</i>";
    return `
      <a href="${href}" class="search-item">
        <span class="search-item-icon">${icon}</span>
        <span class="search-item-body">
          <span class="search-item-title">${e.title || e.text}</span>
          <span class="search-item-meta">${e.file}${e.anchor ? " — #" + e.anchor : ""}</span>
        </span>
      </a>`;
  }

  function render(q) {
    if (!q) {
      drop.style.display = "none";
      if (list) list.style.display = "";
      return;
    }
    if (list) list.style.display = "none";

    const hits = index
      .filter(e => (e.title || e.text).toLowerCase().includes(q) || e.text.toLowerCase().includes(q))
      .slice(0, 8);

    drop.innerHTML = hits.length
      ? hits.map(e => itemHTML(e, q)).join("")
      : `<span class="search-no-result">Nenhum resultado</span>`;

    drop.style.display = "";
  }

  input.addEventListener("input", () => render(input.value.trim().toLowerCase()));
  input.addEventListener("keydown", e => { if (e.key === "Enter") drop.querySelector("a")?.click(); });
  document.addEventListener("click", e => {
    if (!wrap.contains(e.target) && !list?.contains(e.target)) drop.style.display = "none";
  });
}