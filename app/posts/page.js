'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { fetchBoards } from '@/util/boardApi';
import Pagination from '@/util/pagination'

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boards, setBoards] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
    
  const handleCreatePost = () => {
    router.push('/posts/new');
  };

  const handlePostDetail = (id) => {
    router.push(`/posts/${id}`)
  }

  useEffect(() => {
    async function loadBoards() {
      try {
        setLoading(true);
        const data = await fetchBoards(pageNumber); // API 함수 사용
        
        setBoards(data.content);
        setTotalAmount(data.totalElements);
        setError(null);

      } catch (err) {
        setError(err.message);
        setBoards([]);
      } finally {
        setLoading(false);
      }
    }
        
    loadBoards();
  }, [pageNumber]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <div className="header">게시글 목록</div>
      <button className="create-btn" onClick={handleCreatePost}>
        게시글 생성
      </button>
      <div className="board-main">
        {boards.map((post) => {
          return (
            <div className="post-container" key={post.id}
                 onClick={() => {handlePostDetail(post.id)}}>
              <span className="post-writer">{post.writer}</span> 
              <span className="post-title">{post.title}</span>
              <span className="post-views">조회 수: {post.views}</span>
            </div>
          )
        })}
        
        <Pagination 
          currentPageNumber={pageNumber} 
          lastPageNumber={Math.ceil(totalAmount/10)}
          onPageChange={(newPage) => { setPageNumber(newPage)}} 
        />
      </div>
    </div>
  )
}