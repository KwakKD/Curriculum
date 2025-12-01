import { SUBJECT } from "../data/subjectdata";
import { useSchoolJsonDataStore } from "../store/SubjectStore";
import type { JsonData } from "../types/schoolJsontype";
import { toast } from "./toast";

export function duplicateSuject_1(year: string, dropMap: Map<number, string>) {
    let existingTags = new Map;
    let state = true;

    const user = useSchoolJsonDataStore.getState().user[year];

    (Object.keys(user) as Array<keyof typeof user>).forEach((key) => {
        if (key === 'Group' || key === 'AddSubject' || key === 'CEA') {
            return
        } else {
            const zoneTags = user[key].map(item => item.Tag);
            existingTags.set(key, zoneTags)
        }
    })

    const dropTags = [...dropMap.keys()]

    existingTags.forEach((value, key) => {
        const duplicated = dropTags.filter(tag => value.includes(tag));
        duplicated.forEach(tag => {
            const errorsubject = dropMap.get(tag);
            toast.error(`"${errorsubject}" 과목은 이미 "${key}"에 추가되어 있어요!`);
            state = false;
        })
    })
    return state;
}

export function duplicateSuject_2(
    dropMap: Map<number, string>,
    selectGrade: number | null,
    selectSemester: number | null,
    year: string) {
    let existingTags = new Map;
    let state = true;
    const user = useSchoolJsonDataStore.getState().user[year];

    (Object.keys(user) as Array<keyof typeof user>).forEach((key) => {
        if (key === 'Group' || key === 'AddSubject' || key === 'CEA') {
            return
        } else {
            const zoneTags = user[key].map(item => item.Tag);
            existingTags.set(key, zoneTags)
        }
    })

    const dropTags = [...dropMap.keys()];
    for (const [key, value] of existingTags) {
        if (key === '선택과목') {
            const duplicated = dropTags.filter(tag => value.includes(tag));
            duplicated.forEach(tag => {
                const errorsubject = user.선택과목.filter(item => item.Tag === tag);
                if (errorsubject.length > 0) {
                    for (let i = 0; i <= errorsubject.length - 1; i++) {
                        if (Number(errorsubject[i].Grade) === selectGrade && Number(errorsubject[i].Semester) === selectSemester) {
                            toast.error(`"${dropMap.get(tag)}"과목은 ${errorsubject[i].Grade}학년 ${errorsubject[i].Semester}학기 "${errorsubject[i].IsGroup}"에 이미 속해있습니다.`);
                            state = false;
                        }
                    }
                }
            })
        } else {
            const duplicated = dropTags.filter(tag => value.includes(tag));
            duplicated.forEach(tag => {
                const errorsubject = dropMap.get(tag);
                toast.error(`"${errorsubject}" 과목은 이미 "${key}"에 추가되어 있어요!`);
                state = false;
            })
        }
    }
    return state;
}

export function inJsonData1(
    tags: number[],
    selectGroup: string,
    selectGrade: number | null,
    selectSemester: number | null,
    selectCredit: number | null,
    year: string) {
    const newItem: JsonData[] = [];

    let existingTags: number[] = [];
    const user = useSchoolJsonDataStore.getState().user[year];
    const unionSubject = [...SUBJECT, ...user.AddSubject]

    user.학교지정.forEach(item => existingTags.push(item.Tag));
    existingTags = [...existingTags, ...tags];

    existingTags.forEach((tagNum) => {
        const inData = unionSubject.filter(sub => sub.Tag === tagNum)[0];
        if (tags.includes(tagNum)) {
            const inItem = {
                Section: "학교지정",
                IsGroup: selectGroup,
                SubjectGroup: inData.교과군,
                SubjectProperty: inData.유형,
                SubjectName: inData.과목명,
                BasicCredit: inData.기준학점,
                Tag: inData.Tag,
                Grade: selectGrade,
                Semester: selectSemester,
                Credit: selectCredit,
                IsTable: null
            }
            newItem.push(inItem);
        } else {
            newItem.push(user.학교지정.filter(sub => sub.Tag === tagNum)[0])
        }

    })
    console.log('newItem : ', newItem)

    return set_sort1(newItem);
}

