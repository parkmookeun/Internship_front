'use client'
import styles from './ConfirmModal.module.css'


export default function ConfirmModal({title='confirm 모달', contents='confirm 컨텐츠', whenConfirm, whenCancel}){
    return(
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <h2>{title}</h2>
                <p>
                    <span>{contents}</span>하시겠습니까?
                </p>
                <button onClick={whenConfirm}>확인</button> 
                <button onClick={whenCancel}>취소</button>
            </div>
        </div>
    )
}

// 확인 버튼을 목록으로, 취소 버튼을 누르면 그냥 모달 창만 없어짐