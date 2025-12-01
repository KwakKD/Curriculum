import { useState } from "react";
import { useSchoolJsonDataStore } from "../../store/SubjectStore";
import PushButton from "../PushButton/pushbutton";
import styles from './inAddSubjectPopup.module.css'
import { SUBJECT } from "../../data/subjectdata";

export default function InAddSubjectPopup({ onClose }: { onClose: () => void }) {
    console.log('팝업렌더링')
    // const addSubject = useSchoolJsonDataStore().user.AddSubject;
    // const user = useSchoolJsonDataStore.getState().user
    const [checkedItems, setCheckedItems] = useState<number[]>([])
    // const delSubject = useSchoolJsonDataStore().delSubject;
    const { user, year, delSubject, inputTable1, inputTable3, inputTable5, inputTable6 } = useSchoolJsonDataStore()

    // const handleCheckAll = () => {
    //     if (checkedItems.length === user.AddSubject.length) {
    //         setCheckedItems([]);
    //     } else {
    //         setCheckedItems(user.AddSubject.map((sub) => sub.Tag));
    //     }
    // }

    const handleCheckAll = () => {
        // 비활성화 항목을 제외한 활성화된 과목만 가져오기
        const enabledSubjects = user[year].AddSubject.filter(
            (sub) => !handelDisableChecked(sub.Tag).disable
        );

        if (checkedItems.length === enabledSubjects.length) {
            // 이미 전부 선택된 상태라면 해제
            setCheckedItems([]);
        } else {
            // 활성화된 항목만 선택
            setCheckedItems(enabledSubjects.map((sub) => sub.Tag));
        }
    };

    const handleCheck = (tag: number) => {
        setCheckedItems((prev) =>
            prev.includes(tag) ? prev.filter((i) => i !== tag) : [...prev, tag]
        )
    }
    const handleCancel = () => {
        onClose()
    }

    // const isCheckInTable = (TagList: number[]) => {
    //     let state = true;
    //     (Object.keys(user) as Array<keyof typeof user>).forEach((key) => {
    //         if (key === 'Group' || key === 'AddSubject' || key === 'CEA') {
    //             return
    //         } else {
    //             const checkInTable = user[key]
    //             TagList.forEach(tag => {
    //                 if (checkInTable.map(item => item.Tag).includes(tag)) {
    //                     const errorSubject = checkInTable.find(item => item.Tag === tag)?.SubjectName
    //                     toast.error(`"${errorSubject}"은 "${key}"에 이미 속해 있습니다. 우선 편성표에서 과목을 삭제해주세요.`)
    //                     state = false
    //                 }
    //             })
    //         }
    //     })
    //     return state
    // }

    const handleDelSubject = (TagList: number[]) => {
        // if (!isCheckInTable(TagList)) return
        let newStartTag = SUBJECT.length + 1;
        const newAddSubjects = user[year].AddSubject
            .filter((sub) => !TagList.includes(sub.Tag))
            .map((sub) => ({
                ...sub,
                Tag: newStartTag++
            }))
        const AllData = [...user[year].학교지정, ...user[year].선택과목, ...user[year].추가교육과정, ...user[year].공동교육과정];
        const AllDataTags = AllData.map(item => item.Tag);
        user[year].AddSubject.forEach(item => {
            if (AllDataTags.includes(item.Tag)) {
                const inTableItem = AllData.filter(sub => sub.Tag === item.Tag)
                inTableItem.forEach(it => {
                    const inSection = it.Section;
                    const inSubjectName = it.SubjectName;
                    const newItem = newAddSubjects.find(sub => sub.과목명 === inSubjectName)
                    switch (inSection) {
                        case '학교지정':
                            inputTable1(year, item.Tag, { 'Tag': newItem?.Tag })
                            break
                        case '선택과목':
                            inputTable3(year, item.Tag, { 'Tag': newItem?.Tag })
                            break
                        case '추가교육과정':
                            inputTable5(year, item.Tag, { 'Tag': newItem?.Tag })
                            break
                        case '공동교육과정':
                            inputTable6(year, item.Tag, { 'Tag': newItem?.Tag })
                            break
                    }
                })
            }
        })
        setCheckedItems([])
        delSubject(year, newAddSubjects)
    }

    const handelDisableChecked = (tag: number) => {
        const AllData = [...user[year].학교지정, ...user[year].선택과목, ...user[year].추가교육과정, ...user[year].공동교육과정];
        const inTableTag = AllData.find(item => item.Tag === tag)

        if (inTableTag) {
            return {
                disable: true,
                section: inTableTag.Section
            }
        } else {
            return {
                disable: false,
                section: ''
            }
        }
    }

    return (
        <>
            <div className={`${styles.panel} ${styles.scroll}`} >
                <table className={styles.table}>
                    {/* <table> */}
                    <colgroup>
                        <col style={{ width: 30 }} />
                        <col style={{ width: 40 }} />
                        <col style={{ width: 180 }} />
                        <col style={{ width: 100 }} />
                        <col style={{ width: 60 }} />
                        <col style={{ width: 65 }} />
                        <col style={{ width: 65 }} />
                        <col style={{ width: 65 }} />
                        <col style={{ width: 95 }} />
                    </colgroup>
                    <thead>
                        <tr className="bg-gray-100">
                            <td>
                                {/* <input
                                    type="checkbox"
                                    checked={checkedItems.length === user.AddSubject.length}
                                    onChange={handleCheckAll}
                                /> */}
                                <input
                                    type="checkbox"
                                    onChange={handleCheckAll}
                                    checked={
                                        checkedItems.length > 0 &&
                                        checkedItems.length ===
                                        user[year].AddSubject.filter((sub) => !handelDisableChecked(sub.Tag).disable).length
                                    }
                                />
                            </td>
                            <td>연번</td>
                            <td>과목명</td>
                            <td>교과군</td>
                            <td>유형</td>
                            <td>기준학점</td>
                            <td>최소학점</td>
                            <td>최대학점</td>
                            <td>비고</td>
                        </tr>
                    </thead>
                    <tbody>
                        {user[year].AddSubject.map((sub, idx) => {
                            return (
                                <tr key={sub.Tag}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={checkedItems.includes(sub.Tag)}
                                            onChange={() => handleCheck(sub.Tag)}
                                            disabled={handelDisableChecked(sub.Tag).disable}
                                        />
                                    </td>
                                    <td>{idx + 1}</td>
                                    <td>{sub.과목명}</td>
                                    <td>{sub.교과군}</td>
                                    <td>{sub.유형}</td>
                                    <td>{sub.기준학점}</td>
                                    <td>{sub.최소학점}</td>
                                    <td>{sub.최대학점}</td>
                                    <td>{handelDisableChecked(sub.Tag).section}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <PushButton onClick={() => handleDelSubject(checkedItems)}>삭제</PushButton>
                <PushButton variant="danger" onClick={handleCancel}>닫기</PushButton>
            </div>

        </>
    )
}