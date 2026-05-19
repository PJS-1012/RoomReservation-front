import { useEffect, useState } from "react";
import { getRooms } from "../api/roomApi";

function RoomListPage({ refreshKey }) {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);

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
                <div className="alert alert-info mt-3">
                    선택한 회의실: {selectedRoom.name}
                </div>
            )}
        </div>
    )
}

export default RoomListPage;