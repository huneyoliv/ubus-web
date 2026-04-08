import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Envelope, Lock, Eye, EyeClosed, Bus, ArrowLeft } from 'phosphor-react';
import { useAuthStore } from '@/store/useAuthStore';
import { api, ApiError } from '@/lib/api';
import type { LoginResponse } from '@/types';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setLoading(true);
    console.log(`[DEBUG] Tentativa de login iniciada para: ${email}`);

    try {
      const data = await api.post<LoginResponse>('/auth/login', { email, password });
      console.log(`[DEBUG] Login bem-sucedido. Role: ${data.user.role}`);
      setAuth(data.accessToken, data.user);
      
      if (data.user.role === 'DRIVER') {
        navigate('/motorista');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('[DEBUG] Erro durante o login:', err);
      if (err instanceof ApiError && err.status === 401) {
        setError('Email ou senha incorretos.');
      } else {
        setError('Erro de conexão. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-[var(--color-bg)] transition-colors duration-500">
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 z-0 scale-105">
          <img 
            src="/images/login-hero.png" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-90 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#09090B]/60 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl glass border-white/20">
            <Bus size={28} weight="fill" className="text-white" />
          </div>
          <span className="text-white font-bold text-2xl tracking-tighter font-display">Ubus</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase mb-4">Plataforma Inteligente</p>
            <h1 className="text-white text-6xl font-black leading-tight mb-6 font-display">
              A nova era da<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                mobilidade
              </span>
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed max-w-md font-medium">
              Conectamos estudantes ao seu destino com segurança, tecnologia e eficiência.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 text-white/40 text-xs font-medium uppercase tracking-widest">
          © {new Date().getFullYear()} Ubus Tech Ecosystem
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden">
        <div className="md:hidden w-full flex justify-start mb-12">
          <button
            onClick={() => navigate('/')}
            className="w-12 h-12 flex items-center justify-center rounded-2xl glass border-[var(--color-border)]"
          >
            <ArrowLeft size={24} weight="bold" className="text-[var(--color-text)]" />
          </button>
        </div>

        <div className="w-full max-w-[420px] animate-spring-up">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black mb-3 text-[var(--color-text)] font-display tracking-tight">
              Seja bem-vindo
            </h2>
            <p className="text-[var(--color-text-2)] text-lg font-medium">
              Acesse sua conta para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--color-text)] ml-1 uppercase tracking-wider">Email institucional</label>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] transition-colors group-focus-within:text-[var(--color-primary)]">
                  <Envelope size={22} weight="duotone" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="exemplo@universidade.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">Senha</label>
                <button 
                  type="button"
                  onClick={() => navigate('/redefinir-senha')}
                  className="text-sm font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
                >
                  Esqueci a senha
                </button>
              </div>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] transition-colors group-focus-within:text-[var(--color-primary)]">
                  <Lock size={22} weight="duotone" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] hover:text-[var(--color-text)] transition-colors"
                >
                  {showPassword ? <Eye size={22} weight="bold" /> : <EyeClosed size={22} weight="bold" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Entrar na conta <ArrowLeft size={20} weight="bold" className="rotate-180" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[var(--color-text-2)] font-medium">
              Ainda não é membro?{' '}
              <button 
                onClick={() => navigate('/cadastro')}
                className="text-[var(--color-primary)] font-black hover:underline underline-offset-4 decoration-2"
              >
                Crie sua conta agora
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
