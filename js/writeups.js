// Drives both writeups.html (the list) and writeup.html (the reader).
// Everything is driven off writeups/manifest.json — that's the only
// file you need to touch (plus the .md file itself) to publish.

const DIFF_COLOR = {
  Easy: "#3b5a55",
  Medium: "#a8792d",
  Hard: "#8c3323",
};

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

async function loadManifest() {
  const res = await fetch("writeups/manifest.json");
  if (!res.ok) throw new Error("Could not load manifest.json");
  const items = await res.json();
  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function diffMarkup(difficulty) {
  const color = DIFF_COLOR[difficulty] || "#6e7268";
  return `<span class="diff"><span class="diff-swatch" style="background:${color}"></span>${difficulty}</span>`;
}

// ---------- list page (writeups.html) ----------

function renderList(container, items) {
  if (!items.length) {
    container.innerHTML = `<p class="empty-state">No writeups published yet.</p>`;
    return;
  }
  container.innerHTML = items
    .map(
      (w) => `
      <a class="writeup-row" href="writeup.html?slug=${encodeURIComponent(w.slug)}">
        <span class="writeup-title">${w.title}</span>
        <span class="writeup-meta">
          <span>${formatDate(w.date)}</span>
          ${diffMarkup(w.difficulty)}
        </span>
      </a>`
    )
    .join("");
}

function renderFilters(container, items, onFilter) {
  const tags = [...new Set(items.flatMap((w) => w.tags || []))].sort();
  const all = ["all", ...tags];
  container.innerHTML = all
    .map((t, i) => `<button data-tag="${t}" class="${i === 0 ? "active" : ""}">${t}</button>`)
    .join("");

  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tag = btn.dataset.tag;
      onFilter(tag === "all" ? items : items.filter((w) => (w.tags || []).includes(tag)));
    });
  });
}

async function initListPage() {
  const listEl = document.querySelector("[data-writeup-list]");
  const filterEl = document.querySelector("[data-writeup-filters]");
  if (!listEl) return;

  try {
    const items = await loadManifest();
    renderList(listEl, items);
    if (filterEl) renderFilters(filterEl, items, (filtered) => renderList(listEl, filtered));
  } catch (err) {
    listEl.innerHTML = `<p class="empty-state">Couldn't load writeups (${err.message}).</p>`;
  }
}

// ---------- teaser on the homepage ----------

async function initHomeTeaser() {
  const el = document.querySelector("[data-writeup-teaser]");
  if (!el) return;
  try {
    const items = (await loadManifest()).slice(0, 3);
    renderList(el, items);
  } catch (err) {
    el.innerHTML = `<p class="empty-state">Couldn't load writeups.</p>`;
  }
}

// ---------- reader page (writeup.html) ----------

async function initReaderPage() {
  const root = document.querySelector("[data-writeup-reader]");
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  if (!slug) {
    root.innerHTML = `<p class="empty-state">No writeup specified.</p>`;
    return;
  }

  try {
    const items = await loadManifest();
    const meta = items.find((w) => w.slug === slug);
    if (!meta) throw new Error("Not found in manifest.json");

    const res = await fetch(`writeups/${slug}.md`);
    if (!res.ok) throw new Error(`Could not load writeups/${slug}.md`);
    const raw = await res.text();
    const html = marked.parse(raw);

    document.title = `${meta.title} — Abhishek Gore`;

    root.innerHTML = `
      <div class="writeup-header">
        <a class="back" href="writeups.html">&larr; all writeups</a>
        <h1>${meta.title}</h1>
        <div class="meta-line">
          ${formatDate(meta.date)} &nbsp;·&nbsp; ${meta.difficulty} &nbsp;·&nbsp; ${(meta.tags || []).join(", ")}
        </div>
      </div>
      <div class="writeup-body">${html}</div>
    `;
  } catch (err) {
    root.innerHTML = `<p class="empty-state">Couldn't load that writeup (${err.message}).</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initListPage();
  initHomeTeaser();
  initReaderPage();
});
