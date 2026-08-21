import { searchJikanAnime } from "./animexploreApi.js";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const getAnimesByProducer = async (pr, p) => {
  const page = parseInt(p, 10) || 1;

  try {
    try {
      const data = await hianime.getProducerAnimes(pr, page);
      if (data && data.animes && data.animes.length > 0) {
        return {
          manto: true,
          data: data
        };
      }
    } catch (scraperErr) {
      console.warn(`HiAnime scraper failed for producer ${pr}, using fallback:`, scraperErr.message);
    }

    const fallbackAnimes = await searchJikanAnime(pr, page);
    return {
      manto: true,
      data: {
        animes: fallbackAnimes,
        producerName: pr,
        currentPage: page,
        totalPages: 10,
        hasNextPage: page < 10
      }
    };
  } catch (err) {
    console.error("Error fetching producer data:", err.message);
    return {
      manto: false,
      error: err.message
    };
  }
};

