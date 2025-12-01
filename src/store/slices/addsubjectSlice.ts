import type { StateCreator } from "zustand";
import type { SubjectType } from "../../types/schoolJsontype";
import type { UserSlice } from "./userSlice";

export interface AddSubjectSlice {
    addSubject: (year: string, item: SubjectType) => void;
    delSubject: (year: string, item: SubjectType[]) => void; 
}

export const createSubjectSlice: StateCreator<UserSlice & AddSubjectSlice,[],[],AddSubjectSlice> = (set) => ({
    addSubject: (year, item) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                AddSubject: [...state.user[year].AddSubject, item]
            }
        },
    })),
    delSubject : (year, item)=>set((state)=>({
        user: {
            ...state.user,
            [year] : {
                ...state.user[year],
                AddSubject : item
            }
        }
    }))
})