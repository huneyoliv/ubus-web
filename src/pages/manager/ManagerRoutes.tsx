import { useState, useEffect } from 'react'
import { Search, Map, Bus, Plus, Loader2, X, Clock, Calendar } from 'lucide-react'
import { api } from '@/lib/api'

export default function ManagerRoutes() {
    const [routes, setRoutes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newRoute, setNewRoute] = useState({
        name: '',
        description: '',
        weekDays: [1, 2, 3, 4, 5],
        votingOpenTime: '06:00',
        votingCloseTime: '20:00'
    })

    useEffect(() => {
        fetchRoutes()
    }, [])

    async function fetchRoutes() {
        try {
            const data = await api.get<any[]>('/fleet/routes')
            setRoutes(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleAddRoute(e: React.FormEvent) {
        e.preventDefault()
        try {
            await api.post('/fleet/routes', newRoute)
            setShowAddModal(false)
            setNewRoute({
                name: '',
                description: '',
                weekDays: [1, 2, 3, 4, 5],
                votingOpenTime: '06:00',
                votingCloseTime: '20:00'
            })
            fetchRoutes()
        } catch (err) {
            console.error(err)
            alert('Erro ao criar rota')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-full" style={{ background: 'var(--color-bg)' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-8 max-w-[1600px] mx-auto w-full pb-0 shrink-0">
                <div>
                    <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                        Gestão de Rotas
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-2)' }}>
                        Gerencie trajetos e horários disponíveis.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-3)' }} />
                        <input
                            className="pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none sm:w-64 transition-all"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                            placeholder="Buscar rota..."
                            type="text"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary w-full sm:w-auto px-5 h-10 flex items-center justify-center gap-2"
                        style={{ padding: '0 1.25rem', height: '2.5rem' }}
                    >
                        <Plus size={16} /> Nova Rota
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-8 pt-6">
                <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {routes.map((route) => (
                        <div key={route.id} className="rounded-2xl p-6 transition-all hover:-translate-y-1 flex flex-col h-full"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px -4px rgba(37,99,235,0.05)' }}>
                            <div className="flex items-start gap-4 mb-5 flex-1">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)' }}>
                                    <Bus size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg truncate" style={{ color: 'var(--color-text)' }}>{route.name || route.nome}</h3>
                                    <p className="text-sm line-clamp-2 mt-0.5" style={{ color: 'var(--color-text-2)' }}>
                                        {route.description || route.descricao || 'Nenhuma descrição fornecida.'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-xl"
                                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-3)' }}>
                                        <Clock size={12} /> <span className="text-[10px] uppercase font-bold tracking-wider">Votação</span>
                                    </div>
                                    <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                                        {route.votingOpenTime || route.horarioAberturaVotacao} às {route.votingCloseTime || route.horarioFechamentoVotacao}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-3)' }}>
                                        <Calendar size={12} /> <span className="text-[10px] uppercase font-bold tracking-wider">Frequência</span>
                                    </div>
                                    <span className="text-xs font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                        {route.weekDays?.length || route.diasDaSemana?.length || 0} dias/semana
                                    </span>
                                </div>
                            </div>

                            <button className="w-full font-bold text-sm h-11 rounded-xl flex items-center justify-center gap-2 transition-all"
                                style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)', border: '1px solid rgba(37,99,235,0.1)' }}>
                                <Map size={16} /> Detalhes e Mapa
                            </button>
                        </div>
                    ))}

                    {routes.length === 0 && (
                        <div className="col-span-full py-20 text-center rounded-2xl border-2 border-dashed"
                            style={{ borderColor: 'var(--color-border)' }}>
                            <Bus size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-3)' }} />
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-2)' }}>Nenhuma rota cadastrada.</p>
                            <p className="text-xs mt-1" style={{ color: 'var(--color-text-3)' }}>Clique em "Nova Rota" para adicionar a primeira.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Nova Rota */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="rounded-3xl w-full max-w-md overflow-hidden transform transition-all"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
                        <div className="px-6 py-4 flex justify-between items-center border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Nova Rota</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl transition-colors hover:bg-slate-100" style={{ color: 'var(--color-text-3)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddRoute} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>Nome da Linha</label>
                                <input
                                    type="text"
                                    value={newRoute.name}
                                    onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    placeholder="Ex: Universitária - Noite"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>Descrição</label>
                                <textarea
                                    value={newRoute.description}
                                    onChange={(e) => setNewRoute({ ...newRoute, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20 resize-none"
                                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    placeholder="Detalhes do trajeto..."
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>Abre Votação</label>
                                    <input
                                        type="time"
                                        value={newRoute.votingOpenTime}
                                        onChange={(e) => setNewRoute({ ...newRoute, votingOpenTime: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>Fecha Votação</label>
                                    <input
                                        type="time"
                                        value={newRoute.votingCloseTime}
                                        onChange={(e) => setNewRoute({ ...newRoute, votingCloseTime: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary mt-2 flex items-center justify-center gap-2">
                                <Plus size={18} /> Cadastrar Rota
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
