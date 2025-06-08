"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 상태 확인
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("nickName"); // username도 localStorage에 저장되어 있다고 가정

      if (token && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    }
  };

  const handleLogout = () => {
    // localStorage에서 토큰과 사용자 정보 제거
    localStorage.removeItem("token");
    localStorage.removeItem("nickName");

    // 상태 업데이트
    setIsLoggedIn(false);
    setUsername("");

    // 로그인 페이지로 이동 (또는 메인 페이지)
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/");
  };

  return (
    <header style={headerStyle}>
      <div style={headerContentStyle}>
        <h1 style={logoStyle} onClick={() => router.push("/")}>
          게시판
        </h1>

        <div style={userSectionStyle}>
          {isLoggedIn ? (
            <>
              <span style={welcomeTextStyle}>{username}님 환영합니다!</span>
              <button
                style={logoutButtonStyle}
                onClick={handleLogout}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#c82333")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              style={loginButtonStyle}
              onClick={handleLogin}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// 스타일 정의
const headerStyle = {
  backgroundColor: "#f8f9fa",
  borderBottom: "1px solid #dee2e6",
  padding: "1rem 0",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const headerContentStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 1rem",
};

const logoStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#333",
  cursor: "pointer",
  margin: 0,
};

const userSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const welcomeTextStyle = {
  fontSize: "1rem",
  color: "#333",
  fontWeight: "500",
};

const logoutButtonStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: "500",
  transition: "background-color 0.2s",
};

const loginButtonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: "500",
  transition: "background-color 0.2s",
};
