import { motion } from 'framer-motion'
import { CreditCard, Construction } from 'lucide-react'

export default function Pagamentos() {
    return (
        <div className="flex flex-col min-h-full">
            <div className="px-5 pt-8 pb-5">
                <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                    Pagamentos
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>Gerencie suas mensalidades</p>
            </div>

            <div className="flex-1 px-5 pb-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: 'rgba(37,99,235,0.06)' }}>
                        <CreditCard size={32} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                        Módulo em desenvolvimento
                    </h3>
                    <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--color-text-2)' }}>
                        O sistema de pagamentos está sendo implementado.
                        Em breve você poderá visualizar e gerenciar suas mensalidades por aqui.
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
