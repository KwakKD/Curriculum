import { create } from "zustand";
import { createSubjectSlice, type AddSubjectSlice } from "./slices/addsubjectSlice";
import { createUserSlice, type UserSlice } from "./slices/userSlice";
import { createGroupUpdateSlice, type GroupUpdateSlice } from "./slices/groupUpdateSlice";
import { createTable1Slice, type Table1Slice } from "./slices/table1Slice";
import { createTable3Slice, type Table3Slice } from "./slices/table3Slice";
import { createChangeCEASlice, type CEAChangeSlice } from "./slices/CEASlice";
import { createTable5Slice, type Table5Slice } from "./slices/table5Slice";
import { createTable6Slice, type Table6Slice } from "./slices/table6Slice";

export type SubjectStoreState =
    UserSlice &
    AddSubjectSlice &
    GroupUpdateSlice &
    Table1Slice &
    Table3Slice &
    Table5Slice &
    Table6Slice &
    CEAChangeSlice

export const useSchoolJsonDataStore = create<SubjectStoreState>((...a) => ({
    ...createUserSlice(...a),
    ...createSubjectSlice(...a),
    ...createGroupUpdateSlice(...a),
    ...createTable1Slice(...a),
    ...createTable3Slice(...a),
    ...createTable5Slice(...a),
    ...createTable6Slice(...a),
    ...createChangeCEASlice(...a)
}))