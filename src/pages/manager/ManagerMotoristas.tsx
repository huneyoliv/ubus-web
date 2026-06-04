import { useState, useEffect } from 'react'
import { Plus, Loader2, X, UserSearch, UserPlus } from 'lucide-react'
import { api } from '@/lib/api'

export default function ManagerMotoristas() {
    const [buses, setBuses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newDriver, setNewDriver] = useState({
        name: '',
        cpf: '',
        email: '',
        password: '',
        role: 'DRIVER'
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

    async function handleAddDriver(e: React.FormEvent) {
        e.preventDefault()
        try {
            await api.post('/auth/register', newDriver)
            alert('Motorista cadastrado com sucesso!')
            setShowAddModal(false)
            setNewDriver({
                name: '',
                cpf: '',
                email: '',
                password: '',
                role: 'DRIVER'
            })
        } catch (err) {
            console.error(err)
            alert('Erro ao cadastrar motorista')
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
                        Gestão de Motoristas
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-2)' }}>
                        Gerencie os motoristas associados à frota.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary w-full sm:w-auto px-5 h-10 flex items-center justify-center gap-2"
                    style={{ padding: '0 1.25rem', height: '2.5rem' }}
                >
                    <Plus size={16} /> Novo Motorista
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-8 pt-6">
                <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {buses.map((bus) => (
                        <div key={bus.id} className="rounded-2xl overflow-hidden shadow-sm transition-all hover:-translate-y-1 bg-white flex flex-col h-full relative"
                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px -4px rgba(37,99,235,0.05)' }}>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ background: 'rgba(52,211,153,0.1)', color: 'var(--color-success)' }}>
                                            <UserSearch size={20} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={{
                                            background: bus.driverId ? 'rgba(37,99,235,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: bus.driverId ? 'var(--color-primary)' : '#EF4444'
                                        }}>
                                        {bus.driverId ? 'VINCULADO' : 'SEM MOTORISTA'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                                    {bus.driverId ? `Motorista: ${bus.driverId}` : 'Nenhum motorista alocado'}
                                </h3>
                                <p className="text-sm mt-1 mb-5" style={{ color: 'var(--color-text-3)' }}>
                                    Ônibus: {bus.plate || bus.placa} ({bus.identificationNumber || bus.numeroIdentificacao})
                                </p>
                            </div>
                        </div>
                    ))}
                    {buses.length === 0 && (
                        <div className="col-span-full py-20 text-center rounded-2xl border-2 border-dashed"
                            style={{ borderColor: 'var(--color-border)' }}>
                            <UserSearch size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-3)' }} />
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-2)' }}>Nenhum ônibus (logo, motorista) encontrado.</p>
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                   <div className="rounded-3xl w-full max-w-md overflow-hidden transform transition-all"
                       style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
                       <div className="px-6 py-4 flex justify-between items-center border-b" style={{ borderColor: 'var(--color-border)' }}>
                           <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Novo Motorista</h3>
                           <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl transition-colors hover:bg-slate-100" style={{ color: 'var(--color-text-3)' }}>
                               <X size={20} />
                           </button>
                       </div>
                       <form onSubmit={handleAddDriver} className="p-6 flex flex-col gap-4">
                           <div>
                               <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>Nome</label>
                               <input
                                   type="text"
                                   value={newDriver.name}
                                   onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                                   className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                   style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                   required
                               />
                           </div>
                           <div>
                               <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>CPF</label>
                               <input
                                   type="text"
                                   value={newDriver.cpf}
                                   onChange={(e) => setNewDriver({ ...newDriver, cpf: e.target.value })}
                                   className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                   style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                   required
                               />
                           </div>
                           <div>
                               <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>E-mail</label>
                               <input
                                   type="email"
                                   value={newDriver.email}
                                   onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                                   className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                   style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                   required
                               />
                           </div>
                           <div>
                               <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-3)' }}>Senha</label>
                               <input
                                   type="password"
                                   value={newDriver.password}
                                   onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                                   className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                   style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                                   required
                               />
                           </div>
                           <button type="submit" className="btn-primary mt-2 flex items-center justify-center gap-2">
                               <UserPlus size={18} /> Cadastrar
                           </button>
                       </form>
                   </div>
               </div>
           )}
        </div>
    )
}
