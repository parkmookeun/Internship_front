export default function Pagination({currentPageNumber, lastPageNumber, onPageChange}){

    //양쪽으로 뻣어나갈 페이지 수
    const spreadCount = 3;

    return(
        <div>
            <ul className="pagination-ul">
                {MakePageElements(currentPageNumber, spreadCount, lastPageNumber, onPageChange)}
            </ul>
        </div>
    )
}


//페이지바에 들어가는 번호 요소를 만드는 함수
function MakePageElements(currentPage, spreadCount, lastPage, onPageChange) {

    //페이지 요소를 넣을 items 배열 선언 후, 1 페이지 추가
    const items = []
    items.push(<li onClick={() => onPageChange(1)}>1</li>)

    //currentPage에서 왼쪽으로 진행 시, 2보다 크다면 ... 추가
    if(currentPage - spreadCount > 2){
        items.push(<li onClick={scrollToTop}>. . .</li>)
    }

    //중간페이지: startPage ~ endPage까지 진행
    const startPage = currentPage - spreadCount
    const endPage = currentPage + spreadCount


    for(let i = startPage; i <= endPage; i++){
        if(i <= 1) continue;
        if(i >= lastPage) break;
        
        items.push(<li onClick={()=> onPageChange(i)}>{i}</li>)
    }


    //currentPage에서 오른쪽으로 진행 시, 마지막 페이지보다 작다면 ... 추가
    if(currentPage + spreadCount < lastPage){
        items.push(<li onClick={scrollToTop}>. . .</li>)
    }

    //마지막 페이지 추가
    items.push(<li onClick={() => onPageChange(lastPage)}>{lastPage}</li>)

    return items
}


// ... 클릭시 페이지 상단으로 이동
 function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 부드러운 스크롤
    })}