import { useState, useEffect } from 'react'
import { Search, Map, Bus, Plus, Loader2, X, Clock, Calendar } from 'lucide-react'
import { api } from '@/lib/api'

export default function ManagerRoutes() {
    const [routes, setRoutes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newRoute, setNewRoute] = useState({
        nome: '',
        descricao: '',
        diasDaSemana: [1, 2, 3, 4, 5],
        horarioAberturaVotacao: '06:00',
        horarioFechamentoVotacao: '20:00'
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
                nome: '',
                descricao: '',
                diasDaSemana: [1, 2, 3, 4, 5],
                horarioAberturaVotacao: '06:00',
                horarioFechamentoVotacao: '20:00'
            })
            fetchRoutes()
        } catch (err) {
            console.error(err)
            alert('Erro ao criar rota')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-full">
            <div className="flex items-center p-4 pb-2 justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <h2 className="text-xl font-bold leading-tight flex-1">Gestão de Rotas</h2>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-blue-600 outline-none w-64"
                            placeholder="Buscar rota..."
                            type="text"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nova Rota
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {routes.map((route) => (
                        <div key={route.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                                    <Bus className="text-blue-600 w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{route.nome}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{route.descricao || 'Sem descrição'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400 mb-5 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    <span>Votação: {route.horarioAberturaVotacao} - {route.horarioFechamentoVotacao}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{route.diasDaSemana?.length} dias/semana</span>
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 rounded-lg h-10 bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 font-medium transition-colors text-sm">
                                <Map className="w-4 h-4" />
                                Detalhes e Mapa
                            </button>
                        </div>
                    ))}

                    {routes.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-500">Nenhuma rota cadastrada para este município.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Nova Rota</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddRoute} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nome da Linha</label>
                                <input
                                    type="text"
                                    value={newRoute.nome}
                                    onChange={(e) => setNewRoute({ ...newRoute, nome: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                    placeholder="Ex: Universitária - Noite"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descrição</label>
                                <textarea
                                    value={newRoute.descricao}
                                    onChange={(e) => setNewRoute({ ...newRoute, descricao: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                                    placeholder="Detalhes do trajeto..."
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Abre Votação</label>
                                    <input
                                        type="time"
                                        value={newRoute.horarioAberturaVotacao}
                                        onChange={(e) => setNewRoute({ ...newRoute, horarioAberturaVotacao: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fecha Votação</label>
                                    <input
                                        type="time"
                                        value={newRoute.horarioFechamentoVotacao}
                                        onChange={(e) => setNewRoute({ ...newRoute, horarioFechamentoVotacao: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                <Plus className="w-5 h-5" />
                                Cadastrar Rota
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
