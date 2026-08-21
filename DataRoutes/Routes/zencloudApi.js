import axios from "axios";

const ZENCLOUD_BASE_URL = "https://api.zencloud.com/v1";

const getCredentials = (customLogin, customKey) => {
  const login = customLogin || process.env.ZENCLOUD_LOGIN || process.env.NEXT_PUBLIC_ZENCLOUD_LOGIN || "";
  const key = customKey || process.env.ZENCLOUD_KEY || process.env.NEXT_PUBLIC_ZENCLOUD_KEY || "";
  return { login, key };
};

/**
 * ZenCloud API Client
 */
export const ZenCloudAPI = {
  /**
   * Get Account Info
   */
  async getAccountInfo(customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return null;

    try {
      const res = await axios.get(`${ZENCLOUD_BASE_URL}/account/info`, {
        params: { login, key },
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : null;
    } catch (err) {
      console.warn("ZenCloud getAccountInfo error:", err.message);
      return null;
    }
  },

  /**
   * Get an Upload URL
   */
  async getUploadUrl(folder = "", customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return null;

    try {
      const params = { login, key };
      if (folder) params.folder = folder;

      const res = await axios.get(`${ZENCLOUD_BASE_URL}/file/upload`, {
        params,
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : null;
    } catch (err) {
      console.warn("ZenCloud getUploadUrl error:", err.message);
      return null;
    }
  },

  /**
   * Add Remote Upload
   */
  async addRemoteUpload(url, folder = "", headers = "", customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return null;

    try {
      const params = { login, key, url };
      if (folder) params.folder = folder;
      if (headers) params.headers = headers;

      const res = await axios.get(`${ZENCLOUD_BASE_URL}/remote/add`, {
        params,
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : null;
    } catch (err) {
      console.warn("ZenCloud addRemoteUpload error:", err.message);
      return null;
    }
  },

  /**
   * Check Remote Upload Status
   */
  async getRemoteStatus(id = "", limit = 5, customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return [];

    try {
      const params = { login, key, limit };
      if (id) params.id = id;

      const res = await axios.get(`${ZENCLOUD_BASE_URL}/remote/status`, {
        params,
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : [];
    } catch (err) {
      console.warn("ZenCloud getRemoteStatus error:", err.message);
      return [];
    }
  },

  /**
   * List Folders & Files
   */
  async listFolder(folder = "", customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return { folders: [], files: [] };

    try {
      const params = { login, key };
      if (folder) params.folder = folder;

      const res = await axios.get(`${ZENCLOUD_BASE_URL}/file/listfolder`, {
        params,
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : { folders: [], files: [] };
    } catch (err) {
      console.warn("ZenCloud listFolder error:", err.message);
      return { folders: [], files: [] };
    }
  },

  /**
   * Rename Folder
   */
  async renameFolder(folder, name, customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return false;

    try {
      const res = await axios.get(`${ZENCLOUD_BASE_URL}/file/renamefolder`, {
        params: { login, key, folder, name },
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : false;
    } catch (err) {
      console.warn("ZenCloud renameFolder error:", err.message);
      return false;
    }
  },

  /**
   * Rename File
   */
  async renameFile(file, name, customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return false;

    try {
      const res = await axios.get(`${ZENCLOUD_BASE_URL}/file/rename`, {
        params: { login, key, file, name },
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : false;
    } catch (err) {
      console.warn("ZenCloud renameFile error:", err.message);
      return false;
    }
  },

  /**
   * Delete File
   */
  async deleteFile(file, customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return false;

    try {
      const res = await axios.get(`${ZENCLOUD_BASE_URL}/file/delete`, {
        params: { login, key, file },
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : false;
    } catch (err) {
      console.warn("ZenCloud deleteFile error:", err.message);
      return false;
    }
  },

  /**
   * Get Subtitle Upload URL
   */
  async getSubtitleUploadUrl(file, language = "English", customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return null;

    try {
      const res = await axios.get(`${ZENCLOUD_BASE_URL}/subtitle/upload`, {
        params: { login, key, file, language },
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result?.data : null;
    } catch (err) {
      console.warn("ZenCloud getSubtitleUploadUrl error:", err.message);
      return null;
    }
  },

  /**
   * List Subtitles for a File
   */
  async listSubtitles(file, customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return [];

    try {
      const res = await axios.get(`${ZENCLOUD_BASE_URL}/subtitle/list`, {
        params: { login, key, file },
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : [];
    } catch (err) {
      console.warn("ZenCloud listSubtitles error:", err.message);
      return [];
    }
  },

  /**
   * Get Splash Image / Thumbnail
   */
  async getThumbnail(file, customLogin, customKey) {
    const { login, key } = getCredentials(customLogin, customKey);
    if (!login || !key) return null;

    try {
      const res = await axios.get(`${ZENCLOUD_BASE_URL}/file/thumbnail`, {
        params: { login, key, file },
        timeout: 8000
      });
      return res.data?.status === 200 ? res.data.result : null;
    } catch (err) {
      console.warn("ZenCloud getThumbnail error:", err.message);
      return null;
    }
  },

  /**
   * Generate ZenCloud Streaming / Embed Source
   */
  getStreamSource(fileId) {
    if (!fileId) return null;
    const cleanId = String(fileId).trim();
    return {
      sources: [
        {
          url: cleanId.startsWith("http") ? cleanId : `https://zencloud.com/v/${cleanId}`,
          file: cleanId.startsWith("http") ? cleanId : `https://zencloud.com/v/${cleanId}`,
          isM3U8: false,
          label: "ZenCloud HD"
        }
      ],
      tracks: [],
      embedUrl: cleanId.startsWith("http") ? cleanId : `https://zencloud.com/v/${cleanId}`
    };
  }
};

export default ZenCloudAPI;
