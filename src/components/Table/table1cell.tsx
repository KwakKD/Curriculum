// import React, { type ChangeEvent } from "react";
// import { useSchoolJsonDataStore } from "../../store/SubjectStore";
// import styles from './table.module.css';
// import { SUBJECT } from "../../data/subjectdata";
// import type { GroupCell, JsonData } from "../../types/schoolJsontype";
// import { toast } from "../../utils/toast";
// import { useStatistics } from "../../hooks/useStatistics";
// import { set_sort1 } from "../../utils/afterdrop";

// const COLUMN = [
//     { name: "col1", grade: 1, semester: 1, idx: 0 },
//     { name: "col2", grade: 1, semester: 2, idx: 1 },
//     { name: "col3", grade: 2, semester: 1, idx: 2 },
//     { name: "col4", grade: 2, semester: 2, idx: 3 },
//     { name: "col5", grade: 3, semester: 1, idx: 4 },
//     { name: "col6", grade: 3, semester: 2, idx: 5 },
// ] as const

// const DEFAULT_BG = "rgb(205, 222, 255)";
// const SUCCESS_BG = "#ffffff";
// const ERROR_BG = "rgba(255, 165, 165, 1)";

// const Table1Cell = React.memo(() => {
//     const table1Data = set_sort1(useSchoolJsonDataStore((s) => s.user.학교지정));

//     const unionSubject = [...SUBJECT, ...useSchoolJsonDataStore.getState().user.AddSubject]
//     const inputhandle = useSchoolJsonDataStore().inputTable1
//     const deletehandle = useSchoolJsonDataStore().deleteTable1
//     const deleteGrouphandle = useSchoolJsonDataStore().groupUpdate
//     const groupInfo = useSchoolJsonDataStore.getState().user.Group
//     const { statistics_1, allCredit_1 } = useStatistics()

//     const handleInputChange = (e: ChangeEvent<HTMLInputElement>, sub: JsonData, grade: number, sem: number) => {
//         const inputSubject = unionSubject.filter(s => s.Tag === sub.Tag)[0];
//         const min = inputSubject.최소학점 ?? 1
//         const max = inputSubject.최대학점 ?? 20
//         const num = Number(e.target.value);
//         if (Number.isNaN(num)) return
//         if (num < min || num > max) {
//             toast.error(`학점은 최소 ${min}에서 ${max} 사이여야 합니다.`)
//             return
//         }

//         inputhandle(inputSubject.Tag, { 'Credit': num, 'Grade': grade, 'Semester': sem })
//     }
//     console.log('Table1 렌더링!')
//     const getBackgroundColor = (item: JsonData, col: typeof COLUMN[number]) => {
//         // 해당 학년·학기와 매칭되지 않는 칸은 기본 배경
//         if (col.grade !== item.Grade || col.semester !== item.Semester) {
//             return DEFAULT_BG;
//         }
//         return SUCCESS_BG;
//     };

//     const renderGroup = (item: JsonData) => {
//         const group = groupInfo[item.IsGroup];
//         if (!group) return null;

//         const spanNumber = group.Subject.length;
//         const insertText = `[택${group.Choice}]\n${(group.Credit ?? 0) * (group.Choice ?? 0)}`

//         if (spanNumber === 1) {
//             return (
//                 item.Grade === 1 ? (
//                     <>
//                         <td>{insertText}</td>
//                         <td>{insertText}</td>
//                         <td></td><td></td><td></td><td></td>
//                     </>
//                 ) : item.Grade === 2 ? (
//                     <>
//                         <td></td><td></td>
//                         <td>{insertText}</td>
//                         <td>{insertText}</td>
//                         <td></td><td></td>
//                     </>
//                 ) : (
//                     <>
//                         <td></td><td></td><td></td><td></td>
//                         <td>{insertText}</td>
//                         <td>{insertText}</td>
//                     </>
//                 )
//             )
//         } else {
//             return (
//                 item.Grade === 1 ? (
//                     group.Subject[0] === item.Tag ? (
//                         <>
//                             <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
//                             <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
//                             <td rowSpan={spanNumber} ></td>
//                             <td rowSpan={spanNumber} ></td>
//                             <td rowSpan={spanNumber} ></td>
//                             <td rowSpan={spanNumber} ></td>
//                         </>
//                     ) : (
//                         <>

