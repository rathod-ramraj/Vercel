/**
 * ReCloud API & Embed Stream Resolver
 * Base URL: https://cdn.4animo.xyz
 */

const RECLOUD_BASE_URL = "https://cdn.4animo.xyz";

export const ReCloudAPI = {
  SERVERS: ["hd-1", "hd-2", "hd-3", "hd-4"],

  /**
   * Generate ReCloud embed streaming source
   */
  getStreamSource({
    id,
    episode = 1,
    type = "sub",
    server = "hd-1"
  }) {
    if (!id) return null;

    const cleanServer = this.SERVERS.includes(server?.toLowerCase())
      ? server.toLowerCase()
      : "hd-1";
    const cleanType = type?.toLowerCase() === "dub" ? "dub" : "sub";
    const cleanEp = parseInt(episode, 10) || 1;
    const strId = String(id).trim();

    let embedUrl = "";

    if (strId.startsWith("http://") || strId.startsWith("https://")) {
      embedUrl = strId;
    } else if (strId.startsWith("mal-")) {
      const malId = strId.replace("mal-", "");
      embedUrl = `${RECLOUD_BASE_URL}/embed/${cleanServer}/mal/${malId}/${cleanEp}/${cleanType}?k=1`;
    } else if (strId.startsWith("ani-") || strId.startsWith("anilist-")) {
      const aniId = strId.replace(/^(ani-|anilist-)/, "");
      embedUrl = `${RECLOUD_BASE_URL}/embed/${cleanServer}/ani/${aniId}/${cleanEp}/${cleanType}?k=1`;
    } else if (/^\d+$/.test(strId)) {
      // Pure numeric ID - default to MAL ID
      embedUrl = `${RECLOUD_BASE_URL}/embed/${cleanServer}/mal/${strId}/${cleanEp}/${cleanType}?k=1`;
    } else if (strId.includes("$ep$") || strId.includes("?ep=")) {
      // Embed ID format
      const embedId = strId.split("?ep=")[0].split("$ep$")[0];
      embedUrl = `${RECLOUD_BASE_URL}/embed/${cleanServer}/${embedId}/${cleanType}?k=1`;
    } else {
      embedUrl = `${RECLOUD_BASE_URL}/embed/${cleanServer}/mal/${strId}/${cleanEp}/${cleanType}?k=1`;
    }

    return {
      sources: [
        {
          url: embedUrl,
          file: embedUrl,
          isM3U8: false,
          label: `ReCloud ${cleanServer.toUpperCase()}`
        }
      ],
      tracks: [],
      embedUrl
    };
  }
};

export default ReCloudAPI;
