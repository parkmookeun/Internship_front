"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import AlertModal from "@/components/AlertModal";

export default function NewBoard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
  const [contents, setContents] = useState("");
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [showAlertModal, setAlertModal] = useState(false);
  //파일 상태 관리
  const [selectedFiles, setSelectedFiles] = useState([]);

  //파일 선택 핸들러
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  //파일 제거 핸들러
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleCancelModal = () => {
    setConfirmModal(false);
  };

  const handleConfirmModal = () => {
    setConfirmModal(false);
    router.push("/posts");
  };

  const handleAlertConfirm = async () => {
    setAlertModal(false);

    // 여기서 실제 등록 로직 실행
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("writer", writer);
      formData.append("contents", contents);

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: getFormDataHeaders(),
        body: formData,
      });

      router.push("/posts");
    } catch (error) {
      console.log(error);
      alert("게시글 등록 실패");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //제목 빈칸 검증
    if (!title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }

    if (!writer.trim()) {
      alert("작성자를 입력해주세요!");
      return;
    }

    //내용 빈칸 검증
    if (!contents.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }
    setAlertModal(true);
  };

  return (
    <div className="create-board-main">
      <h2>게시글 등록</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-area">
          <label htmlFor="input-writer" className="input-label">
            작성자 :{" "}
          </label>
          <input
            type="text"
            id="input-writer"
            className="input-txt"
            value={writer}
            required
            onChange={(e) => setWriter(e.target.value)}
          ></input>
          <br />
        </div>
        <div className="input-area">
          <label htmlFor="input-title" className="input-label">
            글 제목 :{" "}
          </label>
          <input
            type="text"
            id="input-title"
            className="input-txt"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <br />
        </div>
        <div className="input-area">
          <label htmlFor="input-contents" className="input-label">
            글 내용 :{" "}
          </label>
          <br />
          <textarea
            id="input-contents"
            className="input-textarea"
            value={contents}
            required
            onChange={(e) => setContents(e.target.value)}
            cols={50}
            rows={10}
          ></textarea>
          <br />
        </div>

        <div className="input-area">
          <label htmlFor="input-files" className="input-label">
            파일 첨부:{" "}
          </label>
          <br />
          <input
            type="file"
            id="input-files"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <br />

          {selectedFiles.length > 0 && (
            <div className="selected-files" style={{ marginTop: "10px" }}>
              <p>선택된 파일:</p>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <span>
                      {file.name} ({(file.size / 1024).toFixed(1)}KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      style={{
                        marginLeft: "10px",
                        padding: "2px 6px",
                        fontSize: "12px",
                      }}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="create-btn-style">
          <button type="button" onClick={() => setAlertModal(true)}>
            등록
          </button>
          <button type="button" onClick={() => setConfirmModal(true)}>
            취소
          </button>
        </div>

        {showAlertModal && (
          <AlertModal
            title="등록 확인"
            contents="등록"
            whenConfirm={handleAlertConfirm}
          ></AlertModal>
        )}
        {showConfirmModal && (
          <ConfirmModal
            title="등록 취소"
            contents="등록"
            whenCancel={handleCancelModal}
            whenConfirm={handleConfirmModal}
          ></ConfirmModal>
        )}
      </form>
    </div>
  );
}

function getFormDataHeaders() {
  const headers = {};

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers; // Content-Type 없음 (브라우저가 자동 설정)
}
