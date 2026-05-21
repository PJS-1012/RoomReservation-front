import { useEffect, useState } from "react";
import { getMyReservations, cancelReservation } from "../api/reservationApi";

function MyReservationsPage({ refreshKey }) {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getMyReservations().then((res) => {
            setReservations(res.data);
        })
            .catch(() => {
                alert("내 예약 목록을 불러오지 못했습니다.");
            })
            .finally(() => {
                setIsLoading(false);
            });

    }, [refreshKey]);

    const handleCancelReservation = async (reservationId) => {
        try {
            await cancelReservation(reservationId);

            alert("에약이 취소되었습니다.");

            setReservations((prev) =>
                prev.map((reservation) =>
                    reservation.id === reservationId
                        ? { ...reservation, canceled: true }
                        : reservation));
        } catch {
            alert("예약 취소 실패");
        }
    };

    if (isLoading) {
        return (
            <div className="container mt-5">
                <h2>예약 목록 불러오는중...</h2>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2>내 예약 목록</h2>

            {reservations.length === 0 ? (
                <p>예약 내역이 없습니다.</p>
            ) : (
                <ul className="list-group">
                    {reservations.map((reservation) => (
                        <li className="list-group-item" key={reservation.id}>
                            <strong>{reservation.roomName}</strong>
                            <div>시작 : {reservation.startAt}</div>
                            <div>종료 : {reservation.endAt}</div>
                            <div>상태 : {reservation.canceled ? "취소됨" : "예약됨"}</div>
                            {!reservation.canceled && (
                                <button
                                    className="btn btn-danger mt-2"
                                    type="button"
                                    onClick={() => handleCancelReservation(reservation.id)}>
                                    예약취소
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyReservationsPage;