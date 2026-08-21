export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const secondHalfEp = searchParams.get("ep");

  const streamServers = {
    sub: [
      { serverId: 1, serverName: "megaplay" },
      { serverId: 2, serverName: "tryembed" },
      { serverId: 3, serverName: "animepahe" },
      { serverId: 4, serverName: "hd-1" },
      { serverId: 5, serverName: "hd-2" },
      { serverId: 6, serverName: "hd-3" },
      { serverId: 7, serverName: "hd-4" }
    ],
    dub: [
      { serverId: 1, serverName: "megaplay" },
      { serverId: 2, serverName: "tryembed" },
      { serverId: 3, serverName: "animepahe" },
      { serverId: 4, serverName: "hd-1" },
      { serverId: 5, serverName: "hd-2" },
      { serverId: 6, serverName: "hd-3" },
      { serverId: 7, serverName: "hd-4" }
    ],
    raw: [],
    episodeId: id,
    episodeNo: parseInt(secondHalfEp || id.replace(/^[^\d]*/, "") || "1", 10) || 1
  };

  return new Response(JSON.stringify({ manto: true, data: streamServers }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

