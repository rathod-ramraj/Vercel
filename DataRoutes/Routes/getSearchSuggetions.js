import { searchAniListAnime } from "./animexploreApi.js";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const getSearchSuggetion = async query => {
  try {
    try {
      const data = await hianime.searchSuggestions(query);
      if (data && data.suggestions && data.suggestions.length > 0) {
        return {
          manto: true,
          data: data
        };
      }
    } catch (scraperErr) {
      console.warn("HiAnime search suggestions failed, trying fallback:", scraperErr.message);
    }

    const aniListResults = await searchAniListAnime(query, 1, 6);
    return {
      manto: true,
      data: {
        suggestions: aniListResults.slice(0, 6).map((anime) => ({
          id: anime.id,
          name: anime.name,
          jname: anime.jname,
          poster: anime.poster,
          moreInfo: [anime.type, anime.duration, anime.rating]
        }))
      }
    };
  } catch (err) {
    console.error("Error fetching search suggestions:", err.message);
    return {
      manto: false,
      error: err.message
    };
  }
};


