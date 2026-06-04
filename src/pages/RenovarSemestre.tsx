import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Construction } from 'lucide-react'

export default function RenovarSemestre() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="sticky top-0 z-20 flex items-center gap-3 px-5 py-4"
                style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/me')}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white"
                    style={{ border: '1.5px solid var(--color-border)' }}>
                    <ArrowLeft size={18} style={{ color: 'var(--color-text)' }} />
                </button>
                <div>
                    <h1 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Renovar Semestre</h1>
                    <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Documentação necessária</p>
                </div>
            </div>

            <div className="flex-1 px-5 py-6 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center max-w-sm"
                >
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: 'rgba(37,99,235,0.06)' }}>
                        <FileText size={32} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                        Módulo em desenvolvimento
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-2)' }}>
                        O envio de grade e renovação de semestre está sendo implementado.
                        Em breve você poderá enviar sua documentação de renovação por aqui.
                    </p>
                    <div className="flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <Construction size={14} style={{ color: '#D97706' }} />
                        <span className="text-xs font-semibold" style={{ color: '#D97706' }}>Em breve</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
