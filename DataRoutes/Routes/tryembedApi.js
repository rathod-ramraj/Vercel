/**
 * TryEmbed API & Embed Stream Resolver
 * Base URL: https://tryembed.us.cc
 */

const TRYEMBED_BASE_URL = "https://tryembed.us.cc";

export const TryEmbedAPI = {
  /**
   * Generate TryEmbed streaming source
   */
  getStreamSource({
    id,
    episode = 1,
    type = "sub"
  }) {
    if (!id) return null;

    const cleanType = type?.toLowerCase() === "dub" ? "dub" : "sub";
    const cleanEp = parseInt(episode, 10) || 1;
    const cleanAnimeId = String(id).replace(/^(mal-|anikoto-|jikan-|ani-|anilist-)/, "").split("?")[0].split("$")[0];

    const embedUrl = `${TRYEMBED_BASE_URL}/embed/anime/${cleanAnimeId}/${cleanEp}/${cleanType}`;

    return {
      sources: [
        {
          url: embedUrl,
          file: embedUrl,
          isM3U8: false,
          label: "TryEmbed HD"
        }
      ],
      tracks: [],
      embedUrl
    };
  }
};

export default TryEmbedAPI;
