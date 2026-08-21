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
    const aniListResults = await searchAniListAnime(searchQuery, page, 24);
    if (aniListResults && aniListResults.length > 0) {
      return {
        manto: true,
        data: {
          animes: aniListResults,
          searchQuery,
          currentPage: page,
          hasNextPage: aniListResults.length >= 24,
          totalPages: Math.ceil(aniListResults.length / 24) || 1
        }
      };
    }

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
    } catch {
      // Scraper fallback
    }

    return {
      manto: true,
      data: {
        animes: [],
        searchQuery,
        currentPage: page,
        hasNextPage: false,
        totalPages: 1
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


