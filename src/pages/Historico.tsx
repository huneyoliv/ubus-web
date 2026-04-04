import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react'
import { api } from '@/lib/api'
import type { Reservation, StatusReserva, BackendReservationResponse } from '@/types'
import { mapBackendReservation } from '@/types'
import { useNavigate } from 'react-router-dom'

const statusMap: Record<StatusReserva, { label: string; icon: typeof CheckCircle; bg: string; color: string }> = {
    CONFIRMADA: { label: 'Confirmada', icon: CheckCircle, bg: 'rgba(16,185,129,0.08)', color: '#059669' },
    PRESENTE: { label: 'Presente', icon: CheckCircle, bg: 'rgba(16,185,129,0.08)', color: '#059669' },
    FALTOU: { label: 'Faltou', icon: XCircle, bg: 'rgba(239,68,68,0.08)', color: '#DC2626' },
    CANCELADA_SISTEMA: { label: 'Cancelada', icon: Clock, bg: 'rgba(148,163,184,0.15)', color: '#64748B' },
    EXCESSO: { label: 'Excesso', icon: Clock, bg: 'rgba(245,158,11,0.08)', color: '#D97706' },
}

export default function Historico() {
    const navigate = useNavigate()
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get<BackendReservationResponse[]>('/reservations/mine')
            .then((data) => setReservations(Array.isArray(data) ? data.map(mapBackendReservation) : []))
            .catch(() => setReservations([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="flex flex-col min-h-full">
            <div className="px-5 pt-8 pb-5">
                <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                    Histórico
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>Suas viagens recentes</p>
            </div>

            <div className="flex-1 px-5 pb-6">
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 rounded-2xl skeleton" />)}
                    </div>
                ) : reservations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: 'rgba(37,99,235,0.06)' }}>
                            <CalendarDays size={28} style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <h3 className="font-bold text-base mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                            Nenhuma viagem ainda
                        </h3>
                        <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--color-text-2)' }}>
                            Seu histórico de viagens aparecerá aqui após sua primeira reserva.
                        </p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {reservations.map((res, idx) => {
                            const s = statusMap[res.status] ?? statusMap.CONFIRMADA
                            const Icon = s.icon
                            const isIda = res.viagem?.direcao === 'IDA'

                            return (
                                <motion.div
                                    key={res.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-sm"
                                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                                    onClick={() => navigate('/bilhete', { state: { reservationId: res.id, reservation: res } })}
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: isIda ? 'rgba(37,99,235,0.08)' : 'rgba(124,58,237,0.08)' }}>
                                        <CalendarDays size={18} style={{ color: isIda ? 'var(--color-primary)' : 'var(--color-secondary)' }} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                                                {res.viagem?.direcao ?? 'Viagem'} — {res.viagem?.turno ?? ''}
                                            </p>
                                            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ml-2 shrink-0"
                                                style={{ background: s.bg, color: s.color }}>
                                                <Icon size={10} />
                                                {s.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>{res.viagem?.dataViagem ?? ''}</span>
                                            <span style={{ color: 'var(--color-border)' }}>•</span>
                                            <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>{res.viagem?.linha?.nome ?? res.idViagem}</span>
                                            <span style={{ color: 'var(--color-border)' }}>•</span>
                                            <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>
                                                Poltrona {res.numeroAssento ?? 'Excesso'}
                                            </span>
                                        </div>
                                    </div>

                                    <ArrowRight size={14} style={{ color: 'var(--color-text-3)', flexShrink: 0 }} />
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
