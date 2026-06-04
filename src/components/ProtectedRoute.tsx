import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import type { RoleUsuario } from '@/types'

interface ProtectedRouteProps {
    allowedTypes: RoleUsuario[]
}

export default function ProtectedRoute({ allowedTypes }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore()

    console.log('[ProtectedRoute] allowedTypes:', allowedTypes)
    console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated)
    console.log('[ProtectedRoute] user:', user)
    console.log('[ProtectedRoute] user.role:', user?.role)

    if (!isAuthenticated || !user) {
        console.log('[ProtectedRoute] Não autenticado, redirecionando para /login')
        return <Navigate to="/login" replace />
    }

    if (!allowedTypes.includes(user.role)) {
        console.log('[ProtectedRoute] Role', user.role, 'não está em', allowedTypes, '- redirecionando para /dashboard')
        return <Navigate to="/dashboard" replace />
    }

    console.log('[ProtectedRoute] Acesso permitido para role:', user.role)
    return <Outlet />
}
