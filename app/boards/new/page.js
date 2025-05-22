'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBoard(){

  const router = useRouter();
  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('');
  const [contents, setContents] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await fetch('http://localhost:8080/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, writer, contents }),
      });
      
      alert("게시글이 성공적으로 등록되었습니다!")
      router.push('/boards');
    } catch (error) {
      alert('게시글 등록 실패');
    }
  };

    return(
        <div className="create-board-main">
            <h2>게시글 등록</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-area">
                <label htmlFor="input-writer" className="input-label">작성자 : </label>
                <input type="text" id="input-writer" className="input-txt"
                       value={writer}
                       onChange={(e) => setWriter(e.target.value)}
                ></input><br/>
              </div>
              <div className="input-area">
                <label htmlFor="input-title" className="input-label">글 제목 : </label>      
                <input type="text" id="input-title" className="input-txt"
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                ></input><br/>
                </div>
                <div className="input-area">
                <label htmlFor="input-contents" className="input-label">글 내용 : </label><br/>         
                <textarea id="input-contents" className="input-textarea"
                          value={contents}
                          onChange={(e) => setContents(e.target.value)}
                          cols={50} rows={10} 
                ></textarea><br/>
                </div>
                <button type="submit">등록</button>
                <button type="button" onClick={() => router.push('/boards')}>취소</button>
            </form>
        </div>
    )
}