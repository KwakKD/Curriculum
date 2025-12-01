import { useMemo } from "react";
import { useSchoolJsonDataStore } from "../store/SubjectStore";
import { SUBJECT } from "../data/subjectdata";

export function useStatistics() {
    const year = useSchoolJsonDataStore().year
    const groupInfo = useSchoolJsonDataStore((s) => s.user[year].Group);
    const table1Data = useSchoolJsonDataStore((s) => s.user[year].학교지정);
    const table3Data = useSchoolJsonDataStore((s) => s.user[year].선택과목);
    const addsubject = useSchoolJsonDataStore((s) => s.user[year].AddSubject);

    const union = [...SUBJECT, ...addsubject];

    const statistics_1 = useMemo(() => {
        const cache: Record<string, number> = {};

        for (let grade = 1; grade <= 3; grade++) {
            for (let sem = 1; sem <= 2; sem++) {
                let fixNoGroup = 0;
                let fixIsGroup = 0;

                Object.keys(groupInfo).forEach((key) => {
                    const g = groupInfo[key];
                    if (g.Zone === "학교지정" && g.Grade === grade) {
                        fixIsGroup += g.Credit ?? 0;
                    }
                });

                fixNoGroup = table1Data
                    .filter(
                        (item) =>
                            item.Grade === grade &&
                            item.Semester === sem &&
                            item.IsGroup === ""
                    )
                    .reduce((sum, item) => sum + Number(item.Credit), 0);

                cache[`${grade}-${sem}`] = fixIsGroup + fixNoGroup;
            }
        }

        return cache;
    }, [table1Data, groupInfo]);

    const allCredit_1 = useMemo(() => {
        return Object.values(statistics_1).reduce((sum, val) => sum + val, 0);
    }, [statistics_1]);

    const statistics_3 = useMemo(() => {
        const cache: Record<string, number> = {};
        for (let grade = 1; grade <= 3; grade++) {
            for (let sem = 1; sem <= 2; sem++) {
                let choiceCredit = 0;
                Object.keys(groupInfo).forEach((key) => {
                    const g = groupInfo[key];
                    if (g.Zone === "선택과목" && g.Grade === grade && g.Semester === sem) {
                        const sumCredit = (g.Credit ?? 0) * (g.Choice ?? 0);
                        choiceCredit += sumCredit;
                    }
                });
                cache[`${grade}-${sem}`] = choiceCredit;
            }
        }
        return cache;
    }, [table3Data, groupInfo]);

    const allCredit_3 = useMemo(() => {
        return Object.values(statistics_3).reduce((sum, val) => sum + val, 0);
    }, [statistics_3]);

    const noGradeSubject = union
        .filter(item => (item.교과군 === '교양') ||
            (item.교과군 === '사회' && item.유형 === '융합') ||
            (item.교과군 === '과학' && item.유형 === '융합') ||
            ['과학탐구실험1', '과학탐구실험2'].includes(item.과목명))
        .map(item => item.Tag);

    const statistics_subjectNumber = useMemo(() => {
        const cache: Record<string, string> = {};
        for (let grade = 1; grade <= 3; grade++) {
            for (let sem = 1; sem <= 2; sem++) {
                let subjectnumber: string | Number = 0;
                let subjectIn = 0;
                let subjectOut = 0;

                subjectIn = table1Data.filter(item => item.Grade === grade && item.Semester === sem && item.IsGroup === '' && !noGradeSubject.includes(item.Tag)).length;
                subjectOut = table1Data.filter(item => item.Grade === grade && item.Semester === sem && item.IsGroup === '' && noGradeSubject.includes(item.Tag)).length;

                Object.keys(groupInfo).forEach(key => {
                    if (groupInfo[key].Zone === '학교지정' && groupInfo[key].Grade === grade) {
                        const queryData = groupInfo[key].Subject.filter(tag => !noGradeSubject.includes(tag)).length;
                        if (queryData === 0) {
                            subjectOut = subjectOut + 1
                        } else {
                            subjectIn = subjectIn + 1
                        }
                    } else if (groupInfo[key].Zone === '선택과목' && groupInfo[key].Grade === grade && groupInfo[key].Semester === sem) {
                        const queryData = groupInfo[key].Subject.filter(tag => !noGradeSubject.includes(tag)).length
                        if (queryData === 0) {
                            subjectOut = subjectOut + Number(groupInfo[key].Choice)
                        } else if (queryData >= Number(groupInfo[key].Choice)) {
                            subjectIn = subjectIn + Number(groupInfo[key].Choice);
                        } else if (queryData < Number(groupInfo[key].Choice)) {
                            subjectIn = subjectIn + queryData
                            subjectOut = Number(groupInfo[key].Choice) - queryData;
                        }
                    }
                })
                if (subjectOut === 0) {
                    subjectnumber = String(subjectIn);
                } else {
                    subjectnumber = subjectIn + ' (' + subjectOut + ')'
                }
                cache[`${grade}-${sem}`] = subjectnumber
            }
        }
        return cache;
    }, [addsubject, union, table1Data, table3Data, groupInfo])

    const KMESubjectTag = union
        .filter(item => ['국어', '수학', '영어'].includes(item.교과군))
        .map(item => item.Tag);

    const statistics_KEM = useMemo(() => {
        let creditKME = 0
        const noGroupFixSubject = table1Data.filter(item => item.IsGroup === '');
        const checkBasicSubject = noGroupFixSubject.filter(sub => KMESubjectTag.includes(sub.Tag));
        creditKME = checkBasicSubject.reduce((sum, item) => sum + Number(item.Credit), 0)

        let minCredit = 0
        let maxCredit = 0

        Object.keys(groupInfo).forEach(key => {
            const inQueryData = groupInfo[key].Subject.filter(item => KMESubjectTag.includes(item))
            const outQueryData = groupInfo[key].Subject.filter(item => !KMESubjectTag.includes(item))
            if (groupInfo[key].Zone !== '학교지정') {
                if (groupInfo[key].Subject.length > 0) {
                    if (outQueryData.length === 0) {
                        minCredit = minCredit + Number(groupInfo[key].Choice) * Number(groupInfo[key].Credit)
                        maxCredit = maxCredit + Number(groupInfo[key].Choice) * Number(groupInfo[key].Credit)
                    } else if (inQueryData.length < Number(groupInfo[key].Choice)) {
                        maxCredit = maxCredit + inQueryData.length * Number(groupInfo[key].Credit);
                        if (outQueryData.length < Number(groupInfo[key].Choice)) {
                            minCredit = minCredit + (Number(groupInfo[key].Choice) - outQueryData.length) * Number(groupInfo[key].Credit);
                        }
                    } else if (inQueryData.length >= Number(groupInfo[key].Choice)) {
                        maxCredit = maxCredit + inQueryData.length * Number(groupInfo[key].Credit);
                        if (outQueryData.length < Number(groupInfo[key].Choice)) {
                            minCredit = minCredit + (Number(groupInfo[key].Choice) - outQueryData.length) * Number(groupInfo[key].Credit)
                        }
                    }
                }
            } else {
                if (groupInfo[key].Subject.length > 0) {
                    if (inQueryData.length === 2) {
                        minCredit = minCredit + Number(groupInfo[key].Credit) * 2;
                        maxCredit = maxCredit + Number(groupInfo[key].Credit) * 2;
                    } else if (inQueryData.length === 1) {
                        minCredit = minCredit + Number(groupInfo[key].Credit);
                        maxCredit = maxCredit + Number(groupInfo[key].Credit);
                    }
                }
            }
        })

        maxCredit = maxCredit + creditKME;
        minCredit = minCredit + creditKME;

        return { 'min': minCredit, 'max': maxCredit };
    }, [table1Data, groupInfo, union])

    const subjectGroupList = ['국어', '수학', '영어', '사회', '과학', '체육', '예술', '생활교양'];
    const etc = ['기술∙가정/정보', '제2외국어/한문', '교양'];

    const statistics_subjectCreditCheck = useMemo(() => {
        const cache: Record<string, number[]> = {};

        subjectGroupList.forEach(sub => {
            let subtag;
            if (sub !== '생활교양') {
                subtag = union.filter(item => item.교과군 === sub).map(item => item.Tag);
            } else {
                subtag = union.filter(item => etc.includes(item.교과군)).map(item => item.Tag)
            }

            let subcredit = 0;
            if (table1Data.length > 0) {
                let queryData;
                if (sub === '사회') {
                    queryData = table1Data.filter(item => item.IsGroup === '' && item.SubjectGroup === sub && !['한국사1', '한국사2'].includes(item.SubjectName))
                } else if (sub === '생활교양') {
                    queryData = table1Data.filter(item => item.IsGroup === '' && etc.includes(item.SubjectGroup));
                } else {
                    queryData = table1Data.filter(item => item.IsGroup === '' && item.SubjectGroup === sub);
                }
                subcredit = queryData.reduce((sum, item) => sum + Number(item.Credit), 0);
            }

            let minCredit = 0;
            let maxCredit = 0;

            Object.keys(groupInfo).forEach(key => {
                const inQueryData = groupInfo[key].Subject.filter(item => subtag.includes(item));
                const outQueryData = groupInfo[key].Subject.filter(item => !subtag.includes(item));
                if (groupInfo[key].Zone !== "학교지정") {
                    if (groupInfo[key].Subject.length > 0) {
                        if (outQueryData.length === 0) {
                            minCredit = minCredit + Number(groupInfo[key].Choice) * Number(groupInfo[key].Credit);
                            maxCredit = maxCredit + Number(groupInfo[key].Choice) * Number(groupInfo[key].Credit);
                        } else if (inQueryData.length < Number(groupInfo[key].Choice)) {
                            maxCredit = maxCredit + inQueryData.length * Number(groupInfo[key].Credit);
                            if (outQueryData.length < Number(groupInfo[key].Choice)) {
                                minCredit = minCredit + (Number(groupInfo[key].Choice) - outQueryData.length) * Number(groupInfo[key].Credit);
                            }
                        } else if (inQueryData.length >= Number(groupInfo[key].Choice)) {
                            maxCredit = maxCredit + inQueryData.length * Number(groupInfo[key].Credit);
                            if (outQueryData.length < Number(groupInfo[key].Choice)) {
                                minCredit = minCredit + (Number(groupInfo[key].Choice) - outQueryData.length) * Number(groupInfo[key].Credit);
                            }
                        }
                    }
                } else {
                    if (groupInfo[key].Subject.length > 0) {
                        if (inQueryData.length === 2) {
                            minCredit = minCredit + Number(groupInfo[key].Credit) * 2;
                            maxCredit = maxCredit + Number(groupInfo[key].Credit) * 2;
                        } else if (inQueryData.length === 1) {
                            minCredit = minCredit + Number(groupInfo[key].Credit);
                            maxCredit = maxCredit + Number(groupInfo[key].Credit);
                        }
                    }
                }
            })

            minCredit = minCredit + subcredit;
            maxCredit = maxCredit + subcredit;

            cache[`${sub}`] = [minCredit, maxCredit];
        })
        return cache
    }, [table1Data, groupInfo, union])
    return { statistics_1, statistics_3, allCredit_1, allCredit_3, statistics_subjectNumber, statistics_KEM, statistics_subjectCreditCheck };
} 