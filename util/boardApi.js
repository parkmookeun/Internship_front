// utils/boardApi.js

//게시판 목록 조회
export const fetchBoards = async (pageNumber, pageSize = 10) => {
  const headers = getHeaders();

  const response = await fetch(
    `http://localhost:8080/api/posts?pageNumber=${
      pageNumber - 1
    }&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: headers,
      credentials: "include",
    }
  );

  //게시판 단건 조회
  if (!response.ok) {
    throw new Error("게시글 데이터를 가져오는데 실패했습니다");
  }

  return await response.json();
};

export const fetchBoardById = async (id) => {
  const headers = getHeaders();

  const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
    method: "GET",
    headers: headers,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("게시글을 찾을 수 없습니다");
  }

  return await response.json();
};

//게시글 생성
export const createBoard = async (boardData) => {
  const headers = getHeaders();

  const response = await fetch("http://localhost:8080/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    headers,
    body: JSON.stringify(boardData),
  });

  if (!response.ok) {
    throw new Error("게시글 등록에 실패했습니다");
  }

  return await response.json();
};

// 게시글 삭제
export const deleteBoard = async (id) => {
  const headers = getHeaders();
  const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    headers,
  });

  if (!response.ok) {
    throw new Error("게시글 삭제에 실패했습니다");
  }

  return true;
};

//게시글 수정
export const updateBoard = async (id, title, contents) => {
  const headers = getHeaders();
  const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    headers,
    body: JSON.stringify({ title, contents }),
  });

  if (!response.ok) {
    throw new Error("게시글 수정에 실패했습니다");
  }
};

function getHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  // 브라우저 환경에서만 localStorage 접근
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    // 토큰이 있으면 Authorization 헤더 추가
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}
