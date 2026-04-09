import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Lock, FileText, Shield, ChevronRight, LogOut, Settings, Accessibility } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function Perfil() {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    const menuItems = [
        { icon: User, label: 'Meus Dados Pessoais', sub: 'Nome, CPF, Telefone', route: '/me/dados', color: 'var(--color-primary)', bg: 'rgba(37,99,235,0.08)' },
        { icon: Lock, label: 'Alterar Senha', sub: 'Segurança da conta', route: '/me/alterar-senha', color: 'var(--color-primary)', bg: 'rgba(37,99,235,0.08)' },
        { icon: FileText, label: 'Renovar Semestre', sub: 'Documentação necessária', route: '/me/renovar-semestre', color: '#D97706', bg: 'rgba(245,158,11,0.1)' },
        { icon: Accessibility, label: 'Acessibilidade e Locomoção', sub: 'Laudos PCD, gestantes e idosos', route: '/me/acessibilidade', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
        { icon: Shield, label: 'Regras e Penalidades', sub: 'Advertências e condutas', route: '/me/regras', color: 'var(--color-secondary)', bg: 'rgba(124,58,237,0.08)' },
    ]

    const handleLogout = () => {
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
        <div className="flex flex-col min-h-full">
            <div className="px-5 pt-8 pb-5">
                <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                    Perfil
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>Gerencie sua conta</p>
            </div>

            <div className="px-5 mb-5">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl p-5"
                    style={{
                        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #7C3AED 100%)',
                        boxShadow: '0 12px 40px -12px rgba(37,99,235,0.4)',
                    }}
                >
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
                            <p className="text-white/40 text-xs mt-0.5">CPF: {user?.cpf ? `***${user.cpf.slice(-4)}` : '—'}</p>
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
                </motion.div>
            </div>

            <div className="px-5 flex-1 pb-6">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--color-text-3)' }}>
                    <Settings size={11} className="inline mr-1.5" />Configurações
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

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 mt-4 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98]"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#DC2626', fontFamily: 'var(--font-display)' }}
                >
                    <LogOut size={18} />
                    Sair da conta
                </button>

                <p className="text-center text-xs mt-6" style={{ color: 'var(--color-text-3)' }}>v1.0.0 · ubus.me</p>
            </div>
        </div>
    )
}
