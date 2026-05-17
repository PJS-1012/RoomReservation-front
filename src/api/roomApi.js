import axios from "./axiosInstance";

export const getRooms = () => {
    return axios.get('/rooms');
}