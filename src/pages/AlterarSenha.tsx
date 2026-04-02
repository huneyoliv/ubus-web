import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, CheckCircle, Shield, Loader2, AlertCircle } from 'lucide-react'
import { api, ApiError } from '@/lib/api'

export default function AlterarSenha() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSendReset = async () => {
        setError('')
        setLoading(true)
        try {
            await api.post('/auth/password-email-send')
            setSent(true)
        } catch (err) {
            if (err instanceof ApiError) {
                const body = err.body as Record<string, unknown> | null
                if (body && typeof body.message === 'string') setError(body.message)
                else setError('Erro ao enviar email. Tente novamente.')
            } else {
                setError('Erro de conexão. Tente novamente.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="sticky top-0 z-20 flex items-center gap-3 px-5 py-4"
                style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/perfil')}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white"
                    style={{ border: '1.5px solid var(--color-border)' }}>
                    <ArrowLeft size={18} style={{ color: 'var(--color-text)' }} />
                </button>
                <div>
                    <h1 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Alterar Senha</h1>
                    <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Segurança da sua conta</p>
                </div>
            </div>

            <div className="flex-1 px-5 py-6 flex flex-col gap-5">
                <AnimatePresence mode="wait">
                    {sent ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center text-center py-16 gap-4"
                        >
                            <div className="w-20 h-20 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(16,185,129,0.1)' }}>
                                <CheckCircle size={36} style={{ color: 'var(--color-success)' }} />
                            </div>
                            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                Email enviado!
                            </h2>
                            <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-2)' }}>
                                Enviamos um link de redefinição de senha para o seu email. O link expira em 1 hora.
                            </p>
                            <button
                                onClick={() => navigate('/perfil')}
                                className="mt-4 px-8 py-3 rounded-xl font-bold text-sm transition-all"
                                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                            >
                                Voltar ao perfil
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex items-start gap-3 p-4 rounded-2xl"
                                style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)' }}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(37,99,235,0.12)', color: 'var(--color-primary)' }}>
                                    <Shield size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>Redefinição segura</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-2)' }}>
                                        Enviaremos um link de redefinição de senha para o email cadastrado na sua conta. 
                                        O link terá validade de 1 hora.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center py-8 gap-4">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                    style={{ background: 'rgba(37,99,235,0.08)' }}>
                                    <Mail size={28} style={{ color: 'var(--color-primary)' }} />
                                </div>
                                <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
                                    Clique abaixo para receber o link de redefinição no seu email cadastrado.
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3.5 rounded-xl text-sm font-medium"
                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}>
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!sent && (
                <div className="sticky bottom-0 px-5 py-4"
                    style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        onClick={handleSendReset}
                        disabled={loading}
                        className="w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            fontFamily: 'var(--font-display)',
                            boxShadow: '0 4px 16px -4px rgba(37,99,235,0.5)',
                        }}
                    >
                        {loading ? (
                            <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                        ) : (
                            <><Mail size={18} /> Enviar link de redefinição</>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
