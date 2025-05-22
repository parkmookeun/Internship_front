'use client'
import { useEffect } from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boards, setBoards] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();

  const handleCreatePost = () => {
    router.push('/boards/new');
  };

  const handlePostDetail = (id) => {
    router.push(`/boards/${id}`)
  }

  //useEffect
  useEffect(() =>{
    //데이터 가져오기
    async function fetchBoards() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/boards?pageNumber=${pageNumber-1}&pageSize=10`);
        
        if (!response.ok) {
          throw new Error('사용자 데이터를 가져오는데 실패했습니다');
        }

        //데이터 추출
        const data = await response.json();

        setBoards(data.content);
        setPageNumber(data.pageNumber+1);
        setTotalAmount(data.totalElements);
        setError(null);

      } catch (err) {
        setError(err.message);
        setBoards(null);
      } finally {
        setLoading(false);
      }
    }
        
    fetchBoards();
  },[pageNumber])

  //출력해보기 -> 
  console.log(boards);
  console.log("페이지 번호: " + pageNumber);
  console.log("전체 요소 개수: " + totalAmount);
  return (
    <div>
    <div className="header">게시글 목록</div>
    <button className="create-btn"
            onClick={handleCreatePost}
    >게시글 생성</button>
    <div className="board-main">
    {
      boards.map((post, index) => {
        return <div className="post-container" key={index}
                    onClick={() => {
                      handlePostDetail(index+1)
                    }} 
          >
          <span className="post-writer">{post.writer}</span> 
          <span className="post-title">{post.title}</span>
          <span className="post-views">조회 수: {post.views}</span>
          </div>
      })
    }
    <div className="page-bar"> 
    {
      createArray(Math.ceil(totalAmount/10)).map((num, index) => {
        return <span className="page-number-txt" 
                     onClick={() => {
                      setPageNumber(index+1)
                     }}
        key={index}>{num}</span>
      })
    }
    </div>
    </div>
    </div>
  )
}

//페이지 바에 들어가는 숫자들의 배열 생성
function createArray(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push(i);
  }
  return result;
}

