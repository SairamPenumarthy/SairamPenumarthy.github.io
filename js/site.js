/*
  Renders PROJECTS and PAPERS (from js/data.js) into the page, and drives
  the "View Code" popup that cycles through a project's code snippets.
  You shouldn't need to edit this file just to add content — see js/data.js.
*/

const LINK_LABELS = {
  github: "GitHub",
  demo: "Live Demo",
  writeup: "Writeup",
  pdf: "PDF",
  slides: "Slides",
  code: "Code",
};

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function renderTags(tags) {
  if (!tags || !tags.length) return "";
  return `<div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>`;
}

function renderLinks(links) {
  if (!links) return "";
  const items = Object.entries(links)
    .filter(([, url]) => url)
    .map(([key, url]) => `<a class="btn-link" href="${url}" target="_blank" rel="noopener">${LINK_LABELS[key] || key} &#8599;</a>`)
    .join("");
  return items ? `<div class="card-links">${items}</div>` : "";
}

/* ---------------------------- Projects grid ---------------------------- */

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  if (!PROJECTS.length) {
    grid.appendChild(el(`<p class="empty-state">No projects yet — add one in js/data.js.</p>`));
    return;
  }

  PROJECTS.forEach((project, i) => {
    const media = project.image
      ? `<div class="card-media" style="background-image:url('${project.image}')"></div>`
      : "";

    const codeButton = project.code && project.code.length
      ? `<button class="btn-link btn-code" data-project-index="${i}">View Code &#9002;</button>`
      : "";

    const card = el(`
      <article class="card">
        ${media}
        <div class="card-body">
          <h3 class="card-title">${project.title}</h3>
          <p class="card-desc">${project.description}</p>
          ${renderTags(project.tags)}
          <div class="card-actions">
            ${renderLinks(project.links)}
            ${codeButton}
          </div>
        </div>
      </article>
    `);

    grid.appendChild(card);
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-code");
    if (!btn) return;
    const project = PROJECTS[Number(btn.dataset.projectIndex)];
    openCodeModal(project.title, project.code);
  });
}

/* ----------------------------- Papers grid ------------------------------ */

function renderPapers() {
  const grid = document.getElementById("papers-grid");
  if (!grid) return;

  if (!PAPERS.length) {
    grid.appendChild(el(`<p class="empty-state">No papers yet — add one in js/data.js.</p>`));
    return;
  }

  PAPERS.forEach((paper) => {
    const meta = [paper.course, paper.date].filter(Boolean).join(" &middot; ");
    const card = el(`
      <article class="card paper-card">
        <div class="card-body">
          <h3 class="card-title">${paper.title}</h3>
          ${meta ? `<p class="card-meta">${meta}</p>` : ""}
          <p class="card-desc abstract-text abstract-hidden">${paper.abstract}</p>
          ${renderTags(paper.tags)}
          <div class="card-actions">
            ${renderLinks(paper.links)}
            <button class="btn-link btn-abstract">Read Abstract &#9662;</button>
          </div>
        </div>
      </article>
    `);
    grid.appendChild(card);
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-abstract");
    if (!btn) return;
    const abstract = btn.closest(".paper-card").querySelector(".abstract-text");
    const nowHidden = abstract.classList.toggle("abstract-hidden");
    btn.innerHTML = nowHidden ? "Read Abstract &#9662;" : "Hide Abstract &#9652;";
  });
}

/* ----------------------------- Photos grid ------------------------------ */

function renderPhotos() {
  const grid = document.getElementById("photos-grid");
  if (!grid) return;

  if (!PHOTOS.length) {
    grid.appendChild(el(`<p class="empty-state">No photos yet — add one in js/data.js.</p>`));
    return;
  }

  PHOTOS.forEach((photo) => {
    const card = el(`
      <article class="card photo-card">
        <div class="card-media" style="background-image:url('${photo.src}')"></div>
        <div class="card-body">
          <p class="card-desc">${photo.caption}</p>
        </div>
      </article>
    `);
    grid.appendChild(card);
  });
}

/* -------------------------- Code preview modal -------------------------- */
/* Only present on index.html — guarded so pages without it (e.g. photos.html)
   can still load this shared script. */

const modal = document.getElementById("code-modal");
const modalTitle = document.getElementById("code-modal-title");
const modalTabs = document.getElementById("code-modal-tabs");
const modalPane = document.getElementById("code-modal-pane");
const modalClose = document.getElementById("code-modal-close");

let autoplay = null; // { snippets, index, raf, paused, waiting, holdTimeout }

function openCodeModal(title, snippets) {
  modalTitle.textContent = title;
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  startAutoplay(snippets);
}

function closeCodeModal() {
  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  stopAutoplay();
}

function stopAutoplay() {
  if (!autoplay) return;
  cancelAnimationFrame(autoplay.raf);
  clearTimeout(autoplay.holdTimeout);
  autoplay = null;
}

function startAutoplay(snippets) {
  stopAutoplay();
  autoplay = { snippets, index: 0, paused: false, waiting: false };

  modalTabs.innerHTML = snippets
    .map((s, i) => `<button class="code-tab" data-index="${i}">${s.filename}</button>`)
    .join("");

  showSnippet(0);
  tickAutoplay();
}

function showSnippet(index) {
  if (!autoplay) return;
  autoplay.index = index;
  const snippet = autoplay.snippets[index];

  modalPane.textContent = snippet.snippet;
  modalPane.scrollTop = 0;

  modalTabs.querySelectorAll(".code-tab").forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });
}

function tickAutoplay() {
  if (!autoplay) return;
  const state = autoplay;

  if (!state.paused) {
    modalPane.scrollTop += 0.6; // slow, readable auto-scroll

    const atBottom = modalPane.scrollTop + modalPane.clientHeight >= modalPane.scrollHeight - 1;
    if (atBottom && !state.waiting) {
      state.waiting = true;
      state.holdTimeout = setTimeout(() => {
        if (autoplay !== state) return;
        state.waiting = false;
        showSnippet((state.index + 1) % state.snippets.length);
      }, 1400);
    }
  }

  state.raf = requestAnimationFrame(tickAutoplay);
}

if (modal) {
  modalTabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".code-tab");
    if (!tab || !autoplay) return;
    clearTimeout(autoplay.holdTimeout);
    autoplay.waiting = false;
    showSnippet(Number(tab.dataset.index));
  });

  modal.addEventListener("mouseenter", () => { if (autoplay) autoplay.paused = true; });
  modal.addEventListener("mouseleave", () => { if (autoplay) autoplay.paused = false; });

  modalClose.addEventListener("click", closeCodeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeCodeModal(); // backdrop click
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeCodeModal();
  });
}

/* --------------------------------- Init --------------------------------- */

renderProjects();
renderPapers();
renderPhotos();
