export const getServersByEpisodeId = async (epid) => {
  return {
    manto: true,
    data: {
      sub: [
        { serverName: "MegaPlay", serverId: 1 },
        { serverName: "TryEmbed", serverId: 2 },
        { serverName: "AnimePahe", serverId: 3 },
        { serverName: "HD-1", serverId: 4 },
        { serverName: "HD-2", serverId: 5 },
        { serverName: "HD-3", serverId: 6 },
        { serverName: "HD-4", serverId: 7 }
      ],
      dub: [
        { serverName: "MegaPlay", serverId: 1 },
        { serverName: "TryEmbed", serverId: 2 },
        { serverName: "AnimePahe", serverId: 3 },
        { serverName: "HD-1", serverId: 4 },
        { serverName: "HD-2", serverId: 5 },
        { serverName: "HD-3", serverId: 6 },
        { serverName: "HD-4", serverId: 7 }
      ],
      raw: [],
      episodeNo: parseInt(String(epid).replace(/^[^\d]*/, "") || "1", 10) || 1,
      episodeId: epid
    }
  };
};


