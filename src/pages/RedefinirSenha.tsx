import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LockSimple, CheckCircle, CircleNotch, Warning, Eye, EyeClosed, ShieldCheckered } from 'phosphor-react';
import { api, ApiError } from '@/lib/api';

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      console.warn('[DEBUG] Token de redefinição ausente na URL');
      setError('Link de redefinição inválido ou expirado.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    console.log('[DEBUG] Iniciando redefinição de senha...');
    try {
      await api.post('/auth/password-redefinition', { token, password });
      console.log('[DEBUG] Senha redefinida com sucesso');
      setSuccess(true);
    } catch (err) {
      console.error('[DEBUG] Erro na redefinição:', err);
      if (err instanceof ApiError) {
        setError(err.status === 400 ? 'Token expirado. Solicite um novo link.' : 'Falha ao redefinir. Tente mais tarde.');
      } else {
        setError('Erro de conexão com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors duration-500">
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate('/login')}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105"
          >
            <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-widest text-[var(--color-text)]">Redefinir</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[400px] animate-spring-up overflow-hidden">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle size={48} weight="duotone" className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[var(--color-text)] font-display tracking-tight mb-3">Tudo pronto!</h2>
                  <p className="text-[var(--color-text-2)] font-medium leading-relaxed">
                    Sua senha foi redefinida com sucesso. Use suas novas credenciais para acessar a conta.
                  </p>
                </div>
                <button onClick={() => navigate('/login')} className="btn-primary">
                  Voltar ao login
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-8">
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight mb-3">Nova Senha</h2>
                  <p className="text-[var(--color-text-2)] text-lg font-medium">Crie uma combinação segura para proteger sua conta.</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                  <ShieldCheckered size={24} weight="duotone" className="text-blue-500 shrink-0" />
                  <p className="text-xs font-bold text-blue-600 leading-relaxed uppercase tracking-wider">
                    Dica: Use pelo menos 6 caracteres intercalando letras e números para maior segurança.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <PasswordField label="Nova Senha" value={password} onChange={setPassword} show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  <PasswordField label="Confirmar Senha" value={confirmPassword} onChange={setConfirmPassword} show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />

                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-500 text-sm font-bold">
                      <Warning size={18} weight="bold" />
                      {error}
                    </motion.div>
                  )}

                  <button type="submit" disabled={loading || !token} className="btn-primary">
                    {loading ? <CircleNotch size={24} className="animate-spin" /> : 'Redefinir Senha'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-[var(--color-text)] ml-1 uppercase tracking-widest">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] group-focus-within:text-[var(--color-primary)]">
          <LockSimple size={22} weight="duotone" />
        </div>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pl-12 pr-12"
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] hover:text-[var(--color-text)] transition-colors"
        >
          {show ? <Eye size={22} weight="bold" /> : <EyeClosed size={22} weight="bold" />}
        </button>
      </div>
    </div>
  );
}
