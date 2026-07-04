/**
 * app.js — page controllers
 * ------------------------------------------------------------------
 * One ES6 class per page. A tiny App bootstrapper reads
 * <body data-page="..."> and starts the right controller.
 * ------------------------------------------------------------------
 */

/* ============================ HOME ============================ */
class HomePage {
  constructor() {
    this.collection = new FilmCollection();
    this.modal = new DetailModal();
    this.api = AppConfig.hasKey ? new TmdbService(AppConfig.TMDB_API_KEY) : null;
    this.grid = document.getElementById("canonGrid");
    this.chips = document.querySelectorAll(".chip");
  }

  init() {
    this.render(this.collection.getAll());
    this.chips.forEach((chip) => {
      chip.addEventListener("click", () => this.onFilter(chip));
    });
  }

  onFilter(chip) {
    this.chips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    this.render(this.collection.getByEra(chip.dataset.era));
  }

  render(films) {
    this.grid.innerHTML = films.map((f, i) => `
      <button class="canon-card" data-id="${f.tmdbId}" style="--delay:${i * 40}ms">
        <span class="canon-card__index">${String(i + 1).padStart(2, "0")}</span>
        <span class="canon-card__year">${f.year}</span>
        <span class="canon-card__title">${DetailModal.esc(f.title)}</span>
        <span class="canon-card__director">${DetailModal.esc(f.director)}</span>
        <span class="canon-card__note">${DetailModal.esc(f.note)}</span>
        <span class="canon-card__cta">Lobby card →</span>
      </button>
    `).join("");

    this.grid.querySelectorAll(".canon-card").forEach((card) => {
      card.addEventListener("click", () => this.openDetail(card.dataset.id));
    });
  }

  /** Open the modal. Poster is fetched live if an API key is set. */
  async openDetail(tmdbId) {
    const film = this.collection.getById(tmdbId);
    if (!film) return;

    const base = {
      title: film.title,
      year: film.year,
      runtime: film.runtime,
      director: film.director,
      country: film.country,
      genres: [],
      overview: film.note,
      posterUrl: "",
      source: "The House Canon"
    };

    // Open immediately with local data…
    this.modal.open(base);

    // …then enrich with poster + genres from the API if available.
    if (this.api) {
      try {
        const full = await this.api.getMovie(tmdbId);
        if (this.modal.isOpen) {
          this.modal.open({ ...full, overview: film.note, source: "The House Canon" });
        }
      } catch {
        /* Silently keep the local-only lobby card. */
      }
    }
  }
}

/* =========================== EXPLORE =========================== */
class ExplorePage {
  constructor() {
    this.modal = new DetailModal();
    this.api = AppConfig.hasKey ? new TmdbService(AppConfig.TMDB_API_KEY) : null;

    this.state = { mode: "discover", query: "", genreId: "", page: 1, totalPages: 1, totalResults: 0 };
    this.debounceTimer = null;

    // DOM refs
    this.el = {
      search: document.getElementById("searchInput"),
      genre: document.getElementById("genreSelect"),
      reset: document.getElementById("resetBtn"),
      status: document.getElementById("statusLine"),
      loading: document.getElementById("loadingState"),
      error: document.getElementById("errorState"),
      errorMsg: document.getElementById("errorMessage"),
      retry: document.getElementById("retryBtn"),
      empty: document.getElementById("emptyState"),
      grid: document.getElementById("resultsGrid"),
      pager: document.getElementById("pagination"),
      prev: document.getElementById("prevBtn"),
      next: document.getElementById("nextBtn"),
      pageInfo: document.getElementById("pageInfo")
    };
  }

  init() {
    if (!this.api) {
      this.showError(
        "No API key found. Get a free key at themoviedb.org/settings/api and paste it into js/config.js."
      );
      this.el.retry.hidden = true;
      return;
    }

    this.bindEvents();
    this.loadGenres();
    this.load();
  }

  bindEvents() {
    // Debounced live search.
    this.el.search.addEventListener("input", () => {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = window.setTimeout(() => {
        const q = this.el.search.value.trim();
        this.state.query = q;
        this.state.mode = q ? "search" : "discover";
        this.state.page = 1;
        this.load();
      }, 400);
    });

    this.el.genre.addEventListener("change", () => {
      this.state.genreId = this.el.genre.value;
      // TMDB search endpoint has no genre param, so genre implies discover mode.
      if (this.state.genreId) {
        this.state.mode = "discover";
        this.state.query = "";
        this.el.search.value = "";
      }
      this.state.page = 1;
      this.load();
    });

    this.el.reset.addEventListener("click", () => {
      this.el.search.value = "";
      this.el.genre.value = "";
      this.state = { ...this.state, mode: "discover", query: "", genreId: "", page: 1 };
      this.load();
    });

    this.el.retry.addEventListener("click", () => this.load());
    this.el.prev.addEventListener("click", () => this.goTo(this.state.page - 1));
    this.el.next.addEventListener("click", () => this.goTo(this.state.page + 1));
  }

