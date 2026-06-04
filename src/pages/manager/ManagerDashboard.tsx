import { useState, useEffect } from 'react'
import { Search, Filter, Maximize2, School, Route, Bus, AlertCircle, TrendingUp, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'

interface DashboardData {
    activeStudents: number
    tripsToday: number
    pendingApprovals: number
    fleetActive: number
    weeklyTrips: { date: string; count: number }[]
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function ManagerDashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get<DashboardData>('/metrics/dashboard')
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false))
    }, [])

    const kpis = [
        {
            label: 'Alunos Ativos',
            value: data?.activeStudents ?? 0,
            icon: School,
            color: 'var(--color-primary)',
            bg: 'rgba(37,99,235,0.08)',
            shadow: 'rgba(37,99,235,0.05)',
        },
        {
            label: 'Viagens Hoje',
            value: data?.tripsToday ?? 0,
            icon: Route,
            color: 'var(--color-success)',
            bg: 'rgba(16,185,129,0.08)',
            shadow: 'rgba(16,185,129,0.05)',
        },
        {
            label: 'Frota Operação',
            value: data?.fleetActive ?? 0,
            icon: Bus,
            color: '#D97706',
            bg: 'rgba(245,158,11,0.08)',
            shadow: 'rgba(245,158,11,0.05)',
        },
        {
            label: 'Pendências',
            value: data?.pendingApprovals ?? 0,
            icon: AlertCircle,
            color: '#EF4444',
            bg: 'rgba(239,68,68,0.08)',
            shadow: 'rgba(239,68,68,0.05)',
            isAlert: true,
        },
    ]

    const maxWeekly = Math.max(1, ...(data?.weeklyTrips?.map(w => w.count) ?? [1]))

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-full" style={{ background: 'var(--color-bg)' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="p-5 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                            Visão Geral do Gestor
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-2)' }}>
                            Acompanhe os principais indicadores da sua frota hoje.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6 gap-4">
                    {kpis.map(kpi => (
                        <div key={kpi.label} className="flex flex-col gap-3 rounded-2xl p-5 transition-all hover:-translate-y-1"
                            style={{
                                background: kpi.isAlert ? 'rgba(239,68,68,0.02)' : 'var(--color-surface)',
                                border: kpi.isAlert ? '1px solid rgba(239,68,68,0.15)' : '1px solid var(--color-border)',
                                boxShadow: `0 4px 16px -4px ${kpi.shadow}`,
                            }}>
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] font-bold uppercase tracking-wider"
                                    style={{ color: kpi.isAlert ? '#EF4444' : 'var(--color-text-3)' }}>{kpi.label}</p>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: kpi.bg, color: kpi.color }}>
                                    <kpi.icon size={20} />
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-black"
                                    style={{ fontFamily: 'var(--font-display)', color: kpi.isAlert ? '#EF4444' : 'var(--color-text)' }}>
                                    {kpi.value}
                                </p>
                                {!kpi.isAlert && (
                                    <p className="text-[11px] font-semibold mt-1 flex items-center gap-1" style={{ color: 'var(--color-text-3)' }}>
                                        <TrendingUp size={12} /> Dados em tempo real
                                    </p>
                                )}
                                {kpi.isAlert && kpi.value > 0 && (
                                    <p className="text-[11px] font-semibold mt-1" style={{ color: 'rgba(239,68,68,0.7)' }}>
                                        Cadastros aguardando aprovação
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl p-6 flex flex-col"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Deslocamentos Semanais</h3>
                        </div>
                        {data?.weeklyTrips && data.weeklyTrips.length > 0 ? (
                            <div className="flex-1 flex items-end gap-3 min-h-[240px] px-2">
                                {data.weeklyTrips.map((w) => {
                                    const pct = Math.max(8, (w.count / maxWeekly) * 100)
                                    const dayNum = new Date(w.date + 'T12:00:00').getDay()
                                    return (
                                        <div key={w.date} className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>{w.count}</span>
                                            <div className="w-full rounded-t-xl transition-all"
                                                style={{
                                                    height: `${pct}%`,
                                                    background: 'linear-gradient(to top, var(--color-primary), rgba(37,99,235,0.6))',
                                                    minHeight: 8,
                                                }} />
                                            <span className="text-[10px] font-semibold" style={{ color: 'var(--color-text-3)' }}>
                                                {WEEKDAYS[dayNum] ?? w.date.slice(8)}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center min-h-[240px] rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--color-border)' }}>
                                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-3)' }}>Sem dados disponíveis para o período</p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1 border rounded-2xl p-6 flex flex-col" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Mapa em Tempo Real</h3>
                            <button className="p-2 rounded-lg transition-colors hover:bg-slate-100" style={{ color: 'var(--color-text-3)' }}>
                                <Maximize2 size={18} />
                            </button>
                        </div>
                        <div className="flex-1 rounded-xl flex items-center justify-center min-h-[240px]" style={{ background: 'var(--color-bg)' }}>
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-3)' }}>Mapa indisponível</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Rotas Ativas Hoje</h3>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-none">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-3)' }} />
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none md:w-64 transition-all"
                                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    placeholder="Buscar rota..."
                                    type="text"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                                <Filter size={16} /> <span className="hidden md:inline">Filtrar</span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="text-[11px] font-bold uppercase tracking-wider" style={{ background: 'rgba(37,99,235,0.03)', color: 'var(--color-text-3)' }}>
                                    <th className="px-6 py-4">Linha / Rota</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Motorista</th>
                                    <th className="px-6 py-4">Veículo</th>
                                    <th className="px-6 py-4">Ocupação</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm font-semibold" style={{ color: 'var(--color-text-3)' }}>
                                        Nenhuma rota ativa no momento
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
