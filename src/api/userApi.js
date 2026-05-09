import axios from "./axiosInstance";

export const getMe = () => {
    return axios.get("/users/me");
}