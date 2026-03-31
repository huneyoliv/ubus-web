import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ArrowRight, CheckCircle, Clock, MapPin, CalendarCheck } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/api'
import type { Trip, Reservation } from '@/types'

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
                const [trips, reservations] = await Promise.all([
                    api.get<Trip[]>('/trips/open').catch(() => [] as Trip[]),
                    api.get<Reservation[]>('/reservations/minhas').catch(() => [] as Reservation[]),
                ])
                setOpenTrips(trips)
                setMyReservations(reservations)
            } catch {
                // silently fail
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
        <div className="flex flex-col min-h-full bg-bg-light">
            <div className="flex items-center justify-between px-6 pt-12 pb-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-slate-200 ring-2 ring-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                            {initials}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-bg-light rounded-full" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">Olá, {firstName}!</h2>
                        <p className="text-xs text-slate-500 font-medium">Estudante</p>
                    </div>
                </div>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition-colors relative">
                    <Bell size={24} />
                </button>
            </div>

            <div className="flex-1 px-6 pb-6">
                {loading && (
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                )}

                {!loading && !hasReservation && !hasOpenTrips && (
                    <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Clock size={28} className="text-slate-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-700 mb-2">Nenhuma viagem disponível</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Viagens abertas para reserva aparecerão aqui quando estiverem disponíveis.
                        </p>
                    </div>
                )}

                {!loading && hasOpenTrips && !hasReservation && (
                    <>
                        <div className="mb-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                <CalendarCheck size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-blue-800 mb-0.5">Viagens Abertas!</p>
                                <p className="text-xs leading-relaxed text-blue-700/80">
                                    Há {openTrips.length} viagem(ns) disponíveis para reserva.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Reserve sua Viagem</h3>
                        </div>

                        {openTrips.map((trip) => (
                            <button
                                key={trip.idViagem}
                                onClick={() => navigate('/reservar', { state: { tripId: trip.idViagem, trip } })}
                                className="w-full p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group mb-4 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <CalendarCheck size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-bold text-slate-900">
                                            {trip.direcao === 'IDA' ? 'Ida' : 'Volta'} — {trip.turno}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {trip.dataViagem} • {trip.linha?.nome ?? trip.idViagem}
                                        </p>
                                    </div>
                                    <ArrowRight size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                                </div>
                            </button>
                        ))}
                    </>
                )}

                {!loading && hasReservation && (
                    <>
                        <div className="mt-2 mb-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                                <CheckCircle size={18} />
                                <p className="text-sm font-semibold">Você tem {myReservations.length} reserva(s) ativa(s)</p>
                            </div>
                        </div>

                        {myReservations.map((reservation) => (
                            <div
                                key={reservation.id}
                                className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 mb-4 transition-all hover:shadow-md"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${reservation.viagem?.direcao === 'IDA' ? 'text-amber-500' : 'text-indigo-500'}`}>
                                            {reservation.viagem?.direcao ?? 'Viagem'}
                                        </span>
                                        <h4 className="text-base font-bold text-slate-900 leading-tight">
                                            {reservation.viagem?.direcao === 'IDA' ? 'Ida para Faculdade' : 'Volta para Casa'}
                                        </h4>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-bold text-slate-900 tracking-tight">{reservation.viagem?.turno ?? '--'}</span>
                                        <span className="text-xs text-slate-500">{reservation.viagem?.dataViagem ?? ''}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${reservation.viagem?.direcao === 'IDA' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        <MapPin size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-800">
                                            {reservation.viagem?.linha?.nome ?? reservation.idViagem}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Status: {reservation.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <span className="font-medium">{reservation.idViagem}</span>
                                        <span className="text-slate-300">•</span>
                                        <span>Poltrona {reservation.numeroAssento ?? 'Excesso'}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/bilhete', { state: { reservationId: reservation.id, reservation } })}
                                    className={`w-full py-3 px-4 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-[0.98] ${
                                        reservation.viagem?.direcao === 'IDA'
                                            ? 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20'
                                    }`}
                                >
                                    <CheckCircle size={18} />
                                    <span>Ver Bilhete</span>
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}
