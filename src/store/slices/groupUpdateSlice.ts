import type { StateCreator } from "zustand";
import type { UserSlice } from "./userSlice";
import type { GroupCell } from "../../types/schoolJsontype";

export interface GroupUpdateSlice {
    groupUpdate: (year: string, key: string, item: GroupCell) => void;
}

export const createGroupUpdateSlice: StateCreator<UserSlice & GroupUpdateSlice, [], [], GroupUpdateSlice> = (set) => ({
    groupUpdate: (year, key, item) => set((state) => ({
        user: {
            ...state.user,
            [year]: {
                ...state.user[year],
                Group: {
                    ...state.user[year].Group,
                    [key]: {
                        ...state.user[year].Group[key],
                        ...item
                    }
                }
            }
            // Group: {
            //     ...state.user.Group,
            //     [key]: {
            //         ...state.user.Group[key],
            //         ...item,
            //     }
            // }
        }
    }))
})

// 그룹 삭제 기능
// 1. 그룹 key값과 Tag값을 가져온다.
// 2. key값을 이용해서 group에 접근하고, Subject에서 Tag값을 제외한다.
// 만약 Subject의 길이가 1이면 그룹 초기화를 시킨다.
// 만약 Subject의 길이가 2이상이면 해당 과목만 삭제 시킨다.