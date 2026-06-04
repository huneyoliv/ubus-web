import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bus, Clock, PlusCircle } from 'lucide-react'

export default function SelecionarVeiculo() {
    const navigate = useNavigate()

    return (
        <div className="bg-bg-light dark:bg-[#020617] font-sans min-h-screen text-slate-900 dark:text-slate-100 flex justify-center w-full">
            <div className="relative flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden">
                <div className="sticky top-0 z-10 flex items-center p-4 pb-4 justify-between bg-bg-light/90 dark:bg-[#020617]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Voltar"
                        className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold leading-tight flex-1 text-center pr-12">
                        Escolha um ônibus salvo
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Card 1 */}
                    <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group">
                        <div className="flex items-start gap-4 w-full">
                            <div className="flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 size-14 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Bus className="w-7 h-7" />
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <h2 className="text-base font-bold leading-normal text-slate-900 dark:text-white">ÔNIBUS 1042</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal mt-0.5">Placa: ABC-1234</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs font-normal leading-normal mt-1 flex items-center gap-1">
                                    <Clock className="w-[14px] h-[14px]" />
                                    Último uso: Hoje, 08:30
                                </p>
                            </div>
                            <div className="shrink-0 self-center">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex items-center justify-center rounded-full h-8 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors"
                                >
                                    Selecionar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group">
                        <div className="flex items-start gap-4 w-full">
                            <div className="flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 size-14 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Bus className="w-7 h-7" />
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <h2 className="text-base font-bold leading-normal text-slate-900 dark:text-white">ÔNIBUS 2056</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal mt-0.5">Placa: XYZ-9876</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs font-normal leading-normal mt-1 flex items-center gap-1">
                                    <Clock className="w-[14px] h-[14px]" />
                                    Último uso: Ontem, 18:45
                                </p>
                            </div>
                            <div className="shrink-0 self-center">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex items-center justify-center rounded-full h-8 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors"
                                >
                                    Selecionar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group">
                        <div className="flex items-start gap-4 w-full">
                            <div className="flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 size-14 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Bus className="w-7 h-7" />
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <h2 className="text-base font-bold leading-normal text-slate-900 dark:text-white">ÔNIBUS 3010</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal mt-0.5">Placa: DEF-5678</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs font-normal leading-normal mt-1 flex items-center gap-1">
                                    <Clock className="w-[14px] h-[14px]" />
                                    Último uso: 12/05/2023, 10:15
                                </p>
                            </div>
                            <div className="shrink-0 self-center">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="flex items-center justify-center rounded-full h-8 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors"
                                >
                                    Selecionar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-bg-light dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800 pb-8">
                    <button
                        onClick={() => navigate('/cadastro-veiculo')}
                        className="flex w-full items-center justify-center rounded-full h-14 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                    >
                        <PlusCircle className="mr-2 w-6 h-6" />
                        CADASTRAR NOVO ÔNIBUS
                    </button>
                </div>
            </div>
        </div>
    )
}
