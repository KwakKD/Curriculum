import type { ReactNode } from "react"
import styles from './panel.module.css';

type panelProps = {
    children?: ReactNode;
    size?: "small" | "medium" | "large" | "left";
    scroll?: boolean;
}

export default function Panel({children, size = "medium", scroll = false }:panelProps) {
    return (
        <div className={`${styles.panel} ${styles[size]} ${scroll ? styles.scroll : ""}`}>{children}</div>
    )
}