import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lock, CheckCircle, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { api, ApiError } from '@/lib/api'

export default function RedefinirSenha() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token) {
            setError('Token de redefinição não encontrado. Solicite um novo link.')
        }
    }, [token])

    const validateForm = (): string | null => {
        if (!password || !confirmPassword) {
            return 'Preencha todos os campos.'
        }
        if (password.length < 6) {
            return 'A senha deve ter no mínimo 6 caracteres.'
        }
        if (password !== confirmPassword) {
            return 'As senhas não coincidem.'
        }
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        if (!token) {
            setError('Token inválido. Solicite um novo link de redefinição.')
            return
        }

        setLoading(true)
        try {
            await api.post('/auth/password-redefinition', { token, password })
            setSuccess(true)
        } catch (err) {
            if (err instanceof ApiError) {
                const body = err.body as Record<string, unknown> | null
                if (body && typeof body.message === 'string') {
                    setError(body.message)
                } else if (err.status === 400) {
                    setError('Token inválido ou expirado. Solicite um novo link.')
                } else {
                    setError('Erro ao redefinir senha. Tente novamente.')
                }
            } else {
                setError('Erro de conexão. Tente novamente.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-dvh md:min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="sticky top-0 z-20 flex items-center gap-3 px-5 py-4"
                style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/login')}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white"
                    style={{ border: '1.5px solid var(--color-border)' }}>
                    <ArrowLeft size={18} style={{ color: 'var(--color-text)' }} />
                </button>
                <div>
                    <h1 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Redefinir Senha</h1>
                    <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Crie uma nova senha</p>
                </div>
            </div>

            <div className="flex-1 px-5 py-6 flex flex-col gap-5 md:max-w-lg md:mx-auto md:w-full">
                <AnimatePresence mode="wait">
                    {success ? (
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
                                Senha redefinida!
                            </h2>
                            <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-2)' }}>
                                Sua senha foi alterada com sucesso. Agora você pode fazer login com a nova senha.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 px-8 py-3 rounded-xl font-bold text-sm transition-all"
                                style={{
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    fontFamily: 'var(--font-display)',
                                    boxShadow: '0 4px 16px -4px rgba(37,99,235,0.5)',
                                }}
                            >
                                Ir para o Login
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex items-start gap-3 p-4 rounded-2xl"
                                style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)' }}>
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(37,99,235,0.12)', color: 'var(--color-primary)' }}>
                                    <ShieldCheck size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>Nova senha segura</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-2)' }}>
                                        Crie uma senha forte com no mínimo 6 caracteres. Recomendamos usar letras, números e símbolos.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold px-1" style={{ color: 'var(--color-text-2)' }}>
                                        Nova senha
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <Lock size={16} style={{ color: 'var(--color-text-3)' }} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mínimo 6 caracteres"
                                            className="w-full h-12 pl-11 pr-12 rounded-xl text-sm transition-all outline-none"
                                            style={{
                                                background: 'var(--color-surface)',
                                                border: '1.5px solid var(--color-border)',
                                                color: 'var(--color-text)',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={16} style={{ color: 'var(--color-text-3)' }} />
                                            ) : (
                                                <Eye size={16} style={{ color: 'var(--color-text-3)' }} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold px-1" style={{ color: 'var(--color-text-2)' }}>
                                        Confirmar nova senha
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <Lock size={16} style={{ color: 'var(--color-text-3)' }} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repita a nova senha"
                                            className="w-full h-12 pl-11 pr-12 rounded-xl text-sm transition-all outline-none"
                                            style={{
                                                background: 'var(--color-surface)',
                                                border: '1.5px solid var(--color-border)',
                                                color: 'var(--color-text)',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={16} style={{ color: 'var(--color-text-3)' }} />
                                            ) : (
                                                <Eye size={16} style={{ color: 'var(--color-text-3)' }} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3.5 rounded-xl text-sm font-medium"
                                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}>
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>

            {!success && (
                <div className="sticky bottom-0 px-5 py-4"
                    style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !token}
                        className="w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                        style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            fontFamily: 'var(--font-display)',
                            boxShadow: '0 4px 16px -4px rgba(37,99,235,0.5)',
                        }}
                    >
                        {loading ? (
                            <><Loader2 size={18} className="animate-spin" /> Redefinindo...</>
                        ) : (
                            <><Lock size={18} /> Redefinir Senha</>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
