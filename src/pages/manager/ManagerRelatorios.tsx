import { useState, useEffect } from 'react'
import { BarChart3, School, Route, Bus, AlertCircle, TrendingUp, Loader2, Download } from 'lucide-react'
import { api } from '@/lib/api'

interface DashboardData {
    activeStudents: number
    tripsToday: number
    pendingApprovals: number
    fleetActive: number
    weeklyTrips: { date: string; count: number }[]
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function ManagerRelatorios() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.debug('[ManagerRelatorios] fetching /metrics/dashboard')
        api.get<DashboardData>('/metrics/dashboard')
            .then((d) => {
                console.debug('[ManagerRelatorios] data loaded', d)
                setData(d)
            })
            .catch((err) => {
                console.error('[ManagerRelatorios] error', err)
                setData(null)
            })
            .finally(() => setLoading(false))
    }, [])

    const kpis = [
        { label: 'Alunos Ativos', value: data?.activeStudents ?? 0, icon: School, color: 'var(--color-primary)', bg: 'rgba(37,99,235,0.08)' },
        { label: 'Viagens Hoje', value: data?.tripsToday ?? 0, icon: Route, color: 'var(--color-success)', bg: 'rgba(16,185,129,0.08)' },
        { label: 'Frota em Operação', value: data?.fleetActive ?? 0, icon: Bus, color: '#D97706', bg: 'rgba(245,158,11,0.08)' },
        { label: 'Aprovações Pendentes', value: data?.pendingApprovals ?? 0, icon: AlertCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
    ]

    const maxWeekly = Math.max(1, ...(data?.weeklyTrips?.map(w => w.count) ?? [1]))
    const totalWeekly = data?.weeklyTrips?.reduce((acc, w) => acc + w.count, 0) ?? 0

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-full" style={{ background: 'var(--color-bg)' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="flex-1 p-5 md:p-8 max-w-[1600px] mx-auto w-full space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                            Relatórios Gerenciais
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-2)' }}>
                            Métricas e indicadores da operação
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                        <Download size={16} />
                        <span className="hidden md:inline">Exportar</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map(kpi => (
                        <div key={kpi.label} className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-3)' }}>{kpi.label}</p>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: kpi.bg, color: kpi.color }}>
                                    <kpi.icon size={18} />
                                </div>
                            </div>
                            <p className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                {kpi.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl p-6 flex flex-col"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                                    <BarChart3 size={18} className="inline mr-2" />
                                    Deslocamentos Semanais
                                </h3>
                                <p className="text-xs mt-1" style={{ color: 'var(--color-text-3)' }}>Total: {totalWeekly} viagens na semana</p>
                            </div>
                        </div>
                        {data?.weeklyTrips && data.weeklyTrips.length > 0 ? (
                            <div className="flex-1 flex items-end gap-3 min-h-[260px] px-2">
                                {data.weeklyTrips.map((w) => {
                                    const pct = Math.max(8, (w.count / maxWeekly) * 100)
                                    const dayNum = new Date(w.date + 'T12:00:00').getDay()
                                    return (
                                        <div key={w.date} className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>{w.count}</span>
                                            <div className="w-full rounded-t-xl transition-all hover:opacity-80"
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
                            <div className="flex-1 flex items-center justify-center min-h-[260px] rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--color-border)' }}>
                                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-3)' }}>Sem dados disponíveis para o período</p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl p-6 flex flex-col gap-4"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                            <TrendingUp size={18} className="inline mr-2" />
                            Resumo Operacional
                        </h3>
                        <div className="flex-1 flex flex-col gap-4">
                            {[
                                { label: 'Taxa de Ocupação Média', value: data ? `${Math.min(100, Math.round((data.activeStudents / Math.max(1, data.fleetActive * 40)) * 100))}%` : '—', color: 'var(--color-primary)' },
                                { label: 'Viagens/Dia (média)', value: data?.weeklyTrips ? (totalWeekly / Math.max(1, data.weeklyTrips.length)).toFixed(1) : '—', color: 'var(--color-success)' },
                                { label: 'Relação Aluno/Veículo', value: data ? `${(data.activeStudents / Math.max(1, data.fleetActive)).toFixed(1)}:1` : '—', color: '#D97706' },
                            ].map(item => (
                                <div key={item.label} className="p-4 rounded-xl" style={{ background: 'var(--color-bg)' }}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-3)' }}>{item.label}</p>
                                    <p className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color: item.color }}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
