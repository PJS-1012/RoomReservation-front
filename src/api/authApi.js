import axios from "./axiosInstance";

export const login = ({ email, password }) => {
  return axios.post("/auth/login", {
    email,
    password,
  });
};


