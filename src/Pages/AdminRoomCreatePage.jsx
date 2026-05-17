import { useState } from "react";
import { createRoom } from "../api/adminApi";

function AdminRoomCreatePage( { onRoomCreated }) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createRoom({
                name,
                location,
                capacity: Number(capacity)
            })

            alert("회의실 생성 성공");
            setName("");
            setLocation("");
            setCapacity("");
            onRoomCreated();
        } catch {
            alert("회의실 생성 실패");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="container mt-5" onSubmit={handleCreateRoom}>
            <h2>회의실 생성</h2>
            <input
            className="form-control mb-2"
            placeholder="회의실 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <input
            className="form-control mb-2"
            placeholder="회의실 위치"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            />

            <input
            className="form-control mb-2"
            type="number"
            placeholder="회의실 수용 인원"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            />

            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "회의실 생성 중..." : "회의실 생성"}
            </button>
        </form>
    )

}

export default AdminRoomCreatePage;
