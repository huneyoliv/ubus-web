import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, House, Detective } from 'phosphor-react';

export default function NotFound() {
  const navigate = useNavigate();

  console.log('[DEBUG] Página 404 acessada');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[var(--color-bg)] transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative z-10"
      >
        <div className="w-32 h-32 mx-auto mb-10 rounded-[40px] glass border-2 border-[var(--color-border)] flex items-center justify-center text-blue-500 shadow-2xl">
          <Detective size={64} weight="duotone" />
        </div>

        <h1 className="text-[120px] font-black text-[var(--color-text)] font-display tracking-tighter leading-none mb-4 opacity-10 select-none">
          404
        </h1>
        
        <div className="space-y-4 -mt-16 relative">
          <h2 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight">Perdido no trajeto?</h2>
          <p className="text-sm font-medium text-[var(--color-text-3)] leading-relaxed max-w-xs mx-auto uppercase tracking-widest text-[10px]">
            A página que você procura não existe ou foi movida para uma rota alternativa.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-4 max-w-xs mx-auto w-full">
          <button
            onClick={() => navigate(-1)}
            className="w-full h-16 rounded-[24px] bg-blue-600 text-white font-black font-display tracking-widest uppercase text-xs shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <ArrowLeft size={20} weight="bold" /> Voltar
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full h-16 rounded-[24px] glass border-2 border-[var(--color-border)] text-[var(--color-text)] font-black font-display tracking-widest uppercase text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <House size={20} weight="bold" /> Dashboard
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-0 right-0 opacity-20 pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-text-3)]">Erro de Roteamento · Ubus Prime</p>
      </div>
    </div>
  );
}
