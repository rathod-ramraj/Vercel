import { searchAniListAnime, searchJikanAnime } from "./animexploreApi.js";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const getSearchResults = async (
  searchQuery,
  page = 1,
  sort,
  lang,
  status,
  type,
  rated,
  score,
  season,
  startDate,
  endDate,
  genresQq
) => {
  try {
    try {
      const data = await hianime.search(`${searchQuery}`, page, {
        sort, language: lang, status, type, rated, season,
        start_date: startDate, end_date: endDate, genres: genresQq ? genresQq.replace(/\+/g, ",") : null
      });
      if (data && data.animes && data.animes.length > 0) {
        return {
          manto: true,
          data: data
        };
      }
    } catch (scraperErr) {
      console.warn("HiAnime search failed, trying fallback:", scraperErr.message);
    }

    const fallbackResults = await searchAniListAnime(searchQuery, page);
    return {
      manto: true,
      data: {
        animes: fallbackResults,
        searchQuery,
        currentPage: page,
        hasNextPage: fallbackResults.length >= 20,
        totalPages: Math.ceil(fallbackResults.length / 20) || 1
      }
    };
  } catch (err) {
    console.error("Error fetching search results:", err.message);
    return {
      manto: false,
      error: err.message
    };
  }
};


