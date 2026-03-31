import { useState } from 'react'
import { CheckCircle, AlertTriangle, Clock, Copy, X, ChevronDown, ChevronUp, Bell } from 'lucide-react'

type ParcelaStatus = 'pago' | 'pendente' | 'atrasado' | 'futuro'

interface Parcela {
    id: number
    mes: string
    valor: number
    vencimento: string
    status: ParcelaStatus
    canAdvance: boolean
}

interface PaymentConfig {
    allowAdvancePayment: boolean
    pixKey: string
    pixName: string
    notificationDaysBefore: number
}

const statusConfig = {
    pago: { label: 'Pago', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    pendente: { label: 'Pendente', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    atrasado: { label: 'Atrasado', icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    futuro: { label: 'A vencer', icon: Clock, bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100' },
}

export default function Pagamentos() {
    const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null)
    const [pixCopied, setPixCopied] = useState(false)
    const [showAll, setShowAll] = useState(false)

    const parcelas: Parcela[] = []
    const [config] = useState<PaymentConfig | null>(null)

    const atrasadas = parcelas.filter((p) => p.status === 'atrasado')
    const pendentes = parcelas.filter((p) => p.status === 'pendente')
    const totalDevido = [...atrasadas, ...pendentes].reduce((sum, p) => sum + p.valor, 0)
    const visibleParcelas = showAll ? parcelas : parcelas.slice(0, 4)

    const handleCopyPix = () => {
        if (!config) return
        navigator.clipboard.writeText(config.pixKey)
        setPixCopied(true)
        setTimeout(() => setPixCopied(false), 2500)
    }

    return (
        <div className="flex flex-col min-h-full bg-bg-light">
            <div className="px-6 pt-12 pb-4">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pagamentos</h1>
                <p className="text-sm text-slate-500 mt-1">Gerencie suas mensalidades</p>
            </div>

            <div className="flex-1 px-6 pb-6">
                {parcelas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Clock size={28} className="text-slate-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-700 mb-1">Nenhuma cobrança encontrada</h3>
                        <p className="text-sm text-slate-500">Suas parcelas aparecerão aqui.</p>
                    </div>
                ) : (
                    <>
                        {atrasadas.length > 0 && (
                            <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                                <div className="p-1.5 bg-red-100 rounded-lg text-red-600 shrink-0">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-red-800 mb-0.5">
                                        {atrasadas.length} parcela{atrasadas.length > 1 ? 's' : ''} em atraso
                                    </p>
                                    <p className="text-xs leading-relaxed text-red-700/80">
                                        Regularize para manter seu acesso ao transporte.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Total em aberto</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">
                                        R$ {totalDevido.toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                                <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${atrasadas.length > 0 ? 'bg-red-100 text-red-600' : totalDevido > 0 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {atrasadas.length > 0 ? 'Irregular' : totalDevido > 0 ? 'Pendente' : 'Em dia'}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-2.5 rounded-xl bg-emerald-50">
                                    <p className="text-lg font-bold text-emerald-600">{parcelas.filter(p => p.status === 'pago').length}</p>
                                    <p className="text-[10px] text-emerald-700 font-medium">Pagos</p>
                                </div>
                                <div className="text-center p-2.5 rounded-xl bg-amber-50">
                                    <p className="text-lg font-bold text-amber-600">{pendentes.length}</p>
                                    <p className="text-[10px] text-amber-700 font-medium">Pendentes</p>
                                </div>
                                <div className="text-center p-2.5 rounded-xl bg-red-50">
                                    <p className="text-lg font-bold text-red-600">{atrasadas.length}</p>
                                    <p className="text-[10px] text-red-700 font-medium">Atrasados</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Parcelas</h3>
                            {config && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Bell size={12} />
                                    <span>Aviso {config.notificationDaysBefore} dias antes</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            {visibleParcelas.map((parcela) => {
                                const cfg = statusConfig[parcela.status]
                                const Icon = cfg.icon
                                const canPay = parcela.status === 'atrasado' || parcela.status === 'pendente'
                                const canAdvancePay = parcela.status === 'futuro' && parcela.canAdvance && !!config?.allowAdvancePayment

                                return (
                                    <div key={parcela.id} className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4 transition-all`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg} ${cfg.text}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{parcela.mes}</p>
                                                    <p className="text-xs text-slate-500">Venc: {parcela.vencimento}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-900">R$ {parcela.valor.toFixed(2).replace('.', ',')}</p>
                                                <span className={`text-[10px] font-bold ${cfg.text}`}>{cfg.label}</span>
                                            </div>
                                        </div>
                                        {(canPay || canAdvancePay) && (
                                            <button
                                                onClick={() => setSelectedParcela(parcela)}
                                                className={`w-full mt-3 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${parcela.status === 'atrasado' ? 'bg-red-600 text-white shadow-sm' : parcela.status === 'pendente' ? 'bg-primary text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700'}`}
                                            >
                                                {canAdvancePay ? 'Adiantar Pagamento' : 'Pagar Agora'}
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {parcelas.length > 4 && (
                            <button onClick={() => setShowAll(!showAll)} className="w-full mt-3 flex items-center justify-center gap-1.5 py-3 text-sm text-primary font-medium">
                                {showAll ? <><ChevronUp size={16} /> Ver menos</> : <><ChevronDown size={16} /> Ver todas ({parcelas.length})</>}
                            </button>
                        )}
                    </>
                )}
            </div>

            {selectedParcela && config && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedParcela(null)} />
                    <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-10 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Pagamento via PIX</h3>
                            <button onClick={() => setSelectedParcela(null)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-5 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-slate-500">Parcela</span>
                                <span className="text-sm font-semibold text-slate-900">{selectedParcela.mes}</span>
                            </div>
                            <div className="h-px bg-slate-200 mb-4" />
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-slate-500">Vencimento</span>
                                <span className="text-sm font-semibold text-slate-900">{selectedParcela.vencimento}</span>
                            </div>
                            <div className="h-px bg-slate-200 mb-4" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Valor</span>
                                <span className="text-xl font-bold text-primary">R$ {selectedParcela.valor.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Chave PIX (CNPJ)</p>
                            <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-4">
                                <p className="flex-1 text-sm font-mono font-medium text-slate-900 select-all">{config.pixKey}</p>
                                <button
                                    onClick={handleCopyPix}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${pixCopied ? 'bg-emerald-100 text-emerald-600' : 'bg-primary text-white'}`}
                                >
                                    {pixCopied ? <><CheckCircle size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                            <Bell size={18} className="text-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-blue-800">Favorecido</p>
                                <p className="text-xs text-blue-700/80 mt-0.5">{config.pixName}</p>
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                            Após o pagamento, envie o comprovante para o gestor para confirmação. A baixa pode levar até 24h úteis.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
