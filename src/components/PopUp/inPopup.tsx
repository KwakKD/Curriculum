import { useEffect, useState } from "react";
import { SUBJECT } from "../../data/subjectdata";
import { toast } from "../../utils/toast";
import PushButton from "../PushButton/pushbutton";
import { useSchoolJsonDataStore } from "../../store/SubjectStore";


const lablestyle = {
    width: '100px',
    fontWeight: 1000,
    color: '#333',
}

const divstyle = {
    display: 'flex',
    paddingBottom: '20px'
}

const formstyle = {
    flex: 1,
    padding: '6px 8px',
    border: '1px solid #ccc',
    borderRadius: '8px'
}

const popCredit = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function InPopup({ onClose }: { onClose: () => void }) {
    const [popSubjectType, setPopSubjectType] = useState('진로')
    const [popSubjectGroup, setPopSubjectGroup] = useState('')
    const [popBasicCredit, setPopBasicCredit] = useState('');
    const [popMinCredit, setPopMinCredit] = useState('');
    const [popMaxCredit, setPopMaxCredit] = useState('');
    const [popMinCreditState, setPopMinCreditState] = useState(true);
    const [popMaxCreditState, setPopMaxCreditState] = useState(true);
    const [popSubjectName, setPopSubjectName] = useState('');

    const { user, year, addSubject } = useSchoolJsonDataStore()

    const add = () => {
        const tagNumber: number = user[year].AddSubject.length + SUBJECT.length + 1;
        if (popSubjectName === '') {
            toast.error('과목명을 입력하세요.');
            return
        } else {
            const duplicateSubject = [...SUBJECT.map(item => item.과목명), ...user[year].AddSubject.map(item => item.과목명)]
            if (duplicateSubject.includes(popSubjectName)) {
                toast.error(`"${popSubjectName}" 과목은 이미 존재하는 과목입니다.`);
                return
            }
        }
        if (popSubjectGroup === '') {
            toast.error('교과군을 선택하세요.');
            return
        }
        if (popBasicCredit === '') {
            toast.error('기준학점을 선택하세요.');
            return
        }
        if (popMinCredit === '') {
            toast.error('최소학점을 선택하세요.');
            return
        }
        if (popMaxCredit === '') {
            toast.error('최대학점을 선택하세요.');
            return
        }
        const basic = Number(popBasicCredit);
        const min = Number(popMinCredit);
        const max = Number(popMaxCredit);

        if (Number.isNaN(basic) || Number.isNaN(min) || Number.isNaN(max)) {
            toast.error('학점 값이 올바르지 않습니다.')
            return
        }
        if (min > max) {
            toast.error('최소학점이 최대학점보다 클 수 없습니다.')
            return
        }
        if (basic < min || basic > max) {
            toast.error('기준학점은 최소와 최대 사이에 있어야 합니다.')
            return
        }
        const newItem = {
            '과목명': popSubjectName,
            '교과군': popSubjectGroup,
            '유형': popSubjectType,
            '기준학점': Number(popBasicCredit),
            'Tag': tagNumber,
            '최소학점': Number(popMinCredit),
            '최대학점': Number(popMaxCredit)
        }

        addSubject(year, newItem);
        resetState();
        onClose();
        toast.success(`"${popSubjectName}"과목이 등록되었습니다.`)
    }

    const handleCancel = () => {
        resetState();
        onClose();
    }
    /**입력 과목 초기화 함수 */
    const resetState = () => {
        setPopSubjectName('');
        setPopSubjectGroup('');
        setPopSubjectType('진로');
        setPopBasicCredit('');
        setPopMinCredit('');
        setPopMaxCredit('');
        setPopMinCreditState(true);
        setPopMaxCreditState(true);
    }

    useEffect(() => {
        if (popBasicCredit !== '') {
            setPopMaxCreditState(false);
            setPopMinCreditState(false);
        } else {
            setPopMaxCreditState(true);
            setPopMinCreditState(true);
        }
    }, [popBasicCredit])

    return (
        <>
            <div style={divstyle}>
                <label style={lablestyle}>과목명</label>
                <input style={formstyle} onBlur={(e) => setPopSubjectName(e.target.value)} placeholder="예: 수학 탐구" />
            </div>
            <div style={divstyle}>
                <label style={lablestyle}>교과군</label>
                <select style={formstyle} onChange={(e) => setPopSubjectGroup(e.target.value)}>
                    <option value=''>교과군 선택</option>
                    <option value="국어">국어</option>
                    <option value="수학">수학</option>
                    <option value="영어">영어</option>
                    <option value="사회">사회</option>
                    <option value="과학">과학</option>
                    <option value="체육">체육</option>
                    <option value="예술">예술</option>
                    <option value="기술∙가정/정보">기술∙가정/정보</option>
                    <option value="제2외국어/한문">제2외국어/한문</option>
                    <option value="교양">교양</option>
                </select>
                <label style={lablestyle}>유형</label>
                <select style={formstyle} onChange={(e) => setPopSubjectType(e.target.value)}>
                    <option value="진로">진로</option>
                    <option value="융합">융합</option>
                </select>
            </div>
            <div style={divstyle}>
                <label style={lablestyle}>기준학점</label>
                <select style={formstyle} onChange={(e) => setPopBasicCredit(e.target.value)}>
                    <option value=''>학점선택</option>
                    {popCredit.map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
                <label style={lablestyle}>최소학점</label>
                <select style={formstyle} disabled={popMinCreditState} onChange={(e) => setPopMinCredit(e.target.value)}>
                    <option value=''>학점선택</option>
                    {popCredit.map(num => (
                        num < Number(popBasicCredit) + 1 ?
                            <option key={num} value={num}>{num}</option> :
                            null
                    ))}
                </select>
                <label style={lablestyle}>최대학점</label>
                <select style={formstyle} disabled={popMaxCreditState} onChange={(e) => setPopMaxCredit(e.target.value)}>
                    <option value=''>학점선택</option>
                    {popCredit.map(num => (
                        num > Number(popBasicCredit) - 1 ?
                            <option key={num} value={num}>{num}</option> :
                            null
                    ))}
                </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <PushButton onClick={add}>등록</PushButton>
                <PushButton variant="danger" onClick={handleCancel}>닫기</PushButton>
            </div>
        </>
    )
}