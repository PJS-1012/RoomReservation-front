import { useEffect, useState } from "react";
import { getMe } from "./api/userApi";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import RoomListPage from "./Pages/RoomListPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );

  const [authPage, setAuthPage] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return;
    }

    getMe()
      .then((res) => {
        setUser(res.data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="container mt-5">
        <h2>로딩 중...</h2>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="container mt-5">
        <h2>{user ? `${user.name} 로그인 완료` : "로그인 완료"}</h2>
        <button
          className="btn btn-secondary"
          onClick={() => {
            localStorage.removeItem("accessToken");
            setIsLoggedIn(false);
            setUser(null);
          }}
        >
          로그아웃
        </button>

        <RoomListPage />
      </div>
    );
  }

  if (authPage === "register") {
    return (
      <RegisterPage
        onRegisterSuccess={() => setAuthPage("login")}
        onShowLogin={() => setAuthPage("login")}
      />
    );
  }

  return (
  <LoginPage onLoginSuccess={(userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  }}
    onShowRegister={() => setAuthPage("register")}
  />
);
}

export default App;