import axios from "axios";

const VIDNEST_BASE_URL = "https://vidnest.fun/animepahe";

/**
 * Resolve MAL ID to AniList ID via AniList GraphQL
 */
async function getAniListIdFromMalId(malId) {
  if (!malId) return null;
  const numMalId = parseInt(String(malId).replace(/^(mal-|anikoto-|jikan-)/, ""), 10);
  if (isNaN(numMalId)) return malId;

  try {
    const query = `
      query ($idMal: Int) {
        Media(idMal: $idMal, type: ANIME) {
          id
        }
      }
    `;
    const res = await axios.post(
      "https://graphql.anilist.co",
      { query, variables: { idMal: numMalId } },
      { headers: { "Content-Type": "application/json" }, timeout: 4000 }
    );
    return res.data?.data?.Media?.id || numMalId;
  } catch {
    return numMalId;
  }
}

export const AnimePaheAPI = {
  /**
   * Generate AnimePahe / VidNest streaming embed source
   */
  async getStreamSource({
    id,
    episode = 1,
    type = "sub"
  }) {
    if (!id) return null;

    const cleanType = type?.toLowerCase() === "dub" ? "dub" : "sub";
    const cleanEp = parseInt(episode, 10) || 1;
    const strId = String(id).trim();

    let aniId = strId;

    if (strId.startsWith("ani-") || strId.startsWith("anilist-")) {
      aniId = strId.replace(/^(ani-|anilist-)/, "");
    } else if (strId.startsWith("mal-") || /^\d+$/.test(strId)) {
      const resolvedAniId = await getAniListIdFromMalId(strId);
      aniId = resolvedAniId || strId.replace("mal-", "");
    }

    const embedUrl = `${VIDNEST_BASE_URL}/${aniId}/${cleanEp}/${cleanType}`;

    return {
      sources: [
        {
          url: embedUrl,
          file: embedUrl,
          isM3U8: false,
          label: "AnimePahe HD"
        }
      ],
      tracks: [],
      embedUrl
    };
  }
};

export default AnimePaheAPI;
