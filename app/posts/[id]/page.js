'use client'
import { useEffect } from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { useComments } from "@/hooks/useComments";
import ConfirmModal from "@/components/ConfirmModal";
import CommentList from "@/components/CommentList";


export default function PostDetail() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [board, setBoard] = useState({});
  const [commentWriter, setCommentWriter] = useState('');
  const [commentContents, setCommentContents] = useState('');
  const [showConfirmModal, setConfirmModal] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // ✅ 추가: 파일 다운로드 함수
  const handleDownload = (fileUrl, fileName) => {
  // 새 탭에서 파일 열기 (브라우저가 다운로드 처리)
  window.open(fileUrl, '_blank');
  };
 
  // ✅ 추가: 이미지 파일인지 확인하는 함수
  const isImageFile = (filePath) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  };

  const handleDelete = async () => {
    
    try {
      await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      // alert("게시글이 성공적으로 삭제되었습니다!")
      router.push(`/posts`);
    } catch (error) {
      alert('게시글 삭제 실패');
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    // 여기서 실제 등록 로직 실행
  try {
    await fetch(`http://localhost:8080/api/posts/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writer: commentWriter, contents: commentContents }),
    });
    
    window.location.reload();
  } catch (error) {
      console.log("댓글 등록 실패")
    }
  }

  console.log(id);
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

  //출력해보기 -> 
  console.log(board);
  console.log('commentList:', board.commentList)
  console.log('isArray:', Array.isArray(board.commentList))
  return (
    <div>
        <div className="board-detail-container">
        <table style={{border: '1px solid black', borderCollapse: 'collapse', margin: 'auto', width: '80%', height: '90%'}}>
            <thead>
                <tr>
                    <th style={{border: '1px solid black', padding: '8px'}} colSpan={3}>게시글 상세</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{border: '1px solid black'}}>
                    <td style={{padding: '8px'}}>제목:</td>
                    <td colSpan={2}>{board.title}</td>
                </tr>
                <tr style={{border: '1px solid black', padding: '8px'}}>
                    <td style={{padding: '8px'}}>날짜:</td>
                    <td colSpan={2}>{formatDateWithPadding(board.modifiedAt)}</td>
                </tr>
                <tr style={{border: '1px solid black', padding: '8px'}}>
                    <td style={{padding: '8px'}}>작성자:</td>
                    <td colSpan={2}>{board.writer}</td>
                </tr>
                <tr style={{border: '1px solid black', padding: '8px'}}>
                    <td style={{padding: '8px'}}>내용:</td>
                    <td colSpan={2}>{board.contents}</td>
                </tr>
                
                <tr style={{textAlign: 'center', padding: 'none'}}>
                    <td colSpan={3}><button
                            onClick={() => {
                                router.push(`/posts/${id}/edit`)
                            }}
                            style={{margin: '5px'}}
                    >수정</button>
                    <button onClick={() => {setConfirmModal(true)}}>삭제</button>
                    <button onClick={() => {router.push('/posts')}}
                    style={{marginLeft: '50px'}}
                    >목록으로</button></td>
                </tr>
            </tbody>
        </table>
         {/* ✅ 추가: 게시글 내용 아래에 이미지 표시 영역 */}
        {board.fileList && board.fileList.length > 0 && (
          <div style={{
            margin: '20px auto', 
            width: '80%', 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '5px', 
            backgroundColor: '#f9f9f9'
          }}>
            <h4 style={{margin: '0 0 15px 0'}}>📷 첨부 이미지</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              {board.fileList
                .filter(file => isImageFile(file.filePath)) // 이미지 파일만 필터링
                .map((file, index) => (
                  <div key={index} style={{textAlign: 'center'}}>
                    <img 
                      src={file.filePath} 
                      alt={file.originalName}
                      style={{
                        maxWidth: '100%', 
                        maxHeight: '500px', 
                        height: 'auto',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.error('이미지 로드 실패:', file.filePath);
                      }}
                    />
                    <p style={{
                      margin: '8px 0 0 0', 
                      fontSize: '14px', 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      {file.originalName}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}                      
        {/*별도 첨부파일 영역 (테이블 외부에 표시하고 싶을 경우) */}
        {board.fileList && board.fileList.length > 0 && (
          <div style={{
            margin: '20px auto', 
            width: '80%', 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '5px', 
            backgroundColor: '#f9f9f9'
          }}>
            <h4 style={{margin: '0 0 10px 0'}}>📎 첨부파일</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              {board.fileList.map((file, index) => {
                const fileName = file.originalName
                return (
                  <div 
                    key={index} 
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '8px 12px', 
                      backgroundColor: 'white', 
                      borderRadius: '3px',
                      border: '1px solid #eee'
                    }}
                  >
                    <span>{fileName}</span>
                    <button 
                      onClick={() => handleDownload(file.filePath, fileName)}
                      style={{
                        padding: '6px 12px', 
                        fontSize: '12px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        cursor: 'pointer'
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
        {/* 여기에다가 댓글 목록 표시 */}
        <CommentList postId={id}></CommentList>
       {/* {board?.commentList?.map((comment, index) => (
              <div key={index}>
                <hr/>
                <p>{comment.writer}</p>
                <p>{comment.contents}</p>
              </div>
            ))} */}
        <div>
          <form onSubmit={handlePostComment} method="POST"> 
            <input placeholder="작성자 입력"
                   value={commentWriter} required
                   onChange={(e) => setCommentWriter(e.target.value)} />
            <input placeholder="댓글 입력"
                   value={commentContents} required
                   onChange={(e) => setCommentContents(e.target.value)} />
            <button type="submit">등록</button>
          </form>
        </div>
        </div>
        {showConfirmModal && <ConfirmModal
          title="삭제 확인"
          contents="삭제"
          whenCancel={() => {setConfirmModal(false)}}
          whenConfirm={() => {handleDelete()}}
        ></ConfirmModal>}
    </div>
  )
}

const formatDateWithPadding = (dateString) => {
  const date = new Date(dateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;
};

