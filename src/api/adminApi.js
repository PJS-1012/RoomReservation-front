import axios from "./axiosInstance";

export const createRoom = ({ name, location, capacity }) => {
    return axios.post("/admin", {
        name,
        location,
        capacity
    });
}

export const deactivateRoom = (roomId) => {
    return axios.delete(`/admin/${roomId}`);
}

export const updateRoom = (roomId, {name, location, capacity}) => {
    return axios.put(`/admin/${roomId}`, {
        name,
        location,
        capacity
    });
}