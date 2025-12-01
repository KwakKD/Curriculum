import type { ReactNode } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

type Role = "user" | "admin" | "superadmin" | null;

type ProtectedRouteProps = {
    children: ReactNode
    requiredRole?: Role
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { user, loading, initialized } = useAuthStore()
    const location = useLocation()

    if (!initialized || loading) {
        // 세션 확인 중일 때 보여울 UI
        return <div>인증 상태 확인 중...</div>
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }} //로그인 후 원래 가려던 곳으로 보내고 싶을 때 사용
            />
        )
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/forbidden" replace />
    }
    return <>{children ?? <Outlet />}</>
    // const isAuthenticated = localStorage.getItem('token')
    // return isAuthenticated ? children : <Navigate to='/login' />
}

export default ProtectedRoute

//supabase에 userdata에 role, 승인 등 추가해야함.
