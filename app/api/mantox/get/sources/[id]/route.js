
import { ReCloudAPI } from "@/DataRoutes/Routes/recloudApi.js";
import { MegaPlayAPI } from "@/DataRoutes/Routes/megaplayApi.js";
import { TryEmbedAPI } from "@/DataRoutes/Routes/tryembedApi.js";
import { AnimePaheAPI } from "@/DataRoutes/Routes/animepaheApi.js";

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);

  const { id } = await params;
  const secondHalfEp = searchParams.get("ep");
  const server = (searchParams.get("s") || "megaplay").toLowerCase();
  const subOrDub = (searchParams.get("c") || "sub").toLowerCase();

  const cleanEpNum = parseInt(secondHalfEp || id.replace(/^[^\d]*/, "") || "1", 10) || 1;
  const cleanAnimeId = id.replace(/^(mal-|anikoto-|jikan-)/, "").split("?")[0].split("$")[0];

  let streamSource = null;

  if (server === "animepahe" || server === "vidnest") {
    streamSource = await AnimePaheAPI.getStreamSource({
      id: cleanAnimeId,
      episode: cleanEpNum,
      type: subOrDub
    });
  } else if (server === "tryembed") {
    streamSource = TryEmbedAPI.getStreamSource({
      id: cleanAnimeId,
      episode: cleanEpNum,
      type: subOrDub
    });
  } else if (server === "megaplay") {
    streamSource = MegaPlayAPI.getStreamSource({
      id: cleanAnimeId,
      episode: cleanEpNum,
      type: subOrDub
    });
  } else {
    streamSource = ReCloudAPI.getStreamSource({
      id: cleanAnimeId,
      episode: cleanEpNum,
      type: subOrDub,
      server
    });
  }

  return new Response(JSON.stringify({ manto: true, data: streamSource }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}




