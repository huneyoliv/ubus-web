import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh p-5 text-center" style={{ background: 'var(--color-bg)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                <AlertTriangle size={40} />
            </div>

            <h1 className="text-5xl font-black mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                404
            </h1>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Página não encontrada
            </h2>
            <p className="text-base mb-8 max-w-sm" style={{ color: 'var(--color-text-2)' }}>
                O caminho que você está procurando não existe ou foi movido.
            </p>

            <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                }}
            >
                <ArrowLeft size={18} />
                Voltar
            </button>
        </div>
    )
}
