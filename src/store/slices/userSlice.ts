import type { StateCreator } from "zustand";
import type { SchoolJsonDataType } from "../../types/schoolJsontype";
import { GROUPDATA } from "../../data/subjectdata";

export interface UserSlice {
    year: string;
    setYear: (year: string) => void;
    user: Record<string, SchoolJsonDataType>
    // setUser: (data: Record<string, SchoolJsonDataType>) => Promise<void>
}

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

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
    year: '2025',
    setYear: (newYear) => set({ year: newYear }),
    user: {
        '2025': createDefaultYear(),
        '2026': createDefaultYear(),
        '2027': createDefaultYear(),
    }
    // setUser = 
})