import { create } from "zustand"
import supabase from "../lib/supabaseClient"

type Role = 'user' | 'admin' | 'superadmin' | null

interface AuthUser {
    id: string
    email: string | null
    role: Role
    name: string | null
    schoolname: string | null
    location: string | null
}

interface AuthState {
    user: AuthUser | null
    loading: boolean
    initialized: boolean
    initializeAuth: () => Promise<void>
    setUser: (user: AuthUser | null) => void
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: true,
    initialized: false,
    setUser: (user) => set({ user }),
    initializeAuth: async () => {
        if (get().initialized) return

        set({ loading: true })

        try {
            // 세션 확인
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                console.error('세션 조회 오류: ', error.message)
                set({ user: null, loading: false, initialized: true })
                return
            }

            const sessionUser = data.session?.user

            if (sessionUser) {
                // 프로필 가져오기
                const { data: userinfo, error: userinfoError } = await supabase
                    .from('userinfo')
                    .select('role, name, schoolname, location')
                    .eq('id', sessionUser.id)
                    .single()

                if (userinfoError) {
                    console.error('프로필 조회 오류: ', userinfoError.message)
                }

                set({
                    user: {
                        id: sessionUser.id,
                        email: sessionUser.email ?? null,
                        role: (userinfo?.role as Role) ?? 'user',
                        name: userinfo?.name ?? null,
                        schoolname: userinfo?.schoolname ?? null,
                        location: userinfo?.location ?? null
                    },
                })
            } else {
                set({ user: null })
            }

            supabase.auth.onAuthStateChange(async (_event, session) => {
                const authUser = session?.user
                if (!authUser) {
                    set({ user: null })
                    return
                }

                const { data: userinfo } = await supabase
                    .from('userinfo')
                    .select('role, name, schoolname, location')
                    .eq('id', authUser.id)
                    .single()

                set({
                    user: {
                        id: authUser.id,
                        email: authUser.email ?? null,
                        role: (userinfo?.role as Role) ?? 'user',
                        name: userinfo?.name ?? null,
                        schoolname: userinfo?.schoolname ?? null,
                        location: userinfo?.location ?? null
                    },
                })
            })

            set({ loading: false, initialized: true })

        } catch (err) {
            console.error('initializeAuth 에러: ', err)
            set({ user: null, loading: false, initialized: true })
        }
    },

    logout: async () => {
        try {
            const {error} = await supabase.auth.signOut()
            if (error) {
                console.error('로그아웃 실패: ', error.message)
                return
            }
            console.log('로그아웃 성공')
            set({user: null} )
        } catch (e) {
            console.error('로그아웃 중 에러 발생: ',e)
        }
    }
}))