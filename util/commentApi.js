// utils/commentApi.js
export const fetchComments = async (postId, pageNumber, pageSize = 10) => {
  let token = null;
  if (typeof window != "undefined") {
    token = localStorage.getItem("token");
  }

  const headers = {
    "Content-Type": "application/json",
  };

  //토큰이 있으면 Authorization 헤더 추가
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `http://localhost:8080/api/posts/${postId}/comments?pageNumber=${
      pageNumber - 1
    }&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: headers,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("댓글 데이터를 가져오는데 실패했습니다");
  }

  return await response.json();
};
