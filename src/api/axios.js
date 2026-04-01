import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV ? "" : import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log(`[API] Response ${res.status}`, res.data);
    return res;
  },
  async (err) => {
    console.error(`[API] Error ${err.response?.status}`, err.response?.data);
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post("/api/auth/refresh-token", { refreshToken });
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
```

---

## After saving, open browser DevTools → Console tab

You will see logs like:
```
[API] GET /api/courses
[API] Error 400 { message: "..." }