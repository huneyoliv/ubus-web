import { NavLink } from 'react-router-dom'
import { Home, Clock, CreditCard, Wallet, User as UserIcon, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function BottomNav() {
    const pagamentos = useAuthStore((s: any) => s.pagamentos)
    const user = useAuthStore((s: any) => s.user)
    const lider = user?.role === 'LEADER'

    const navItems = [
        { icon: Home, label: 'Início', route: '/dashboard' },
        { icon: Clock, label: 'Histórico', route: '/historico' },
        ...(pagamentos ? [{ icon: Wallet, label: 'Pagamentos', route: '/pagamentos' }] : []),
        ...(lider ? [{ icon: ShieldCheck, label: 'Líder', route: '/lider' }] : []),
        { icon: CreditCard, label: 'Carteirinha', route: '/carteirinha' },
        { icon: UserIcon, label: 'Perfil', route: '/me' },
    ]

    return (
        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2"
            style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderTop: '1px solid var(--color-border)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
        >
            <div className="flex justify-around items-center h-16">
                {navItems.map(({ route, icon: Icon, label }) => (
                    <NavLink
                        key={route}
                        to={route}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-text-3 hover:text-text-2'
                            }`
                        }
                        style={({ isActive }) => isActive ? { color: 'var(--color-primary)' } : { color: 'var(--color-text-3)' }}
                    >
                        {({ isActive }) => (
                            <>
                                <div
                                    className="flex items-center justify-center w-10 h-7 rounded-xl transition-all"
                                    style={isActive ? { background: 'rgba(37,99,235,0.1)' } : {}}
                                >
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                                </div>
                                <span className="text-[10px] font-semibold tracking-tight">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}
