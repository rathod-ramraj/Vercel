import axios from "axios";

export const ANIKOTO_BASE_URL = "https://anikotoapi.site";
export const JIKAN_BASE_URL = "https://api.jikan.moe/v4";
export const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";

// --- Normalizers ---

export function normalizeJikan(item, rank = 1) {
  if (!item) return null;
  const malId = item.mal_id || item.id;
  const title = item.title_english || item.title || "Anime";
  const jtitle = item.title_japanese || item.title || "";
  const poster = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || "";
  const duration = item.duration || "24m";
  const type = item.type || "TV";
  const rating = item.rating || "PG-13";
  const score = item.score ? `${item.score}` : "N/A";
  const episodesCount = item.episodes || 12;

  return {
    id: malId ? `mal-${malId}` : (title.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
    malId: malId,
    name: title,
    jname: jtitle,
    poster: poster,
    duration: duration,
    type: type,
    rating: rating,
    status: item.status || "Finished Airing",
    genres: Array.isArray(item.genres) && item.genres.length > 0 ? item.genres.map((g) => g.name) : ["Action", "Fantasy"],
    studios: Array.isArray(item.studios) && item.studios.length > 0 ? item.studios.map((s) => s.name).join(", ") : "Animation Studio",
    aired: item.aired?.string || "N/A",
    premiered: item.season && item.year ? `${item.season} ${item.year}` : "N/A",
    rank: rank || item.rank || 1,
    otherInfo: [duration, item.year ? `${item.year}` : "2024", "HD", score],
    description: item.synopsis || "",
    episodes: {
      sub: episodesCount,
      dub: episodesCount
    }
  };
}

export function normalizeAniListMedia(media, rank = 1) {
  if (!media) return null;
  const title = media.title?.english || media.title?.romaji || media.title?.native || "Anime";
  const poster = media.coverImage?.large || media.coverImage?.medium || "";
  const malId = media.idMal;
  const score = media.averageScore ? `${(media.averageScore / 10).toFixed(1)}` : "N/A";

  return {
    id: malId ? `mal-${malId}` : `ani-${media.id}`,
    aniId: media.id,
    malId: media.idMal,
    name: title,
    jname: media.title?.native || media.title?.romaji || "",
    poster: poster,
    duration: media.duration ? `${media.duration}m` : "24m",
    type: media.format || "TV",
    rating: media.isAdult ? "18+" : "PG-13",
    status: media.status ? media.status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : "Finished Airing",
    genres: media.genres && media.genres.length > 0 ? media.genres : ["Action", "Fantasy"],
    studios: media.studios?.nodes?.[0]?.name || "Animation Studio",
    aired: media.startDate?.year ? `${media.startDate.year}` : "N/A",
    premiered: media.season && media.seasonYear ? `${media.season} ${media.seasonYear}` : "N/A",
    rank: rank,
    otherInfo: [media.duration ? `${media.duration}m` : "24m", media.seasonYear ? `${media.seasonYear}` : "2024", "HD", score],
    description: (media.description || "").replace(/<[^>]*>?/gm, ""),
    episodes: {
      sub: media.episodes || 12,
      dub: media.episodes || 12
    }
  };
}

export function normalizeAnikotoAnime(anime, rank = 1) {
  if (!anime) return null;
  const id = anime.id || anime.series_id || anime.anime_id;
  const title = anime.title || anime.name || "Anime";
  const poster = anime.poster || anime.cover || anime.image || "";

  return {
    id: id ? `anikoto-${id}` : title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    anikotoId: id,
    name: title,
    jname: anime.japanese_title || title,
    poster: poster,
    duration: anime.duration || "24m",
    type: anime.type || "TV",
    rating: anime.rating || "PG-13",
    status: "Finished Airing",
    genres: anime.genres || ["Action", "Fantasy"],
    studios: "Animation Studio",
    aired: "N/A",
    premiered: "N/A",
    rank: rank,
    otherInfo: [anime.duration || "24m", "HD"],
    description: anime.synopsis || anime.description || "",
    episodes: {
      sub: anime.total_episodes || anime.episodes?.length || 12,
      dub: anime.total_episodes || anime.episodes?.length || 12
    }
  };
}

// --- 1. Anikoto API ---

export async function fetchAnikotoRecentReleases(page = 1, limit = 20) {
  try {
    const res = await axios.get(`${ANIKOTO_BASE_URL}/recent-anime`, {
      params: { page, per_page: limit },
      timeout: 6000
    });
    const items = res.data?.data || res.data || [];
    return Array.isArray(items) ? items.map((item, idx) => normalizeAnikotoAnime(item, idx + 1)) : [];
  } catch (err) {
    return [];
  }
}

export async function fetchAnikotoSeries(id) {
  try {
    const res = await axios.get(`${ANIKOTO_BASE_URL}/series/${id}`, { timeout: 3000 });
    return res.data?.data || res.data || null;
  } catch (err) {
    return null;
  }
}

export function getMegaPlayStreamUrl(embedId, type = "sub") {
  return `https://megaplay.buzz/stream/s-2/${embedId}/${type}`;
}

// --- 2. Jikan & AniList Fallback API ---

export async function searchAniListAnime(query, page = 1, perPage = 20) {
  const gqlQuery = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(search: $search, type: ANIME, isAdult: false) {
          id
          idMal
          title { romaji english native }
          coverImage { large medium }
          averageScore
          description
          format
          episodes
          duration
          status
          seasonYear
          genres
        }
      }
    }
  `;
  try {
    const res = await axios.post(
      ANILIST_GRAPHQL_URL,
      { query: gqlQuery, variables: { search: query, page, perPage } },
      { headers: { "Content-Type": "application/json" }, timeout: 7000 }
    );
    const mediaList = res.data?.data?.Page?.media || [];
    return mediaList.map((media, idx) => normalizeAniListMedia(media, (page - 1) * perPage + idx + 1));
  } catch (err) {
    console.error("AniList Search error:", err.message);
    return [];
  }
}

export async function fetchAniListCategory(category = "most-popular", page = 1, perPage = 20) {
  let sort = ["POPULARITY_DESC"];
  let status = undefined;
  let format = undefined;

  switch (category) {
    case "top-airing":
      sort = ["POPULARITY_DESC"];
      status = "RELEASING";
      break;
    case "top-upcoming":
      sort = ["POPULARITY_DESC"];
      status = "NOT_YET_RELEASED";
      break;
    case "most-favorite":
      sort = ["FAVOURITES_DESC"];
      break;
    case "movie":
      sort = ["POPULARITY_DESC"];
      format = "MOVIE";
      break;
    case "special":
      sort = ["POPULARITY_DESC"];
      format = "SPECIAL";
      break;
    case "ova":
      sort = ["POPULARITY_DESC"];
      format = "OVA";
      break;
    case "ona":
      sort = ["POPULARITY_DESC"];
      format = "ONA";
      break;
    case "recently-updated":
    case "recently-added":
      sort = ["UPDATED_AT_DESC"];
      break;
    case "most-popular":
    default:
      sort = ["POPULARITY_DESC"];
      break;
  }

  const gqlQuery = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus, $format: MediaFormat) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(sort: $sort, status: $status, format: $format, type: ANIME, isAdult: false) {
          id
          idMal
          title { romaji english native }
          coverImage { large medium }
          averageScore
          description
          format
          episodes
          duration
          status
          seasonYear
          genres
        }
      }
    }
  `;

  try {
    const res = await axios.post(
      ANILIST_GRAPHQL_URL,
      { query: gqlQuery, variables: { page, perPage, sort, status, format } },
      { headers: { "Content-Type": "application/json" }, timeout: 7000 }
    );
    const mediaList = res.data?.data?.Page?.media || [];
    return mediaList.map((media, idx) => normalizeAniListMedia(media, (page - 1) * perPage + idx + 1));
  } catch (err) {
    console.error("AniList Category error:", err.message);
    return [];
  }
}

