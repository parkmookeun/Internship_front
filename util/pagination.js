'use-client'
//필요한 인수
//마지막 페이지 번호
export default function Pagination({currentPageNumber, lastPageNumber, onPageChange}){

    //선택한 번호의 양쪽에 3칸씩
    //만약 왼쪽으로 3칸 갔는데 숫자가 1보다 크다? ...으로 배치하고 끝
    //마찬가지로 오른쪽도 3칸 갔는데 숫자가 20보다 작다? ...으로 배치하고 끝
    const spreadCount = 3;


    return(
        <div>
            <ul className="pagination-ul">
                <li onClick={() => onPageChange(1)}>1</li>
                {MakePageElement(currentPageNumber-1, 0, spreadCount, lastPageNumber,onPageChange)} 
                {(currentPageNumber !== 1) && (currentPageNumber !== lastPageNumber) ? <li onClick={() => onPageChange(currentPageNumber)}>{currentPageNumber}</li> : ''}
                {MakePageElement(currentPageNumber+1, 1, spreadCount, lastPageNumber,onPageChange)}
                {(lastPageNumber !== 1) && <li onClick={() => onPageChange(lastPageNumber)}>{lastPageNumber}</li>}
            </ul>
        </div>
    )
}

function MakePageElement(start, dir, cnt, limit, onPageChange) {

    const items = []
    
    if(dir == 0){ //왼쪽인 경우

        for (let i = 0; i<cnt; i++) {
            if((start-i) <= 1){
                break;
            }
            // console.log("왼쪽에 " + (start-i) + "추가")
            items.push(<li  key={start-i} onClick={() => onPageChange(start-i)}>{start-i}</li>)
        }
        if((start - cnt) > 1){ items.push(<li>. . .</li>)}
        items.reverse()

    }else if(dir == 1){ //오른쪽인 경우

        for (let i = 0; i<cnt; i++) {
            if((start+i) >= limit){
                break;
            }

            console.log("오른쪽에 " + (start+i) + "추가")
            items.push(<li key={start+i} onClick={() => onPageChange(start+i)}>{start+i}</li>)
        }

        if((start + cnt) < limit){ items.push(<li>. . .</li>)}
    } 
    
    return items
}