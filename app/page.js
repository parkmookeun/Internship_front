"use client";

import ConfirmModal from "@/components/ConfirmModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Tiptap from "@/components/Tiptap";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지

    // 입력값 검증
    if (!email.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // JWT 토큰을 localStorage에 저장 (클라이언트 사이드에서만 실행)
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("nickName", data.nickName);
        }

        alert("로그인 성공!");
        console.log("로그인 성공:", data);

        // 로그인 성공 후 페이지 이동 (Next.js App Router)
        router.push("/posts");
      } else {
        const errorText = await response.text();
        alert(`로그인 실패: ${errorText}`);
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="home-header">게시판 프로젝트</div>
      <div className="home-main">
        <form onSubmit={handleLogin}>
          {/* 아이디 입력 칸 */}
          <div className="login-container">
            <div className="login-div">
              <div className="login-label">
                <label htmlFor="input-id">아이디: </label>
              </div>
              <input
                id="input-id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="아이디(이메일)를 입력해주세요."
              ></input>
            </div>
            <div className="login-div">
              <div className="login-label">
                <label htmlFor="input-password">비밀번호: </label>
              </div>
              <input
                id="input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="비밀번호를 입력해주세요."
              ></input>
            </div>
            <div className="login-div">
              <button>로그인</button>
            </div>
            <div className="login-div">
              <h4>게시판을 이용하려면 로그인을 해주세요!</h4>
            </div>
          </div>
        </form>
      </div>
      <Tiptap />
    </div>
  );
}
