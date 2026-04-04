import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Bus, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'
import type { Reservation, BackendReservationResponse } from '@/types'
import { mapBackendReservation } from '@/types'

export default function Bilhete() {
    const navigate = useNavigate()
    const location = useLocation()
    const user = useAuthStore((s) => s.user)
    const [time, setTime] = useState(new Date())

    const stateData = location.state as { reservationId?: string; reservation?: Reservation; tripId?: string; seatNumber?: number; trip?: unknown } | undefined
    const [reservation, setReservation] = useState<Reservation | null>(stateData?.reservation ?? null)
    const [loading, setLoading] = useState(!stateData?.reservation)
    const isRelocated = reservation?.status === 'EXCESSO'

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (reservation) return
        if (stateData?.reservationId) {
            api.get<Reservation>(`/reservations/${stateData.reservationId}`)
                .then(setReservation)
                .catch(() => { })
                .finally(() => setLoading(false))
        } else {
            api.get<BackendReservationResponse[]>('/reservations/mine')
                .then((list) => { if (list.length > 0) setReservation(mapBackendReservation(list[0])) })
                .catch(() => { })
                .finally(() => setLoading(false))
        }
    }, [stateData?.reservationId, reservation])

    const formatTime = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-dvh">
                <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)', borderWidth: 3 }} />
            </div>
        )
    }

    const viagem = reservation?.viagem
    const seatDisplay = reservation?.numeroAssento ?? stateData?.seatNumber ?? '—'
    const dirDisplay = viagem?.direcao ?? 'Viagem'
    const linhaDisplay = viagem?.linha?.nome ?? viagem?.idViagem ?? reservation?.idViagem ?? '—'
    const turnoDisplay = viagem?.turno ?? ''
    const dataDisplay = viagem?.dataViagem ?? ''
    const isIda = dirDisplay === 'IDA'

    const gradient = isRelocated
        ? 'linear-gradient(160deg, #92400E 0%, #B45309 40%, #78350F 100%)'
        : isIda
            ? 'linear-gradient(160deg, #1E1B4B 0%, #2563EB 40%, #0EA5E9 100%)'
            : 'linear-gradient(160deg, #064E3B 0%, #059669 40%, #10B981 100%)'

    return (
        <div className="w-full min-h-dvh flex flex-col relative overflow-hidden" style={{ background: gradient }}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl bg-white" />
                <div className="absolute bottom-20 -left-10 w-60 h-60 rounded-full opacity-10 blur-2xl bg-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl bg-white" />
            </div>

            <div className="relative z-10 flex flex-col min-h-dvh max-w-xl mx-auto w-full">
                <div className="flex items-center justify-between px-5 pt-12 pb-4">
                    <button onClick={() => navigate('/dashboard')}
                        className="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <ArrowLeft size={18} className="text-white" />
                    </button>
                    <h1 className="text-white font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>Bilhete Digital</h1>
                    <div className="w-10" />
                </div>

                {isRelocated && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-5 mb-4 p-3.5 rounded-2xl flex items-center gap-3"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <AlertTriangle size={18} className="text-amber-300 shrink-0" />
                        <div>
                            <p className="text-white font-bold text-sm">Transbordo Ativo</p>
                            <p className="text-white/70 text-xs">Você foi realocado para um veículo de apoio.</p>
                        </div>
                    </motion.div>
                )}

                <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">Horário Atual</p>
                        <div className="text-white font-black tracking-tight tabular-nums" style={{ fontSize: '3.5rem', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                            {formatTime(time)}
                        </div>
                        <p className="text-white/50 text-sm mt-2 capitalize">{formatDate(time)}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full rounded-3xl overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: 'rgba(255,255,255,0.15)' }}>
                                        <Bus size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{linhaDisplay}</p>
                                        <p className="text-white/60 text-xs">{dirDisplay} • {turnoDisplay}</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    Poltrona {seatDisplay}
                                </div>
                            </div>

                            <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.15)' }} />

                            <div className="grid grid-cols-2 gap-4 mb-5 text-left">
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Data da Viagem</p>
                                    <p className="text-white font-semibold text-sm">{dataDisplay || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">ID Reserva</p>
                                    <p className="text-white font-semibold text-xs font-mono truncate">{reservation?.id?.slice(0, 8) ?? '—'}</p>
                                </div>
                            </div>

                            <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.15)' }} />

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Passageiro</p>
                                    <p className="text-white text-xs font-semibold truncate">{user?.name?.split(' ')[0] ?? '—'}</p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">CPF</p>
                                    <p className="text-white text-xs font-semibold font-mono">
                                        {user?.cpf ? `***${user.cpf.slice(-4)}` : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Status</p>
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                                        style={{ background: 'rgba(52,211,153,0.2)' }}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                        <span className="text-emerald-200 text-[10px] font-bold">{reservation?.status ?? 'ATIVO'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 py-4 border-t"
                            style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                            <CheckCircle size={13} className="text-white/30" />
                            <span className="text-white/30 text-xs">Bilhete gerado em tempo real • Não compartilhe</span>
                        </div>
                    </motion.div>
                </div>

                <div className="px-5 pb-10 pt-4 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Clock size={12} className="text-white/30" />
                        <span className="text-white/30 text-xs">Válido somente para a data da viagem</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
