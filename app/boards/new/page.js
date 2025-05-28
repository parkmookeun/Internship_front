'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import AlertModal from "@/components/AlertModal";

export default function NewBoard(){

  const router = useRouter();
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [contents, setContents] = useState('');
  const [showConfirmModal, setConfirmModal] = useState(false);
  const [showAlertModal, setAlertModal] = useState(false);

   const handleCancelModal = () => {
      setConfirmModal(false);
    }

  const handleConfirmModal = () => {
      setConfirmModal(false);
      router.push('/boards')
    }
  
  const handleAlertConfirm = async () => {
  setAlertModal(false);
  
  // 여기서 실제 등록 로직 실행
  try {
    await fetch('http://localhost:8080/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, writer, contents }),
    });
    
    router.push('/boards');
  } catch (error) {
    alert('게시글 등록 실패');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //제목 빈칸 검증
    if (!title.trim()) {
    alert('제목을 입력해주세요!');
    return;
    }
    
    if(!writer.trim()){
      alert('작성자를 입력해주세요!');
      return;
    }

    //내용 빈칸 검증
    if (!contents.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }
    setAlertModal(true);
  };

    return(
        <div className="create-board-main">
            <h2>게시글 등록</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-area">
                <label htmlFor="input-writer" className="input-label">작성자 : </label>
                <input type="text" id="input-writer" className="input-txt"
                       value={writer} required
                       onChange={(e) => setWriter(e.target.value)}
                ></input><br/>
              </div>
              <div className="input-area">
                <label htmlFor="input-title" className="input-label">글 제목 : </label>      
                <input type="text" id="input-title" className="input-txt"
                       value={title} required
                       onChange={(e) => setTitle(e.target.value)}
                ></input><br/>
                </div>
                <div className="input-area">
                <label htmlFor="input-contents" className="input-label">글 내용 : </label><br/>         
                <textarea id="input-contents" className="input-textarea"
                          value={contents} required
                          onChange={(e) => setContents(e.target.value)}
                          cols={50} rows={10} 
                ></textarea><br/>
                </div>
                <div className="create-btn-style">
                <button type="button" onClick={() => setAlertModal(true)}>등록</button>
                <button type="button" onClick={() => setConfirmModal(true)}>취소</button>
                </div>

                {/* 등록 버튼 하고 취소 버튼 */}
                {showAlertModal && <AlertModal
                                title="등록 확인"
                                contents="등록"
                                whenConfirm={handleAlertConfirm}
                                ></AlertModal>}
                {showConfirmModal && <ConfirmModal
                                title="등록 취소"
                                contents="등록"
                                whenCancel={handleCancelModal}
                                whenConfirm={handleConfirmModal}
                                ></ConfirmModal>}
            </form>
        </div>
    )
}