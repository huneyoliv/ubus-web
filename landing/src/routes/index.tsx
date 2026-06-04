import { createBrowserRouter } from 'react-router-dom'
import Splash from '@/pages/Splash'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import ManagerLayout from '@/components/layout/ManagerLayout'
import ManagerRoutes from '@/pages/manager/ManagerRoutes'
import ManagerValidations from '@/pages/manager/ManagerValidations'
import ManagerFrota from '@/pages/manager/ManagerFrota'
import ManagerRelatorios from '@/pages/manager/ManagerRelatorios'
import ManagerConfiguracoes from '@/pages/manager/ManagerConfiguracoes'
import ManagerMotoristas from '@/pages/manager/ManagerMotoristas'
import SuperAdminManagement from '@/pages/manager/SuperAdminManagement'
import NotFound from '@/pages/NotFound'
import ProtectedRoute from '@/components/ProtectedRoute'

export const router = createBrowserRouter([
    { path: '/', element: <Splash /> },
    { path: '/login', element: <Login /> },
    { path: '/dashboard', element: <Dashboard /> },

    {
        element: <ProtectedRoute allowedTypes={['MANAGER', 'SUPER_ADMIN']} />,
        children: [
            {
                element: <ManagerLayout />,
                children: [
                    { path: '/rotas', element: <ManagerRoutes /> },
                    { path: '/validacoes', element: <ManagerValidations /> },
                    { path: '/frota', element: <ManagerFrota /> },
                    { path: '/motoristas', element: <ManagerMotoristas /> },
                    { path: '/relatorios', element: <ManagerRelatorios /> },
                    { path: '/configuracoes', element: <ManagerConfiguracoes /> },
                    { path: '/admin-management', element: <SuperAdminManagement /> },
                ],
            },
        ],
    },
    { path: '*', element: <NotFound /> },
])

