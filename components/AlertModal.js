'use client'
import styles from './AlertModal.module.css'


export default function AlertModal({title='alert 모달', contents='alert 컨텐츠', whenConfirm}){
    return(
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <h2>{title}</h2>
                <p>
                    게시글이 <span>{contents}</span>되었습니다.
                </p>
                <button onClick={whenConfirm}>확인</button> 
            </div>
        </div>
    )
}