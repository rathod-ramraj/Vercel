import axios from "axios";
import { load } from "cheerio";
import { fetchAniListTrending, fetchAniListCategory, fetchJikanTop, fetchAnikotoRecentReleases } from "./animexploreApi.js";
import underrated from "@/Utils/underratedMap.js";

const BASE_NEWS_URL = "https://www.animenewsnetwork.com";

const fetchNewsFeeds = async (topic = "anime") => {
  try {
    const url = topic ? `${BASE_NEWS_URL}/news/?topic=${topic}` : `${BASE_NEWS_URL}/news`;
    const { data } = await axios.get(url, { timeout: 6000 });
    const $ = load(data);
    const feeds = [];

    $(".herald.box.news").each((i, el) => {
      const title = $(el).find("h3").text().trim();
      const slug = $(el).find("h3 > a").attr("href") || "";
      const newsUrl = `${BASE_NEWS_URL}${slug}`;
      const byline = $(el).find(".byline");
      const uploadedAt = byline.find("time").text().trim();
      const topics = [];

      byline.find(".topics > a").each((i, el) => {
        topics.push($(el).text().trim());
      });

      const El = $(el).find(".preview");
      const preview = {
        intro: El.find(".intro").text().trim(),
        full: El.find(".full").text().replace("―", "").trim()
      };

      const thumbnailSlug = $(el).find(".thumbnail").attr("data-src");
      const thumbnail = thumbnailSlug
        ? `${BASE_NEWS_URL}${thumbnailSlug}`
        : "https://i.imgur.com/KkkVr1g.png";

      feeds.push({
        id: slug.replace("/news/", ""),
        title,
        uploadedAt,
        topics,
        preview,
        thumbnail,
        url: newsUrl
      });
    });

    return feeds;
  } catch (error) {
    return [];
  }
};

export const getCustomHomePage = async () => {
  try {
    const [trendingAniList, popularList, airingList, favoriteList, recentAnikoto, newsFeed] = await Promise.all([
      fetchAniListTrending(12).catch(() => []),
      fetchAniListCategory("most-popular", 1, 20).catch(() => []),
      fetchAniListCategory("top-airing", 1, 15).catch(() => []),
      fetchAniListCategory("most-favorite", 1, 15).catch(() => []),
      fetchAnikotoRecentReleases(1, 14).catch(() => []),
      fetchNewsFeeds("anime").catch(() => [])
    ]);

    const spotlightList = trendingAniList.length > 0 ? trendingAniList : popularList.slice(0, 10);
    const trendingList = popularList.length > 0 ? popularList.slice(0, 15) : trendingAniList.slice(0, 15);
    const topAiringList = airingList.length > 0 ? airingList.slice(0, 12) : popularList.slice(0, 12);
    const mostFavoriteList = favoriteList.length > 0 ? favoriteList.slice(0, 12) : popularList.slice(5, 17);
    const specialList = recentAnikoto.length > 0 ? recentAnikoto : popularList.slice(0, 14);

    const topTenData = {
      t: spotlightList.slice(0, 10),
      w: trendingList.slice(0, 10),
      m: mostFavoriteList.slice(0, 10)
    };

    const homeData = {
      spotlightAnimes: spotlightList,
      trendingAnimes: trendingList,
      topAiring: topAiringList,
      mostFavorite: mostFavoriteList,
      underrated: Array.isArray(underrated) ? underrated.slice(0, 12) : popularList.slice(0, 12),
      mostPopular: popularList.slice(0, 12),
      special: specialList,
      newsFeed: newsFeed,
      topTen: topTenData
    };

    return {
      manto: true,
      data: homeData
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error.message);
    return {
      manto: false,
      error: error.message
    };
  }
};


