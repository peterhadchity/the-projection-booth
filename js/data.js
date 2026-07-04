/**
 * data.js — The House Canon
 * ------------------------------------------------------------------
 * "Your Own Content" requirement: 16 real, hand-curated films with
 * original annotations written for this project (no placeholder text).
 * Each entry carries a `tmdbId` so the modal can pull the poster live.
 * ------------------------------------------------------------------
 */
class FilmCollection {
  constructor() {
    /** @type {Array<Object>} */
    this.films = [
      {
        tmdbId: 289, title: "Casablanca", year: 1942, director: "Michael Curtiz",
        country: "USA", runtime: 102, era: "classic",
        note: "Every line is a quotation now, and it still plays like it was written yesterday. The gold standard for studio-era screenwriting."
      },
      {
        tmdbId: 548, title: "Rashomon", year: 1950, director: "Akira Kurosawa",
        country: "Japan", runtime: 88, era: "classic",
        note: "Four witnesses, four truths. Kurosawa invented a narrative structure so influential it became a dictionary entry."
      },
      {
        tmdbId: 599, title: "Sunset Boulevard", year: 1950, director: "Billy Wilder",
        country: "USA", runtime: 110, era: "classic",
        note: "Hollywood eating itself, narrated by a corpse. Wilder's darkest joke and Gloria Swanson's greatest close-up."
      },
      {
        tmdbId: 439, title: "12 Angry Men", year: 1957, director: "Sidney Lumet",
        country: "USA", runtime: 97, era: "classic",
        note: "One room, twelve chairs, ninety-six minutes. Proof that blocking and faces are all the special effects a film needs."
      },
      {
        tmdbId: 213, title: "North by Northwest", year: 1959, director: "Alfred Hitchcock",
        country: "USA", runtime: 136, era: "classic",
        note: "The wrong-man thriller perfected — a crop-duster, a monument chase, and Cary Grant outrunning the plot itself."
      },
      {
        tmdbId: 5156, title: "The Battle of Algiers", year: 1966, director: "Gillo Pontecorvo",
        country: "Italy / Algeria", runtime: 121, era: "classic",
        note: "Shot like newsreel, structured like a fuse. Still screened by both militaries and film schools, which tells you everything."
      },
      {
        tmdbId: 238, title: "The Godfather", year: 1972, director: "Francis Ford Coppola",
        country: "USA", runtime: 175, era: "newhollywood",
        note: "An American business story dressed as a crime saga. The lighting alone — those Gordon Willis shadows — rewired cinematography."
      },
      {
        tmdbId: 3082, title: "Modern Times", year: 1936, director: "Charlie Chaplin",
        country: "USA", runtime: 87, era: "classic",
        note: "Chaplin fed into the gears of the machine age. The factory sequence is still the sharpest tech satire ever filmed."
      },
      {
        tmdbId: 11216, title: "Cinema Paradiso", year: 1988, director: "Giuseppe Tornatore",
        country: "Italy", runtime: 155, era: "newhollywood",
        note: "The patron saint of projection booths. A film about why anyone falls for films — ends with the best montage in the medium."
      },
      {
        tmdbId: 129, title: "Spirited Away", year: 2001, director: "Hayao Miyazaki",
        country: "Japan", runtime: 125, era: "modern",
        note: "A bathhouse for gods, drawn by hand. Miyazaki's imagination at full flood, with an economy of storytelling Pixar still studies."
      },
      {
        tmdbId: 77338, title: "The Intouchables", year: 2011, director: "Olivier Nakache & Éric Toledano",
        country: "France", runtime: 112, era: "modern",
        note: "The rare crowd-pleaser that earns every laugh. Built entirely on the chemistry of two performances."
      },
      {
        tmdbId: 496243, title: "Parasite", year: 2019, director: "Bong Joon-ho",
        country: "South Korea", runtime: 132, era: "modern",
        note: "A house as a class diagram. Bong switches genres mid-scene without grinding a single gear — architecture as screenwriting."
      },
      {
        tmdbId: 546554, title: "Knives Out", year: 2019, director: "Rian Johnson",
        country: "USA", runtime: 130, era: "modern",
        note: "The whodunit rebuilt from the blueprints up: it shows you the answer early, then makes the question better."
      },
      {
        tmdbId: 120467, title: "The Grand Budapest Hotel", year: 2014, director: "Wes Anderson",
        country: "USA / Germany", runtime: 100, era: "modern",
        note: "A pastry of a film with a war inside it. Anderson's symmetry finally in service of real melancholy."
      },
      {
        tmdbId: 27205, title: "Inception", year: 2010, director: "Christopher Nolan",
        country: "USA / UK", runtime: 148, era: "modern",
        note: "A heist film folded four levels deep. The rare blockbuster that trusts the audience to keep the map in their head."
      },
      {
        tmdbId: 76341, title: "Mad Max: Fury Road", year: 2015, director: "George Miller",
        country: "Australia", runtime: 120, era: "modern",
        note: "Two hours of forward motion, edited like percussion. Action filmmaking as pure visual grammar — barely a wasted frame."
      }
    ];
  }

  /** All films. */
  getAll() {
    return this.films;
  }

  /** Films filtered by era key ("all" returns everything). */
  getByEra(era) {
    if (!era || era === "all") return this.films;
    return this.films.filter((f) => f.era === era);
  }

  /** Find one film by its TMDB id. */
  getById(tmdbId) {
    return this.films.find((f) => f.tmdbId === Number(tmdbId)) || null;
  }
}
