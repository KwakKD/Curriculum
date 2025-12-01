import type { ReactNode } from "react"
import styles from './homeButton.module.css'

type HomeButtonProps = {
    children: ReactNode;
    onClick?: () => void;
}

export default function HomeButton({ children, onClick }: HomeButtonProps) {
    return (
        <button
            onClick={onClick}
            className={styles.button}>
            {children}
        </button>
    )
}