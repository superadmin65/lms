import axios from "axios";

// 1. Declare the constant at the top so it's accessible to the whole file
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // --- AUTH ---
  login: (data) => api.post("/v2/user/login", data),
  register: (data) => api.post("/v2/user/register", data),

  // --- EXIT / LOGOUT ---
  logout: (data) => api.post("/exit_api/logout", data),

  // --- MCQ ---
  getMcqProgress: (userId, actId) =>
    api.get(`/mcq/progress/${userId}/${actId}`, {
      params: { t: new Date().getTime() },
    }),

  saveMcqProgress: (payload) => api.post("/mcq/progress", payload),
  completeMcq: (payload) => api.post("/mcq/complete", payload),

  // --- SPELLING (CompleteWord) ---
  getSpellingProgress: (uid, aid) =>
    api.get(`/completedword/progress/${uid}/${aid}`),

  saveSpellingProgress: (data) => api.post("/completedword/progress", data),
  completeSpelling: (data) => api.post("/completedword/complete", data),

  // --- PLAYLIST / ACTIVITY DATA ---
  getActivityData: (id) => api.get("/activity/data", { params: { id } }),
  getActivityDetail: (id) => api.get(`/activity/detail/${id}`),

  // --- IMAGE HELPERS ---
  // This helper generates the dynamic URL for your Oracle images
  getIconUrl: (id) => `${API_BASE}/v1/konzeptes/image/icon/${id}`,

  // Add this to your apiService.js if not already there
  getBgImageUrl: (id) => `${API_BASE}/v1/konzeptes/image/bg/${id}`,

  // --- HOME / DASHBOARD CONFIG ---
  getHomeConfig: () => api.get("/v1/konzeptes/config"),

  // --- SEQUENCE ---
  getSequenceProgress: (uid, aid) =>
    api.get(`/sequence/progress/${uid}/${aid}`, {
      params: { t: new Date().getTime() },
    }),

  saveSequenceProgress: (payload) => api.post("/sequence/progress", payload),

  completeSequence: (payload) => api.post("/sequence/complete", payload),

  // --- MATCH BY ---
  getMatchByProgress: (uid, aid) =>
    api.get(`/matchby/progress/${uid}/${aid}`, {
      params: { t: new Date().getTime() },
    }),

  saveMatchByProgress: (payload) => api.post("/matchby/progress", payload),

  completeMatchBy: (payload) => api.post("/matchby/complete", payload),
};
