import type { StateCreator } from "zustand";
import type { JsonData } from "../../types/schoolJsontype";
import type { UserSlice } from "./userSlice";

export interface Table6Slice {
    addTable6: (year: string, item: JsonData[]) => void
    inputTable6: (year: string, tag: number, partial: Partial<JsonData>) => void
}

export const createTable6Slice: StateCreator<Table6Slice & UserSlice, [], [], Table6Slice> = (set) => ({
    addTable6: (year, item) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                '공동교육과정': item
            }
        }
    })),
    inputTable6: (year, tag, parital) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                '공동교육과정': state.user[year].공동교육과정.map((item) =>
                    item.Tag === tag ? { ...item, ...parital } : item)
            }

        }
    }))
})