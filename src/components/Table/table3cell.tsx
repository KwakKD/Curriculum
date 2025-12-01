import React from "react";
import { useSchoolJsonDataStore } from "../../store/SubjectStore";
import type { GroupCell, JsonData } from "../../types/schoolJsontype";
import { useStatistics } from "../../hooks/useStatistics";
import { set_sort3 } from "../../utils/afterdrop";
import styles from './table.module.css'
import { toast } from "../../utils/toast";

const ERROR_BG = "rgba(255, 165, 165, 1)";

const Table3Cell = React.memo(() => {
    const year = useSchoolJsonDataStore().year
    const table3Data = useSchoolJsonDataStore((s) => s.user[year].선택과목);
    const groupUpdate = useSchoolJsonDataStore().groupUpdate;
    const addTable3 = useSchoolJsonDataStore().addTable3;
    const { statistics_3, allCredit_3 } = useStatistics()

    table3Data.sort((a, b) =>
        (a.IsTable !== b.IsTable && a.IsTable && b.IsTable) ? a.IsTable - b.IsTable :
            (a.Grade !== b.Grade) ? Number(a.Grade) - Number(b.Grade) :
                Number(a.Semester) - Number(b.Semester))
    console.log('Table3 렌더링!')

    const groupInfo = useSchoolJsonDataStore.getState().user[year].Group
    const rows = (item: JsonData, idx: number, data: JsonData[]) => {
        const spanNumber = groupInfo[item.IsGroup].Subject.length;
        const spanSubject = data.filter(sub => sub.IsGroup === item.IsGroup);
        const rowNumber = data.length;

        if (idx !== rowNumber - 1) {
            if (item.IsTable !== data[idx + 1].IsTable) {
                if (item.Tag === spanSubject[0].Tag) {
                    const insertText = `[택${groupInfo[item.IsGroup].Choice}]\n${(groupInfo[item.IsGroup].Choice ?? 0) * (groupInfo[item.IsGroup].Credit ?? 0)}`
                    return (
                        (item.Grade === 1 && item.Semester === 1)
                            ?
                            <>
                                <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                <td></td><td></td><td></td><td></td><td></td>
                            </>
                            : (item.Grade === 1 && item.Semester === 2)
                                ?
                                <>
                                    <td></td>
                                    <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                    <td></td><td></td><td></td><td></td>
                                </>
                                : (item.Grade === 2 && item.Semester === 1)
                                    ?
                                    <>
                                        <td></td><td></td>
                                        <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                        <td></td><td></td><td></td>
                                    </>
                                    : (item.Grade === 2 && item.Semester === 2)
                                        ?
                                        <>
                                            <td></td><td></td><td></td>
                                            <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                            <td></td><td></td>
                                        </>
                                        : (item.Grade === 3 && item.Semester === 1)
                                            ?
                                            <>
                                                <td></td><td></td><td></td><td></td>
                                                <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                                <td></td>
                                            </>
                                            :
                                            <>
                                                <td></td><td></td><td></td><td></td><td></td>
                                                <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                            </>
                    )
                } else {
                    return (
                        <>
                            <td></td><td></td><td></td><td></td><td></td>
                        </>
                    )
                }
            } else if (item.IsTable === data[idx + 1].IsTable) {
                const spanNumber_1 = groupInfo[data[idx + 1].IsGroup].Subject.length;
                const spanSubject_1 = data.filter(sub => sub.IsGroup === data[idx + 1].IsGroup)
                if (item.Tag === spanSubject[0].Tag && data[idx + 1].Tag === spanSubject_1[0].Tag) {
                    const insertText_1 = `[택${groupInfo[item.IsGroup].Choice}]\n${(groupInfo[item.IsGroup].Choice ?? 0) * (groupInfo[item.IsGroup].Credit ?? 0)}`
                    const insertText_2 = `[택${groupInfo[data[idx + 1].IsGroup].Choice}]\n${(groupInfo[data[idx + 1].IsGroup].Choice ?? 0) * (groupInfo[data[idx + 1].IsGroup].Credit ?? 0)}`
                    return (
                        item.Grade === 1
                            ?
                            <>
                                <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText_1}</td>
                                <td rowSpan={spanNumber_1} style={{ whiteSpace: 'pre' }}>{insertText_2}</td>
                                <td></td><td></td><td></td><td></td>
                            </>
                            : item.Grade === 2
                                ?
                                <>
                                    <td></td><td></td>
                                    <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText_1}</td>
                                    <td rowSpan={spanNumber_1} style={{ whiteSpace: 'pre' }}>{insertText_2}</td>
                                    <td></td><td></td>
                                </>
                                :
                                <>
                                    <td></td><td></td><td></td><td></td>
                                    <td rowSpan={spanNumber} style={{ whiteSpace: 'pre' }}>{insertText_1}</td>
                                    <td rowSpan={spanNumber_1} style={{ whiteSpace: 'pre' }}>{insertText_2}</td>
                                </>
                    )
                } else if (item.Tag !== spanSubject[0].Tag && data[idx + 1].Tag === spanSubject_1[0].Tag) {
                    const insertText_2 = `[택${groupInfo[data[idx + 1].IsGroup].Choice}]\n${(groupInfo[data[idx + 1].IsGroup].Choice ?? 0) * (groupInfo[data[idx + 1].IsGroup].Credit ?? 0)}`
                    return (
                        item.Grade === 1
                            ?
                            <>
                                <td rowSpan={spanNumber_1} style={{ whiteSpace: 'pre' }}>{insertText_2}</td>
                                <td></td><td></td><td></td><td></td>
                            </>
                            : item.Grade === 2
                                ?
                                <>
                                    <td></td><td></td>
                                    <td rowSpan={spanNumber_1} style={{ whiteSpace: 'pre' }}>{insertText_2}</td>
                                    <td></td><td></td>
                                </>
                                :
                                <>
                                    <td></td><td></td><td></td><td></td>
                                    <td rowSpan={spanNumber_1} style={{ whiteSpace: 'pre' }}>{insertText_2}</td>
                                </>
                    )
                } else if (item.Tag !== spanSubject[0].Tag && data[idx + 1].Tag !== spanSubject_1[0].Tag) {
                    return (
                        <>
                            <td></td><td></td><td></td><td></td>
                        </>
                    )
                }
            }
        } else if (idx === 0) {
            const insertText = `[택${groupInfo[item.IsGroup].Choice}]\n${(groupInfo[item.IsGroup].Choice ?? 0) * (groupInfo[item.IsGroup].Credit ?? 0)}`
            return (
                (item.Grade === 1 && item.Semester === 1)
                    ?
                    <>
                        <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                        <td></td><td></td><td></td><td></td><td></td>
                    </>
                    : (item.Grade === 1 && item.Semester === 2)
                        ?
                        <>
                            <td></td>
                            <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                            <td></td><td></td><td></td><td></td>
                        </>
                        : (item.Grade === 2 && item.Semester === 1)
                            ?
                            <>
                                <td></td><td></td>
                                <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                <td></td><td></td><td></td>
                            </>
                            : (item.Grade === 2 && item.Semester === 2)
                                ?
                                <>
                                    <td></td><td></td><td></td>
                                    <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                    <td></td><td></td>
                                </>
                                : (item.Grade === 3 && item.Semester === 1)
                                    ?
                                    <>
                                        <td></td><td></td><td></td><td></td>
                                        <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                        <td></td>
                                    </>
                                    :
                                    <>
                                        <td></td><td></td><td></td><td></td><td></td>
                                        <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                    </>
            )
        } else {
            if (data[idx - 1].IsTable !== item.IsTable) {
                if (data[idx - 1].IsGroup === item.IsGroup) {
                    return (
                        <>
                            <td></td><td></td><td></td><td></td><td></td>
                        </>
                    )
                } else {
                    const insertText = `[택${groupInfo[item.IsGroup].Choice}]\n${(groupInfo[item.IsGroup].Choice ?? 0) * (groupInfo[item.IsGroup].Credit ?? 0)}`
                    return (
                        (item.Grade === 1 && item.Semester === 1)
                            ?
                            <>
                                <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                <td></td><td></td><td></td><td></td><td></td>
                            </>
                            : (item.Grade === 1 && item.Semester === 2)
                                ?
                                <>
                                    <td></td>
                                    <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                    <td></td><td></td><td></td><td></td>
                                </>
                                : (item.Grade === 2 && item.Semester === 1)
                                    ?
                                    <>
                                        <td></td><td></td>
                                        <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                        <td></td><td></td><td></td>
                                    </>
                                    : (item.Grade === 2 && item.Semester === 2)
                                        ?
                                        <>
                                            <td></td><td></td><td></td>
                                            <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                            <td></td><td></td>
                                        </>
                                        : (item.Grade === 3 && item.Semester === 1)
                                            ?
                                            <>
                                                <td></td><td></td><td></td><td></td>
                                                <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                                <td></td>
                                            </>
                                            :
                                            <>
                                                <td></td><td></td><td></td><td></td><td></td>
                                                <td style={{ whiteSpace: 'pre' }}>{insertText}</td>
                                            </>
                    )
                }

            }
        }
    }
    const groupRendering = (item: JsonData, idx: number, data: JsonData[]) => {
        const joinGroupText = item.IsGroup + ',' + data[idx + 1]?.IsGroup.slice(3)
        const soloGroupText = item.IsGroup;
        const choice1 = groupInfo[item.IsGroup].Choice ?? 0
        const choice2 = groupInfo[data[idx + 1]?.IsGroup]?.Choice ?? 0
        const subjectNumber1 = groupInfo[item.IsGroup].Subject.length
        const subjectNumber2 = groupInfo[data[idx + 1]?.IsGroup]?.Subject.length ?? 0

        if (data.length === 1) {
            return (
                <td style={{ background: ERROR_BG }}>{soloGroupText}</td>
            )
        } else {
            if (idx !== data.length - 1) {
                if (item.IsTable === data[idx + 1].IsTable) {
                    if (choice1 < subjectNumber1 && choice2 < subjectNumber2) {
                        return (
                            <td>{joinGroupText}</td>
                        )
                    } else {
                        return (
                            <td style={{ background: ERROR_BG }}>{joinGroupText}</td>
                        )
                    }
                } else {
                    if (choice1 < subjectNumber1) {
                        return <td>{soloGroupText}</td>
                    } else {
                        return <td style={{ background: ERROR_BG }}>{soloGroupText}</td>
                    }
                }
            } else {
                if (data[idx - 1].IsTable !== item.IsTable) {
                    if (choice1 < subjectNumber1) {
                        return <td>{soloGroupText}</td>
                    } else {
                        return <td style={{ background: ERROR_BG }}>{soloGroupText}</td>
                    }
                }
            }
        }
    }

    const handleDelete = (item: JsonData) => {
        const deleteindex = item.IsTable;
        const deleteTag = item.Tag;
        const deleteItem = table3Data.filter(sub => sub.IsTable === deleteindex)
        const deleteGroup = deleteItem.map(sub => sub.IsGroup);
        console.log(deleteGroup, deleteItem, deleteindex)

        deleteGroup.forEach(group => {
            const handleGroupInfo = groupInfo[group];

            if (handleGroupInfo.Subject.length === 1) {
                const resetGroupCell: GroupCell = {
                    Zone: null,
                    Subject: [],
                    Grouptag: null,
                    Credit: null,
                    Grade: null,
                    Semester: null,
                    Choice: null
                };
                groupUpdate(year, group, resetGroupCell);
                addTable3(year, set_sort3(table3Data.filter(sub => sub.Tag !== deleteTag)))
            } else {
                const newSubject = handleGroupInfo.Subject.filter(sub => sub !== deleteTag).sort((a, b) => a - b)
                const newGroupCell: GroupCell = {
                    ...handleGroupInfo,
                    Subject: newSubject,
                    Grouptag: newSubject[0]
                }
                groupUpdate(year, group, newGroupCell);
                addTable3(year, set_sort3(table3Data.filter(sub => sub.Tag !== deleteTag)))
            }
        })
        toast.success(`"${item.SubjectName}"과목이 삭제되었습니다.`)
    }

    // const statisticsSubjects = useMemo(() => {
    //     const cache: Record<string, number> = {};

    //     for (let grade = 1; grade <= 3; grade++) {
    //         for (let sem = 1; sem <= 2; sem++) {
    //             let choiceCredit = 0;
    //             Object.keys(groupInfo).forEach(key => {
    //                 const g = groupInfo[key];
    //                 if (g.Zone === '선택과목' && g.Grade === grade && g.Semester === sem) {
    //                     const sumCredit = (g.Credit ?? 0) * (g.Choice ?? 0)
    //                     choiceCredit += sumCredit;
    //                 }
    //             });

    //             cache[`${grade}-${sem}`] = choiceCredit;
    //         }
    //     }
    //     return cache;
    // }, [table3Data, groupInfo])

    // const allCredit = useMemo(() => {
    //     return Object.values(statisticsSubjects).reduce((sum, val) => sum + val, 0)
    // }, [statisticsSubjects])


    return (
        <tbody>
            {table3Data.map((item, idx, data) => (
                (item.IsTable !== data[idx + 1]?.IsTable && idx > 0 && item.IsTable === data[idx - 1].IsTable)
                    ? null
                    :
                    <tr key={idx} style={{ border: '1px solid #ddd' }}>
                        <td>{item.Section}</td>
                        {groupRendering(item, idx, data)}
                        <td>{item.SubjectGroup}</td>
                        <td>{item.SubjectProperty}</td>
                        <td>{item.SubjectName}</td>
                        <td>{item.BasicCredit}</td>
                        <td>{item.Credit}</td>
                        {rows(item, idx, data)}
                        <td>
                            <button onClick={() => handleDelete(item)} className={styles.deletebtn}>
                                ❌
                            </button>
                        </td>
                    </tr>
            ))}
            <tr style={{ fontSize: 11, border: '1px solid #ccc' }}>
                <td colSpan={5} style={{ backgroundColor: '#f0f0f0' }}>선택과목 소계</td>
                <td></td><td></td>
                <td>{statistics_3['1-1']}</td>
                <td>{statistics_3['1-2']}</td>
                <td>{statistics_3['2-1']}</td>
                <td>{statistics_3['2-2']}</td>
                <td>{statistics_3['3-1']}</td>
                <td>{statistics_3['3-2']}</td>
                <td>{allCredit_3}</td>
            </tr>

        </tbody>
    )
})

export default Table3Cell