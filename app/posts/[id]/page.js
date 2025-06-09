"use client";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useComments } from "@/hooks/useComments";
import ConfirmModal from "@/components/ConfirmModal";
import CommentList from "@/components/CommentList";
import styles from "./[id].module.css";
import { fetchBoardById, getHeaders } from "@/util/boardApi";

export default function PostDetail() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [board, setBoard] = useState({});
  const [commentWriter, setCommentWriter] = useState("");
  const [commentContents, setCommentContents] = useState("");
  const [showConfirmModal, setConfirmModal] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const headers = getHeaders();
  // 파일 다운로드 함수
  const handleDownload = async (s3Key, fileName) => {
    try {
      if (!s3Key) {
        throw new Error("S3 키가 제공되지 않았습니다.");
      }

      if (!fileName) {
        fileName = s3Key.split("/").pop();
        console.log("파일명 자동 추출:", fileName);
      }

      const authHeaders = getHeaders();
      if (!authHeaders.Authorization) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await fetch(
        `http://localhost:8080/api/files/download?fileKey=${s3Key}`,
        {
          method: "GET",
          headers: {
            Authorization: authHeaders.Authorization,
          },
        }
      );

      console.log("응답 상태:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("서버 에러 응답:", errorText);

        switch (response.status) {
          case 401:
            throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
          case 403:
            throw new Error("파일 다운로드 권한이 없습니다.");
          case 404:
            throw new Error("파일을 찾을 수 없습니다.");
          case 500:
            throw new Error("서버 오류가 발생했습니다.");
          default:
            throw new Error(`다운로드 실패: ${response.status} - ${errorText}`);
        }
      }

      const blob = await response.blob();
      console.log("파일 크기:", blob.size, "bytes");

      if (blob.size === 0) {
        throw new Error("빈 파일입니다.");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log("✅ 다운로드 완료!");
    } catch (error) {
      console.error("❌ 다운로드 오류:", error);

      let userMessage = "파일 다운로드에 실패했습니다.";

      if (error.message.includes("로그인")) {
        userMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
      } else if (error.message.includes("권한")) {
        userMessage = "파일 다운로드 권한이 없습니다.";
      } else if (error.message.includes("찾을 수 없습니다")) {
        userMessage = "파일을 찾을 수 없습니다.";
      }

      alert(userMessage);
    }
  };

  // 이미지 파일인지 확인하는 함수
  const isImageFile = (filePath) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".svg",
    ];
    const extension = filePath
      .toLowerCase()
      .substring(filePath.lastIndexOf("."));
    return imageExtensions.includes(extension);
  };

  // ✅ 글 내용과 이미지를 함께 렌더링하는 함수
  const renderContentWithImages = () => {
    if (!board.contents) return null;

    const imageFiles =
      board.fileList?.filter((file) => isImageFile(file.filePath)) || [];

    return (
      <div style={{ lineHeight: "1.6" }}>
        {/* 글 내용 */}
        <div
          style={{
            marginBottom: imageFiles.length > 0 ? "20px" : "0",
            whiteSpace: "pre-wrap", // 줄바꿈 유지
          }}
        >
          {board.contents}
        </div>

        {/* 이미지들을 글 내용 아래에 표시 */}
        {imageFiles.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            {imageFiles.map((file, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <img
                  src={file.filePath}
                  alt={file.originalName}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    height: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    console.error("이미지 로드 실패:", file.filePath);
                  }}
                />
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "12px",
                    color: "#888",
                    fontStyle: "italic",
                  }}
                >
                  {file.originalName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        headers,
      });

      router.push(`/posts`);
    } catch (error) {
      alert("게시글 삭제 실패");
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8080/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        headers,
        body: JSON.stringify({
          writer: commentWriter,
          contents: commentContents,
        }),
      });

      window.location.reload();
    } catch (error) {
      console.log("댓글 등록 실패");
    }
  };

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);
        const data = await fetchBoardById(id);

        setBoard(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setBoard(null);
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, [id]);

  return (
    <div>
      <div className="board-detail-container">
        <table
          style={{
            border: "1px solid black",
            borderCollapse: "collapse",
            margin: "auto",
            width: "80%",
            height: "90%",
          }}
        >
          <thead>
            <tr>
              <th
                style={{ border: "1px solid black", padding: "8px" }}
                colSpan={3}
              >
                게시글 상세
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ border: "1px solid black" }}>
              <td style={{ padding: "8px" }}>제목:</td>
              <td colSpan={2}>{board.title}</td>
            </tr>
            <tr style={{ border: "1px solid black", padding: "8px" }}>
              <td style={{ padding: "8px" }}>날짜:</td>
              <td colSpan={2}>{formatDateWithPadding(board.modifiedAt)}</td>
            </tr>
            <tr style={{ border: "1px solid black", padding: "8px" }}>
              <td style={{ padding: "8px" }}>작성자:</td>
              <td colSpan={2}>{board.writer}</td>
            </tr>
            <tr style={{ border: "1px solid black", padding: "8px" }}>
              <td style={{ padding: "8px", verticalAlign: "top" }}>내용:</td>
              <td colSpan={2} style={{ padding: "15px" }}>
                {/* ✅ 글 내용과 이미지를 함께 표시 */}
                {renderContentWithImages()}
              </td>
            </tr>

            <tr style={{ textAlign: "center", padding: "none" }}>
              <td colSpan={3}>
                <button
                  onClick={() => {
                    router.push(`/posts/${id}/edit`);
                  }}
                  style={{ margin: "5px" }}
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    setConfirmModal(true);
                  }}
                >
                  삭제
                </button>
                <button
                  onClick={() => {
                    router.push("/posts");
                  }}
                  style={{ marginLeft: "50px" }}
                >
                  목록으로
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ✅ 첨부파일 다운로드 영역 (이미지가 아닌 파일들만) */}
        {board.fileList &&
          board.fileList.filter((file) => !isImageFile(file.filePath)).length >
            0 && (
            <div
              style={{
                margin: "20px auto",
                width: "80%",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0" }}>📎 첨부파일</h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {board.fileList
                  .filter((file) => !isImageFile(file.filePath)) // 이미지가 아닌 파일들만
                  .map((file, index) => {
                    const fileName = file.originalName;
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          backgroundColor: "white",
                          borderRadius: "3px",
                          border: "1px solid #eee",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: "bold" }}>{fileName}</span>
                          <br />
                          <small style={{ color: "#666" }}>
                            {file.mimeType} • {Math.round(file.fileSize / 1024)}
                            KB
                          </small>
                        </div>
                        <button
                          onClick={() => handleDownload(file.s3Key, fileName)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer",
                          }}
                        >
                          다운로드
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

        {/* 댓글 작성 폼 */}
        <div className={styles.commentInput}>
          <form onSubmit={handlePostComment} method="POST">
            <input
              placeholder="작성자 입력"
              value={commentWriter}
              required
              onChange={(e) => setCommentWriter(e.target.value)}
            />
            <textarea
              placeholder="댓글 입력"
              value={commentContents}
              required
              cols={50}
              rows={8}
              onChange={(e) => setCommentContents(e.target.value)}
            />
            <button type="submit">등록</button>
          </form>
        </div>

        {/* 댓글 목록 */}
        <CommentList postId={id}></CommentList>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          title="삭제 확인"
          contents="삭제"
          whenCancel={() => {
            setConfirmModal(false);
          }}
          whenConfirm={() => {
            handleDelete();
          }}
        ></ConfirmModal>
      )}
    </div>
  );
}

const formatDateWithPadding = (dateString) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;
};