export async function fetchAniListByGenre(genre, page = 1, perPage = 20) {
  const gqlQuery = `
    query ($genre: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(genre: $genre, sort: [POPULARITY_DESC], type: ANIME, isAdult: false) {
          id
          idMal
          title { romaji english native }
          coverImage { large medium }
          averageScore
          description
          format
          episodes
          duration
          status
          seasonYear
          genres
        }
      }
    }
  `;

  try {
    const formattedGenre = genre
      ? genre
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "";

    const res = await axios.post(
      ANILIST_GRAPHQL_URL,
      { query: gqlQuery, variables: { genre: formattedGenre, page, perPage } },
      { headers: { "Content-Type": "application/json" }, timeout: 7000 }
    );
    const mediaList = res.data?.data?.Page?.media || [];
    return mediaList.map((media, idx) => normalizeAniListMedia(media, (page - 1) * perPage + idx + 1));
  } catch (err) {
    console.error("AniList Genre error:", err.message);
    return [];
  }
}

export async function searchJikanAnime(query, page = 1) {
  try {
    const res = await axios.get(`${JIKAN_BASE_URL}/anime`, {
      params: { q: query, page },
      timeout: 3000
    });
    const items = res.data?.data || [];
    if (items.length > 0) {
      return items.map((item, idx) => normalizeJikan(item, idx + 1));
    }
  } catch (err) {
    console.warn("Jikan Search unavailable, falling back to AniList:", err.message);
  }
  return searchAniListAnime(query, page);
}

