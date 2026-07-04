/**
 * config.js — API configuration
 * ------------------------------------------------------------------
 * Get a FREE TMDB API key (v3 auth) here:
 *   1. Create an account:  https://www.themoviedb.org/signup
 *   2. Request a key:      https://www.themoviedb.org/settings/api
 *      (choose "Developer", fill the short form — approval is instant)
 *
 * Paste the "API Key (v3 auth)" value below.
 * ------------------------------------------------------------------
 */
class AppConfig {
  static get TMDB_API_KEY() {
    return "515c89ad79d0d53292be3b19895b2982";
  }

  static get TMDB_BASE_URL() {
    return "https://api.themoviedb.org/3";
  }

  static get TMDB_IMAGE_BASE() {
    return "https://image.tmdb.org/t/p";
  }

  /** True once a real key has been pasted in. */
  static get hasKey() {
    const k = AppConfig.TMDB_API_KEY;
    return Boolean(k) && !k.startsWith("PASTE_");
  }
}
