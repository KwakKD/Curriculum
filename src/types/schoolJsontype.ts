/**JsonData로 들어가는 단일 과목의 구성 */
export type JsonData = {
    Section: string,
    IsGroup: string,
    SubjectGroup: string,
    SubjectProperty: string,
    SubjectName: string,
    BasicCredit: number,
    Tag: number,
    Grade: number | string | null,
    Semester: number | string | null,
    Credit: number | string | null,
    IsTable: number | null
}

// export type CEAtype = {
//     '1-1': number
//     '1-2': number
//     '2-1': number
//     '2-2': number
//     '3-1': number
//     '3-2': number
// }

export type SubjectType = {
    '과목명': string;
    '교과군': string;
    '유형': string;
    '기준학점': number;
    'Tag': number;
    '최소학점': number;
    '최대학점': number;
}


export type SchoolJsonDataType = {
    "학교지정": JsonData[],
    "선택과목": JsonData[],
    "추가교육과정": JsonData[],
    "공동교육과정": JsonData[],
    "Group": GroupData,
    "AddSubject": SubjectType[],
    "CEA": CEAtype
}

export interface GroupCell {
    Zone: string | null;
    Subject: number[]; // 문자열 배열
    Grouptag: number | null
    Credit: number | null;
    Grade: number | null;
    Semester: number | null;
    Choice: number | null;
}

export type GroupData = Record<string, GroupCell>;
export type CEAtype = Record<string, number>;

export const schoolJsonData: SchoolJsonDataType = {
    "학교지정": [],
    "선택과목": [],
    "추가교육과정": [],
    "공동교육과정": [],
    "Group": {},
    "AddSubject": [],
    "CEA": {
        '1-1': 0,
        '1-2': 0,
        '2-1': 0,
        '2-2': 0,
        '3-1': 0,
        '3-2': 0
    }
}