import React, { useCallback, type ChangeEvent } from "react";
import { useSchoolJsonDataStore } from "../../store/SubjectStore";
import { SUBJECT } from "../../data/subjectdata";
import styles from './table.module.css'
import type { JsonData } from "../../types/schoolJsontype";
import { toast } from "../../utils/toast";
import { set_sort } from "../../utils/afterdrop";

const COLUMN = [
    { name: "col1", grade: 1, semester: 1, idx: 0 },
    { name: "col2", grade: 1, semester: 2, idx: 1 },
    { name: "col3", grade: 2, semester: 1, idx: 2 },
    { name: "col4", grade: 2, semester: 2, idx: 3 },
    { name: "col5", grade: 3, semester: 1, idx: 4 },
    { name: "col6", grade: 3, semester: 2, idx: 5 },
] as const

const DEFAULT_BG = "rgb(205, 222, 255)";
const SUCCESS_BG = "#ffffff";

const Table5Cell = React.memo(() => {
    const year = useSchoolJsonDataStore().year
    const table5Data = useSchoolJsonDataStore((s) => s.user[year].추가교육과정);
    const unionSubject = [...SUBJECT, ...useSchoolJsonDataStore.getState().user[year].AddSubject]
    const inputTable5 = useSchoolJsonDataStore().inputTable5
    const addTable5 = useSchoolJsonDataStore().addTable5
    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, sub: JsonData, grade: number, sem: number) => {
            const inputSubject = unionSubject.find((s) => s.Tag === sub.Tag);
            if (!inputSubject) return;

            const min = inputSubject.최소학점 ?? 1;
            const max = inputSubject.최대학점 ?? 20;
            const num = Number(e.target.value);
            if (Number.isNaN(num)) return;

            if (num < min || num > max) {
                toast.error(`학점은 최소 ${min}에서 ${max} 사이여야 합니다.`);
                return;
            }

            inputTable5(year, inputSubject.Tag, { Credit: num, Grade: grade, Semester: sem });
        },
        [unionSubject, inputTable5]
    )
    const getBackgroundColor = useCallback((item: JsonData, col: (typeof COLUMN)[number]) => {
        return col.grade === item.Grade && col.semester === item.Semester ? SUCCESS_BG : DEFAULT_BG;
    }, [])

    const handleDelete = useCallback(
        (item: JsonData) => {
            addTable5(year, set_sort(table5Data.filter(sub => sub.Tag !== item.Tag)))
            toast.success(`"${item.SubjectName}"과목이 삭제되었습니다.`)
        },
        [table5Data]
    )
    return (
        <tbody>
            {table5Data.map((item) => (
                <tr key={item.Tag} style={{ border: '1px solid #ddd' }}>
                    <td>{item.Section}</td>
                    <td>{item.IsGroup}</td>
                    <td>{item.SubjectGroup}</td>
                    <td>{item.SubjectProperty}</td>
                    <td>{item.SubjectName}</td>
                    <td>{item.BasicCredit}</td>
                    <td>{item.Credit}</td>
                    {COLUMN.map((col) => (
                        <td key={col.name}>
                            <input
                                className={styles.table_input}
                                name={col.name}
                                inputMode="numeric"
                                style={{ background: getBackgroundColor(item, col) }}
                                value={col.grade === item.Grade && col.semester === item.Semester ? String(item.Credit) : ""}
                                aria-label={`학년 ${col.grade}, 학기 ${col.semester} 학점 입력`}
                                onChange={(e) => handleInputChange(e, item, col.grade, col.semester)}
                            />
                        </td>
                    ))}
                    <td>
                        <button onClick={() => handleDelete(item)} className={styles.deletebtn}>
                            ❌
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    )
})

export default Table5Cell
