'use client'
import { useEffect } from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import ConfirmModal from "@/components/ConfirmModal";
import AlertModal from "@/components/AlertModal";

export default function BoardEditPage(){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [board, setBoard] = useState({});
    const [writer, setWriter] = useState('');
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [showConfirmModal, setConfirmModal] = useState(false);
    const [showAlertModal, setAlertModal] = useState(false);
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const handleSubmit = async (e) => {
    e.preventDefault();

    //제목 빈칸 검증
    if (!title.trim()) {
    alert('제목을 입력해주세요!');
    return;
    }
    
    //내용 빈칸 검증
    if (!contents.trim()) {
      alert('내용을 입력해주세요!');
      return;
      }

    try {
      await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, contents }),
      });
      
      // alert("게시글이 성공적으로 수정되었습니다!")
      setAlertModal(true);

      
    } catch (error) {
      console.log(error)
    }
  };

  const handleCancelModal = () => {
      setConfirmModal(false);
    }

  const handleConfirmModal = () => {
      setConfirmModal(false);
      router.push(`/posts/${id}`)
    }
 
  const handleAlertModal = () => {
    setAlertModal(false);
    router.push('/posts');
  }

    //useEffect
      useEffect(() =>{
    
        //데이터 가져오기
        async function fetchBoard() {
          try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/posts/${id}`);
            
            if (!response.ok) {
              throw new Error('사용자 데이터를 가져오는데 실패했습니다');
            }
            
            //데이터 추출
            const data = await response.json();
    
            setBoard(data);
            setWriter(data.writer);
            setTitle(data.title);
            setContents(data.contents);
            setError(null);
    
          } catch (err) {
            setError(err.message);
            setBoard(null);
          } finally {
            setLoading(false);
          }
        }
            
        fetchBoard();
      },[])

    return(
        <div className="create-board-main">
            <h2>게시글 수정</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-area">
                <label htmlFor="input-writer" className="input-label">작성자 : </label>
                <input type="text" id="input-writer" className="input-txt"
                       value={writer}
                       disabled
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
                <button type="submit">수정</button>
                <button type="button" onClick={() => {setConfirmModal(true)}}>취소</button>
                
                {/* ConfirmModal과 AlertModal 요소 */}
                {showConfirmModal && <ConfirmModal
                title="수정 취소"
                contents="수정"
                whenCancel={handleCancelModal}
                whenConfirm={handleConfirmModal}
                ></ConfirmModal>}

                {showAlertModal && <AlertModal
                title="수정 확인"
                contents="수정"
                whenConfirm={handleAlertModal}
                ></AlertModal>}
            </form>
        </div>
    )
}