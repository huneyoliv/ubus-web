import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Check, Bus, Navigation, CheckCircle } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

interface PontoEmbarque {
    id: string
    nome: string
    endereco: string
    lat: number
    lng: number
    idLinha: string
    ordem: number
}

interface Linha {
    id: string
    nome: string
    descricao?: string
}

export default function SelecionarPontoEmbarque() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const [linhas, setLinhas] = useState<Linha[]>([])
    const [selectedLinha, setSelectedLinha] = useState<string | null>(user?.defaultRouteId ?? null)
    const [pontos, setPontos] = useState<PontoEmbarque[]>([])
    const [selectedPonto, setSelectedPonto] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        api.get<Linha[]>('/fleet/routes')
            .then(setLinhas)
            .catch(() => setLinhas([]))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!selectedLinha) { setPontos([]); return }
        setLoading(true)
        api.get<PontoEmbarque[]>(`/fleet/routes/${selectedLinha}/points`)
            .then((data) => setPontos(Array.isArray(data) ? data : []))
            .catch(() => setPontos([]))
            .finally(() => setLoading(false))
    }, [selectedLinha])

    const handleSave = async () => {
        if (!selectedPonto) return
        setSaving(true)
        try {
            await api.patch('/users/me/point', { pointId: selectedPonto })
            setSuccess(true)
            setTimeout(() => navigate('/dashboard'), 1200)
        } catch (err) {
            if (err instanceof ApiError) {
                console.error('Erro ao salvar ponto:', err.body)
            }
        } finally {
            setSaving(false)
        }
    }

    const selectedPontoData = pontos.find(p => p.id === selectedPonto)

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="sticky top-0 z-20 flex items-center gap-3 px-5 py-4"
                style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white"
                    style={{ border: '1.5px solid var(--color-border)' }}>
                    <ArrowLeft size={18} style={{ color: 'var(--color-text)' }} />
                </button>
                <div>
                    <h1 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                        Ponto de Embarque
                    </h1>
                    <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Selecione onde você embarca</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col px-5 py-6 gap-6 pb-40 overflow-y-auto">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5"
                        style={{ color: 'var(--color-text-3)' }}>
                        <Bus size={11} /> Sua Linha
                    </p>
                    <div className="flex flex-col gap-2">
                        {linhas.map((linha) => {
                            const isSelected = selectedLinha === linha.id
                            return (
                                <motion.button
                                    key={linha.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { setSelectedLinha(linha.id); setSelectedPonto(null) }}
                                    className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                                    style={{
                                        background: isSelected ? 'rgba(37,99,235,0.06)' : 'var(--color-surface)',
                                        border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                                        boxShadow: isSelected ? '0 4px 16px -4px rgba(37,99,235,0.15)' : 'none',
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
                                        style={{
                                            background: isSelected ? 'var(--color-primary)' : 'rgba(37,99,235,0.08)',
                                            color: isSelected ? 'white' : 'var(--color-primary)',
                                        }}>
                                        <Bus size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{linha.nome}</p>
                                        {linha.descricao && (
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>{linha.descricao}</p>
                                        )}
                                    </div>
                                    {isSelected && (
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center"
                                            style={{ background: 'var(--color-primary)' }}>
                                            <Check size={13} className="text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </motion.button>
                            )
                        })}
                    </div>
                </div>

                {selectedLinha && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5"
                            style={{ color: 'var(--color-text-3)' }}>
                            <MapPin size={11} /> Onde você embarca?
                        </p>

                        {loading ? (
                            <div className="flex flex-col gap-2">
                                {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl skeleton" />)}
                            </div>
                        ) : pontos.length === 0 ? (
                            <div className="text-center py-10 rounded-2xl border-2 border-dashed"
                                style={{ borderColor: 'var(--color-border)' }}>
                                <MapPin size={32} className="mx-auto mb-2" style={{ color: 'var(--color-text-3)' }} />
                                <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>Nenhum ponto cadastrado para esta linha.</p>
                                <p className="text-xs mt-1" style={{ color: 'var(--color-text-3)' }}>O gestor precisa cadastrar os pontos.</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute left-[29px] top-8 bottom-8 w-0.5 z-0" style={{ background: 'var(--color-border)' }} />

                                <div className="flex flex-col gap-2 relative z-10">
                                    {pontos.map((ponto, index) => {
                                        const isFirst = index === 0
                                        const isLast = index === pontos.length - 1
                                        const isSelected = selectedPonto === ponto.id

                                        return (
                                            <motion.button
                                                key={ponto.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => setSelectedPonto(ponto.id)}
                                                className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                                                style={{
                                                    background: isSelected ? 'rgba(37,99,235,0.06)' : 'var(--color-surface)',
                                                    border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                                                    boxShadow: isSelected ? '0 4px 16px -4px rgba(37,99,235,0.15)' : 'none',
                                                }}
                                            >
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
                                                    style={{
                                                        background: isSelected ? 'var(--color-primary)' : (isFirst || isLast) ? 'rgba(16,185,129,0.1)' : 'var(--color-bg)',
                                                        color: isSelected ? 'white' : (isFirst || isLast) ? 'var(--color-success)' : 'var(--color-text-3)',
                                                        boxShadow: isSelected ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                                                    }}>
                                                    {isFirst ? <Navigation size={16} /> : isLast ? <MapPin size={16} /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{ponto.nome}</p>
                                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>{ponto.endereco}</p>
                                                    {(isFirst || isLast) && (
                                                        <span className="inline-block mt-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                                            style={{
                                                                background: isFirst ? 'rgba(16,185,129,0.1)' : 'rgba(37,99,235,0.08)',
                                                                color: isFirst ? '#059669' : 'var(--color-primary)',
                                                            }}>
                                                            {isFirst ? 'Ponto Inicial' : 'Destino Final'}
                                                        </span>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                                                        style={{ background: 'var(--color-primary)' }}>
                                                        <Check size={13} className="text-white" strokeWidth={3} />
                                                    </div>
                                                )}
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30 px-5 py-4"
                style={{ background: 'rgba(240,244,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--color-border)' }}>
                <div className="max-w-2xl mx-auto">
                    {selectedPontoData && (
                        <div className="flex items-center gap-3 mb-3 p-3 rounded-xl"
                            style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
                            <MapPin size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                            <div>
                                <p className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-primary)' }}>Seu ponto:</p>
                                <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{selectedPontoData.nome}</p>
                            </div>
                        </div>
                    )}

                    {success ? (
                        <div className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-bold"
                            style={{ background: 'var(--color-success)', color: 'white', fontFamily: 'var(--font-display)' }}>
                            <CheckCircle size={20} /> Ponto salvo!
                        </div>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={!selectedPonto || saving}
                            className="btn-primary"
                        >
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Salvando...
                                </span>
                            ) : 'Confirmar Ponto de Embarque'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
