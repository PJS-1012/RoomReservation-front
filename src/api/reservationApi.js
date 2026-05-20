import axios from "./axiosInstance";

export const createReservation = ({ roomId, startAt, endAt }) => {
    return axios.post("/reservations", {
        roomId,
        startAt,
        endAt
    });
};

export const getMyReservations = () => {
    return axios.get("/reservations");
}