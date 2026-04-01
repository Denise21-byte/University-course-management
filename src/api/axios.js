import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
          { refreshToken }
        );
        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (_) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;