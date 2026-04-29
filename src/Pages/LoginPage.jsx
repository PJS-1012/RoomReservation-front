import { useState } from "react";
import axios from "../api/axiosInstance";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("/auth/login", {
                email,
                password
            });
            localStorage.setItem("accessToken", res.data.accessToken);
            alert("로그인 성공");
        } catch (e) { alert("로그인 실패"); 
            
        }
    };

    return (
        <div className="container mt-5">
            <h2>로그인</h2>
            <input
                className="form-control mb-2"
                placeholder="이메일"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="form-control mb-2"
                type="password"
                placeholder="비밀번호"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleLogin}>
                로그인
            </button>
        </div>
    );
}

export default LoginPage;