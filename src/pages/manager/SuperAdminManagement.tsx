import { useState, useEffect } from 'react'
import { Landmark, UserPlus, Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import type { Prefeitura } from '@/types'

export default function SuperAdminManagement() {
    const [municipalities, setMunicipalities] = useState<Prefeitura[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Municipality Form
    const [muniName, setMuniName] = useState('')
    
    // Manager Form
    const [managerData, setManagerData] = useState({
        municipalityId: '',
        cpf: '',
        name: '',
        email: '',
        password: '',
        phone: ''
    })

    useEffect(() => {
        fetchMunicipalities()
    }, [])

    async function fetchMunicipalities() {
        try {
            const data = await api.get<Prefeitura[]>('/management')
            setMunicipalities(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleCreateMunicipality(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        try {
            await api.post('/management', { name: muniName })
            setSuccess('Prefeitura criada com sucesso!')
            setMuniName('')
            fetchMunicipalities()
        } catch (err: any) {
            setError(err.body?.message || 'Erro ao criar prefeitura')
        }
    }

    async function handleCreateManager(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        try {
            await api.post('/management/managers', managerData)
            setSuccess('Gestor criado com sucesso!')
            setManagerData({
                municipalityId: '',
                cpf: '',
                name: '',
                email: '',
                password: '',
                phone: ''
            })
        } catch (err: any) {
            setError(err.body?.message || 'Erro ao criar gestor')
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
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Landmark className="text-blue-600" />
                Painel Super Admin
            </h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Municipality */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                        <Building2 className="w-5 h-5 text-blue-500" />
                        Cadastrar Prefeitura
                    </h2>
                    <form onSubmit={handleCreateMunicipality} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Nome da Prefeitura
                            </label>
                            <input
                                type="text"
                                value={muniName}
                                onChange={(e) => setMuniName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Ex: Prefeitura de Joinville"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                            Criar Prefeitura
                        </button>
                    </form>
                </section>

                {/* Create Manager */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                        <UserPlus className="w-5 h-5 text-blue-500" />
                        Cadastrar Gestor
                    </h2>
                    <form onSubmit={handleCreateManager} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Prefeitura
                            </label>
                            <select
                                value={managerData.municipalityId}
                                onChange={(e) => setManagerData({ ...managerData, municipalityId: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                            >
                                <option value="">Selecione uma prefeitura</option>
                                {municipalities.filter(m => m.id !== '00000000-0000-0000-0000-000000000001').map((m) => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                value={managerData.name}
                                onChange={(e) => setManagerData({ ...managerData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    value={managerData.cpf}
                                    onChange={(e) => setManagerData({ ...managerData, cpf: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={managerData.password}
                                    onChange={(e) => setManagerData({ ...managerData, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={managerData.email}
                                onChange={(e) => setManagerData({ ...managerData, email: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                            Criar Gestor
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}
