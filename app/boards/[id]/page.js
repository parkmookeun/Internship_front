'use client'
import { useEffect } from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";

export default function PostDetail() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [board, setBoard] = useState({});
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const handleDelete = async () => {
    
    try {
      await fetch(`http://localhost:8080/api/boards/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      alert("게시글이 성공적으로 삭제되었습니다!")
      router.push(`/boards`);
    } catch (error) {
      alert('게시글 삭제 실패');
    }
  };

  console.log(id);
  //useEffect
  useEffect(() =>{

    //데이터 가져오기
    async function fetchBoard() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/boards/${id}`);
        
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
  return (
    <div>
        <table style={{border: '1px solid white', borderCollapse: 'collapse', color: 'white'}}>
            <thead>
                <tr>
                    <th style={{border: '1px solid white', padding: '8px'}} colSpan={3}>게시글 상세</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{border: '1px solid white', padding: '8px'}}>
                    <td>제목</td>
                    <td colSpan={2}>{board.title}</td>
                </tr>
                <tr>
                    <td>작성자</td>
                    <td colSpan={2}>{board.writer}</td>
                </tr>
                <tr>
                    <td>내용</td>
                    <td colSpan={2}>{board.contents}</td>
                </tr>
                <tr>
                    <td><button
                            onClick={() => {
                                router.push(`/boards/${id}/edit`)
                            }}
                    >수정</button></td>
                    <td><button
                            onClick={() => {
                                if(confirm('게시글을 정말로 삭제하시겠습니까?')){
                                    handleDelete();
                                }
                            }}
                    >삭제</button></td>
                    <td><button onClick={() => {
                        router.push('/boards')
                    }}
                    >목록으로</button></td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}