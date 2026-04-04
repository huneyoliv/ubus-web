import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, ArrowRight, CheckCircle, Clock, MapPin, CalendarCheck, Bus, Zap } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/api'
import type { Trip, Reservation, BackendReservationResponse } from '@/types'
import { mapBackendReservation } from '@/types'

export default function Home() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const [openTrips, setOpenTrips] = useState<Trip[]>([])
    const [myReservations, setMyReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [trips, backendReservations] = await Promise.all([
                    api.get<Trip[]>('/trips/open').catch(() => [] as Trip[]),
                    api.get<BackendReservationResponse[]>('/reservations/mine').catch(() => [] as BackendReservationResponse[]),
                ])
                setOpenTrips(trips)
                setMyReservations(backendReservations.map(mapBackendReservation))
            } catch {
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    const firstName = user?.name?.split(' ')[0] ?? ''
    const hasReservation = myReservations.length > 0
    const hasOpenTrips = openTrips.length > 0

    return (
        <div className="flex flex-col min-h-full">
            <div className="px-5 pt-8 pb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', fontFamily: 'var(--font-display)' }}>
                            {initials}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                            style={{ background: 'var(--color-success)' }} />
                    </div>
                    <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--color-text-3)' }}>Bem-vindo de volta</p>
                        <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{firstName}</h2>
                    </div>
                </div>
                <button className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white"
                    style={{ border: '1.5px solid var(--color-border)' }}>
                    <Bell size={18} style={{ color: 'var(--color-text-2)' }} />
                </button>
            </div>

            <div className="px-5 pb-6 flex flex-col gap-4">
                {loading && (
                    <div className="flex flex-col gap-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-24 rounded-2xl skeleton" />
                        ))}
                    </div>
                )}

                {!loading && !hasReservation && !hasOpenTrips && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: 'rgba(37,99,235,0.08)' }}>
                            <Clock size={28} style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <h3 className="font-bold text-base mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                            Nenhuma viagem disponível
                        </h3>
                        <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--color-text-2)' }}>
                            Viagens abertas para reserva aparecerão aqui quando estiverem disponíveis.
                        </p>
                    </motion.div>
                )}

                {!loading && hasOpenTrips && !hasReservation && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-4 rounded-2xl"
                            style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'rgba(37,99,235,0.12)' }}>
                                <Zap size={18} style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <div>
                                <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>Viagens abertas!</p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-2)' }}>
                                    {openTrips.length} viagem(ns) disponíveis para reserva.
                                </p>
                            </div>
                        </div>

                        <h3 className="font-bold text-sm uppercase tracking-wide px-1" style={{ color: 'var(--color-text-3)' }}>Reserve agora</h3>

                        {openTrips.map((trip, idx) => (
                            <motion.button
                                key={trip.idViagem}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                onClick={() => navigate('/reservar', { state: { tripId: trip.idViagem, trip } })}
                                className="card-hover w-full p-5 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.08))' }}>
                                        <CalendarCheck size={22} style={{ color: 'var(--color-primary)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                                            {trip.direcao === 'IDA' ? '→ Ida' : '← Volta'} — {trip.turno}
                                        </p>
                                        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--color-text-3)' }}>
                                            <MapPin size={10} />
                                            {trip.dataViagem} • {trip.linha?.nome ?? trip.idViagem}
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ background: 'rgba(37,99,235,0.08)' }}>
                                        <ArrowRight size={16} style={{ color: 'var(--color-primary)' }} />
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {!loading && hasReservation && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-success)' }} />
                            <span className="text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
                                {myReservations.length} reserva(s) ativa(s)
                            </span>
                        </div>

                        {myReservations.map((reservation, idx) => {
                            const isIda = reservation.viagem?.direcao === 'IDA'
                            return (
                                <motion.div
                                    key={reservation.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.06 }}
                                    className="rounded-2xl overflow-hidden"
                                    style={{ boxShadow: '0 8px 32px -8px rgba(37,99,235,0.18)', border: '1px solid var(--color-border)' }}
                                >
                                    <div className="p-1" style={{ background: isIda ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'linear-gradient(135deg, #059669, #047857)' }}>
                                        <div className="flex items-center justify-between px-4 py-2.5">
                                            <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">
                                                {reservation.viagem?.direcao ?? 'Viagem'}
                                            </span>
                                            <span className="text-white text-xs font-bold">{reservation.viagem?.turno ?? '—'}</span>
                                        </div>
                                    </div>

                                    <div className="p-5" style={{ background: 'var(--color-surface)' }}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                                    {isIda ? 'Ida para Faculdade' : 'Volta para Casa'}
                                                </h4>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
                                                    {reservation.viagem?.linha?.nome ?? reservation.idViagem}
                                                </p>
                                            </div>
                                            <div className="px-3 py-1 rounded-full text-xs font-bold"
                                                style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }}>
                                                {reservation.status}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-4 p-3 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                                            <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-2)' }}>
                                                <Bus size={14} />
                                                <span className="text-xs font-medium">Poltrona {reservation.numeroAssento ?? 'Excesso'}</span>
                                            </div>
                                            <div className="w-px h-4" style={{ background: 'var(--color-border)' }} />
                                            <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-2)' }}>
                                                <CalendarCheck size={14} />
                                                <span className="text-xs font-medium">{reservation.viagem?.dataViagem ?? '—'}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate('/bilhete', { state: { reservationId: reservation.id, reservation } })}
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
                                            style={{
                                                background: isIda ? 'var(--color-primary)' : 'var(--color-success)',
                                                color: 'white',
                                                fontFamily: 'var(--font-display)',
                                                boxShadow: isIda ? '0 4px 16px -4px rgba(37,99,235,0.4)' : '0 4px 16px -4px rgba(16,185,129,0.4)',
                                            }}
                                        >
                                            <CheckCircle size={16} />
                                            Ver Bilhete
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
