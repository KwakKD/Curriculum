import { useAuthStore } from '../../store/authStore';
import styles from './header.module.css';

type HeaderProps = {
    title: string;
}

export default function Header({title} : HeaderProps) {
    const user = useAuthStore((state)=>state.user)
    return (
        <header className={styles.main_header}>
            <h6 style={{marginTop:0, marginBottom:0,}}>{user?.schoolname}</h6>
            <h1>{title}</h1>
        </header>
    )
}