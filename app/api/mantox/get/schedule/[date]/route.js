import { HiAnime } from "aniwatch";
import axios from "axios";

const hianime = new HiAnime.Scraper();

export async function GET(request, { params }) {
  const { date } = await params;

  try {
    const data = await hianime.getEstimatedSchedule(date);
    if (data && data.scheduledAnimes && data.scheduledAnimes.length > 0) {
      return new Response(JSON.stringify({ manto: true, data }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    // Scraper unavailable, fallback to AniList
  }

  try {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = Math.floor(new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime() / 1000);
    const endOfDay = startOfDay + 86400;

    const gqlQuery = `
      query ($start: Int, $end: Int) {
        Page(page: 1, perPage: 30) {
          airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
            id
            airingAt
            episode
            media {
              id
              idMal
              title { romaji english native }
              coverImage { large }
              format
            }
          }
        }
      }
    `;

    const res = await axios.post(
      "https://graphql.anilist.co",
      { query: gqlQuery, variables: { start: startOfDay, end: endOfDay } },
      { headers: { "Content-Type": "application/json" }, timeout: 7000 }
    );

    const schedules = res.data?.data?.Page?.airingSchedules || [];
    const scheduledAnimes = schedules.map((item) => {
      const airingDate = new Date(item.airingAt * 1000);
      const hours = String(airingDate.getUTCHours()).padStart(2, "0");
      const minutes = String(airingDate.getUTCMinutes()).padStart(2, "0");
      const time = `${hours}:${minutes}`;

      return {
        id: item.media?.idMal ? `mal-${item.media.idMal}` : `ani-${item.media?.id}`,
        name: item.media?.title?.english || item.media?.title?.romaji || "Anime",
        jname: item.media?.title?.native || item.media?.title?.romaji || "",
        time: time,
        episode: item.episode
      };
    });

    return new Response(
      JSON.stringify({
        manto: true,
        data: {
          scheduledAnimes
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (fallbackErr) {
    return new Response(
      JSON.stringify({
        manto: true,
        data: {
          scheduledAnimes: []
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

