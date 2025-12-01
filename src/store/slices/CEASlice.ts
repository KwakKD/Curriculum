import type { StateCreator } from "zustand";
import type { UserSlice } from "./userSlice";

export interface CEAChangeSlice {
    changeCEA: (year: string, key: string, credit: number) => void;
}

export const createChangeCEASlice: StateCreator<UserSlice & CEAChangeSlice, [], [], CEAChangeSlice> = (set) => ({
    changeCEA: (year, key, credit) => set((state) => ({
        user: {
            ...state.user,
            [year] : {
                ...state.user[year],
                CEA: {
                    ...state.user[year].CEA,
                    [key]: credit
                }
            }
            // CEA: {
            //     ...state.user.CEA,
            //     [key]: credit
            // }
        }
    }))
})