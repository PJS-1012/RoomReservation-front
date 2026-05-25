import { useState } from "react";
import { register } from "../api/userApi";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

function RegisterPage({ onRegisterSuccess, onShowLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);  

        try {
            await register({
                email,
                password,
                name
            });
            alert("회원가입 성공");
            onRegisterSuccess();
        } catch (error) {
            alert(getApiErrorMessage(error, "회원가입 실패"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="container mt-5" onSubmit={handleRegister}>
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
            <input
                className="form-control mb-2"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "회원가입 중..." : "회원가입"}
            </button>
            <button className="btn btn-link" type="button" onClick={onShowLogin}>
                로그인으로 돌아가기
            </button>

        </form>
    );
}

export default RegisterPage;
