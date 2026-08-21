/**
 * FlixCloud API & Embed Stream Resolver
 * Base: https://flixcloud.cc/e/{embedId}
 */

export const FlixCloudAPI = {
  getStreamSource(id, options = {}) {
    const {
      autoPlay = true,
      skipIntro = false,
      skipOutro = false,
      startAt = 0
    } = options;

    if (!id) return null;

    let embedId = String(id).trim();

    // If full URL passed, use as is
    if (embedId.startsWith("http://") || embedId.startsWith("https://")) {
      return {
        sources: [
          {
            url: embedId,
            file: embedId,
            isM3U8: false,
            label: "FlixCloud HD"
          }
        ],
        tracks: [],
        embedUrl: embedId
      };
    }

    const ts = Date.now();
    const queryParams = new URLSearchParams({
      v: "1",
      autoPlay: String(autoPlay),
      skI: String(skipIntro),
      skO: String(skipOutro),
      a: "1",
      project_r_ts: String(ts)
    });

    if (startAt > 0) {
      queryParams.set("start_at", String(startAt));
    }

    const flixUrl = `https://flixcloud.cc/e/${embedId}?${queryParams.toString()}`;

    return {
      sources: [
        {
          url: flixUrl,
          file: flixUrl,
          isM3U8: false,
          label: "FlixCloud HD"
        }
      ],
      tracks: [],
      embedUrl: flixUrl
    };
  }
};

export default FlixCloudAPI;