//                         </>
//                     )
//                 ) : (item.Grade === 2) ? (
//                     group.Subject[0] === item.Tag ? (
//                         <>
//                             <td rowSpan={spanNumber}></td>
//                             <td rowSpan={spanNumber}></td>
//                             <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
//                             <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
//                             <td rowSpan={spanNumber}></td>
//                             <td rowSpan={spanNumber}></td>
//                         </>
//                     ) : (
//                         <>
//                         </>
//                     )
//                 ) : (
//                     group.Subject[0] === item.Tag ? (
//                         <>
//                             <td rowSpan={spanNumber}></td>
//                             <td rowSpan={spanNumber}></td>
//                             <td rowSpan={spanNumber} ></td>
//                             <td rowSpan={spanNumber} ></td>
//                             <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
//                             <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
//                         </>
//                     ) : (
//                         <>
//                         </>
//                     )
//                 )
//             )

//         }
//     };

//     const handleDelete = (item: JsonData) => {
//         console.log(item.Tag, item.IsGroup)
//         if (item.IsGroup === '') {
//             deletehandle(item.Tag);
//         } else {
//             const handleGroupInfo = groupInfo[item.IsGroup]
//             if (handleGroupInfo.Subject.length === 1) {
//                 const resetGroupCell: GroupCell = {
//                     Zone: null,
//                     Subject: [],
//                     Grouptag: null,
//                     Credit: null,
//                     Grade: null,
//                     Semester: null,
//                     Choice: null
//                 }
//                 deleteGrouphandle(item.IsGroup, resetGroupCell);
//                 deletehandle(item.Tag)

//             } else {
//                 const newSubject = handleGroupInfo.Subject.filter(sub => sub !== item.Tag)
//                 newSubject.sort((a, b) => a - b)
//                 const newGroupCell: GroupCell = {
//                     Zone: handleGroupInfo.Zone,
//                     Subject: newSubject,
//                     Grouptag: newSubject[0],
//                     Credit: handleGroupInfo.Credit,
//                     Grade: handleGroupInfo.Grade,
//                     Semester: handleGroupInfo.Semester,
//                     Choice: handleGroupInfo.Choice
//                 }
//                 deleteGrouphandle(item.IsGroup, newGroupCell)
//                 deletehandle(item.Tag)
//             }
//         }
//     }

//     return (
//         <tbody>
//             {table1Data.map((item) => (
//                 <tr key={item.Tag} style={{ border: '1px solid #ddd' }}>
//                     <td>{item.Section}</td>
//                     {item.IsGroup === '' ? (
//                         <td>{item.IsGroup}</td>
//                     ) : (
//                         groupInfo[item.IsGroup].Subject.length < 2 ? (
//                             <td style={{ background: ERROR_BG }}>{item.IsGroup}</td>
//                         ) : (
//                             <td>{item.IsGroup}</td>
//                         )
//                     )}
//                     <td>{item.SubjectGroup}</td>
//                     <td>{item.SubjectProperty}</td>
//                     <td>{item.SubjectName}</td>
//                     <td>{item.BasicCredit}</td>
//                     <td>{item.Credit}</td>
//                     <>
//                         {item.IsGroup === '' ? (
//                             COLUMN.map((col) => (
//                                 <td key={col.name} style={{ padding: col.idx === 0 ? 0 : undefined }}>
//                                     <input
//                                         className={styles.table_input}
//                                         name={col.name}
//                                         inputMode="numeric"
//                                         style={{ background: (getBackgroundColor(item, col)) }}
//                                         value={(col.grade === item.Grade && col.semester === item.Semester ? String(item.Credit) : "")}
//                                         // 학기에 맞춰서 입력해야함.
//                                         aria-label={`학년 ${col.grade}, 학기 ${col.semester} 학점 입력`}
//                                         onChange={(e) => handleInputChange(e, item, col.grade, col.semester)}
//                                     />
//                                 </td>
//                             ))
//                         ) : (
//                             renderGroup(item)
//                         )}
//                         <td>
//                             <button
//                                 onClick={() => handleDelete(item)}
//                                 className={styles.deletebtn}>❌</button>
//                         </td>
//                     </>
//                 </tr>
//             ))}
//             {/* 통계자료 나타내는 곳 */}
//             <tr style={{ fontSize: 11, border: '1px solid #ccc' }}>
//                 <td colSpan={5} style={{ backgroundColor: '#f0f0f0' }}>학교지정 소계</td>
//                 <td></td><td></td>
//                 <td>{statistics_1['1-1']}</td>
//                 <td>{statistics_1['1-2']}</td>
//                 <td>{statistics_1['2-1']}</td>
//                 <td>{statistics_1['2-2']}</td>
//                 <td>{statistics_1['3-1']}</td>
//                 <td>{statistics_1['3-2']}</td>
//                 <td>{allCredit_1}</td>
//             </tr>
//         </tbody>
//     );
// })

