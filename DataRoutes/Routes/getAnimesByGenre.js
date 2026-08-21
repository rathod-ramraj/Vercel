import { fetchAniListByGenre } from "./animexploreApi.js";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const getAnimesByGenre = async (g, p) => {
  const page = parseInt(p, 10) || 1;

  try {
    try {
      const data = await hianime.getGenreAnime(g, page);
      if (data && data.animes && data.animes.length > 0) {
        return {
          manto: true,
          data: data
        };
      }
    } catch (scraperErr) {
      console.warn(`HiAnime scraper failed for genre ${g}, using fallback:`, scraperErr.message);
    }

    const fallbackAnimes = await fetchAniListByGenre(g, page);
    return {
      manto: true,
      data: {
        animes: fallbackAnimes,
        genreName: g,
        currentPage: page,
        totalPages: 10,
        hasNextPage: page < 10
      }
    };
  } catch (err) {
    console.error("Error fetching genre data:", err.message);
    return {
      manto: false,
      error: err.message
    };
  }
};


