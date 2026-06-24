import axios from "axios";

const api = axios.create({
  baseURL:  import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")&&
      !originalRequest._isSessionRestore 
    ) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null); // ✅ resolve all queued requests
        isRefreshing = false;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError); // ✅ reject all queued requests
        isRefreshing = false;

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;