export function inJsonData3(
    tags: number[],
    selectGroup: string,
    selectGrade: number | null,
    selectSemester: number | null,
    selectCredit: number | null,
    year: string) {
    let newItem: JsonData[] = []
    const user = useSchoolJsonDataStore.getState().user[year];
    const unionSubject = [...SUBJECT, ...user.AddSubject]
    let existingTags: number[] = [];
    user.선택과목.forEach(item => existingTags.push(item.Tag));
    // existingTags = [...existingTags, ...tags];
    tags.forEach((tagNum) => {
        const inData = unionSubject.filter(sub => sub.Tag === tagNum)[0]
        const inItem = {
            Section: "선택과목",
            IsGroup: selectGroup,
            SubjectGroup: inData.교과군,
            SubjectProperty: inData.유형,
            SubjectName: inData.과목명,
            BasicCredit: inData.기준학점,
            Tag: inData.Tag,
            Grade: selectGrade,
            Semester: selectSemester,
            Credit: selectCredit,
            IsTable: null
        }
        newItem.push(inItem);
    })
    newItem = [...user.선택과목, ...newItem]
    console.log(newItem)
    return set_sort3(newItem);
}

export function inJsonData5(tags: number[], year: string) {
    const newItem: JsonData[] = [];

    let existingTags: number[] = [];
    const user = useSchoolJsonDataStore.getState().user[year];
    const unionSubject = [...SUBJECT, ...user.AddSubject]

    user.추가교육과정.forEach(item => existingTags.push(item.Tag));
    existingTags = [...existingTags, ...tags];
    existingTags.forEach((tagNum) => {
        const inData = unionSubject.filter(sub => sub.Tag === tagNum)[0];
        if (tags.includes(tagNum)) {
            const inItem: JsonData = {
                Section: "추가교육과정",
                IsGroup: '',
                SubjectGroup: inData.교과군,
                SubjectProperty: inData.유형,
                SubjectName: inData.과목명,
                BasicCredit: inData.기준학점,
                Tag: inData.Tag,
                Grade: null,
                Semester: null,
                Credit: null,
                IsTable: null
            }
            newItem.push(inItem);
        } else {
            newItem.push(user.추가교육과정.filter(sub => sub.Tag === tagNum)[0])
        }

    })
    return set_sort(newItem)
}

export function inJsonData6(tags: number[], year: string) {
    const newItem: JsonData[] = [];

    let existingTags: number[] = [];
    const user = useSchoolJsonDataStore.getState().user[year];
    const unionSubject = [...SUBJECT, ...user.AddSubject]

    user.공동교육과정.forEach(item => existingTags.push(item.Tag));
    existingTags = [...existingTags, ...tags];
    existingTags.forEach((tagNum) => {
        const inData = unionSubject.filter(sub => sub.Tag === tagNum)[0];
        if (tags.includes(tagNum)) {
            const inItem: JsonData = {
                Section: "공동교육과정",
                IsGroup: '',
                SubjectGroup: inData.교과군,
                SubjectProperty: inData.유형,
                SubjectName: inData.과목명,
                BasicCredit: inData.기준학점,
                Tag: inData.Tag,
                Grade: null,
                Semester: null,
                Credit: null,
                IsTable: null
            }
            newItem.push(inItem);
        } else {
            newItem.push(user.공동교육과정.filter(sub => sub.Tag === tagNum)[0])
        }

    })
    return set_sort(newItem)
}

export function set_sort(newItem: JsonData[]) {
    newItem.sort((a, b) => a.Tag - b.Tag);
    newItem.forEach((sub, idx) => sub.IsTable = idx + 1)
    return newItem
}

