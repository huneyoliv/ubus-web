import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Map, MessageSquare, Settings, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/store/useAuthStore'

export default function DriverLayout({ children }: { children?: React.ReactNode }) {
    const location = useLocation()
    const currentPath = location.pathname
    const navigate = useNavigate()
    const { logout } = useAuthStore()

    const navItems = [
        { icon: LayoutDashboard, label: 'Painel', path: '/dashboard' },
        { icon: Map, label: 'Mapa', path: '/mapa' },
        { icon: MessageSquare, label: 'Avisos', path: '/avisos' },
        { icon: Settings, label: 'Config', path: '/config' },
    ]

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="w-full max-w-md mx-auto h-[100dvh] relative overflow-hidden bg-[#f8f8f5] dark:bg-[#221f10] flex flex-col text-slate-900 dark:text-slate-100">
            <header className="flex justify-between items-center px-6 py-4 border-b border-[#393628]">
                <h1 className="font-bold text-lg">UBUS Driver</h1>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <LogOut className="w-5 h-5 text-red-500" />
                </button>
            </header>
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                {children ?? <Outlet />}
            </div>

            <nav className="absolute bottom-0 w-full border-t border-[#393628] bg-[#27251b] px-6 pb-6 pt-3 z-20">
                <div className="flex justify-between items-center max-w-sm mx-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = currentPath === item.path

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex flex-col items-center justify-center gap-1 group transition-colors",
                                    isActive ? "text-[#f2cc0d]" : "text-[#bab59c] hover:text-slate-200"
                                )}
                            >
                                <div className={clsx(
                                    "p-1.5 rounded-full transition-colors",
                                    isActive ? "group-hover:bg-[#f2cc0d]/10" : "group-hover:bg-white/5"
                                )}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-bold tracking-wide uppercase">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
