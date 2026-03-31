import { Search, Filter, Maximize2, School, Route, Bus, AlertCircle, TrendingUp } from 'lucide-react'

export default function ManagerDashboard() {
    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-6 md:hidden">Visão Geral do Gestor</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:gap-8 gap-4 md:gap-6">
                <div className="flex flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal uppercase tracking-wider">Alunos Ativos</p>
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <School className="text-blue-600 w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-bold leading-tight text-slate-400">—</p>
                        <p className="text-slate-400 text-sm font-medium mt-1 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> Aguardando dados
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal uppercase tracking-wider">Viagens Hoje</p>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                            <Route className="text-emerald-500 w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-bold leading-tight text-slate-400">—</p>
                        <p className="text-slate-400 text-sm font-medium mt-1">Aguardando dados</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal uppercase tracking-wider">Frota Operação</p>
                        <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                            <Bus className="text-amber-500 w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-bold leading-tight text-slate-400">—</p>
                        <p className="text-slate-400 text-sm font-medium mt-1">Aguardando dados</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-red-700 dark:text-red-400 text-sm font-medium leading-normal uppercase tracking-wider">Pendências</p>
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertCircle className="text-red-500 w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-red-400 text-3xl font-bold leading-tight">—</p>
                        <p className="text-red-400/80 text-sm font-medium mt-1">Aguardando dados</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <h3 className="text-lg font-bold">Deslocamentos Semanais de Alunos</h3>
                        <select className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-lg px-3 py-1.5">
                            <option>Esta Semana</option>
                            <option>Semana Passada</option>
                            <option>Últimos 30 dias</option>
                        </select>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-h-[240px]">
                        <p className="text-slate-400 text-sm">Sem dados disponíveis para o período</p>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Mapa em Tempo Real</h3>
                        <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                            <Maximize2 className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 w-full bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center min-h-[240px]">
                        <p className="text-slate-400 text-sm">Mapa indisponível</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-8 md:mb-0">
                <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold">Rotas Ativas Hoje</h3>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm md:w-64"
                                placeholder="Buscar rota..."
                                type="text"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 md:px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <Filter className="w-4 h-4" /> <span className="hidden md:inline">Filtrar</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="px-6 py-4">Linha / Rota</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Motorista</th>
                                <th className="px-6 py-4">Veículo</th>
                                <th className="px-6 py-4">Ocupação</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    Nenhuma rota ativa no momento
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
