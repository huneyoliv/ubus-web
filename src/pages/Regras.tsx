import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle, Ban, Clock, CheckCircle, Shield } from 'lucide-react'

const regras = [
    {
        icon: Ban,
        title: 'Falta sem justificativa',
        description: 'Reservar e não comparecer ao embarque gera 1 advertência.',
        severity: 'warning' as const,
    },
    {
        icon: AlertTriangle,
        title: '3 advertências = Suspensão',
        description: 'Ao acumular 3 advertências, o acesso ao transporte é suspenso por 7 dias.',
        severity: 'danger' as const,
    },
    {
        icon: Clock,
        title: 'Horário de reserva',
        description: 'As reservas noturnas devem ser feitas até às 13:00. Após esse horário, o sistema fecha automaticamente.',
        severity: 'info' as const,
    },
    {
        icon: Ban,
        title: 'Cancelamento tardio',
        description: 'Cancelar a reserva após 1h antes do embarque conta como falta.',
        severity: 'warning' as const,
    },
    {
        icon: CheckCircle,
        title: 'Cancelamento antecipado',
        description: 'Cancelar com mais de 1h de antecedência libera a vaga sem penalidade.',
        severity: 'success' as const,
    },
    {
        icon: AlertTriangle,
        title: 'Uso do bilhete',
        description: 'O bilhete é pessoal e intransferível. Compartilhar gera suspensão imediata.',
        severity: 'danger' as const,
    },
]

const severityConfig = {
    info: { bg: 'rgba(37,99,235,0.06)', border: 'rgba(37,99,235,0.15)', iconBg: 'rgba(37,99,235,0.12)', color: 'var(--color-primary)' },
    warning: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)', iconBg: 'rgba(245,158,11,0.12)', color: '#D97706' },
    danger: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.12)', iconBg: 'rgba(239,68,68,0.1)', color: '#DC2626' },
    success: { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)', iconBg: 'rgba(16,185,129,0.12)', color: '#059669' },
}

export default function Regras() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="sticky top-0 z-20 flex items-center gap-3 px-5 py-4"
                style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/me')}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white"
                    style={{ border: '1.5px solid var(--color-border)' }}>
                    <ArrowLeft size={18} style={{ color: 'var(--color-text)' }} />
                </button>
                <div>
                    <h1 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Regras e Penalidades</h1>
                    <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Advertências e condutas</p>
                </div>
            </div>

            <div className="flex-1 px-5 py-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-5 rounded-2xl mb-6"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px -4px rgba(37,99,235,0.08)' }}
                >
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-3)' }}>
                            Suas Advertências
                        </p>
                        <p className="text-4xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-success)' }}>0</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold" style={{ color: 'var(--color-success)' }}>Sem penalidades</span>
                    </div>
                </motion.div>

                <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5"
                    style={{ color: 'var(--color-text-3)' }}>
                    <Shield size={11} />
                    Regras do Sistema
                </p>

                <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
                    {regras.map((regra, i) => {
                        const Icon = regra.icon
                        const cfg = severityConfig[regra.severity]
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-start gap-3 p-4 rounded-2xl"
                                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                            >
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: cfg.iconBg, color: cfg.color }}>
                                    <Icon size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--color-text)' }}>{regra.title}</p>
                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-2)' }}>{regra.description}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
