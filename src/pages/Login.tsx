import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { api, ApiError } from '@/lib/api'
import type { LoginResponse } from '@/types'

export default function Login() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((s) => s.setAuth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setError('')
        setLoading(true)

        try {
            console.log('[DEBUG] Tentando login com:', { email })
            const data = await api.post<LoginResponse>('/auth/login', { email, password })
            console.log('[DEBUG] Resposta da API:', JSON.stringify(data, null, 2))
            
            const role = data.user?.role
            console.log('[DEBUG] Role do usuário:', role)

            if (role === 'MANAGER' || role === 'SUPER_ADMIN') {
                console.log('[DEBUG] Acesso permitido para:', role)
                setAuth(data.accessToken, data.user)
                navigate('/dashboard')
            } else {
                console.log('[DEBUG] Acesso negado para role:', role)
                setError('Acesso restrito apenas para administradores e gestores.')
            }
        } catch (err) {
            console.error('[DEBUG] Erro no login:', err)
            if (err instanceof ApiError) {
                console.error('[DEBUG] ApiError status:', err.status, 'body:', err.body)
            }
            if (err instanceof ApiError && err.status === 401) {
                setError('Email ou senha incorretos.')
            } else {
                setError('Erro de conexão. Tente novamente.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-dvh flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-[46%] relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #0F172A 100%)' }}>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-2xl"
                        style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
                </div>
                <div className="relative flex items-center gap-2.5">
                    <img src="/logo.png" alt="Ubus Logo" className="h-10 w-auto" />
                </div>

                <div className="relative">
                    <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">Painel Administrativo</p>
                    <h1 className="text-white text-5xl font-black leading-[1.1] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                        Gestão de<br />mobilidade<br />urbana.
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed max-w-xs">
                        Plataforma exclusiva para gestão e monitoramento do transporte universitário.
                    </p>
                </div>

                <div className="relative flex items-center gap-1.5 text-white/30">
                    <span className="text-xs">© {new Date().getFullYear()} Ubus — Todos os direitos reservados</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col" style={{ background: 'var(--color-bg)' }}>
                <div className="md:hidden flex items-center px-5 pt-12 pb-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white active:scale-95"
                        style={{ border: '1.5px solid var(--color-border)' }}
                    >
                        <ArrowLeft size={20} style={{ color: 'var(--color-text)' }} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 py-8 md:px-16 max-w-md md:max-w-none w-full mx-auto md:mx-0">
                    <div className="mb-8">
                        <div className="hidden md:flex items-center gap-2.5 mb-10">
                            <img src="/logo.png" alt="Ubus Logo" className="h-10 w-auto" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                            Acesso Gestor
                        </h2>
                        <p style={{ color: 'var(--color-text-2)' }} className="text-base">
                            Informe suas credenciais administrativas.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Email</label>
                            <div className="flex items-center rounded-xl overflow-hidden transition-all"
                                style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
                                <div className="flex items-center justify-center w-12 h-14 shrink-0" style={{ color: 'var(--color-text-3)' }}>
                                    <Mail size={18} />
                                </div>
                                <input
                                    className="flex-1 h-14 bg-transparent text-sm outline-none pr-4"
                                    style={{ color: 'var(--color-text)' }}
                                    placeholder="seu@email.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Senha</label>
                            <div className="flex items-center rounded-xl overflow-hidden transition-all"
                                style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
                                <div className="flex items-center justify-center w-12 h-14 shrink-0" style={{ color: 'var(--color-text-3)' }}>
                                    <Lock size={18} />
                                </div>
                                <input
                                    className="flex-1 h-14 bg-transparent text-sm outline-none"
                                    style={{ color: 'var(--color-text)' }}
                                    placeholder="Sua senha"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="flex items-center justify-center w-12 h-14 shrink-0 transition-colors"
                                    style={{ color: showPassword ? 'var(--color-primary)' : 'var(--color-text-3)' }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <a className="text-sm font-semibold transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }} href="#">
                                Esqueci minha senha
                            </a>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3.5 rounded-xl text-sm font-medium text-center"
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Entrando...
                                    </span>
                                ) : 'Acessar plataforma'}
                            </button>
                        </div>
                    </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

