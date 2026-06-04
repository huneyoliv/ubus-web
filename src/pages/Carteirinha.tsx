import { motion } from 'framer-motion'
import { CreditCard, Shield, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function Carteirinha() {
    const user = useAuthStore((s) => s.user)

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

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
                    Carteirinha Digital
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>Apresente ao motorista quando solicitado</p>
            </div>

            <div className="flex-1 flex flex-col items-center px-5 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-sm rounded-3xl overflow-hidden"
                    style={{ boxShadow: '0 20px 60px -16px rgba(37,99,235,0.35)', border: '1px solid rgba(37,99,235,0.1)' }}
                >
                    <div className="relative overflow-hidden px-6 pt-8 pb-6 flex flex-col items-center"
                        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)' }}>
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-15 blur-3xl bg-blue-400" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-2xl bg-violet-400" />

                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-black text-3xl"
                                style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)', fontFamily: 'var(--font-display)' }}>
                                {initials}
                            </div>
                            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                                style={{ background: 'var(--color-success)', border: '2.5px solid #1E3A8A' }}>
                                <CheckCircle size={14} className="text-white" strokeWidth={3} />
                            </div>
                        </div>

                        <h2 className="text-white font-bold text-lg text-center relative" style={{ fontFamily: 'var(--font-display)' }}>
                            {user?.name ?? '—'}
                        </h2>
                        <p className="text-white/50 text-xs mt-0.5 relative">{user?.email ?? '—'}</p>

                        <div className="relative mt-4 flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <Shield size={12} className="text-blue-300" />
                            <span className="text-blue-200 text-xs font-semibold">{roleLabel[user?.role ?? ''] ?? user?.role ?? '—'}</span>
                        </div>
                    </div>

                    <div className="bg-white px-6 py-5">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-36 h-36 rounded-2xl p-3 flex items-center justify-center"
                                style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-border)' }}>
                                <svg viewBox="0 0 100 100" className="w-full h-full">
                                    {Array.from({ length: 10 }).map((_, row) =>
                                        Array.from({ length: 10 }).map((_, col) => (
                                            <rect
                                                key={`${row}-${col}`}
                                                x={col * 10} y={row * 10} width="8" height="8" rx="1.5"
                                                fill={(row + col) % 3 === 0 ? '#0F172A' : ((row * col) % 5 < 2 ? '#0F172A' : 'transparent')}
                                            />
                                        ))
                                    )}
                                </svg>
                            </div>
                        </div>

                        <p className="text-center text-[10px] mb-5" style={{ color: 'var(--color-text-3)' }}>
                            Gerado em {new Date().toLocaleString('pt-BR')}
                        </p>

                        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--color-border)' }}>
                            {[
                                ['CPF', user?.cpf ?? '—'],
                                ['Email', user?.email ?? '—'],
                                ['Status', 'Ativo'],
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between items-center py-3">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-3)' }}>{k}</span>
                                    {k === 'Status' ? (
                                        <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--color-success)' }}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            {v}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold font-mono" style={{ color: 'var(--color-text)' }}>{v}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 py-3"
                        style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
                        <CreditCard size={12} style={{ color: 'var(--color-text-3)' }} />
                        <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-3)' }}>Carteirinha Digital Ubus • v1.0</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
