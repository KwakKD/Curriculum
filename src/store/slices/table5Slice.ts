import type { StateCreator } from "zustand";
import type { JsonData } from "../../types/schoolJsontype";
import type { UserSlice } from "./userSlice";

export interface Table5Slice {
    addTable5: (year: string, item: JsonData[]) => void
    inputTable5: (year: string, tag: number, partial: Partial<JsonData>) => void
}

export const createTable5Slice: StateCreator<Table5Slice & UserSlice, [], [], Table5Slice> = (set) => ({
    addTable5: (year, item) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                '추가교육과정': item
            }
            // '추가교육과정': item
        }
    })),
    inputTable5: (year, tag, parital) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                '추가교육과정': state.user[year].추가교육과정.map((item) =>
                    item.Tag === tag ? { ...item, ...parital } : item)
            }
            // '추가교육과정': state.user.추가교육과정.map((item) =>
            //     item.Tag === tag ? { ...item, ...parital } : item)
        }
    }))
})