/**
 * modal.js — DetailModal
 * ==================================================================
 * ★ CUSTOM UI REQUIREMENT (assigned): "Modal popup for a detailed
 *   view of an item."
 *
 * Implemented from scratch as an ES6 class (deliberately NOT the
 * Bootstrap modal) so the mechanics are my own:
 *   • builds its own backdrop + dialog DOM on demand
 *   • closes on backdrop click, close button, or Escape key
 *   • traps Tab focus inside the dialog while open
 *   • locks body scroll while open, restores focus on close
 *   • styled as a cinema "lobby card" (poster left, details right)
 * ==================================================================
 */
class DetailModal {
  /** @param {string} rootId id of an empty div used as the mount point */
  constructor(rootId = "modalRoot") {
    this.root = document.getElementById(rootId);
    this.isOpen = false;
    this.lastFocused = null;

    // Bound handlers so add/removeEventListener match.
    this.onKeydown = this.onKeydown.bind(this);
  }

  /**
   * Open the modal with a film object.
   * @param {Object} film normalized film data
   *   { title, year, director, runtime, country, genres, rating, votes, overview, posterUrl, source }
   */
  open(film) {
    this.lastFocused = document.activeElement;
    this.root.innerHTML = this.template(film);
    document.body.classList.add("modal-locked");
    this.isOpen = true;

    const overlay = this.root.querySelector(".lobby__overlay");
    const dialog = this.root.querySelector(".lobby__card");
    const closeBtn = this.root.querySelector(".lobby__close");

    // Backdrop click closes; clicks inside the card do not.
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.close();
    });
    closeBtn.addEventListener("click", () => this.close());
    document.addEventListener("keydown", this.onKeydown);

    // Entrance animation hook + initial focus.
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    closeBtn.focus();

    // Guard against broken poster URLs.
    const img = dialog.querySelector(".lobby__poster img");
    if (img) {
      img.addEventListener("error", () => {
        img.closest(".lobby__poster").classList.add("lobby__poster--missing");
        img.remove();
      });
    }
  }

  /** Close, unlock scroll, restore focus. */
  close() {
    if (!this.isOpen) return;
    const overlay = this.root.querySelector(".lobby__overlay");
    if (overlay) overlay.classList.remove("is-open");

    document.removeEventListener("keydown", this.onKeydown);
    document.body.classList.remove("modal-locked");
    this.isOpen = false;

    // Let the fade-out play before removing the DOM.
    window.setTimeout(() => {
      this.root.innerHTML = "";
    }, 180);

    if (this.lastFocused) this.lastFocused.focus();
  }

  /** Escape closes; Tab is trapped inside the dialog. */
  onKeydown(e) {
    if (e.key === "Escape") {
      this.close();
      return;
    }
    if (e.key === "Tab") {
      const focusables = this.root.querySelectorAll(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /** Build the lobby-card markup for a film. */
  template(film) {
    const genres = (film.genres || []).map(
      (g) => `<span class="lobby__genre">${DetailModal.esc(g)}</span>`
    ).join("");

    const rating = film.rating
      ? `<div class="lobby__stat">
           <span class="lobby__stat-k">TMDB rating</span>
           <span class="lobby__stat-v">★ ${film.rating}${film.votes ? ` <em>(${film.votes} votes)</em>` : ""}</span>
         </div>`
      : "";

    const poster = film.posterUrl
      ? `<img src="${film.posterUrl}" alt="Poster for ${DetailModal.esc(film.title)}">`
      : "";

    return `
      <div class="lobby__overlay" role="presentation">
        <div class="lobby__card" role="dialog" aria-modal="true" aria-label="${DetailModal.esc(film.title)} details">
          <button class="lobby__close" aria-label="Close details">×</button>

          <div class="lobby__poster ${film.posterUrl ? "" : "lobby__poster--missing"}">${poster}</div>

          <div class="lobby__body">
            <p class="lobby__eyebrow">${DetailModal.esc(film.source || "From the archive")}</p>
            <h3 class="lobby__title">${DetailModal.esc(film.title)}</h3>

            <p class="lobby__meta">
              ${film.year ? `<span>${film.year}</span>` : ""}
              ${film.runtime ? `<span>${film.runtime} min</span>` : ""}
              ${film.director ? `<span>Dir. ${DetailModal.esc(film.director)}</span>` : ""}
              ${film.country ? `<span>${DetailModal.esc(film.country)}</span>` : ""}
            </p>

            ${genres ? `<div class="lobby__genres">${genres}</div>` : ""}
            ${rating}

            ${film.overview ? `<p class="lobby__overview">${DetailModal.esc(film.overview)}</p>` : ""}
          </div>
        </div>
      </div>`;
  }

  /** Minimal HTML escaping for injected strings. */
  static esc(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
}
