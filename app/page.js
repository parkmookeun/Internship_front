import Pagination from "@/util/pagination";

export default function Home(){
  return(
    <div>
      <div className="home-header">
      게시판 프로젝트 v2.0.0 버전입니다!
      </div>
      <div className="home-main">
        <a href="/boards"> &lt; 게시글 목록 바로가기 &gt; </a>
      </div>
    </div>
  )
}