// export default Table1Cell

import React, { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { useSchoolJsonDataStore } from "../../store/SubjectStore";
import styles from "./table.module.css";
import { SUBJECT } from "../../data/subjectdata";
import { toast } from "../../utils/toast";
import { useStatistics } from "../../hooks/useStatistics";
import { set_sort1 } from "../../utils/afterdrop";
import type { GroupCell, JsonData } from "../../types/schoolJsontype";

const COLUMN = [
    { name: "col1", grade: 1, semester: 1, idx: 0 },
    { name: "col2", grade: 1, semester: 2, idx: 1 },
    { name: "col3", grade: 2, semester: 1, idx: 2 },
    { name: "col4", grade: 2, semester: 2, idx: 3 },
    { name: "col5", grade: 3, semester: 1, idx: 4 },
    { name: "col6", grade: 3, semester: 2, idx: 5 },
] as const;

const DEFAULT_BG = "rgb(205, 222, 255)";
const SUCCESS_BG = "#ffffff";
const ERROR_BG = "rgba(255, 165, 165, 1)";

const Table1Cell = React.memo(() => {
    /** ----------------------------
     *  Zustand store 데이터 최소화 접근
     * ---------------------------- */
    const year = useSchoolJsonDataStore().year
    const {
        // user: { 학교지정, AddSubject, Group },
        user,
        addTable1,
        inputTable1,
        groupUpdate,
    } = useSchoolJsonDataStore();
    const yearUser = user[year]
    const AddSubject = yearUser.AddSubject
    const Group = yearUser.Group

    const table1Data = useMemo(() => set_sort1(yearUser.학교지정), [yearUser.학교지정]);
    // const table1Data = set_sort1(학교지정);
    const unionSubject = useMemo(() => [...SUBJECT, ...AddSubject], [AddSubject]);
    const { statistics_1, allCredit_1 } = useStatistics();
    const [tempValue, setTempValue] = useState<boolean>(true);
    const [inputValue, setInputValue] = useState<number>(0)

    /** ----------------------------
     *  학점 입력 핸들러
     * ---------------------------- */
    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, sub: JsonData, grade: number, sem: number) => {
            setTempValue(true)
            setInputValue(0)
            const inputSubject = unionSubject.find((s) => s.Tag === sub.Tag);
            if (!inputSubject) return;

            const min = inputSubject.최소학점 ?? 1;
            const max = inputSubject.최대학점 ?? 20;
            const basic = inputSubject.기준학점 ?? 1;
            const num = Number(e.target.value);

            console.log(inputValue)
            if (Number.isNaN(num)) return;

            if (min >= 10 || max >= 10 || basic >= 10) {
                setInputValue(num)
                if (num < min || num > max) {
                    toast.error(`학점은 최소 ${min}에서 ${max} 사이여야 합니다.`)
                    setTempValue(false)
                } else {
                    inputTable1(year, inputSubject.Tag, { Credit: num, Grade: grade, Semester: sem });
                    setTempValue(true)
                }
            } else {
                if (num < min || num > max) {
                    toast.error(`학점은 최소 ${min}에서 ${max} 사이여야 합니다.`);
                    return;
                } else {
                    inputTable1(year, inputSubject.Tag, { Credit: num, Grade: grade, Semester: sem });
                    setTempValue(true)
                }
            }
        },
        [unionSubject, inputTable1, inputValue]
    );

    /** ----------------------------
     *  배경색 처리
     * ---------------------------- */
    const getBackgroundColor = useCallback((item: JsonData, col: (typeof COLUMN)[number]) => {
        const inputSubject = unionSubject.find((s) => s.Tag === item.Tag);
        if (!inputSubject) return;
        const min = inputSubject.최소학점 ?? 1;
        const max = inputSubject.최대학점 ?? 20;
        const basic = inputSubject.기준학점 ?? 1;
        if (col.grade === item.Grade && col.semester === item.Semester) {
            return SUCCESS_BG
        } else if (min >= 10 || max >= 10 || basic >= 10) {
            if (inputValue !== 0) {
                if (min > inputValue || max < inputValue || !tempValue) {
                    return ERROR_BG
                } else {
                    return DEFAULT_BG
                }
            } else {
                return DEFAULT_BG
            }

        } else {
            return DEFAULT_BG
        }
    }, [inputValue, tempValue]);

    /** ----------------------------
     *  그룹 렌더링 처리
     * ---------------------------- */
    const renderGroup = useCallback(
        (item: JsonData) => {
            const group = Group[item.IsGroup];
            if (!group) return null;

            const spanNumber = group.Subject.length;
            const insertText = `[택${group.Choice}]\n${(group.Credit ?? 0) * (group.Choice ?? 0)}`;
            const isFirst = group.Subject[0] === item.Tag;

            if (!isFirst) return null;

            const td = (_idx: number, content?: string) => (
                <td rowSpan={spanNumber} style={{ whiteSpace: "pre" }}>
                    {content ?? ""}
                </td>
            );

            switch (item.Grade) {
                case 1:
                    return (
                        <>
                            {td(0, insertText)}
                            {td(1, insertText)}
                            {td(2)}
                            {td(3)}
                            {td(4)}
                            {td(5)}
                        </>
                    );
                case 2:
                    return (
                        <>
                            {td(0)}
                            {td(1)}
                            {td(2, insertText)}
                            {td(3, insertText)}
                            {td(4)}
                            {td(5)}
                        </>
                    );
                default:
                    return (
                        <>
                            {td(0)}
                            {td(1)}
                            {td(2)}
                            {td(3)}
                            {td(4, insertText)}
                            {td(5, insertText)}
                        </>
                    );
            }
        },
        [Group]
    );
    /** ----------------------------
     *  valiu 값 처리
     * ---------------------------- */
    const handleValue = (item: JsonData, col: (typeof COLUMN)[number]) => {
        const inputSubject = unionSubject.find((s) => s.Tag === item.Tag);
        if (!inputSubject) return;

        const min = inputSubject.최소학점 ?? 1;
        const max = inputSubject.최대학점 ?? 20;
        const basic = inputSubject.기준학점 ?? 1;

        if (min >= 10 || max >= 10 || basic >= 10) {
            if (tempValue) {
                if (col.grade === item.Grade && col.semester === item.Semester) {
                    return String(item.Credit)
                } else {
                    return ""
                }
            }
        } else {
            if (col.grade === item.Grade && col.semester === item.Semester) {
                return String(item.Credit)
            } else {
                return ""
            }
        }
    }

    /** ----------------------------
     *  삭제 핸들러
     * ---------------------------- */
    // const handleDelete = useCallback(
    //     (item: JsonData) => {
    //         if (item.IsGroup === "") {
    //             console.log(table1Data)
    //             console.log(table1Data.filter(sub => sub.Tag !== item.Tag))
    //             addTable1(set_sort1(table1Data.filter(sub => sub.Tag !== item.Tag)));

    //             return;
    //         }

    //         const handleGroupInfo = Group[item.IsGroup];
    //         if (!handleGroupInfo) return;

    //         if (handleGroupInfo.Subject.length === 1) {
    //             const resetGroupCell: GroupCell = {
    //                 Zone: null,
    //                 Subject: [],
    //                 Grouptag: null,
    //                 Credit: null,
    //                 Grade: null,
    //                 Semester: null,
    //                 Choice: null,
    //             };
    //             groupUpdate(item.IsGroup, resetGroupCell);
    //             addTable1(set_sort1(table1Data.filter(sub => sub.Tag !== item.Tag)));
    //         } else {
    //             const newSubject = handleGroupInfo.Subject.filter((sub) => sub !== item.Tag).sort();
    //             const newGroupCell: GroupCell = {
    //                 ...handleGroupInfo,
    //                 Subject: newSubject,
    //                 Grouptag: newSubject[0],
    //             };
    //             groupUpdate(item.IsGroup, newGroupCell);
    //             addTable1(set_sort1(table1Data.filter(sub => sub.Tag !== item.Tag)));
    //             // deleteTable1(item.Tag);
    //             // const newJson = table1Data.filter(sub => sub.Tag !==item.Tag);
    //             // addTable1(set_sort1(newJson));
    //         }
    //         toast.success(`"${item.SubjectName}"과목이 삭제되었습니다.`)
    //     },
    //     [Group, addTable1, groupUpdate]
    // );
    const handleDelete = (item: JsonData) => {
        if (item.IsGroup === "") {
            console.log(table1Data)
            console.log(table1Data.filter(sub => sub.Tag !== item.Tag))
            addTable1(year, set_sort1(table1Data.filter(sub => sub.Tag !== item.Tag)));

            return;
        }

        const handleGroupInfo = Group[item.IsGroup];
        if (!handleGroupInfo) return;

        if (handleGroupInfo.Subject.length === 1) {
            const resetGroupCell: GroupCell = {
                Zone: null,
                Subject: [],
                Grouptag: null,
                Credit: null,
                Grade: null,
                Semester: null,
                Choice: null,
            };
            groupUpdate(year, item.IsGroup, resetGroupCell);
            addTable1(year, set_sort1(table1Data.filter(sub => sub.Tag !== item.Tag)));
        } else {
            const newSubject = handleGroupInfo.Subject.filter((sub) => sub !== item.Tag).sort();
            const newGroupCell: GroupCell = {
                ...handleGroupInfo,
                Subject: newSubject,
                Grouptag: newSubject[0],
            };
            groupUpdate(year, item.IsGroup, newGroupCell);
            addTable1(year, set_sort1(table1Data.filter(sub => sub.Tag !== item.Tag)));
            // deleteTable1(item.Tag);
            // const newJson = table1Data.filter(sub => sub.Tag !==item.Tag);
            // addTable1(set_sort1(newJson));
        }
        toast.success(`"${item.SubjectName}"과목이 삭제되었습니다.`)
    }


    /** ----------------------------
     *  렌더링
     * ---------------------------- */
    return (
        <tbody>
            {table1Data.map((item) => (
                <tr key={item.Tag} style={{ border: "1px solid #ddd" }}>
                    <td>{item.Section}</td>
                    <td style={item.IsGroup && Group[item.IsGroup]?.Subject.length < 2 ? { background: ERROR_BG } : {}}>
                        {item.IsGroup}
                    </td>
                    <td>{item.SubjectGroup}</td>
                    <td>{item.SubjectProperty}</td>
                    <td>{item.SubjectName}</td>
                    <td>{item.BasicCredit}</td>
                    <td>{item.Credit}</td>

                    {item.IsGroup === "" ? (
                        COLUMN.map((col) => (
                            <td key={col.name}>
                                <input
                                    className={styles.table_input}
                                    name={col.name}
                                    inputMode="numeric"
                                    style={{ background: getBackgroundColor(item, col) }}
                                    value={handleValue(item, col)}
                                    aria-label={`학년 ${col.grade}, 학기 ${col.semester} 학점 입력`}
                                    onChange={(e) => handleInputChange(e, item, col.grade, col.semester)}
                                />
                            </td>
                        ))
                    ) : (
                        renderGroup(item)
                    )}

                    <td>
                        <button onClick={() => handleDelete(item)} className={styles.deletebtn}>
                            ❌
                        </button>
                    </td>
                </tr>
            ))}

            {/* 통계 행 */}
            <tr style={{ fontSize: 11, border: "1px solid #ccc" }}>
                <td colSpan={5} style={{ backgroundColor: "#f0f0f0" }}>
                    학교지정 소계
                </td>
                <td></td>
                <td></td>
                <td>{statistics_1["1-1"]}</td>
                <td>{statistics_1["1-2"]}</td>
                <td>{statistics_1["2-1"]}</td>
                <td>{statistics_1["2-2"]}</td>
                <td>{statistics_1["3-1"]}</td>
                <td>{statistics_1["3-2"]}</td>
                <td>{allCredit_1}</td>
            </tr>
        </tbody>
    );
});

export default Table1Cell;
