import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from './mainLayout.module.css';
import { useAuthStore } from "../../store/authStore";
import { toast } from "../../utils/toast";

export default function MainLayout() {
    const navigate = useNavigate()
    const logout = useAuthStore((state)=>state.logout)
    
    const menu = [
        { icon: '🏠', path: '/Home', tooltip: '홈'},
        { icon: '📚', path: '/Sub', tooltip: '교육과정 편성표 작성' },
        { icon: '🌐', path: '/Union', tooltip: '오프라인 공동교육과정 현황' },
        { icon: '📊', path: '/Statistics', tooltip: '과목별 통계' },
        { icon: '🚀', path: '/Credit', tooltip: '과목별 시수 현황' },
    ];

    const handleLogout = async () => {
        console.log(
            '로그아웃 버튼 클릭'
        )
        await logout()
        toast.success('정상적으로 로그아웃 되었습니다.')
        navigate('/login')
    }

    return (
        <div className={styles.vscode_layout}>
            <aside className={styles.sidebar}>
                <ul>
                    {menu.map(({ icon, path, tooltip }) => (
                        <li key={path} className={styles.tooltipWrapper}>
                            <Link to={path} className={styles.icon}>
                            {icon}
                            <span className={styles.tooltip}>{tooltip}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className={styles.logoutSection}>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        🚪 LogOut
                    </button>
                </div>
            </aside>

            <main className={styles.main_area}>
                <Outlet/>
            </main>
        </div>
    )
}