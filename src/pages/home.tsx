import HomeAreaHead from '../components/HomeAreaHead/homeAreaHead'
import HomeButton from '../components/HomeButton/homeButton'
import HomeProgressBar from '../components/ProgressBar/homeProgressBar'
import { useAuthStore } from '../store/authStore'
import styles from './home.module.css'

export default function Home() {
    const user = useAuthStore((state) => state.user)
    return (
        <>
            <div>
                <div style={{ background: '#Ffffff', display: 'flex', height: 86 }}>
                    <h1 className={styles.logo}>Connecting Space</h1>
                    <div style={{ display: 'flex', flex: 1, gap: 20, alignItems: 'end', background: '#968bd9ff' }}>
                        <p className={styles.schoolname}>{user?.schoolname}</p>
                        <p className={styles.welcome}>{user?.name}님 환영합니다.</p>
                    </div>
                </div>
            </div>
            <div className={styles.headerArea}>
                <HomeButton>교육과정 편성표 작성</HomeButton>
                <HomeButton>오프라인 공동 교육과정</HomeButton>
                <HomeButton>과목별 통계</HomeButton>
                <HomeButton>과목별 시수 점검</HomeButton>
                <button onClick={()=>console.log(user)}>test</button>
            </div>
            <div style={{ height: '40vh', background: '#ffffffff', display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ padding: 8 }}>
                    <div className={styles.imageArea}>
                        <h1>그림</h1>
                    </div>
                </div>
                <div style={{ padding: 8 }}>
                    <div className={styles.yearsCurr}>
                        <HomeProgressBar />
                    </div>
                </div>
            </div>
            <div style={{ height: '40vh', background: '#ffffffff', display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ padding: 10 }}>
                    <div className={styles.unionArea}>
                        <HomeAreaHead>🌐 오프라인 공동교육과정 현황</HomeAreaHead>
                    </div>
                </div>
                <div style={{ padding: 10 }}>
                    <div className={styles.unionArea}>
                        <HomeAreaHead>📊 과목별 통계</HomeAreaHead>
                    </div>
                </div>
                <div style={{ padding: 10 }}>
                    <div className={styles.unionArea}>
                        <HomeAreaHead>🚀 과목별 시수 현황</HomeAreaHead>
                    </div>
                </div>
            </div>

        </>



    )
}