import { fetchJikanTop, fetchAnikotoRecentReleases, fetchAniListCategory } from "./animexploreApi.js";
import { HiAnime } from "aniwatch";
import underrated from "@/Utils/underratedMap.js";

const hianime = new HiAnime.Scraper();
const ANIMES_PER_PAGE = 34;

const getJikanFilter = (category) => {
  switch (category) {
    case "top-airing":
      return "airing";
    case "top-upcoming":
      return "upcoming";
    case "most-favorite":
      return "favorite";
    case "most-popular":
    default:
      return "bypopularity";
  }
};

export const getAnimesByCategory = async (c, p) => {
  const page = parseInt(p, 10) || 1;

  try {
    if (c === "underrated") {
      if (!Array.isArray(underrated) || underrated.length === 0) {
        throw new Error("Underrated anime list is empty or invalid.");
      }

      const totalAnimes = underrated.length;
      const totalPages = Math.ceil(totalAnimes / ANIMES_PER_PAGE);
      if (page > totalPages || page < 1) {
        throw new Error("Invalid page number.");
      }

      const startIndex = (page - 1) * ANIMES_PER_PAGE;
      const endIndex = startIndex + ANIMES_PER_PAGE;
      const paginatedAnimes = underrated.slice(startIndex, endIndex);

      return {
        manto: true,
        data: {
          animes: paginatedAnimes,
          totalPages,
          hasNextPage: page < totalPages,
          currentPage: page,
          category: "Underrated Animes"
        }
      };
    }

    try {
      const data = await hianime.getCategoryAnime(c, page);
      if (data && data.animes && data.animes.length > 0) {
        return {
          manto: true,
          data
        };
      }
    } catch (scraperErr) {
      console.warn(`HiAnime scraper failed for category ${c}, using fallback:`, scraperErr.message);
    }

    // Fallback using AniList, Jikan or Anikoto API
    let fallbackAnimes = [];
    if (c === "recently-updated" || c === "recently-added") {
      fallbackAnimes = await fetchAnikotoRecentReleases(page, 24);
      if (!fallbackAnimes || fallbackAnimes.length === 0) {
        fallbackAnimes = await fetchAniListCategory(c, page);
      }
    } else {
      const filter = getJikanFilter(c);
      fallbackAnimes = await fetchJikanTop(filter, page);
      if (!fallbackAnimes || fallbackAnimes.length === 0) {
        fallbackAnimes = await fetchAniListCategory(c, page);
      }
    }

    return {
      manto: true,
      data: {
        animes: fallbackAnimes,
        category: c,
        currentPage: page,
        totalPages: 10,
        hasNextPage: page < 10
      }
    };
  } catch (err) {
    console.error("Error fetching category data:", err.message);
    return {
      manto: false,
      error: err.message
    };
  }
};

