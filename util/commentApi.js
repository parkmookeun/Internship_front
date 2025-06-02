// utils/commentApi.js
export const fetchComments = async (postId, pageNumber, pageSize = 10) => {
  const response = await fetch(`http://localhost:8080/api/posts/${postId}/comments?pageNumber=${pageNumber-1}&pageSize=${pageSize}`);
  
  if (!response.ok) {
    throw new Error('댓글 데이터를 가져오는데 실패했습니다');
  }

  return await response.json();
};