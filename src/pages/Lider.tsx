import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Users, AlertTriangle, CheckCircle, BellRing, X, Send, Clock } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import type { Reservation } from '@/types'

export default function Lider() {
    const [comMarcacao, setComMarcacao] = useState(true)
    const [passageiros, setPassageiros] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [alertaEnviado, setAlertaEnviado] = useState(false)
    const [punicaoAplicada, setPunicaoAplicada] = useState(false)
    const [error, setError] = useState('')
    const [tripId, setTripId] = useState<string | null>(null)

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const trips = await api.get<{ idViagem: string }[]>('/trips/open')
                if (Array.isArray(trips) && trips.length > 0) {
                    setTripId(trips[0].idViagem)
                }
            } catch { }
        }
        fetchTrip()
    }, [])

    const fetchPassageiros = useCallback(async () => {
        if (!tripId) { setLoading(false); return }
        try {
            const data = await api.get<Reservation[]>(`/reservations/trip/${tripId}`)
            setPassageiros(Array.isArray(data) ? data : [])
        } catch {
            setPassageiros([])
        } finally {
            setLoading(false)
        }
    }, [tripId])

    useEffect(() => { fetchPassageiros() }, [fetchPassageiros])

    const totalReservados = passageiros.length
    const presentes = passageiros.filter(p => p.status === 'PRESENTE' || p.status === 'CONFIRMADA').length
    const faltaram = passageiros.filter(p => p.status === 'FALTOU').length

    const handleEnviarAlerta = async () => {
        if (!tripId) return
        setError('')
        try {
            await api.post(`/trips/${tripId}/confirmation-alert`)
            setAlertaEnviado(true)
            setTimeout(() => { setAlertaEnviado(false); fetchPassageiros() }, 3000)
        } catch (err) {
            if (err instanceof ApiError) {
                const body = err.body as Record<string, unknown> | null
                setError(typeof body?.message === 'string' ? body.message : 'Erro ao enviar alerta.')
            }
        }
    }

    const handleAplicarPunicao = async () => {
        if (!tripId) return
        setError('')
        try {
            await api.post(`/trips/${tripId}/finish-and-punish`)
            setPunicaoAplicada(true)
            setTimeout(() => setPunicaoAplicada(false), 3000)
        } catch (err) {
            if (err instanceof ApiError) {
                const body = err.body as Record<string, unknown> | null
                setError(typeof body?.message === 'string' ? body.message : 'Erro ao aplicar punição.')
            }
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-full items-center justify-center" style={{ background: 'var(--color-bg)' }}>
                <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)', borderWidth: 3 }} />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="px-5 pt-8 pb-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                        <ShieldCheck size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                            Painel do Líder
                        </h1>
                        <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
                            {tripId ? `Viagem: ${tripId.slice(0, 8)}...` : 'Nenhuma viagem ativa'}
                        </p>
                    </div>
                </div>

                <div className="flex p-1 rounded-xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    {[{ label: 'Com Marcação', active: comMarcacao }, { label: 'Sem Marcação', active: !comMarcacao }].map((tab, i) => (
                        <button
                            key={i}
                            onClick={() => setComMarcacao(i === 0)}
                            className="flex-1 py-2.5 text-xs font-bold rounded-lg transition-all"
                            style={{
                                background: tab.active ? 'var(--color-primary)' : 'transparent',
                                color: tab.active ? 'white' : 'var(--color-text-3)',
                                boxShadow: tab.active ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 px-5 pb-8 flex flex-col gap-4">
                {error && (
                    <div className="p-3.5 rounded-xl text-sm font-medium text-center"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { value: totalReservados, label: 'Reservas', icon: Users, color: 'var(--color-primary)', bg: 'rgba(37,99,235,0.08)' },
                        { value: presentes, label: 'Presentes', icon: CheckCircle, color: 'var(--color-success)', bg: 'rgba(16,185,129,0.08)' },
                        { value: faltaram, label: 'Faltas', icon: X, color: '#DC2626', bg: 'rgba(239,68,68,0.08)' },
                    ].map(({ value, label, icon: Icon, color, bg }) => (
                        <div key={label} className="p-4 rounded-2xl flex flex-col items-center text-center"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: bg, color }}>
                                <Icon size={16} />
                            </div>
                            <p className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color }}>{value}</p>
                            <p className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-3)' }}>{label}</p>
                        </div>
                    ))}
                </div>

                {comMarcacao ? (
                    <>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1 flex items-center justify-between"
                                style={{ color: 'var(--color-text-3)' }}>
                                <span>Lista de Passageiros</span>
                                <span className="px-2 py-0.5 rounded-full" style={{ background: 'var(--color-bg)' }}>{totalReservados}</span>
                            </p>

                            <div className="flex flex-col gap-2">
                                {passageiros.map((p, idx) => {
                                    const isFalta = p.status === 'FALTOU'
                                    return (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="flex items-center gap-3 p-3.5 rounded-xl"
                                            style={{
                                                background: isFalta ? 'rgba(239,68,68,0.06)' : 'var(--color-surface)',
                                                border: `1px solid ${isFalta ? 'rgba(239,68,68,0.15)' : 'var(--color-border)'}`,
                                            }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate" style={{ color: isFalta ? '#DC2626' : 'var(--color-text)' }}>
                                                    {p.usuario?.nome ?? `Usuário ${p.idUsuario.slice(0, 8)}`}
                                                </p>
                                                <p className="text-[11px] mt-0.5" style={{ color: isFalta ? 'rgba(220,38,38,0.7)' : 'var(--color-text-3)' }}>
                                                    Assento {p.numeroAssento ?? 'Excesso'} • {p.status}
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                                style={{
                                                    background: isFalta ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.1)',
                                                    color: isFalta ? '#DC2626' : 'var(--color-success)',
                                                }}>
                                                {isFalta ? <X size={16} /> : <CheckCircle size={16} />}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        <button
                            onClick={handleAplicarPunicao}
                            disabled={punicaoAplicada || !tripId}
                            className="w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
                            style={{
                                background: punicaoAplicada ? 'var(--color-success)' : '#DC2626',
                                color: 'white',
                                fontFamily: 'var(--font-display)',
                                boxShadow: punicaoAplicada ? 'none' : '0 4px 16px -4px rgba(220,38,38,0.5)',
                                opacity: (!tripId && !punicaoAplicada) ? 0.5 : 1,
                            }}
                        >
                            {punicaoAplicada ? <><CheckCircle size={20} /> Punição Aplicada</> : <><AlertTriangle size={20} /> Confirmar Ausências e Punir</>}
                        </button>
                        <p className="text-[10px] text-center" style={{ color: 'var(--color-text-3)' }}>
                            Os alunos que faltaram receberão advertência automática no sistema.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="p-5 rounded-2xl"
                            style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(37,99,235,0.12)', color: 'var(--color-primary)' }}>
                                    <BellRing size={20} />
                                </div>
                                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>Alerta Rápido</h3>
                            </div>
                            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--color-text-2)' }}>
                                Envie uma notificação push para todos os alunos que registraram viagem. Eles terão 2 minutos para confirmar.
                            </p>
                            <button
                                onClick={handleEnviarAlerta}
                                disabled={alertaEnviado || !tripId}
                                className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                style={{
                                    background: alertaEnviado ? 'var(--color-success)' : 'var(--color-primary)',
                                    color: 'white',
                                    fontFamily: 'var(--font-display)',
                                    boxShadow: alertaEnviado ? 'none' : '0 4px 16px -4px rgba(37,99,235,0.4)',
                                    opacity: (!tripId && !alertaEnviado) ? 0.5 : 1,
                                }}
                            >
                                {alertaEnviado ? <><CheckCircle size={16} /> Alerta Enviado</> : <><Send size={16} /> Enviar Alerta</>}
                            </button>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1"
                                style={{ color: 'var(--color-text-3)' }}>
                                Status de Confirmações
                            </p>
                            <div className="flex flex-col gap-2">
                                {passageiros.map((p, idx) => {
                                    const confirmed = p.status === 'CONFIRMADA' || p.status === 'PRESENTE'
                                    return (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="flex items-center gap-3 p-3.5 rounded-xl"
                                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                                                    {p.usuario?.nome ?? `Usuário ${p.idUsuario.slice(0, 8)}`}
                                                </p>
                                            </div>
                                            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                                                style={{
                                                    background: confirmed ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                                                    color: confirmed ? '#059669' : '#D97706',
                                                    border: `1px solid ${confirmed ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                                                }}>
                                                {confirmed ? <CheckCircle size={10} /> : <Clock size={10} />}
                                                {confirmed ? 'Confirmado' : p.status}
                                            </span>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        <button
                            onClick={handleAplicarPunicao}
                            disabled={punicaoAplicada || !tripId}
                            className="w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
                            style={{
                                background: punicaoAplicada ? 'var(--color-success)' : '#DC2626',
                                color: 'white',
                                fontFamily: 'var(--font-display)',
                                boxShadow: punicaoAplicada ? 'none' : '0 4px 16px -4px rgba(220,38,38,0.5)',
                                opacity: (!tripId && !punicaoAplicada) ? 0.5 : 1,
                            }}
                        >
                            {punicaoAplicada ? <><CheckCircle size={20} /> Punição Aplicada</> : <><AlertTriangle size={20} /> Punir Não Confirmados</>}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
