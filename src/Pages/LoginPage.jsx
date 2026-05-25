import { useState } from "react";
import { login } from "../api/authApi";
import { getMe } from "../api/userApi";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

function LoginPage({ onLoginSuccess, onShowRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await login({
                email,
                password
            });
            localStorage.setItem("accessToken", res.data.accessToken);

            const meRes = await getMe();
            onLoginSuccess(meRes.data);
        } catch (error) { 
            alert(getApiErrorMessage(error, "로그인 실패"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="container mt-5" onSubmit={handleLogin}>
            <h2>로그인</h2>
            <input
                className="form-control mb-2"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="form-control mb-2"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
            <button className="btn btn-link" type="button" onClick={onShowRegister}>
                회원가입
            </button>
        </form>
    );
}

export default LoginPage;
