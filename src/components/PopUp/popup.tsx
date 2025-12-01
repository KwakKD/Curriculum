import type { ReactNode } from "react";
import styles from './popup.module.css'

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

export default function PopUp({isOpen, onClose, children}:PopupProps) {
    if (!isOpen) {
        return null
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popupContainer} onClick={(e)=>e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}