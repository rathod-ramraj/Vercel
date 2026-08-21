import { fetchAnikotoSeries, resolveByMalId } from "./animexploreApi.js";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export const getEpisodesByAnimeId = async (id) => {
  try {
    const cleanId = String(id).replace(/^(mal-|anikoto-|jikan-)/, "");

    const anikotoSeries = await fetchAnikotoSeries(cleanId);
    if (anikotoSeries && anikotoSeries.episodes) {
      return {
        manto: true,
        data: {
          totalEpisodes: anikotoSeries.episodes.length,
          episodes: anikotoSeries.episodes.map((ep, idx) => ({
            episodeId: ep.embed_id || ep.id || `${cleanId}?ep=${idx + 1}`,
            number: ep.number || idx + 1,
            title: ep.title || `Episode ${idx + 1}`,
            isFiller: false
          }))
        }
      };
    }

    if (/^\d+$/.test(cleanId)) {
      const resolved = await resolveByMalId(cleanId);
      if (resolved && resolved.episodes && resolved.episodes.length > 0) {
        return {
          manto: true,
          data: {
            totalEpisodes: resolved.episodes.length,
            episodes: resolved.episodes.map((ep) => ({
              episodeId: `${cleanId}?ep=${ep.number}`,
              number: ep.number,
              title: ep.title,
              isFiller: false
            }))
          }
        };
      }
    }

    const data = await hianime.getEpisodes(id);
    return {
      manto: true,
      data: data
    };
  } catch (err) {
    console.error("Error fetching episodes:", err.message);
    return {
      manto: false,
      error: err.message
    };
  }
};

