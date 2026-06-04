import { useNavigate } from 'react-router-dom'
import { User, Lock, Shield, ChevronRight, LogOut, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function ManagerConfiguracoes() {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    console.debug('[ManagerConfiguracoes] render', { user })

    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    const menuItems = [
        { icon: User, label: 'Meus Dados Pessoais', sub: 'Nome, CPF, Telefone', route: '/me/dados', color: 'var(--color-primary)', bg: 'rgba(37,99,235,0.08)' },
        { icon: Lock, label: 'Alterar Senha', sub: 'Segurança da conta', route: '/me/alterar-senha', color: 'var(--color-primary)', bg: 'rgba(37,99,235,0.08)' },
        { icon: Shield, label: 'Regras e Penalidades', sub: 'Advertências e condutas', route: '/me/regras', color: 'var(--color-secondary)', bg: 'rgba(124,58,237,0.08)' },
    ]

    const handleLogout = () => {
        console.debug('[ManagerConfiguracoes] logout')
        logout()
        navigate('/login')
    }

    const roleLabel: Record<string, string> = {
        STUDENT: 'Estudante',
        LEADER: 'Líder de Turma',
        RIDE_SHARE: 'Caronista',
        DRIVER: 'Motorista',
        MANAGER: 'Gestor',
        SUPER_ADMIN: 'Super Admin',
    }

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="flex-1 p-5 md:p-8 max-w-3xl mx-auto w-full space-y-6">
                <div>
                    <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                        Configurações
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-2)' }}>Gerencie sua conta e preferências</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl p-5"
                    style={{
                        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #7C3AED 100%)',
                        boxShadow: '0 12px 40px -12px rgba(37,99,235,0.4)',
                    }}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-15 bg-white blur-2xl" />
                    <div className="absolute bottom-0 left-10 w-24 h-24 rounded-full opacity-10 bg-white blur-xl" />
                    <div className="relative flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0"
                            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontFamily: 'var(--font-display)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-lg leading-tight truncate" style={{ fontFamily: 'var(--font-display)' }}>
                                {user?.name ?? '—'}
                            </h3>
                            <p className="text-white/60 text-xs mt-0.5 truncate">{user?.email ?? '—'}</p>
                        </div>
                    </div>
                    <div className="relative mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Função</p>
                            <p className="text-white font-semibold text-sm">
                                {roleLabel[user?.role ?? ''] ?? user?.role ?? '—'}
                            </p>
                        </div>
                        <div className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
                            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.25)' }}>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                            <span className="text-emerald-200 text-xs font-bold">Ativo</span>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--color-text-3)' }}>
                        <Settings size={11} className="inline mr-1.5" />Conta
                    </p>
                    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        {menuItems.map((item, i) => (
                            <div key={i}>
                                <button
                                    onClick={() => navigate(item.route)}
                                    className="w-full flex items-center gap-4 px-4 py-4 text-left transition-all hover:bg-slate-50 active:bg-slate-100 group"
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                        style={{ background: item.bg, color: item.color }}>
                                        <item.icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{item.label}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>{item.sub}</p>
                                    </div>
                                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5"
                                        style={{ color: 'var(--color-text-3)' }} />
                                </button>
                                {i < menuItems.length - 1 && (
                                    <div className="h-px mx-4" style={{ background: 'var(--color-border)' }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98]"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#DC2626', fontFamily: 'var(--font-display)' }}
                >
                    <LogOut size={18} />
                    Sair da conta
                </button>

                <p className="text-center text-xs" style={{ color: 'var(--color-text-3)' }}>v1.0.0 · ubus.me</p>
            </div>
        </div>
    )
}
