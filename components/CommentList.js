// components/CommentList.js
import { useComments } from "@/hooks/useComments";
import Pagination from "@/components/Pagination";
import styles from "./CommentList.module.css";

export default function CommentList({ postId }) {
  const {
    comments,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    handlePageChange,
  } = useComments(postId, 1); // 페이지당 10개

  if (loading && comments.length === 0) {
    return <div>댓글을 불러오는 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div style={{ margin: "20px auto", width: "80%" }}>
      <h4>💬 댓글 목록 ({totalElements}개)</h4>

      {/* 댓글 리스트 */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
          padding: "15px",
        }}
      >
        {comments.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            아직 댓글이 없습니다.
          </p>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id || index}
              style={{
                padding: "10px",
                backgroundColor: "white",
                marginBottom: "10px",
                borderRadius: "3px",
                border: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <strong>{comment.writer}</strong>
                <small style={{ color: "#666" }}>
                  {formatDate(comment.createdAt)}
                </small>
              </div>
              <p style={{ margin: "0", lineHeight: "1.4" }}>
                {comment.contents}
              </p>
              {/* <p className={styles.commentBtn}>
                 <button>수정</button>
                  <button>삭제</button>
              </p> */}
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{ marginTop: "20px" }}>
          <Pagination
            currentPageNumber={currentPage}
            lastPageNumber={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}
