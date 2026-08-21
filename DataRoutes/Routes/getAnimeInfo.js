import { resolveByMalId, fetchJikanAnimeById } from "./animexploreApi.js";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const getAnimeInfo = async animeId => {
  try {
    const cleanId = String(animeId).replace(/^(mal-|anikoto-|jikan-)/, "");
    if (/^\d+$/.test(cleanId)) {
      const resolved = await resolveByMalId(cleanId);
      if (resolved && resolved.anime) {
        return {
          manto: true,
          data: {
            anime: {
              info: {
                id: resolved.anime.id,
                name: resolved.anime.name,
                poster: resolved.anime.poster,
                description: resolved.anime.description,
                stats: {
                  rating: resolved.anime.rating,
                  type: resolved.anime.type,
                  duration: resolved.anime.duration,
                  quality: "HD",
                  episodes: {
                    sub: resolved.anime.episodes?.sub || 12,
                    dub: resolved.anime.episodes?.dub || 12
                  }
                }
              },
              moreInfo: {
                japanese: resolved.anime.jname || resolved.anime.name,
                Japanese: resolved.anime.jname || resolved.anime.name,
                duration: resolved.anime.duration,
                Duration: resolved.anime.duration,
                status: resolved.anime.status || "Finished Airing",
                Status: resolved.anime.status || "Finished Airing",
                genres: resolved.anime.genres || ["Action", "Fantasy"],
                studios: resolved.anime.studios || "Animation Studio",
                producers: [resolved.anime.studios || "Animation Studio"],
                aired: resolved.anime.aired || "N/A",
                premiered: resolved.anime.premiered || "N/A"
              }
            },
            seasons: [],
            relatedAnimes: [],
            recommendedAnimes: []
          }
        };
      }
    }

    const data = await hianime.getInfo(animeId);
    return {
      manto: true,
      data: data
    };
  } catch (err) {
    console.error("Error fetching anime info:", err.message);
    return {
      manto: false,
      error: err.message
    };
  }
};

