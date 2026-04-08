import { NavLink, useNavigate } from 'react-router-dom'
import {
    Home, Clock, CreditCard, Wallet, User as UserIcon,
    ShieldCheck, Bus, MapPin, LogOut
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function SideNav() {
    const user = useAuthStore((s: any) => s.user)
    const logout = useAuthStore((s: any) => s.logout)
    const pagamentos = useAuthStore((s: any) => s.pagamentos)
    const lider = user?.role === 'LEADER'
    const navigate = useNavigate()

    const navItems = [
        { icon: Home, label: 'Início', route: '/dashboard' },
        { icon: Clock, label: 'Histórico', route: '/historico' },
        { icon: CreditCard, label: 'Carteirinha', route: '/carteirinha' },
        ...(pagamentos ? [{ icon: Wallet, label: 'Pagamentos', route: '/pagamentos' }] : []),
        ...(lider ? [{ icon: ShieldCheck, label: 'Líder', route: '/lider' }] : []),
    ]

    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen shrink-0"
            style={{ background: 'var(--color-sidebar-bg)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-6 py-7 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl"
                    style={{ background: 'var(--color-primary)', boxShadow: '0 4px 12px rgba(37,99,235,0.5)' }}>
                    <Bus size={18} className="text-white" strokeWidth={2} />
                </div>
                <span className="font-display font-800 text-white text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                    Ubus
                </span>
            </div>

            <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
                {navItems.map(({ route, icon: Icon, label }) => (
                    <NavLink
                        key={route}
                        to={route}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                ? 'text-white font-semibold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`
                        }
                        style={({ isActive }) => isActive ? { background: 'rgba(37,99,235,0.25)', fontWeight: 600 } : {}}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                    <Icon size={18} />
                                </div>
                                <span className="text-sm">{label}</span>
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
                            </>
                        )}
                    </NavLink>
                ))}

                <div className="mx-2 my-3" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                <NavLink
                    to="/me"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                            ? 'text-white'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`
                    }
                    style={({ isActive }) => isActive ? { background: 'rgba(37,99,235,0.25)', fontWeight: 600 } : {}}
                >
                    {({ isActive }) => (
                        <>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                <UserIcon size={18} />
                            </div>
                            <span className="text-sm">Perfil</span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/ponto-embarque"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                            ? 'text-white'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`
                    }
                    style={({ isActive }) => isActive ? { background: 'rgba(37,99,235,0.25)', fontWeight: 600 } : {}}
                >
                    {({ isActive }) => (
                        <>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                <MapPin size={18} />
                            </div>
                            <span className="text-sm">Ponto de Embarque</span>
                        </>
                    )}
                </NavLink>
            </nav>

            <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: 'rgba(37,99,235,0.3)', color: '#93C5FD' }}>
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: 'var(--font-display)' }}>
                            {user?.name?.split(' ')[0] ?? 'Usuário'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.role ?? ''}</p>
                    </div>
                    <button onClick={handleLogout} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    )
}
