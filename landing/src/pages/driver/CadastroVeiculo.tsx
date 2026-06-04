import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

export default function CadastroVeiculo() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        numero: '',
        assentos: '',
        temNumeracao: null as boolean | null,
        cadeirasPrimeiraFila: '',
        logicaNumeracao: '',
        facilidades: {
            arCondicionado: false,
            wifi: false,
            banheiro: false,
            acessibilidade: false
        }
    })

    const totalSteps = 6

    const handleNext = () => {
        if (step <= totalSteps) {
            setStep(step + 1)
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        } else {
            navigate(-1)
        }
    }

    const handleToggleFacilidade = (key: keyof typeof formData.facilidades) => {
        setFormData(prev => ({
            ...prev,
            facilidades: {
                ...prev.facilidades,
                [key]: !prev.facilidades[key]
            }
        }))
    }

    const renderProgressBar = () => (
        <div className="flex w-full flex-row items-center justify-center gap-2 py-5 shrink-0 px-6">
            {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                    key={idx}
                    className={clsx(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        (idx + 1) <= step ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                    )}
                />
            ))}
        </div>
    )

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col py-3 w-full shrink-0 animate-slide-up">
                        <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">
                            Qual o número do ônibus?
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-8">
                            Digite ou confirme o número de identificação do veículo.
                        </p>
                        <label className="flex flex-col w-full group">
                            <span className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-3">Número do ônibus</span>
                            <input
                                type="number"
                                value={formData.numero}
                                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                placeholder="00000"
                                className="form-input flex w-full rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary h-20 px-6 text-4xl text-center font-bold tracking-[0.1em] shadow-sm transition-colors"
                            />
                        </label>
                    </div>
                )
            case 2:
                return (
                    <div className="flex flex-col py-3 w-full shrink-0 animate-slide-up">
                        <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">
                            Capacidade
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-8">
                            Quantos assentos para passageiros o veículo possui?
                        </p>
                        <label className="flex flex-col w-full group">
                            <span className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-3">Quantidade de assentos</span>
                            <input
                                type="number"
                                value={formData.assentos}
                                onChange={(e) => setFormData({ ...formData, assentos: e.target.value })}
                                placeholder="Ex: 42"
                                className="form-input flex w-full rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary h-20 px-6 text-4xl text-center font-bold shadow-sm transition-colors"
                            />
                        </label>
                    </div>
                )
            case 3:
                return (
                    <div className="flex flex-col py-3 w-full shrink-0 animate-slide-up">
                        <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">
                            Numeração
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-8">
                            As poltronas deste veículo são numeradas?
                        </p>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, temNumeracao: true })}
                                className={clsx(
                                    "p-6 rounded-2xl border-2 text-left transition-all",
                                    formData.temNumeracao === true
                                        ? "border-primary bg-primary/5"
                                        : "border-slate-200 dark:border-slate-800 hover:border-primary/50"
                                )}
                            >
                                <div className="font-bold text-xl mb-1 dark:text-white">Sim</div>
                                <div className="text-slate-500 text-sm">Passageiros podem reservar cadeiras específicas.</div>
                            </button>
                            <button
                                onClick={() => {
                                    setFormData({ ...formData, temNumeracao: false })
                                    // Se não tem numeração, podemos pular os passos 4 e 5!
                                }}
                                className={clsx(
                                    "p-6 rounded-2xl border-2 text-left transition-all",
                                    formData.temNumeracao === false
                                        ? "border-primary bg-primary/5"
                                        : "border-slate-200 dark:border-slate-800 hover:border-primary/50"
                                )}
                            >
                                <div className="font-bold text-xl mb-1 dark:text-white">Não</div>
                                <div className="text-slate-500 text-sm">Ordem de chegada, sem lugar marcado.</div>
                            </button>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="flex flex-col py-3 w-full shrink-0 animate-slide-up">
                        <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">
                            Layout (Frente)
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-8">
                            Para montar o mapa de assentos, precisamos de algumas informações.
                        </p>
                        <label className="flex flex-col w-full group">
                            <span className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-3">Quantas cadeiras na primeira fila?</span>
                            <input
                                type="number"
                                value={formData.cadeirasPrimeiraFila}
                                onChange={(e) => setFormData({ ...formData, cadeirasPrimeiraFila: e.target.value })}
                                placeholder="Ex: 4"
                                className="form-input flex w-full rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-primary dark:focus:border-primary h-20 px-6 text-4xl text-center font-bold shadow-sm transition-colors"
                            />
                        </label>
                    </div>
                )
            case 5:
                return (
                    <div className="flex flex-col py-3 w-full shrink-0 animate-slide-up">
                        <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">
                            Lógica de Numeração
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-8">
                            Como a numeração das poltronas se comporta?
                        </p>
                        <div className="flex flex-col gap-4">
                            {[
                                { id: 'sequencial', label: 'Sequencial Clássica', desc: '1, 2, 3, 4 (esquerda para direita)' },
                                { id: 'impar-par', label: 'Ímpar/Par Janela', desc: 'Ímpares na janela, pares no corredor' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setFormData({ ...formData, logicaNumeracao: opt.id })}
                                    className={clsx(
                                        "p-6 rounded-2xl border-2 text-left transition-all",
                                        formData.logicaNumeracao === opt.id
                                            ? "border-primary bg-primary/5"
                                            : "border-slate-200 dark:border-slate-800 hover:border-primary/50"
                                    )}
                                >
                                    <div className="font-bold text-xl mb-1 dark:text-white">{opt.label}</div>
                                    <div className="text-slate-500 text-sm">{opt.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            case 6:
                return (
                    <div className="flex flex-col py-3 w-full shrink-0 animate-slide-up">
                        <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-3">
                            Facilidades
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-8">
                            Selecione os recursos disponíveis neste veículo.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'arCondicionado' as const, label: 'Ar Cond.', icon: '❄️' },
                                { id: 'wifi' as const, label: 'Wi-Fi', icon: '📶' },
                                { id: 'banheiro' as const, label: 'Banheiro', icon: '🚻' },
                                { id: 'acessibilidade' as const, label: 'Acess.', icon: '♿' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleToggleFacilidade(opt.id)}
                                    className={clsx(
                                        "p-5 rounded-2xl border-2 flex flex-col justify-center items-center gap-3 transition-all",
                                        formData.facilidades[opt.id]
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary/50"
                                    )}
                                >
                                    <div className="text-3xl">{opt.icon}</div>
                                    <div className="font-bold text-sm tracking-wide">{opt.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            case 7:
                return (
                    <div className="flex flex-col py-3 w-full shrink-0 animate-slide-up">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-center tracking-tight text-3xl font-bold leading-tight pb-2">
                            Resumo Técnico
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-center text-sm font-normal leading-normal pb-8">
                            Confirme os dados antes de finalizar o cadastro.
                        </p>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="text-slate-500 text-sm">Veículo ID</span>
                                <span className="font-bold dark:text-white">ÔNIBUS {formData.numero || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="text-slate-500 text-sm">Capacidade Total</span>
                                <span className="font-bold dark:text-white">{formData.assentos || '0'} Lugares</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="text-slate-500 text-sm">Numeração</span>
                                <span className="font-bold dark:text-white">{formData.temNumeracao ? 'Sim' : 'Não'}</span>
                            </div>
                            <div className="flex flex-col gap-2 pt-1">
                                <span className="text-slate-500 text-sm">Facilidades Confirmadas</span>
                                <div className="flex gap-2 flex-wrap">
                                    {Object.entries(formData.facilidades).map(([k, v]) => v && (
                                        <div key={k} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold uppercase dark:text-slate-300">
                                            {k}
                                        </div>
                                    ))}
                                    {!Object.values(formData.facilidades).some(Boolean) && (
                                        <span className="text-sm dark:text-slate-400 italic">Nenhuma facilidade selecionada</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    const isStepValid = () => {
        if (step === 1) return formData.numero.trim() !== ''
        if (step === 2) return formData.assentos.trim() !== ''
        if (step === 3) return formData.temNumeracao !== null
        if (step === 4) return formData.cadeirasPrimeiraFila.trim() !== ''
        if (step === 5) return formData.logicaNumeracao !== ''
        return true // steps 6 e 7 sempre validos
    }

    const handleActionClick = () => {
        if (step === 7) {
            navigate('/selecionar-veiculo')
        } else {
            if (step === 3 && formData.temNumeracao === false) {
                setStep(6)
            } else {
                handleNext()
            }
        }
    }

    return (
        <div className="bg-bg-light dark:bg-[#020617] font-sans flex flex-col min-h-screen text-slate-900 dark:text-slate-100 w-full">
            <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto">
                <div className="flex items-center p-4 pb-2 justify-between shrink-0">
                    <button
                        onClick={handleBack}
                        className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-slate-900 dark:text-white"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    {step <= totalSteps && (
                        <span className="text-sm font-bold text-slate-400 mr-4">Passo {step} de {totalSteps}</span>
                    )}
                </div>

                {step <= totalSteps && renderProgressBar()}

                <main className="flex-1 flex flex-col px-6 w-full max-w-md mx-auto">
                    {renderStepContent()}
                </main>

                <footer className="p-6 pb-10 mt-auto shrink-0 w-full max-w-md mx-auto">
                    <button
                        onClick={handleActionClick}
                        disabled={!isStepValid()}
                        className={clsx(
                            "w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center transition-all",
                            isStepValid()
                                ? "bg-primary text-white hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(13,127,242,0.25)] active:scale-[0.98]"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        {step === 7 ? "Confirmar e Salvar" : "Continuar"}
                    </button>
                </footer>
            </div>
        </div>
    )
}
