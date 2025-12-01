import { useCallback, useEffect, useMemo, useState } from "react"
import ComboBox from "../components/ComboBox/combobox"
import Header from "../components/Header/header"
import { SUBJECT, SUBJECT_CHOICENUMBER, SUBJECT_CREDIT, SUBJECT_GROUPS, SUBJECT_LEVELS, SUBJECT_SEMESTERS, SUBJECT_TYPES } from "../data/subjectdata"
import Panel from "../components/Panel/panel"
import CheckedArea from "../components/CheckedArea/checkedArea"
import { useSchoolJsonDataStore } from "../store/SubjectStore"
import ListBox from "../components/ListBox/listbox"
import PopUp from "../components/PopUp/popup"
import InPopup from "../components/PopUp/inPopup"
import PushButton from "../components/PushButton/pushbutton"
import DropZone from "../components/DropZone/dropzone"
import { toast } from "../utils/toast"
import type { GroupCell, SchoolJsonDataType } from "../types/schoolJsontype"
import { duplicateSuject_1, duplicateSuject_2, inJsonData1, inJsonData3, inJsonData5, inJsonData6 } from "../utils/afterdrop"
import Table1 from "../components/Table/table1"
import Table3 from "../components/Table/table3"
import Table4 from "../components/Table/table4"
import { StatisticsInPanel } from "../components/Statistics/statisticsInPanel"
import AllCreditProgress from "../components/ProgressBar/progressBar"
import HeaderArea from "../components/HeaderArea/headerArea"
import { Table5 } from "../components/Table/table5"
import { Table6 } from "../components/Table/table6"
import InAddSubjectPopup from "../components/PopUp/inAddSubjectPopup"
import { exprotToExcel } from "../utils/exportExcel"
import supabase from "../lib/supabaseClient"
import { useAuthStore } from "../store/authStore"

