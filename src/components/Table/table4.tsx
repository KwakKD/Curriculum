import type { ChangeEvent } from 'react';
import { useStatistics } from '../../hooks/useStatistics'
import { useSchoolJsonDataStore } from '../../store/SubjectStore';
import styles from './table.module.css'
import TableColgroup from './tableColgroup'

const CEA_COLUMN = [
    { name: '1-1', grade: 1, semester: 1 },
    { name: '1-2', grade: 1, semester: 2 },
    { name: '2-1', grade: 2, semester: 1 },
    { name: '2-2', grade: 2, semester: 2 },
    { name: '3-1', grade: 3, semester: 1 },
    { name: '3-2', grade: 3, semester: 2 }
]

const DEFAULT_BG = "rgb(205, 222, 255)";
const SUCCESS_BG = "#ffffff";
// const ERROR_BG = "rgba(255, 165, 165, 1)";

export default function Table4() {
    const { statistics_1, statistics_3, allCredit_1, allCredit_3, statistics_subjectNumber } = useStatistics()
    const allCredit = allCredit_1 + allCredit_3;
    const year = useSchoolJsonDataStore().year
    const changeCEA = useSchoolJsonDataStore().changeCEA
    const CEA = useSchoolJsonDataStore.getState().user[year].CEA

    const handelInputCEA = (e: ChangeEvent<HTMLInputElement>) => {
        const keyname = e.target.name
        const num = Number(e.target.value);
        if (Number.isNaN(num)) return
        changeCEA(year, keyname, num)
    }
    const allCEA = () => {
        return Object.values(CEA).reduce((sum, val) => sum + val, 0)
    }
    const getBackgroundColor = (credit: number|string) => {
        if (credit === 0 || credit === '') {
            return DEFAULT_BG
        }
        return SUCCESS_BG
    }
    return (
        <table className={styles.table}>
            <TableColgroup />
            <tbody>
                <tr style={{ fontSize: 11, border: '1px solid #ccc' }}>
                    <td colSpan={5} style={{ backgroundColor: '#f0f0f0' }}>이수 학점 소계</td>
                    <td colSpan={2}></td>
                    <td>{statistics_1['1-1'] + statistics_3['1-1']}</td>
                    <td>{statistics_1['1-2'] + statistics_3['1-2']}</td>
                    <td>{statistics_1['2-1'] + statistics_3['2-1']}</td>
                    <td>{statistics_1['2-2'] + statistics_3['2-2']}</td>
                    <td>{statistics_1['3-1'] + statistics_3['3-1']}</td>
                    <td>{statistics_1['3-2'] + statistics_3['3-2']}</td>
                    <td>{allCredit}</td>
                </tr>
                <tr style={{ fontSize: 11, border: '1px solid #ccc' }}>
                    <td colSpan={5} style={{ backgroundColor: '#f0f0f0' }}>창의적 체험활동</td>
                    <td colSpan={2}></td>
                    {CEA_COLUMN.map((col) => (
                        <td key={col.name}>
                            <input
                                className={styles.table_input}
                                name={col.name}
                                inputMode='numeric'
                                onChange={(e) => handelInputCEA(e)}
                                aria-label={`학년 ${col.grade}, 학기 ${col.semester} 학점 입력`}
                                onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                value={CEA[col.name] === 0 ? '' : CEA[col.name]}
                                style={{ background: (getBackgroundColor(CEA[col.name])) }}
                            />
                        </td>
                    ))}
                    <td>{allCEA()}</td>

                </tr>
                <tr style={{ fontSize: 11, border: '1px solid #ccc' }}>
                    <td colSpan={5} style={{ backgroundColor: '#f0f0f0' }}>학기별 총 이수학점</td>
                    <td colSpan={2}></td>
                    <td>{statistics_1['1-1'] + statistics_3['1-1'] + CEA['1-1']}</td>
                    <td>{statistics_1['1-2'] + statistics_3['1-2'] + CEA['1-2']}</td>
                    <td>{statistics_1['2-1'] + statistics_3['2-1'] + CEA['2-1']}</td>
                    <td>{statistics_1['2-2'] + statistics_3['2-2'] + CEA['2-2']}</td>
                    <td>{statistics_1['3-1'] + statistics_3['3-1'] + CEA['3-1']}</td>
                    <td>{statistics_1['3-2'] + statistics_3['3-2'] + CEA['3-2']}</td>

                    <td>{allCredit_1 + allCredit_3 + allCEA()}</td>
                </tr>
                <tr style={{ fontSize: 11, border: '1px solid #ccc' }}>
                    <td colSpan={5} style={{ backgroundColor: '#f0f0f0' }}>학기당 과목 수</td>
                    <td colSpan={2}></td>
                    <td>{statistics_subjectNumber['1-1']}</td>
                    <td>{statistics_subjectNumber['1-2']}</td>
                    <td>{statistics_subjectNumber['2-1']}</td>
                    <td>{statistics_subjectNumber['2-2']}</td>
                    <td>{statistics_subjectNumber['3-1']}</td>
                    <td>{statistics_subjectNumber['3-2']}</td>
                    <td></td>
                </tr>
                <tr style={{ fontSize: 11, border: '1px solid #ccc' }}>
                    <td colSpan={5} style={{ backgroundColor: '#f0f0f0' }}>학년별 총 이수 학점</td>
                    <td colSpan={2}></td>
                    <td colSpan={2}>{statistics_1['1-1'] + statistics_3['1-1'] + CEA['1-1'] + statistics_1['1-2'] + statistics_3['1-2'] + CEA['1-2']}</td>
                    <td colSpan={2}>{statistics_1['2-1'] + statistics_3['2-1'] + CEA['2-1'] + statistics_1['2-2'] + statistics_3['2-2'] + CEA['2-2']}</td>
                    <td colSpan={2}>{statistics_1['3-1'] + statistics_3['3-1'] + CEA['3-1'] + statistics_1['3-2'] + statistics_3['3-2'] + CEA['3-2']}</td>
                    <td>{allCredit_1 + allCredit_3 + allCEA()}</td>
                </tr>
            </tbody>
        </table>
    )
}