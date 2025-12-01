import { create } from "zustand";
import type { SchoolJsonDataType } from "../../types/schoolJsontype";
import { GROUPDATA } from "../../data/subjectdata";

type YearKey = '2025' | '2026' | '2027';

const createDefaultYear = (): SchoolJsonDataType => ({
    '학교지정': [],
    '선택과목': [],
    '추가교육과정': [],
    '공동교육과정': [],
    'Group': GROUPDATA,
    'AddSubject': [],
    'CEA': {
        '1-1': 0,
        '1-2': 0,
        '2-1': 0,
        '2-2': 0,
        '3-1': 0,
        '3-2': 0,
    },
});

export interface YearSlice {
    year: YearKey | string;
    setYear: (year: string) => void;
    curriculum: Record<YearKey, SchoolJsonDataType>;
    setCurriculum: (year: YearKey, item: SchoolJsonDataType) => void;
}

export const useCurriculum = create<YearSlice>((set) => ({
    year: '2025',

    setYear: (newYear) => set({ year: newYear }),

    curriculum: {
        '2025': createDefaultYear(),
        '2026': createDefaultYear(),
        '2027': createDefaultYear(),
    },

    setCurriculum: (newYear, item) =>
        set((state) => ({
            curriculum: {
                ...state.curriculum,
                [newYear]: item,
            },
        })),
}));