export default function Sub() {
    console.log('렌더링시행!')
    const [subjectType, setSubjectType] = useState('')
    const [subjectLevel, setSubjectLevel] = useState('')
    const [subjectGroup, setSubjectGroup] = useState('')
    const [subjectSemester, setSubjectSemester] = useState('')
    const [subjectChoiceNumber, setSubjectChoiceNumber] = useState('')
    const [subjectCredit, setSubjectCredit] = useState('')

    const [selected, setSelected] = useState<string | null>(null);
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isAddSubjectPop, setIsAddSubjectPop] = useState(false)


    const { user, year, setYear, groupUpdate, addTable1, addTable3, addTable5, addTable6 } = useSchoolJsonDataStore();
    const yearUser = user[year]
    
    // 학교지정 누르면 비활성화 시킴
    useEffect(() => {
        if (subjectGroup === '') {
            setSubjectSemester('');
            setSubjectChoiceNumber('');
            setSubjectCredit('');
        } else {
            const sem = String(yearUser.Group[subjectGroup].Grade) + '학년' + String(yearUser.Group[subjectGroup].Semester) + '학기'
            const choice = '택' + String(yearUser.Group[subjectGroup].Choice)
            const credit = String(yearUser.Group[subjectGroup].Credit)
            setSubjectSemester(sem ?? '');
            setSubjectChoiceNumber(choice ?? '');
            setSubjectCredit(credit ?? "");
        }
    }, [subjectGroup])

    const unionSubject = [...SUBJECT, ...yearUser.AddSubject]

    const renderSubjectList = useMemo(
        () => unionSubject.filter(s => (!subjectType || s.교과군 === subjectType) && (!subjectLevel || s.유형 === subjectLevel)).sort((a, b) => a.Tag - b.Tag)
        , [subjectType, subjectLevel, unionSubject, year]
    )

    const checkedSubjectTag = useMemo(() => {
        return [...checked]
            .map(item => unionSubject.find(sub => sub.과목명 === item))
            .filter(sub => sub !== undefined)
            .sort((a, b) => a.Tag - b.Tag)
    }, [checked, unionSubject])

    // const OpenPopUp = () => {
    //     setIsPopupOpen(true);
    // }

    // const ClosePopUp = () => {
    //     setIsPopupOpen(false)
    // }

    const OpenPopUp = useCallback(() => {
        setIsPopupOpen(true);
    }, []);

    const ClosePopUp = useCallback(() => {
        setIsPopupOpen(false);
    }, []);

    const OpenAddSubjectPopUp = useCallback(() => {
        setIsAddSubjectPop(true);
    }, []);

    const CloseAddSubjectPopUp = useCallback(() => {
        setIsAddSubjectPop(false);
    }, []);

    const handleDropText = (texts: string[], value: string) => {
        if ([...checked].length === 0) return
        const dropTags = [...checked]
            .map(sub => unionSubject.find(item => item.과목명 === sub)?.Tag)
            .filter((tag): tag is number => tag !== undefined);
        const droppedMap: Map<number, string> = new Map(dropTags.map((key, index) => [key, [...checked][index]]));
        const selectgroup = subjectGroup;
        const selectGrade = subjectSemester === '' ? null : Number(subjectSemester[0]);
        const selectSemester = subjectSemester === '' ? null : Number(subjectSemester[3]);
        const selectCredit = subjectCredit === '' ? null : Number(subjectCredit);
        const selectChoice = subjectChoiceNumber === '' ? null : Number(subjectChoiceNumber.slice(1));

        if (value === '2' || value === '3') {
            if (!selectgroup || selectgroup === '') {
                toast.error('그룹을 먼저 선택하세요.')
                return
            }
            if (selectSemester === null) {
                toast.error('학기를 선택하세요.')
                return
            }
            if (selectChoice === null) {
                toast.error('택N을 선택하세요.')
                return
            }
            if (selectCredit === null) {
                toast.error('학점을 선택하세요.')
                return
            }

            for (const sub of texts[0]) {
                const subjectCreditInfo = unionSubject.find(s => s.과목명 === sub);
                const min = subjectCreditInfo?.최소학점 ?? 1;
                const max = subjectCreditInfo?.최대학점 ?? 20;
                if (Number(selectCredit) < min || Number(selectCredit) > max) {
                    toast.error(`${sub} 과목의 유효한 학점은 ${min}에서 ${max} 사이입니다.`);
                    return
                }
            }

            const groupitem: GroupCell = {
                Zone: value === '2' ? '학교지정' : '선택과목',
                Subject: [],
                Grouptag: null,
                Credit: selectCredit,
                Grade: selectGrade,
                Semester: selectSemester,
                Choice: selectChoice
            }
            console.log(yearUser.Group[selectgroup].Subject)
            if (yearUser.Group[selectgroup].Subject.length === 0) {
                groupitem.Subject = [...dropTags]
            } else {
                groupitem.Subject = [...yearUser.Group[selectgroup].Subject, ...dropTags]
            }

            if (value === '2') {
                if (yearUser.Group[selectgroup].Zone === '선택과목') {
                    toast.error(`선택하신 "${selectgroup}"은 이미 "선택과목"에 있습니다.`);
                    return
                }
                if (yearUser.Group[selectgroup].Credit !== null) {
                    if (Number(yearUser.Group[selectgroup].Credit) !== Number(selectCredit)) {
                        toast.error(`선택하신 그룹 "${selectgroup}"은 이미 ${selectCredit}학점으로 구성되어 있습니다.`);
                        return
                    }
                }
                if (selectChoice !== 1) {
                    toast.error('학교지정(선택)은 "택1"으로만 선택할 수 있습니다.');
                    return
                }
                if (yearUser.Group[selectgroup].Subject.length + texts[0].length > 2) {
                    toast.error('학교지정(선택)은 "2과목"으로만 구성되어야 합니다.');
                    return
                }
                console.log(texts[0])
                if (duplicateSuject_1(year, droppedMap)) {
                    groupitem.Subject.sort((a, b) => a - b);
                    groupitem.Grouptag = groupitem.Subject[0];
                    groupUpdate(year, selectgroup, groupitem);
                    addTable1(year, inJsonData1(dropTags, selectgroup, selectGrade, selectSemester, selectCredit, year))
                    toast.success(`${[...checked].length}개 과목이 등록되었습니다.`);
                } else {
                    return
                }
            } else {
                if (yearUser.Group[selectgroup].Zone === '학교지정') {
                    toast.error(`선택하신 "${selectgroup}"은 이미 "학교지정"에 있습니다.`);
                    return
                }
                if (yearUser.Group[selectgroup].Credit !== null) {
                    if (Number(yearUser.Group[selectgroup].Credit) !== Number(selectCredit)) {
                        toast.error(`선택하신 그룹 "${selectgroup}"은 이미 ${selectCredit}학점으로 구성되어 있습니다.`);
                        return
                    }
                }
                if (yearUser.Group[selectgroup].Grade && yearUser.Group[selectgroup].Semester) {
                    if (yearUser.Group[selectgroup].Grade !== selectGrade || yearUser.Group[selectgroup].Semester !== selectSemester) {
                        toast.error(`선택하신 그룹 "${selectgroup}"은 ${yearUser.Group[selectgroup].Grade}학년 ${yearUser.Group[selectgroup].Semester}학기에 존재합니다.`)
                        return
                    }
                }
                if (yearUser.선택과목) {
                    for (const sub of texts[0]) {
                        const choiceSubjects = yearUser.선택과목.filter(item => item.SubjectName === sub)
                        for (let i = 0; i <= choiceSubjects.length - 1; i++) {
                            if (choiceSubjects[i].Credit !== selectCredit) {
                                toast.error(`"${sub}"과목은 "${choiceSubjects[i].IsGroup}"에서 이미 ${choiceSubjects[i].Credit}학점으로 편성되었습니다.`)
                                return
                            }
                        }
                    }
                }
                if (duplicateSuject_2(droppedMap, selectGrade, selectSemester, year)) {
                    groupitem.Subject.sort((a, b) => a - b);
                    groupitem.Grouptag = groupitem.Subject[0];
                    groupUpdate(year, selectgroup, groupitem);
                    addTable3(year, inJsonData3(dropTags, selectgroup, selectGrade, selectSemester, selectCredit, year))
                    toast.success(`${[...checked].length}개 과목이 등록되었습니다.`);
                } else {
                    return
                }
            }
        } else if (value === '1') {
            if (selectgroup !== '') {
                toast.error('학교지정은 그룹을 "학교지정"으로 설정해야 합니다.');
                return
            }
            if (duplicateSuject_1(year, droppedMap)) {
                addTable1(year, inJsonData1(dropTags, selectgroup, selectGrade, selectSemester, selectCredit, year))
                toast.success(`${[...checked].length}개 과목이 등록되었습니다.`);
            } else {
                return
            }
        } else if (value === '4') {
            if (duplicateSuject_1(year, droppedMap)) {
                addTable5(year, inJsonData5(dropTags, year))
                toast.success(`${[...checked].length}개 과목이 등록되었습니다.`);
            } else {
                return
            }
        } else if (value === '5') {
            if (duplicateSuject_1(year, droppedMap)) {
                addTable6(year, inJsonData6(dropTags, year))
                toast.success(`${[...checked].length}개 과목이 등록되었습니다.`);
            } else {
                return
            }
        }

        setChecked(new Set());
    }

    const saveData = async (savedata: Record<string, SchoolJsonDataType>) => {
        console.log('시작')
        const auth = useAuthStore.getState().user
        if (!auth) {
            console.error('auth 정보가 없습니다.')
            return
        }

        const rows = (Object.keys(savedata) as Array<keyof typeof savedata>).map(
            (key) => {
                const insertdata = savedata[key];
                return {
                    user_id: auth.id,
                    year: key,
                    location: auth.location,
                    schoolname: auth.schoolname,
                    role: auth.role,
                    fix: insertdata.학교지정,
                    choice: insertdata.선택과목,
                    addcurri: insertdata.추가교육과정,
                    union: insertdata.공동교육과정,
                    groupdata: insertdata.Group,
                    addsubjects: insertdata.AddSubject,
                    CEA: insertdata.CEA,
                };
            }
        );
        console.log(rows)

        const { data, error } = await supabase
            .from("schoolsdata")
            .upsert(rows, {
                onConflict: 'user_id,year',
            });

        if (error) {
            console.error("insert error: ", error);
            return;
        }

        console.log("성공", data);

    }

    return (
        <>
            <HeaderArea>
                <h1 style={{ alignContent: 'center', fontSize: 35, marginRight: '1%', marginLeft: '1%', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>Connecting Space</h1>
                <Header title="교육과정 편성표 작성" />
                <AllCreditProgress />
            </HeaderArea>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: '#4f5781',
                borderBottom: '1px solid #ddd'
            }}>
                <div style={{ display: "flex", gap: 15 }}>
                    <div style={{ display: "flex", gap: 10, padding: '12px 16px', height: 24, alignItems: "center" }}>
                        <h5 style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", color: '#ffffff' }}>🗓️ 학년도</h5>
                        <ComboBox
                            comboboxList={['2025', '2026', '2027']}
                            value={year}
                            onChange={setYear}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 20, padding: '12px 16px', height: 24, alignItems: "center" }}>
                        <h5 style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", color: '#ffffff' }}>🧮 교과군</h5>
                        <ComboBox
                            comboboxList={[{ label: '전체', value: "" }, ...SUBJECT_TYPES.map(t => ({ label: t, value: t }))]}
                            value={subjectType}
                            onChange={setSubjectType}
                        />
                        <h5 style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", color: '#ffffff' }}>유형</h5>
                        <ComboBox
                            comboboxList={[{ label: '전체', value: "" }, ...SUBJECT_LEVELS.map(t => ({ label: t, value: t }))]}
                            value={subjectLevel}
                            onChange={setSubjectLevel}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 10, padding: '12px 16px', height: 24, alignItems: "center" }}>
                        <h5 style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", color: '#ffffff' }}>🧑‍🤝‍🧑 그룹</h5>
                        <ComboBox
                            comboboxList={[{ label: '학교지정', value: "" }, ...SUBJECT_GROUPS.map(t => ({ label: t, value: t }))]}
                            value={subjectGroup}
                            onChange={setSubjectGroup}
                        />
                        <h5 style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", color: '#ffffff' }}>학기</h5>
                        <ComboBox
                            comboboxList={[{ label: '학기선택', value: "" }, ...SUBJECT_SEMESTERS.map(t => ({ label: t, value: t }))]}
                            value={subjectSemester}
                            onChange={setSubjectSemester}
                            disabled={subjectGroup === ''}
                        />
                        <h5 style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", color: '#ffffff' }}>택N</h5>
                        <ComboBox
                            comboboxList={[{ label: '택N', value: "" }, ...SUBJECT_CHOICENUMBER.map(t => ({ label: t, value: t }))]}
                            value={subjectChoiceNumber}
                            onChange={setSubjectChoiceNumber}
                            disabled={subjectGroup === ''}
                        />
                        <h5 style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", color: '#ffffff' }}>학점</h5>
                        <ComboBox
                            comboboxList={[{ label: '학점선택', value: "" }, ...SUBJECT_CREDIT.map(t => ({ label: t, value: t }))]}
                            value={subjectCredit}
                            onChange={setSubjectCredit}
                            disabled={subjectGroup === ''}
                        />
                    </div >
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ display: "flex", gap: 2, padding: '12px 16px', height: 24, alignItems: "center" }}>
                        {/* <PushButton onClick={() => console.log(user)}>시험용</PushButton> */}
                        <PushButton variant="secondary" onClick={OpenPopUp}>과목추가</PushButton>
                        <PopUp isOpen={isPopupOpen} onClose={ClosePopUp}>
                            <h2 style={{
                                marginBottom: 8,
                                fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif"
                            }}>과목추가</h2>
                            <h6 style={{
                                marginTop: 0,
                                marginBottom: 8,
                                color: '#7d7d7dff',
                                fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif"
                            }}>추가된 과목은 편성표상에서 가장 아래에 표시됩니다.</h6>
                            <InPopup onClose={ClosePopUp} />
                        </PopUp>
                        <PushButton variant="secondary" onClick={OpenAddSubjectPopUp}>추가과목조회</PushButton>
                        <PopUp isOpen={isAddSubjectPop} onClose={CloseAddSubjectPopUp}>
                            <h2 style={{
                                marginBottom: 8,
                                fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif"
                            }}>추가과목조회</h2>
                            <h6 style={{
                                marginTop: 0,
                                marginBottom: 8,
                                color: '#7d7d7dff',
                                fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif"
                            }}>과목을 체크하고 삭제버튼을 눌러 삭제할 수 있습니다.</h6>
                            <InAddSubjectPopup onClose={CloseAddSubjectPopUp} />
                        </PopUp>
                    </div>
                </div>
            </div>
            {/* 선택된 과목을 나타내는 곳 */}
            <CheckedArea>
                <h5 style={{ color: '#7c7c7cff', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>✔️ 선택된 과목</h5>
                {checkedSubjectTag.map(item => (
                    <div style={{
                        display: 'flex',
                        // fontSize: 11,
                        border: '1px solid #ddd',
                        padding: 3,
                        borderRadius: 8,
                        backgroundColor: '#8c8c8cff',
                        color: '#ffffff',
                        font: '11px bold'
                    }}
                        key={item.Tag}>
                        {item.과목명}
                    </div>
                ))}
            </CheckedArea>
            {/* 본문영역을 나타내는 곳 */}
            <div style={{ display: "flex", flex: 1, gap: 10, padding: 3 }}>
                {/* 과목의 리스트가 보이는 영역 */}
                <Panel size="left" scroll>
                    <h4 style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", margin: 5, textAlign: 'start', marginLeft: 2 }}>🖱️ ➡️Choice & Drag</h4>
                    <ListBox
                        items={renderSubjectList.map((item) => item.과목명)}
                        selected={selected}
                        onSelect={setSelected}
                        checkedSet={checked}
                        onCheckedChange={(next) => setChecked(new Set(next))}
                    />
                </Panel>
                {/* 드롭존, 통계 부분 */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 10, padding: 0, height: '78vh' }}>
                    <Panel size="small">
                        <h3 style={{ marginBottom: 1, textAlign: 'center', marginTop: 5, fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>🫳 Drop Zone</h3>
                        <DropZone onDropText={handleDropText} label='학교지정' value="1" />
                        <DropZone onDropText={handleDropText} label='학교 지정(선택)' value="2" />
                        <DropZone onDropText={handleDropText} label='선택과목' value="3" />
                        <DropZone onDropText={handleDropText} label='추가 교육과정' value="4" />
                        <DropZone onDropText={handleDropText} label='오프라인 공동 교육과정' value="5" />
                    </Panel>
                    <Panel size="medium" scroll>
                        <StatisticsInPanel />
                    </Panel>
                </div>
                <Panel size="large" scroll>
                    {/* <ComboBox
                        comboboxList={YEARS.map(t => ({ label: t, value: t }))}
                        value={year}
                        onChange={setYear}/> */}
                    <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: 10 }}>
                        <h4 style={{ marginTop: 1, marginBottom: 2 }}>📝 {year}학년도 신입생 교육과정 편성표</h4>
                        <div style={{ display: 'flex', gap: 2 }}>
                            <PushButton onClick={() => saveData(user)}>저장</PushButton>
                            <PushButton variant={"excel"} onClick={exprotToExcel}>엑셀출력</PushButton>
                        </div>
                    </div>

                    {/* <h5 style={{ marginTop: 1, marginBottom: 1 }}>1. 학교지정</h5> */}
                    <Table1 />
                    {/* <h5 style={{ marginTop: 1, marginBottom: 1 }}>2. 선택과목</h5> */}
                    <Table3 />
                    <Table4 />
                    <h4 style={{ marginTop: 1, marginBottom: 1 }}>📋 추가교육과정</h4>
                    <Table5 />
                    <h4 style={{ marginTop: 1, marginBottom: 1 }}>📋 공동교육과정</h4>
                    <Table6 />
                </Panel>

            </div>


        </>
    )
}