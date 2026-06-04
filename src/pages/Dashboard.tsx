import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import ManagerLayout from '@/components/layout/ManagerLayout'
import ManagerDashboard from '@/pages/manager/ManagerDashboard'
import SuperAdminDashboard from '@/pages/manager/SuperAdminDashboard'

export default function Dashboard() {
    const { user, isAuthenticated } = useAuthStore()

    console.log('[DEBUG] Dashboard check - isAuthenticated:', isAuthenticated)
    console.log('[DEBUG] Dashboard check - user role:', user?.role)

    if (!isAuthenticated || !user) {
        console.log('[DEBUG] Redirecionando para login - não autenticado')
        return <Navigate to="/login" replace />
    }

    if (user.role === 'MANAGER' || user.role === 'SUPER_ADMIN') {
        console.log('[DEBUG] Renderizando layout de gestão para:', user.role)
        return (
            <ManagerLayout>
                {user.role === 'SUPER_ADMIN' ? (
                    <SuperAdminDashboard />
                ) : (
                    <ManagerDashboard />
                )}
            </ManagerLayout>
        )
    }

    console.log('[DEBUG] Role não autorizada no dashboard:', user.role)
    return <Navigate to="/login" replace />
}

