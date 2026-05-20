import { useEffect, useState } from "react";
import { getRooms } from "../api/roomApi";
import { createReservation } from "../api/reservationApi";

function RoomListPage({ refreshKey, onReservationCreated }) {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [isReservationSubmitting, setIsReservationSubmitting] = useState(false);

    useEffect(() => {
        getRooms().then((res) => {
            setRooms(res.data);
        })
            .catch(() => {
                alert("회의실 목록을 불러오지 못했습니다.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [refreshKey]);

    const handleCreateReservation = async (e) => {
        e.preventDefault();

        if (!selectedRoom) {
            return;
        }

        if (!startAt || !endAt) {
            alert("시작 시간과 종료 시간을 입력하세요.");
            return;
        }

        const start = new Date(startAt);
        const end = new Date(endAt);
        const now = new Date();
        const durationMinutes = (end - start) / 1000 / 60;

        if (start < now) {
            alert("지난 시간은 예약할 수 없습니다.");
            return;
        }

        if (durationMinutes < 30) {
            alert("예약은 최소 30분 이상이어야 합니다.");
            return;
        }

        if (durationMinutes > 240) {
            alert("예약은 최대 4시간까지 가능합니다.");
            return;
        }

        setIsReservationSubmitting(true);

        try {
            await createReservation({
                roomId: selectedRoom.id,
                startAt,
                endAt
            });

            alert("예약 성공");
            setSelectedRoom(null);
            setStartAt("");
            setEndAt("");
            onReservationCreated();
        } catch {
            alert("예약 실패");
        } finally {
            setIsReservationSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mt-5">
                <h2>회의실 불러오는중  </h2>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2>회의실 목록</h2>

            {rooms.length === 0 ? (
                <p>등록된 회의실이 없습니다.</p>
            ) : (
                <ul className="list-group">
                    {rooms.map((room) => (
                        <li className="list-group-item" key={room.id}>
                            <strong>{room.name}</strong>
                            <div>위치: {room.location}</div>
                            <div>수용 인원: {room.capacity}명</div>
                            <button
                                className="btn btn-primary mt-2"
                                type="button"
                                onClick={() => setSelectedRoom(room)}>
                                예약하기
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {selectedRoom && (
                <form className="alert alert-info mt-3" onSubmit={handleCreateReservation}>
                    <h3>{selectedRoom.name} 예약하기</h3>

                    <label className="form-label">시작 시간</label>
                    <input
                        className="form-control mb-2"
                        type="datetime-local"
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                    />

                    <label className="form-label">종료 시간</label>
                    <input
                        className="form-control mb-2"
                        type="datetime-local"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                    />

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={isReservationSubmitting}
                    >
                        {isReservationSubmitting ? "예약중" : "예약하기"}
                    </button>
                </form>
            )}
        </div>
    )
}

export default RoomListPage;