  async loadGenres() {
    try {
      const genres = await this.api.getGenres();
      this.el.genre.insertAdjacentHTML("beforeend",
        genres.map((g) => `<option value="${g.id}">${DetailModal.esc(g.name)}</option>`).join("")
      );
    } catch {
      /* Genre filter simply stays "All genres" if this fails. */
    }
  }

  goTo(page) {
    if (page < 1 || page > this.state.totalPages) return;
    this.state.page = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.load();
  }

  /** Fetch + render according to current state. */
  async load() {
    this.showLoading();
    try {
      const data = this.state.mode === "search"
        ? await this.api.search(this.state.query, { page: this.state.page })
        : await this.api.discover({ page: this.state.page, genreId: this.state.genreId });

      this.state.totalPages = data.totalPages;
      this.state.totalResults = data.totalResults;

      if (data.results.length === 0) {
        this.showEmpty();
      } else {
        this.renderResults(data.results);
      }
    } catch (err) {
      this.showError(err.message);
    }
  }

  /* ---------- UI states ---------- */

  hideAll() {
    this.el.loading.hidden = true;
    this.el.error.hidden = true;
    this.el.empty.hidden = true;
    this.el.pager.hidden = true;
    this.el.grid.innerHTML = "";
  }

  showLoading() {
    this.hideAll();
    this.el.status.textContent = "Loading the stacks…";
    this.el.loading.innerHTML = Array.from({ length: 8 })
      .map(() => `<div class="skeleton-card"><div class="skeleton-card__img"></div><div class="skeleton-card__line"></div><div class="skeleton-card__line skeleton-card__line--short"></div></div>`)
      .join("");
    this.el.loading.hidden = false;
  }

  showError(message) {
    this.hideAll();
    this.el.status.textContent = "";
    this.el.errorMsg.textContent = message;
    this.el.error.hidden = false;
  }

  showEmpty() {
    this.hideAll();
    this.el.status.textContent = "0 results";
    this.el.empty.hidden = false;
  }

  renderResults(results) {
    this.hideAll();

    const label = this.state.mode === "search"
      ? `“${this.state.query}” — ${this.state.totalResults.toLocaleString()} results`
      : `Browsing ${this.state.totalResults.toLocaleString()} films by popularity`;
    this.el.status.textContent = label;

    this.el.grid.innerHTML = results.map((m) => {
      const poster = this.api.imageUrl(m.poster_path, "w342");
      const year = m.release_date ? m.release_date.slice(0, 4) : "—";
      const rating = m.vote_average ? m.vote_average.toFixed(1) : "–";
      return `
        <button class="result-card" data-id="${m.id}">
          <span class="result-card__imgwrap">
            ${poster
              ? `<img src="${poster}" alt="Poster for ${DetailModal.esc(m.title)}" loading="lazy">`
              : `<span class="result-card__noimg">No poster</span>`}
            <span class="result-card__rating">★ ${rating}</span>
          </span>
          <span class="result-card__title">${DetailModal.esc(m.title)}</span>
          <span class="result-card__year">${year}</span>
        </button>`;
    }).join("");

    this.el.grid.querySelectorAll(".result-card").forEach((card) => {
      card.addEventListener("click", () => this.openDetail(card.dataset.id));
    });

    // Pagination
    this.el.pageInfo.textContent = `Page ${this.state.page} of ${this.state.totalPages}`;
    this.el.prev.disabled = this.state.page <= 1;
    this.el.next.disabled = this.state.page >= this.state.totalPages;
    this.el.pager.hidden = this.state.totalPages <= 1;
  }

  /** ★ Custom UI requirement in action: modal detail view of one item. */
  async openDetail(id) {
    try {
      const film = await this.api.getMovie(id);
      this.modal.open({ ...film, source: "From the TMDB archive" });
    } catch (err) {
      this.showError(err.message);
    }
  }
}

/* ============================ BOOT ============================ */
class App {
  static start() {
    const page = document.body.dataset.page;
    if (page === "home") new HomePage().init();
    if (page === "explore") new ExplorePage().init();
    /* "about" is static — nothing to boot. */
  }
}

document.addEventListener("DOMContentLoaded", () => App.start());
