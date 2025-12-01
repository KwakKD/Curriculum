import { useSchoolJsonDataStore } from '../../store/SubjectStore'
import HomeAreaHead from '../HomeAreaHead/homeAreaHead'
import styles from './homeProgressBar.module.css'

export default function HomeProgressBar() {
    const user = useSchoolJsonDataStore().user
    const CEA = (year: string) => {
        const yearuser = user[year].CEA
        return Object.values(yearuser).reduce((sum, val) => sum + val, 0)
    }
    const statistics_1 = (year: string) => {
        const yearUser = user[year];
        const group = yearUser.Group;
        const data = yearUser.학교지정;

        let fixNoGroup = 0;
        let fixIsGroup = 0;
        Object.keys(group).forEach((key) => {
            const g = group[key];
            if (g.Zone === '학교지정') {
                fixIsGroup += g.Credit ?? 0;
            }
        })
        fixNoGroup = data.filter((item) => item.IsGroup === '').reduce((sum, item) => sum + Number(item.Credit), 0);
        return fixNoGroup + fixIsGroup;
    }

    const statistics_2 = (year: string) => {
        const yearUser = user[year]
        const group = yearUser.Group;
        let choiceCredit = 0;
        Object.keys(group).forEach((key) => {
            const g = group[key];
            if (g.Zone === '선택과목') {
                const sumCredit = (g.Credit ?? 0) * (g.Choice ?? 0)
                choiceCredit += sumCredit;
            }
        })
        return choiceCredit;
    }

    const percent = (year: string) => {
        return Math.min(100, Math.round((allCredit(year) / 192) * 100))
    }
    const allCredit = (year: string) => {
        return statistics_1(year) + statistics_2(year) + CEA(year)
    }

    return (
        <>
            <div>
                <div>
                    <HomeAreaHead>📚 교육과정 편성 현황</HomeAreaHead>
                </div>
                <p style={{ marginBottom: 0, marginLeft: 15 }}>🧩 2025학년도 신입생 교육과정</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressBar} style={{ width: `${percent('2025')}%` }} />
                        {/* <span className={styles.progressBarP}>92/192</span> */}
                    </div>
                    <p className={styles.progressBarP}>{allCredit('2025')}/192</p>
                </div>
            </div>
            <div>
                <p style={{ marginBottom: 0, marginLeft: 15 }}>🧩 2026학년도 신입생 교육과정</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressBar} style={{ width: `${percent('2026')}%` }} />
                        {/* <span className={styles.progressBarP}>92/192</span> */}
                    </div>
                    <p className={styles.progressBarP}>{allCredit('2026')}/192</p>
                </div>
            </div>
            <div>
                <p style={{ marginBottom: 0, marginLeft: 15 }}>🧩 2027학년도 신입생 교육과정</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressBar} style={{ width: `${percent('2027')}%` }} />
                        {/* <span className={styles.progressBarP}>92/192</span> */}
                    </div>
                    <p className={styles.progressBarP}>{allCredit('2027')}/192</p>
                </div>
            </div>
        </>
    )
}