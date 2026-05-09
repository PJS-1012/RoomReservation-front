import { useState } from "react";
import LoginPage from "./Pages/LoginPage";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
      Boolean(localStorage.getItem("accessToken"))
    );

    if(isLoggedIn) {
      return (
        <div className = "container mt-5">
          <h2>로그인 완료</h2>
          <button
            className="btn btn-secondary"
            onClick={() => {
              localStorage.removeItem("accessToken");
              setIsLoggedIn(false);
            }}
            >
              로그아웃
            </button>
        </div>
      );
    }
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }
  export default App;