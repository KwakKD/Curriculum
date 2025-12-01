import type { StateCreator } from "zustand";
import type { JsonData } from "../../types/schoolJsontype";
import type { UserSlice } from "./userSlice";

export interface Table1Slice {
    addTable1: (year: string, item: JsonData[]) => void
    inputTable1: (year: string, tag: number, partial: Partial<JsonData>) => void
    deleteTable1: (year: string, Tag: number) => void
}
export const createTable1Slice: StateCreator<Table1Slice & UserSlice, [], [], Table1Slice> = (set) => ({
    addTable1: (year, item) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                '학교지정': item
            }
        }
    })),
    inputTable1: (year, tag, partial) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                '학교지정': state.user[year].학교지정.map((item) =>
                    item.Tag === tag ? { ...item, ...partial } : item)
            }
            // '학교지정': state.user.학교지정.map((item) =>
            //     item.Tag === tag ? { ...item, ...partial } : item)
        }
    })),
    deleteTable1: (year, Tag) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                '학교지정': state.user[year].학교지정.filter(sub => sub.Tag! == Tag)
            }
            // '학교지정': state.user.학교지정.filter(sub => sub.Tag !== Tag)
        }
    }))
})