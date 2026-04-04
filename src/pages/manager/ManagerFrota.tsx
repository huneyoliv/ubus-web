import { useState, useEffect } from 'react'
import { Bus, Plus, Loader2, X, Info, Zap, Settings, CreditCard } from 'lucide-react'
import { api } from '@/lib/api'

export default function ManagerFrota() {
    const [buses, setBuses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newBus, setNewBus] = useState({
        identificationNumber: '',
        plate: '',
        standardCapacity: 44,
        hasBathroom: false,
        hasAirConditioning: true
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
                identificationNumber: '',
                plate: '',
                standardCapacity: 44,
                hasBathroom: false,
                hasAirConditioning: true
            })
            fetchBuses()
        } catch (err) {
            console.error(err)
            alert('Erro ao cadastrar veículo')
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
                        Gestão de Frota
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-2)' }}>
                        Controle os veículos disponíveis para operação.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary w-full sm:w-auto px-5 h-10 flex items-center justify-center gap-2"
                    style={{ padding: '0 1.25rem', height: '2.5rem' }}
                >
                    <Plus size={16} /> Novo Veículo
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-8 pt-6">
                <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {buses.map((bus) => (
                        <div key={bus.id} className="rounded-2xl overflow-hidden shadow-sm transition-all hover:-translate-y-1 bg-white relative group"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px -4px rgba(37,99,235,0.05)' }}>
                            <div className="h-1.5 w-full" style={{ background: bus.active !== false ? 'var(--color-success)' : 'var(--color-text-3)' }} />
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)' }}>
                                        <Bus size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={{
                                            background: bus.active !== false ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
                                            color: bus.active !== false ? 'var(--color-success)' : 'var(--color-text-3)'
                                        }}>
                                        {bus.active !== false ? 'ATIVO' : 'INATIVO'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Prefixo {bus.identificationNumber || bus.numeroIdentificacao}</h3>
                                <div className="flex items-center gap-1.5 mt-1 mb-5">
                                    <CreditCard size={14} style={{ color: 'var(--color-text-3)' }} />
                                    <p className="text-sm font-semibold tracking-wider font-mono" style={{ color: 'var(--color-text-2)' }}>{bus.plate || bus.placa}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    <div className="p-2 rounded-xl text-center" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-3)' }}>Lotação</p>
                                        <p className="text-lg font-black" style={{ color: 'var(--color-text)' }}>{bus.standardCapacity || bus.capacidadePadrao}</p>
                                    </div>
                                    <div className="p-2 rounded-xl flex flex-col items-center justify-center gap-1.5" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                                        <div className="flex gap-2">
                                            {(bus.hasAirConditioning ?? bus.temArCondicionado) && <span title="Ar Condicionado"><Zap size={15} style={{ color: '#D97706' }} /></span>}
                                            {(bus.hasBathroom ?? bus.temBanheiro) && <span title="Banheiro"><Info size={15} style={{ color: 'var(--color-primary)' }} /></span>}
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-3)' }}>Extras</p>
                                    </div>
                                </div>
                                
                                <button className="w-full font-bold text-sm h-11 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-slate-50"
                                    style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                                    <Settings size={16} /> Gerenciar
                                </button>
                            </div>
                        </div>
                    ))}

                    {buses.length === 0 && (
                        <div className="col-span-full py-20 text-center rounded-2xl border-2 border-dashed"
                            style={{ borderColor: 'var(--color-border)' }}>
                            <Bus size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-3)' }} />
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-2)' }}>Nenhum veículo cadastrado.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Novo Veículo */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="rounded-3xl w-full max-w-md overflow-hidden transform transition-all"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
                        <div className="px-6 py-4 flex justify-between items-center border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Novo Veículo</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl transition-colors hover:bg-slate-100" style={{ color: 'var(--color-text-3)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddBus} className="p-6 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>Prefixo</label>
                                    <input
                                        type="text"
                                        value={newBus.identificationNumber}
                                        onChange={(e) => setNewBus({ ...newBus, identificationNumber: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                        placeholder="Ex: 20120"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>Placa</label>
                                    <input
                                        type="text"
                                        value={newBus.plate}
                                        onChange={(e) => setNewBus({ ...newBus, plate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm font-medium font-mono uppercase outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                        placeholder="ABC-1234"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>Assentos (Capacidade)</label>
                                <input
                                    type="number"
                                    value={newBus.standardCapacity}
                                    onChange={(e) => setNewBus({ ...newBus, standardCapacity: Number(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                    required
                                />
                            </div>
                            <div className="flex gap-6 py-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={newBus.hasAirConditioning}
                                            onChange={(e) => setNewBus({ ...newBus, hasAirConditioning: e.target.checked })}
                                            className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                                        />
                                        <div className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600" style={{ borderColor: 'var(--color-border)' }}>
                                            {newBus.hasAirConditioning && <svg className="w-3 h-3 text-white" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Ar Condicionado</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={newBus.hasBathroom}
                                            onChange={(e) => setNewBus({ ...newBus, hasBathroom: e.target.checked })}
                                            className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                                        />
                                        <div className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600" style={{ borderColor: 'var(--color-border)' }}>
                                            {newBus.hasBathroom && <svg className="w-3 h-3 text-white" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Banheiro</span>
                                </label>
                            </div>
                            <button type="submit" className="btn-primary mt-2 w-full flex items-center justify-center gap-2">
                                <Plus size={18} /> Cadastrar Veículo
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
