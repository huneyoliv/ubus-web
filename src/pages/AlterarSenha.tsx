import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PaperPlaneTilt, CheckCircle, ShieldCheckered, CircleNotch, Warning } from 'phosphor-react';
import { api, ApiError } from '@/lib/api';

export default function AlterarSenha() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendReset = async () => {
    setError('');
    setLoading(true);
    console.log('[DEBUG] Solicitando envio de email de redefinição...');
    try {
      await api.post('/auth/password-email-send');
      console.log('[DEBUG] Email de redefinição enviado');
      setSent(true);
    } catch (err) {
      console.error('[DEBUG] Erro ao enviar email:', err);
      if (err instanceof ApiError) {
        setError('Falha ao enviar email. Tente novamente em instantes.');
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
            onClick={() => navigate('/me')}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105"
          >
            <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-widest text-[var(--color-text)]">Segurança</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[400px] animate-spring-up">
          <AnimatePresence mode="wait">
            {sent ? (
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
                  <h2 className="text-3xl font-black text-[var(--color-text)] font-display tracking-tight mb-3">Email enviado!</h2>
                  <p className="text-[var(--color-text-2)] font-medium leading-relaxed">
                    Verifique sua caixa de entrada. Enviamos um link seguro para você redefinir sua senha agora mesmo.
                  </p>
                </div>
                <button onClick={() => navigate('/perfil')} className="btn-primary">
                  Voltar ao meu perfil
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-8">
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight mb-3">Senha</h2>
                  <p className="text-[var(--color-text-2)] text-lg font-medium">Melhore a segurança da sua conta Ubus.</p>
                </div>

                <div className="p-5 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheckered size={24} weight="duotone" className="text-blue-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">Protocolo Seguro</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                    Por segurança, você deve redefinir sua senha através de um link enviado ao seu email institucional cadastrado.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-6 py-6 group">
                  <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] transition-transform group-hover:scale-110">
                    <PaperPlaneTilt size={36} weight="duotone" />
                  </div>
                  <p className="text-center text-[var(--color-text-2)] font-medium">
                    O link de redefinição será válido por 60 minutos.
                  </p>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-500 text-sm font-bold">
                    <Warning size={18} weight="bold" />
                    {error}
                  </motion.div>
                )}

                <button onClick={handleSendReset} disabled={loading} className="btn-primary">
                  {loading ? <CircleNotch size={24} className="animate-spin" /> : 'Receber link por email'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
