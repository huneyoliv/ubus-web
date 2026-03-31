import { useState, useEffect } from 'react'
import { Bus, Plus, Loader2, X, Info, Zap } from 'lucide-react'
import { api } from '@/lib/api'

export default function ManagerFrota() {
    const [buses, setBuses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newBus, setNewBus] = useState({
        numeroIdentificacao: '',
        placa: '',
        capacidadePadrao: 44,
        temBanheiro: false,
        temArCondicionado: true
    })

    useEffect(() => {
        fetchBuses()
    }, [])

    async function fetchBuses() {
        try {
            const data = await api.get<any[]>('/fleet/buses')
            setBuses(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleAddBus(e: React.FormEvent) {
        e.preventDefault()
        try {
            await api.post('/fleet/buses', newBus)
            setShowAddModal(false)
            setNewBus({
                numeroIdentificacao: '',
                placa: '',
                capacidadePadrao: 44,
                temBanheiro: false,
                temArCondicionado: true
            })
            fetchBuses()
        } catch (err) {
            console.error(err)
            alert('Erro ao cadastrar veículo')
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
                <h2 className="text-xl font-bold leading-tight flex-1">Gestão de Frota</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Novo Veículo
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {buses.map((bus) => (
                        <div key={bus.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                            <div className="h-2 bg-blue-600 w-full" />
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600">
                                        <Bus className="w-6 h-6" />
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bus.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                                        {bus.active !== false ? 'ATIVO' : 'INATIVO'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-1">Prefixo {bus.numeroIdentificacao}</h3>
                                <p className="text-sm text-slate-500 mb-4 font-mono">{bus.placa}</p>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Assentos</p>
                                        <p className="text-lg font-bold text-blue-600">{bus.capacidadePadrao}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1">
                                        {bus.temArCondicionado && <span title="Ar Condicionado"><Zap className="w-3 h-3 text-amber-500" /></span>}
                                        {bus.temBanheiro && <span title="Banheiro"><Info className="w-3 h-3 text-blue-500" /></span>}
                                        <p className="text-[10px] text-slate-400 font-medium">Extra</p>
                                    </div>
                                </div>
                                
                                <button className="w-full text-xs font-semibold py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-wider">
                                    Gerenciar Veículo
                                </button>
                            </div>
                        </div>
                    ))}

                    {buses.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-500">Nenhum veículo cadastrado na frota municipal.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Novo Veículo</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddBus} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Prefixo</label>
                                    <input
                                        type="text"
                                        value={newBus.numeroIdentificacao}
                                        onChange={(e) => setNewBus({ ...newBus, numeroIdentificacao: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm py-2 px-3 border border-slate-200 outline-none"
                                        placeholder="Ex: 20120"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Placa</label>
                                    <input
                                        type="text"
                                        value={newBus.placa}
                                        onChange={(e) => setNewBus({ ...newBus, placa: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono py-2 px-3 border border-slate-200 outline-none"
                                        placeholder="ABC-1234"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Capacidade de Assentos</label>
                                <input
                                    type="number"
                                    value={newBus.capacidadePadrao}
                                    onChange={(e) => setNewBus({ ...newBus, capacidadePadrao: Number(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm py-2 px-3 border border-slate-200 outline-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 py-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={newBus.temArCondicionado}
                                        onChange={(e) => setNewBus({ ...newBus, temArCondicionado: e.target.checked })}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-600 border-slate-300 dark:border-slate-700"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">Ar Condicionado</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={newBus.temBanheiro}
                                        onChange={(e) => setNewBus({ ...newBus, temBanheiro: e.target.checked })}
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-600 border-slate-300 dark:border-slate-700"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">Banheiro</span>
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                            >
                                Adicionar Veículo
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
