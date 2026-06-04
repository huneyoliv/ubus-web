import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bus, IdCard, Lock, ArrowRight } from 'lucide-react'

export default function MotoristaSplash() {
    const navigate = useNavigate()
    const [driverId, setDriverId] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        navigate('/selecionar-veiculo')
    }

    return (
        <div className="bg-[#f5f8f5] dark:bg-[#102210] min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[#0df20d] selection:text-[#102210] w-full">
            <div className="w-full max-w-md flex flex-col min-h-[min(884px,100dvh)] justify-between gap-8 py-8">

                <div className="flex flex-col items-center justify-center pt-10 gap-6">
                    <div className="flex items-center justify-center size-24 rounded-full bg-slate-800/50 border-2 border-slate-700">
                        <Bus className="text-white w-12 h-12" />
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight leading-tight">
                            MuniMobility<br />Motorista
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            Sistema Municipal de Transporte Escolar
                        </p>
                    </div>
                </div>

                <div className="w-full space-y-6 px-2 flex-1 flex flex-col justify-center">
                    <form onSubmit={handleSubmit} className="space-y-6 w-full">
                        <div className="space-y-2">
                            <label className="text-slate-700 dark:text-slate-200 text-sm font-bold uppercase tracking-wider" htmlFor="driver-id">
                                ID do Motorista
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <IdCard className="text-slate-400 group-focus-within:text-[#0df20d] transition-colors w-6 h-6" />
                                </div>
                                <input
                                    id="driver-id"
                                    type="text"
                                    placeholder="Digite seu ID"
                                    value={driverId}
                                    onChange={(e) => setDriverId(e.target.value)}
                                    className="block w-full rounded-lg border-0 bg-slate-200 dark:bg-slate-800 py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#0df20d] focus:bg-slate-100 dark:focus:bg-slate-700 transition-all font-medium text-lg outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-700 dark:text-slate-200 text-sm font-bold uppercase tracking-wider" htmlFor="password">
                                Senha
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-slate-400 group-focus-within:text-[#0df20d] transition-colors w-6 h-6" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg border-0 bg-slate-200 dark:bg-slate-800 py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#0df20d] focus:bg-slate-100 dark:focus:bg-slate-700 transition-all font-medium text-lg outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0df20d] dark:hover:text-[#0df20d] transition-colors">
                                Esqueceu a senha?
                            </a>
                        </div>

                        <div className="w-full pt-4 pb-8 space-y-4">
                            <button
                                type="submit"
                                className="w-full bg-[#0df20d] text-[#102210] hover:bg-opacity-90 active:scale-[0.98] transition-all h-16 rounded-xl font-extrabold text-lg uppercase tracking-wide shadow-lg shadow-[#0df20d]/20 flex items-center justify-center gap-3"
                            >
                                <span>Iniciar Jornada</span>
                                <ArrowRight className="w-6 h-6" />
                            </button>
                            <p className="text-center text-xs text-slate-500 dark:text-slate-600 font-medium">
                                Versão 2.4.0 • Build 892
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