export function set_sort1(newItem: JsonData[]) {
    interface groupedListType {
        type: string
        tag: number
        subject: number[]
    }
    const year = useSchoolJsonDataStore.getState().year
    const user = useSchoolJsonDataStore.getState().user[year];
    const groupedList: groupedListType[] = [];
    const soloData: number[] = [];
    newItem.forEach((item) => {
        if (item.IsGroup === '' || item.IsGroup === null) soloData.push(item.Tag);
    });

    (Object.keys(user.Group) as Array<keyof typeof user.Group>).forEach((key) => {
        if (user.Group[key].Zone === '학교지정') {
            if (user.Group[key].Grouptag) {
                groupedList.push({ type: key, tag: user.Group[key].Grouptag, subject: user.Group[key].Subject });
            }
        }
    })

    const combine = [...soloData.map(item => ({ type: '', tag: item, subject: Array(item) })), ...groupedList];
    combine.sort((a, b) => a.tag - b.tag);

    const result = new Map()

    for (const item of combine) {
        if (item.type === '') {
            result.set(item.tag, item.type);
        } else {
            item.subject.forEach(data => result.set(data, item.type))
        }
    }

    const newData: JsonData[] = [];
    let index: number = 1;

    for (const [data, group] of result) {
        const arritem = newItem.filter(searchtag => searchtag.Tag === data)[0];
        newData.push(
            {
                Section: "학교지정",
                IsGroup: group,
                SubjectGroup: arritem.SubjectGroup,
                SubjectProperty: arritem.SubjectProperty,
                SubjectName: arritem.SubjectName,
                BasicCredit: arritem.BasicCredit,
                Tag: data,
                Grade: arritem.Grade,
                Semester: arritem.Semester,
                Credit: arritem.Credit,
                IsTable: index
            }
        )
        index++;
    }
    return newData;
}

