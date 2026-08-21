/**
 * MegaPlay API & Embed Stream Resolver
 * Base URL: https://megaplay.buzz
 */

const MEGAPLAY_BASE_URL = "https://megaplay.buzz";

export const MegaPlayAPI = {
  /**
   * Generate MegaPlay embed streaming source
   */
  getStreamSource({
    id,
    episode = 1,
    type = "sub"
  }) {
    if (!id) return null;

    const cleanType = type?.toLowerCase() === "dub" ? "dub" : "sub";
    const cleanEp = parseInt(episode, 10) || 1;
    const strId = String(id).trim();

    let embedUrl = "";

    if (strId.startsWith("http://") || strId.startsWith("https://")) {
      embedUrl = strId;
    } else if (strId.startsWith("mal-")) {
      const malId = strId.replace("mal-", "");
      embedUrl = `${MEGAPLAY_BASE_URL}/stream/mal/${malId}/${cleanEp}/${cleanType}`;
    } else if (strId.startsWith("ani-") || strId.startsWith("anilist-")) {
      const aniId = strId.replace(/^(ani-|anilist-)/, "");
      embedUrl = `${MEGAPLAY_BASE_URL}/stream/ani/${aniId}/${cleanEp}/${cleanType}`;
    } else if (/^\d+$/.test(strId)) {
      // If long ID (like embed ID > 100000), use s-2; if small MAL ID, use mal
      if (parseInt(strId, 10) > 100000) {
        embedUrl = `${MEGAPLAY_BASE_URL}/stream/s-2/${strId}/${cleanType}`;
      } else {
        embedUrl = `${MEGAPLAY_BASE_URL}/stream/mal/${strId}/${cleanEp}/${cleanType}`;
      }
    } else if (strId.includes("$ep$") || strId.includes("?ep=")) {
      const embedId = strId.split("?ep=")[0].split("$ep$")[0];
      embedUrl = `${MEGAPLAY_BASE_URL}/stream/s-2/${embedId}/${cleanType}`;
    } else {
      embedUrl = `${MEGAPLAY_BASE_URL}/stream/mal/${strId}/${cleanEp}/${cleanType}`;
    }

    return {
      sources: [
        {
          url: embedUrl,
          file: embedUrl,
          isM3U8: false,
          label: "MegaPlay HD"
        }
      ],
      tracks: [],
      embedUrl
    };
  }
};

export default MegaPlayAPI;
