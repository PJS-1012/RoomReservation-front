import { useEffect, useState } from "react";
import { getRooms } from "../api/roomApi";
import { createReservation } from "../api/reservationApi";
import { deactivateRoom, updateRoom } from "../api/adminApi";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

function RoomListPage({ refreshKey, onReservationCreated, isAdmin, onRoomChange }) {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [isReservationSubmitting, setIsReservationSubmitting] = useState(false);
    const [updatingRoomId, setUpdatingRoomId] = useState(null);
    const [updateName, setUpdateName] = useState("");
    const [updateLocation, setUpdateLocation] = useState("");
    const [updateCapacity, setUpdateCapacity] = useState("");
    const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);

    useEffect(() => {
        getRooms().then((res) => {
            setRooms(res.data);
        })
            .catch((error) => {
                alert(getApiErrorMessage(error, "회의실 목록을 불러오지 못했습니다."));
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
        } catch (error) {
            alert(getApiErrorMessage(error, "예약 실패"));
        } finally {
            setIsReservationSubmitting(false);
        }
    };

    const handleDeactivateRoom = async (roomId) => {
        if (!confirm("해당 회의실을 비활성화 하겠습니까?")) {
            return;
        }

        try {
            await deactivateRoom(roomId);
            alert("회의실이 비활성화되었습니다.");
            onRoomChange();
        } catch (error) {
            alert(getApiErrorMessage(error, "회의실 비활성화 실패"));
        }
    };

    const handleStartUpdateRoom = (room) => {
        setUpdatingRoomId(room.id);
        setUpdateName(room.name);
        setUpdateLocation(room.location);
        setUpdateCapacity(String(room.capacity));

    };

    const handleUpdateRoom = async (e) => {
        e.preventDefault();

        setIsUpdateSubmitting(true);

        try {
            await updateRoom(updatingRoomId, {
                name: updateName,
                location: updateLocation,
                capacity: Number(updateCapacity)
            });

            alert("회의실 정보가 수정되었습니다.");
            setUpdatingRoomId(null);
            setUpdateName("");
            setUpdateLocation("");
            setUpdateCapacity("");
            onRoomChange();
        } catch (error) {
            alert(getApiErrorMessage(error, "회의실 정보 수정 실패"));

        } finally {
            setIsUpdateSubmitting(false);
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
                            {isAdmin && (
                                <>
                                    <button
                                        className="btn btn-danger mt-2 ms-2"
                                        type="button"
                                        onClick={() => handleDeactivateRoom(room.id)}>
                                        비활성화
                                    </button>

                                    <button
                                        className="btn btn-warning mt-2 ms-2"
                                        type="button"
                                        onClick={() => handleStartUpdateRoom(room)}>
                                        수정
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {updatingRoomId && (
                <form className="alert alert-warning mt-3" onSubmit={handleUpdateRoom}>
                    <h3>회의실 정보 수정</h3>

                    <input
                        className="form-control mb-2"
                        placeholder="회의실 이름"
                        value={updateName}
                        onChange={(e) => setUpdateName(e.target.value)}
                    />

                    <input
                        className="form-control mb-2"
                        placeholder="회의실 위치"
                        value={updateLocation}
                        onChange={(e) => setUpdateLocation(e.target.value)}
                    />

                    <input
                        className="form-control mb-2"
                        type="number"
                        placeholder="회의실 수용 인원"
                        value={updateCapacity}
                        onChange={(e) => setUpdateCapacity(e.target.value)}
                    />

                    <button
                        className="btn btn-warning"
                        type="submit"
                        disabled={isUpdateSubmitting}
                    >
                        {isUpdateSubmitting ? "수정중..." : "수정하기"}
                    </button>

                    <button
                        className="btn btn-secondary ms-2"
                        type="button"
                        onClick={() => setUpdatingRoomId(null)}
                    >
                        취소
                    </button>
                </form>)}

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