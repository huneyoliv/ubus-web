import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bus, Ticket, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api, ApiError } from '@/lib/api'
import type { Trip, CreateReservationPayload } from '@/types'

type SeatStatus = 'available' | 'occupied' | 'selected'

interface SeatData {
    id: number
    status: SeatStatus
}

export default function Reservar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { tripId, trip } = (location.state as { tripId?: string; trip?: Trip }) ?? {}
    const [seats, setSeats] = useState<SeatData[]>([])
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const capacity = trip?.capacidadeReal ?? 40

    useEffect(() => {
        if (!tripId) { setLoading(false); return }

        const fetchSeats = async () => {
            try {
                const occupied = await api.get<number[]>(`/reservations/trip/${tripId}/occupied-seats`)
                const occupiedSet = new Set(Array.isArray(occupied) ? occupied : [])
                const seatList: SeatData[] = Array.from({ length: capacity }, (_, i) => ({
                    id: i + 1,
                    status: occupiedSet.has(i + 1) ? 'occupied' as const : 'available' as const,
                }))
                setSeats(seatList)
            } catch {
                setSeats(Array.from({ length: capacity }, (_, i) => ({ id: i + 1, status: 'available' as const })))
            } finally {
                setLoading(false)
            }
        }
        fetchSeats()
    }, [tripId, capacity])

    const toggleSeat = (id: number) => {
        const seat = seats.find((s) => s.id === id)
        if (!seat || seat.status === 'occupied') return

        if (selectedSeat === id) {
            setSelectedSeat(null)
            setSeats(seats.map((s) => (s.id === id ? { ...s, status: 'available' as const } : s)))
        } else {
            setSeats(seats.map((s) => {
                if (s.id === id) return { ...s, status: 'selected' as const }
                if (s.id === selectedSeat) return { ...s, status: 'available' as const }
                return s
            }))
            setSelectedSeat(id)
        }
    }

    const handleReserve = async () => {
        if (!tripId || selectedSeat === null) return
        setSubmitting(true)
        setError('')
        try {
            const payload: CreateReservationPayload = { tripId, seatNumber: selectedSeat }
            await api.post('/reservations', payload)
            navigate('/bilhete', { state: { tripId, seatNumber: selectedSeat, trip } })
        } catch (err) {
            if (err instanceof ApiError) {
                const body = err.body as Record<string, unknown> | null
                setError(typeof body?.message === 'string' ? body.message : 'Erro ao reservar. Tente novamente.')
            } else {
                setError('Erro de conexão. Tente novamente.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    const rows = Math.ceil(seats.length / 4)
    const leftSeats = Array.from({ length: rows }, (_, row) => [seats[row * 4], seats[row * 4 + 1]].filter(Boolean))
    const rightSeats = Array.from({ length: rows }, (_, row) => [seats[row * 4 + 2], seats[row * 4 + 3]].filter(Boolean))

    const occupiedCount = seats.filter(s => s.status === 'occupied').length
    const availableCount = seats.filter(s => s.status === 'available').length

    const seatClass = (status: SeatStatus) => cn(
        'h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all select-none',
        status === 'occupied' && 'cursor-not-allowed',
        status === 'available' && 'cursor-pointer',
        status === 'selected' && 'cursor-pointer scale-105',
    )

    const seatStyle = (status: SeatStatus): React.CSSProperties => {
        if (status === 'occupied') return { background: 'var(--color-bg)', color: 'var(--color-text-3)', border: '1.5px solid var(--color-border)' }
        if (status === 'selected') return { background: 'var(--color-primary)', color: 'white', boxShadow: '0 4px 12px rgba(37,99,235,0.4)', border: 'none' }
        return { background: 'white', color: 'var(--color-text-2)', border: '1.5px solid rgba(37,99,235,0.25)', boxShadow: '0 1px 3px rgba(37,99,235,0.08)' }
    }

    if (!tripId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
                <p style={{ color: 'var(--color-text-2)' }}>Nenhuma viagem selecionada.</p>
                <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                    Voltar ao início
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="flex items-center gap-3 px-5 py-4 sticky top-0 z-20"
                style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/dashboard')}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white"
                    style={{ border: '1.5px solid var(--color-border)' }}>
                    <ArrowLeft size={18} style={{ color: 'var(--color-text)' }} />
                </button>
                <div>
                    <h1 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Nova Reserva</h1>
                    {trip && (
                        <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
                            {trip.direcao} • {trip.turno} • {trip.dataViagem}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex-1 px-5 py-5">
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 p-3 rounded-xl flex items-center gap-2.5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        <Users size={16} style={{ color: 'var(--color-primary)' }} />
                        <div>
                            <p className="text-lg font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{availableCount}</p>
                            <p className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-3)' }}>Livres</p>
                        </div>
                    </div>
                    <div className="flex-1 p-3 rounded-xl flex items-center gap-2.5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        <Bus size={16} style={{ color: 'var(--color-text-3)' }} />
                        <div>
                            <p className="text-lg font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{occupiedCount}</p>
                            <p className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-3)' }}>Ocupados</p>
                        </div>
                    </div>
                    <div className="flex-1 p-3 rounded-xl flex items-center gap-2.5" style={{ background: selectedSeat ? 'rgba(37,99,235,0.06)' : 'var(--color-surface)', border: `1px solid ${selectedSeat ? 'rgba(37,99,235,0.2)' : 'var(--color-border)'}` }}>
                        <Ticket size={16} style={{ color: selectedSeat ? 'var(--color-primary)' : 'var(--color-text-3)' }} />
                        <div>
                            <p className="text-lg font-black" style={{ fontFamily: 'var(--font-display)', color: selectedSeat ? 'var(--color-primary)' : 'var(--color-text)' }}>
                                {selectedSeat ? String(selectedSeat).padStart(2, '0') : '—'}
                            </p>
                            <p className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-3)' }}>Selecionado</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 px-1" style={{ color: 'var(--color-text-3)' }}>Mapa de Assentos</h3>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)', borderWidth: 3 }} />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="w-full max-w-sm rounded-3xl overflow-hidden"
                            style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', boxShadow: '0 8px 32px -8px rgba(37,99,235,0.1)' }}>
                            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="flex items-center gap-2">
                                    <Bus size={16} style={{ color: 'var(--color-primary)' }} />
                                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{trip?.linha?.nome ?? 'Ônibus'}</span>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                    style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)' }}>
                                    {capacity} lugares
                                </span>
                            </div>

                            <div className="px-6 py-6">
                                <div className="grid grid-cols-[auto_20px_auto] gap-x-3 gap-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        {leftSeats.map((row) => row.map((seat) => (
                                            <motion.button
                                                key={seat.id}
                                                whileTap={{ scale: seat.status !== 'occupied' ? 0.92 : 1 }}
                                                onClick={() => toggleSeat(seat.id)}
                                                disabled={seat.status === 'occupied'}
                                                className={seatClass(seat.status)}
                                                style={seatStyle(seat.status)}
                                            >
                                                {String(seat.id).padStart(2, '0')}
                                            </motion.button>
                                        )))}
                                    </div>
                                    <div className="flex flex-col items-center gap-2 pt-1">
                                        {Array.from({ length: rows }).map((_, i) => (
                                            <div key={i} className="h-10 w-px" style={{ background: 'var(--color-border)' }} />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {rightSeats.map((row) => row.map((seat) => (
                                            <motion.button
                                                key={seat.id}
                                                whileTap={{ scale: seat.status !== 'occupied' ? 0.92 : 1 }}
                                                onClick={() => toggleSeat(seat.id)}
                                                disabled={seat.status === 'occupied'}
                                                className={seatClass(seat.status)}
                                                style={seatStyle(seat.status)}
                                            >
                                                {String(seat.id).padStart(2, '0')}
                                            </motion.button>
                                        )))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-5 mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-md" style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-border)' }} />
                                        <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>Ocupado</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-md" style={{ background: 'white', border: '1.5px solid rgba(37,99,235,0.25)' }} />
                                        <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>Livre</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-md" style={{ background: 'var(--color-primary)' }} />
                                        <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>Selecionado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3.5 rounded-xl text-sm font-medium text-center"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}>
                        {error}
                    </div>
                )}
            </div>

            <div className="sticky bottom-0 z-30 px-5 py-4"
                style={{ background: 'rgba(240,244,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--color-border)' }}>
                <div>
                    <button
                        onClick={handleReserve}
                        disabled={selectedSeat === null || submitting}
                        className="btn-primary"
                    >
                        {submitting ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Reservando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Ticket size={18} />
                                {selectedSeat ? `Confirmar assento ${String(selectedSeat).padStart(2, '0')}` : 'Selecione um assento'}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
