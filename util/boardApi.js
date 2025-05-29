// utils/boardApi.js
export const fetchBoards = async (pageNumber, pageSize = 10) => {
  const response = await fetch(`http://localhost:8080/api/posts?pageNumber=${pageNumber-1}&pageSize=${pageSize}`);
  
  if (!response.ok) {
    throw new Error('게시글 데이터를 가져오는데 실패했습니다');
  }

  return await response.json();
};

export const fetchBoardById = async (id) => {
  const response = await fetch(`http://localhost:8080/api/posts/${id}`);
  
  if (!response.ok) {
    throw new Error('게시글을 찾을 수 없습니다');
  }

  return await response.json();
};

export const createBoard = async (boardData) => {
  const response = await fetch('http://localhost:8080/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(boardData),
  });

  if (!response.ok) {
    throw new Error('게시글 등록에 실패했습니다');
  }

  return await response.json();
};

export const deleteBoard = async (id) => {
  const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('게시글 삭제에 실패했습니다');
  }

  return true;
};