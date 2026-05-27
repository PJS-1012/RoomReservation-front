import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080"
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (res) => {
    return res;
  }, (error) => {
    if(error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.reload();
    }

    return Promise.reject(error);
  }

)

export default instance;