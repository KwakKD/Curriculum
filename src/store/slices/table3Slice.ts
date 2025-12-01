import type { StateCreator } from "zustand";
import type { JsonData } from "../../types/schoolJsontype";
import type { UserSlice } from "./userSlice";

export interface Table3Slice {
    addTable3: (year: string, item: JsonData[]) => void
    inputTable3: (year: string, tag: number, partial: Partial<JsonData>) => void
}

export const createTable3Slice: StateCreator<Table3Slice & UserSlice, [], [], Table3Slice> = (set) => ({
    addTable3: (year, item) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                '선택과목': item
            }
            // '선택과목': item
        }
    })),
    inputTable3: (year, tag, partial) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                '선택과목': state.user[year].선택과목.map((item) =>
                    item.Tag === tag ? { ...item, ...partial } : item)
            }
            // '선택과목': state.user.선택과목.map((item) =>
            //     item.Tag === tag ? { ...item, ...partial } : item)
        }
    }))
})