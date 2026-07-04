/**
 * api.js — TmdbService
 * ------------------------------------------------------------------
 * Thin ES6-class wrapper around the TMDB v3 REST API.
 * All requests fail loudly (thrown Errors) so the UI layer can show
 * a proper error state with retry.
 * ------------------------------------------------------------------
 */
class TmdbService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.base = AppConfig.TMDB_BASE_URL;
    this.imgBase = AppConfig.TMDB_IMAGE_BASE;
  }

  /** Internal: fetch JSON or throw a readable error. */
  async request(path, params = {}) {
    const url = new URL(this.base + path);
    url.searchParams.set("api_key", this.apiKey);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    }

    let res;
    try {
      res = await fetch(url);
    } catch {
      throw new Error("Network error — check your connection and try again.");
    }

    if (res.status === 401) {
      throw new Error("TMDB rejected the API key. Check the key pasted in js/config.js.");
    }
    if (!res.ok) {
      throw new Error(`TMDB responded with status ${res.status}.`);
    }
    return res.json();
  }

  /** Genre list for the filter dropdown. */
  async getGenres() {
    const data = await this.request("/genre/movie/list");
    return data.genres || [];
  }

  /**
   * Browse films (optionally by genre), paginated.
   * @returns {Promise<{results: Array, page: number, totalPages: number, totalResults: number}>}
   */
  async discover({ page = 1, genreId = "" } = {}) {
    const data = await this.request("/discover/movie", {
      page,
      with_genres: genreId,
      sort_by: "popularity.desc",
      include_adult: "false"
    });
    return TmdbService.normalizePage(data);
  }

  /** Search films by title, paginated. */
  async search(query, { page = 1 } = {}) {
    const data = await this.request("/search/movie", {
      query,
      page,
      include_adult: "false"
    });
    return TmdbService.normalizePage(data);
  }

  /** Full details for one film (used by the modal). */
  async getMovie(id) {
    const data = await this.request(`/movie/${id}`, { append_to_response: "credits" });
    const director = (data.credits?.crew || []).find((c) => c.job === "Director");
    return {
      title: data.title,
      year: data.release_date ? data.release_date.slice(0, 4) : "",
      runtime: data.runtime || null,
      director: director ? director.name : "",
      country: (data.production_countries || []).map((c) => c.name).join(" / "),
      genres: (data.genres || []).map((g) => g.name),
      rating: data.vote_average ? data.vote_average.toFixed(1) : null,
      votes: data.vote_count || null,
      overview: data.overview || "",
      posterUrl: this.imageUrl(data.poster_path, "w500")
    };
  }

  /** Build a full image URL, or empty string if no path. */
  imageUrl(path, size = "w342") {
    return path ? `${this.imgBase}/${size}${path}` : "";
  }

  /** Normalize a paginated TMDB response. TMDB caps paging at 500. */
  static normalizePage(data) {
    return {
      results: data.results || [],
      page: data.page || 1,
      totalPages: Math.min(data.total_pages || 1, 500),
      totalResults: data.total_results || 0
    };
  }
}