export function set_sort3(newItem: JsonData[]) {
    let index = 1; //table에 채워질 행 번호

    newItem.forEach(item => item.IsTable = null);
    newItem.sort((a, b) => a.Tag - b.Tag)
    //각 학년을 돌면서
    for (let i = 1; i <= 3; i++) {
        //학년에 해당되는 과목을 가져온다.
        let gradeItemList = newItem.filter(item => item.Grade === i);
        //과목 Tag순으로 나열한다.
        gradeItemList.sort((a, b) => a.Tag - b.Tag);
        //만약 과목이 없으면 넘어간다.
        if (gradeItemList.length === 0) continue;
        //가장 Tag가 낮은 과목이 속한 학기를 sem이라 한다.
        let sem = gradeItemList[0].Semester;
        //학년에 해당되는 과목이 모두 행에 들어갈떄까지 반복한다.
        while (gradeItemList.filter(item => item.IsTable === null).length > 0) {
            //학년에 채워진 과목 중 table에 들어가지 않은 과목을 가져온다.
            gradeItemList = newItem.filter(item => item.Grade === i && item.IsTable === null);
            //만약 Tag가 가장 낮은 과목이 속한 그룹이 1학기라면,
            if (sem === 1) {
                // 그 과목이 속한 과목의 그룹.
                let firstgroup: string | null = gradeItemList[0].IsGroup;
                let secondgroup: string | null = null;
                let finditem = null;

                while (firstgroup !== null || secondgroup !== null) {
                    //1학기에만 속한 과목을 배열
                    finditem = gradeItemList.filter(item => item.IsGroup === firstgroup && item.IsTable === null);
                    finditem.forEach(item => {
                        let findsub = gradeItemList.filter(sub => sub.Tag === item.Tag);
                        if (findsub.length === 1) {
                            item.IsTable = index;
                            index = index + 1;
                            //1,2학기 동시에 속한 과목이 있다면 그 그룹을 찾는다.
                        } else if (findsub.length > 1 && secondgroup === null) {
                            secondgroup = findsub.filter(sub => sub.IsGroup !== firstgroup)[0].IsGroup;
                        }
                    })
                    //만약 2학기에 속한 과목이 없다면 while문을 벗어난다.
                    if (secondgroup === null) break;
                    //1,2학기 동시에 속한 과목을 table에 넣는다.
                    finditem = gradeItemList.filter(item => (item.IsGroup === firstgroup || item.IsGroup === secondgroup) && item.IsTable === null);
                    finditem.sort((a, b) => a.Tag - b.Tag);
                    finditem.forEach(item => {
                        let findsub = gradeItemList.filter(sub => sub.Tag === item.Tag);
                        if (findsub.length === 2 && findsub.filter(table => table.IsTable === null).length === 2) {
                            item.IsTable = index;
                            // index = index + 1;
                        } else if (findsub.length === 2 && findsub.filter(table => table.IsTable === null).length === 1) {
                            item.IsTable = index;
                            index = index + 1;
                        }
                    })

                    firstgroup = null;

                    finditem = gradeItemList.filter(item => item.IsGroup === secondgroup && item.IsTable === null);
                    finditem.forEach(item => {
                        let findsub = gradeItemList.filter(sub => sub.Tag === item.Tag && item.IsTable === null);
                        if (findsub.length === 1) {
                            item.IsTable = index;
                            index = index + 1;
                        } else if (findsub.length > 1 && firstgroup === null) {
                            firstgroup = findsub.filter(sub => sub.IsGroup !== secondgroup)[0].IsGroup;
                        }
                    })

                    if (firstgroup === null) {
                        secondgroup = null;
                    } else {
                        finditem = gradeItemList.filter(item => (item.IsGroup === firstgroup || item.IsGroup === secondgroup) && item.IsTable === null);
                        finditem.sort((a, b) => a.Tag - b.Tag);
                        finditem.forEach(item => {
                            let findsub = gradeItemList.filter(sub => sub.Tag === item.Tag);
                            if (findsub.length === 2 && findsub.filter(table => table.IsTable === null).length === 2) {
                                item.IsTable = index;
                                // index = index + 1;
                            } else if (findsub.length === 2 && findsub.filter(table => table.IsTable === null).length === 1) {
                                item.IsTable = index;
                                index = index + 1;
                            }
                        })
                    }
                }
            } else {
                let firstgroup: string | null = null;
                let secondgroup: string | null = gradeItemList[0].IsGroup;
                let finditem = null;

                while (firstgroup !== null || secondgroup !== null) {
                    finditem = gradeItemList.filter(item => item.IsGroup === secondgroup && item.IsTable === null);
                    finditem.forEach(item => {
                        let findsub = gradeItemList.filter(sub => sub.Tag === item.Tag && item.IsTable === null);
                        if (findsub.length > 1 && firstgroup === null) {
                            firstgroup = findsub.filter(sub => sub.IsGroup !== secondgroup)[0].IsGroup;
                        }
                    })

                    finditem = gradeItemList.filter(item => item.IsGroup === firstgroup && item.IsTable === null);
                    finditem.forEach(item => {
                        let findsub = gradeItemList.filter(sub => sub.Tag === item.Tag);
                        if (findsub.length === 1) {
                            item.IsTable = index;
                            index = index + 1;
                        }
                    })

                    finditem = gradeItemList.filter(item => (item.IsGroup === firstgroup || item.IsGroup === secondgroup) && item.IsTable === null);
                    finditem.sort((a, b) => a.Tag - b.Tag);
                    finditem.forEach(item => {
                        let findsub = gradeItemList.filter(sub => sub.Tag === item.Tag);
                        if (findsub.length === 2 && findsub.filter(table => table.IsTable === null).length === 2) {
                            item.IsTable = index;
                            // index = index + 1;
                        } else if (findsub.length === 2 && findsub.filter(table => table.IsTable === null).length === 1) {
                            item.IsTable = index;
                            index = index + 1;
                        }
                    })

                    firstgroup = null;

                    finditem = gradeItemList.filter(item => item.IsGroup === secondgroup && item.IsTable === null);
                    finditem.forEach(item => {
                        let findsub = gradeItemList.filter(sub => sub.Tag === item.Tag && item.IsTable === null);
                        if (findsub.length === 1) {
                            item.IsTable = index;
                            index = index + 1;
                        } else if (findsub.length > 1 && firstgroup === null) {
                            firstgroup = findsub.filter(sub => sub.IsGroup !== secondgroup)[0].IsGroup;
                        }
                    })

                    if (firstgroup === null) {
                        secondgroup = null;
                    } else {
                        finditem = gradeItemList.filter(item => (item.IsGroup === firstgroup || item.IsGroup === secondgroup) && item.IsTable === null);
                        finditem.sort((a, b) => a.Tag - b.Tag);
                        finditem.forEach(item => {
                            let findsub = gradeItemList.filter(sub => sub.Tag === item.Tag);
                            if (findsub.length === 2 && findsub.filter(table => table.IsTable === null).length === 2) {
                                item.IsTable = index;
                                // index = index + 1;
                            } else if (findsub.length === 2 && findsub.filter(table => table.IsTable === null).length === 1) {
                                item.IsTable = index;
                                index = index + 1;
                            }
                        })
                    }
                }
            }
        }
    }
    newItem.sort((a, b) =>
        (a.IsTable !== b.IsTable && a.IsTable && b.IsTable) ? a.IsTable - b.IsTable :
            (a.Semester !== b.Semester && a.Semester && b.Semester) ? Number(a.Semester) - Number(b.Semester) :
                Number(a.Grade) - Number(b.Grade))

    return newItem;
}