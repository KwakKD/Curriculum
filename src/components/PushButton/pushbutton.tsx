import type { ReactNode } from 'react';
import styles from './pushbutton.module.css';

type PushButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger" | "excel";
}

export default function PushButton({ children, onClick, type = 'button', variant = 'primary' }: PushButtonProps) {
    return (
        <button className={`${styles.button} ${styles[variant]}`} type={type} onClick={onClick}>
            {children}
        </button>
    )
}