import axios from "./axiosInstance";

export const getMe = () => {
    return axios.get("/users/me");
}

export const register = ({ email, password, name}) => {
    return axios.post("/users", {
        email,
        password,
        name
    });
};