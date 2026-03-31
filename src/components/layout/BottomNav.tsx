import { NavLink } from 'react-router-dom'
import { Home, Clock, CreditCard, Wallet, User as UserIcon, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

export default function BottomNav() {
    const pagamentos = useAuthStore((s: any) => s.pagamentos)
    const lider = useAuthStore((s: any) => s.lider)

    const navItems = [
        { icon: Home, label: 'Início', route: '/home' },
        { icon: Clock, label: 'Histórico', route: '/historico' },
        ...(pagamentos ? [{ icon: Wallet, label: 'Pagamentos', route: '/pagamentos' }] : []),
        ...(lider ? [{ icon: ShieldCheck, label: 'Líder', route: '/lider' }] : []),
        { icon: CreditCard, label: 'Carteirinha', route: '/carteirinha' },
        { icon: UserIcon, label: 'Perfil', route: '/perfil' },
    ]

    return (
        <nav className="absolute bottom-0 w-full z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-2 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-end h-16">
                {navItems.map(({ route, icon: Icon, label }) => (
                    <NavLink
                        key={route}
                        to={route}
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center gap-1 group transition-colors min-w-0',
                                isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={cn(
                                    'flex items-center justify-center w-10 h-8 rounded-full transition-all',
                                    isActive && 'bg-primary/10'
                                )}>
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                                </div>
                                <span className="text-[10px] font-medium truncate">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}