export async function fetchJikanTop(filter = "bypopularity", page = 1) {
  try {
    const res = await axios.get(`${JIKAN_BASE_URL}/top/anime`, {
      params: { filter, page },
      timeout: 3000
    });
    const items = res.data?.data || [];
    if (items.length > 0) {
      return items.map((item, idx) => normalizeJikan(item, idx + 1));
    }
  } catch (err) {
    console.warn("Jikan Top unavailable, falling back to AniList:", err.message);
  }
  const catMap = {
    bypopularity: "most-popular",
    airing: "top-airing",
    upcoming: "top-upcoming",
    favorite: "most-favorite"
  };
  return fetchAniListCategory(catMap[filter] || "most-popular", page);
}

export async function fetchJikanAnimeById(malId) {
  try {
    const res = await axios.get(`${JIKAN_BASE_URL}/anime/${malId}`, { timeout: 3000 });
    return res.data?.data ? normalizeJikan(res.data.data) : null;
  } catch (err) {
    console.warn("Jikan Anime By ID unavailable, falling back to AniList:", err.message);
    return fetchAniListByMalId(malId);
  }
}

// --- 3. AniList GraphQL API ---

export async function fetchAniListTrending(perPage = 10) {
  const query = `
    query ($perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME, status: RELEASING, isAdult: false) {
          id
          idMal
          title { romaji english native }
          coverImage { large medium }
          averageScore
          description
          format
          episodes
        }
      }
    }
  `;

  try {
    const res = await axios.post(
      ANILIST_GRAPHQL_URL,
      { query, variables: { perPage } },
      { headers: { "Content-Type": "application/json" }, timeout: 7000 }
    );
    const mediaList = res.data?.data?.Page?.media || [];
    return mediaList.map((media, idx) => normalizeAniListMedia(media, idx + 1));
  } catch (err) {
    console.error("AniList Trending error:", err.message);
    return [];
  }
}

export async function fetchAniListByMalId(malId) {
  const query = `
    query ($malId: Int) {
      Media(idMal: $malId, type: ANIME) {
        id
        idMal
        title { romaji english native }
        coverImage { large medium }
        averageScore
        description
        format
        episodes
        duration
        status
        genres
        studios { nodes { name } }
        startDate { year }
        season
        seasonYear
      }
    }
  `;

  try {
    const res = await axios.post(
      ANILIST_GRAPHQL_URL,
      { query, variables: { malId: parseInt(malId, 10) } },
      { headers: { "Content-Type": "application/json" }, timeout: 7000 }
    );
    const media = res.data?.data?.Media;
    return media ? normalizeAniListMedia(media) : null;
  } catch (err) {
    console.error("AniList fetch by MAL ID error:", err.message);
    return null;
  }
}

// --- 4. Resolution Engine (server/resolve.js pattern) ---

export async function resolveByMalId(malId) {
  const cleanMalId = String(malId).replace(/^mal-/, "");

  // 1. Try Anikoto Series directly
  const anikotoSeries = await fetchAnikotoSeries(cleanMalId);
  if (anikotoSeries) {
    return {
      source: "anikoto",
      anime: normalizeAnikotoAnime(anikotoSeries),
      episodes: anikotoSeries.episodes || []
    };
  }

  // 2. Query Jikan / AniList for MAL metadata
  const jikanAnime = await fetchJikanAnimeById(cleanMalId);
  const aniListAnime = jikanAnime ? null : await fetchAniListByMalId(cleanMalId);
  const anime = jikanAnime || aniListAnime;

  return {
    source: jikanAnime ? "jikan" : (aniListAnime ? "anilist" : "unknown"),
    anime: anime,
    aniId: aniListAnime?.aniId || null,
    malId: cleanMalId,
    episodes: anime?.episodes?.sub
      ? Array.from({ length: anime.episodes.sub }, (_, i) => ({
          number: i + 1,
          title: `Episode ${i + 1}`,
          embedUrl: `https://tryembed.com/embed/anime/${cleanMalId}/${i + 1}`
        }))
      : []
  };
}
