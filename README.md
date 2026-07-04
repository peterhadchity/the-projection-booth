# The Projection Booth 

A film-discovery website built for the **Full Stack Development — Final Project 2026** (Lebanese University, Faculty of Engineering, Branch 2 – Roumieh).

**Live URL:** https://peterhadchity.github.io/the-projection-booth/

---

## 1. Author

**Name: HADCHITY Peter**

**ID: 7451** 

**Fourth Year-Electrical Engineering-Power&Automation**

## 2. API Used

**[The Movie Database (TMDB) API v3](https://developer.themoviedb.org/docs)** — a free, key-based public REST API.

Endpoints used:

| Endpoint | Purpose |
|---|---|
| `/genre/movie/list` | Populates the genre filter dropdown |
| `/discover/movie` | Default browse mode + genre filtering (paginated) |
| `/search/movie` | Live title search (debounced, paginated) |
| `/movie/{id}?append_to_response=credits` | Full details + director for the modal |
| `image.tmdb.org/t/p/...` | Poster images |

###  Getting a free API key (required before running)

1. Create a free account: **https://www.themoviedb.org/signup**
2. Request a key (choose *Developer*, approval is instant): **https://www.themoviedb.org/settings/api**
3. Copy the **"API Key (v3 auth)"** value.
4. Paste it into **`js/config.js`**:

```js
static get TMDB_API_KEY() {
  return "your_key_here";
}
```

Alternative free key-based APIs if TMDB is unavailable in your region: [OMDb](https://www.omdbapi.com/apikey.aspx), [API Ninjas](https://api-ninjas.com/), [Pexels](https://www.pexels.com/api/), [Unsplash](https://unsplash.com/developers).



## 3. Project Description

The Projection Booth is a 3-page film site styled after a mid-century cinema booth (marquee-board hero, film-strip dividers, "lobby card" modals):

- **Home** — a hand-curated canon of **16 real films** with original annotations (the "own content" requirement), filterable client-side by era.
- **Explore** — live TMDB integration: debounced **search**, **genre filtering**, **pagination** (prev/next over up to 500 pages), with proper **loading (skeleton), error (retry), and empty** states.
- **About** — project background, tech stack, and credits.

### Tech compliance checklist

-  Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`)
-  Hand-written CSS3 (custom properties, grid, animations) + **Flexbox** throughout
-  **Bootstrap 5** (navbar + collapse, grid container)
-  Responsive (mobile → desktop; tested at 375 / 768 / 1440 px)
-  **All JavaScript in ES6 classes** — `AppConfig`, `FilmCollection`, `DetailModal`, `TmdbService`, `HomePage`, `ExplorePage`, `App`. No jQuery.
-  Min. 3 pages with a consistent navbar, anchor-based routing
-  Key-based public API with search + filter + pagination and full state handling
-  16 items of real curated content (`js/data.js`)

## 4. Custom UI Requirement — Modal popup for a detailed item view

Implemented **from scratch** (deliberately *not* the Bootstrap modal) as the `DetailModal` ES6 class in **`js/modal.js`** — see the ★ comment block at the top of that file.

Features:
- Builds its own backdrop + dialog DOM on demand, styled as a cinema **lobby card** (poster left / details right, stacking vertically on mobile)
- Dismiss via **backdrop click**, **close button**, or **Escape**
- **Focus trap** (Tab cycles inside the dialog) and focus restoration on close
- **Body scroll lock** while open
- Graceful handling of missing/broken poster images
- Used on **both** pages: canon cards (Home) and API results (Explore)

## 5. Running locally

No build step. Either open `index.html` directly, or serve the folder:

```bash
npx serve .        # or: python3 -m http.server
```

## 6. Deployment

Deployed on **GitHub Pages** (deploy from branch: `main` / root). Steps used:

1. Push repo to GitHub (public).
2. Import into Vercel/Netlify  or enable GitHub Pages on the `main` branch root.
3. Verify the live URL loads with **no console errors** and works on a phone.

## 7. Evidence
<img width="1885" height="872" alt="image" src="https://github.com/user-attachments/assets/c067869c-e348-4099-a943-33c93321d5d8" />



## 8. AI-Use Appendix

**Tools used:**
- **Claude (Anthropic)** used for: ` generating the initial project scaffold (HTML structure, CSS theme, ES6 class architecture), which I then reviewed, tested, and modified`
- **ChatGPT** used for prompt advisor`

**Actual prompts used (2–3):**
1. `"You are a senior software developer... The special task: Implement a modal popup for a detailed view of an item. An api key has to be inserted to grab pictures... Provide me with JS, CSS and HTML files necessary for an amazing project for a fullstack website. Also add a detailed read.me file"`
2. `"Build a movie search page using TMDB API with search, genre filter, and pagination. Use ES6 JavaScript and make it responsive."`
3. `"Create a custom modal in JavaScript that shows item details, closes on Escape or click outside, and prevents background scrolling."`

**Things the AI got wrong / that didn't work, and how I found & fixed them :**
1. `I had an issue where images were not loading correctly from the API. I fixed it by checking the image path and adding a fallback image when the poster was missing.`


## 9. Credits

- Film data & posters: [TMDB](https://www.themoviedb.org/). *This product uses the TMDB API but is not endorsed or certified by TMDB.*
- Fonts: [Anton](https://fonts.google.com/specimen/Anton), [Work Sans](https://fonts.google.com/specimen/Work+Sans), [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) via Google Fonts.
- Framework: [Bootstrap 5.3](https://getbootstrap.com/).
