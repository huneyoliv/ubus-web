import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Wrench, Sparkle, ArrowLeft, WarningCircle } from 'phosphor-react';

export default function Pagamentos() {
  const navigate = useNavigate();

  console.log('[DEBUG] Acessando módulo de Pagamentos (Em desenvolvimento)');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-500 pb-24">
      <header className="px-6 pt-10 pb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105"
        >
          <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">Pagamentos</h1>
          <p className="text-[var(--color-text-2)] font-medium mt-1 uppercase tracking-widest text-[10px]">Financeiro & Mensalidades</p>
        </div>
      </header>

      <div className="px-6 flex-1 flex flex-col items-center justify-center animate-spring-up overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -2, 2, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-32 h-32 rounded-[40px] glass border-2 border-white/10 flex items-center justify-center shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-600"
          >
            <CreditCard size={56} weight="duotone" className="text-white" />
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 border-4 border-[var(--color-bg)] flex items-center justify-center">
              <Sparkle size={20} weight="fill" className="text-white animate-pulse" />
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center max-w-xs space-y-4">
          <h3 className="text-2xl font-black text-[var(--color-text)] font-display tracking-tight">Sistemas em Upgrade</h3>
          <p className="text-sm font-medium text-[var(--color-text-3)] leading-relaxed uppercase tracking-widest text-[10px]">
            Estamos refinando a experiência de pagamentos para oferecer maior segurança e agilidade.
          </p>
        </div>

        <div className="mt-12 w-full max-w-sm rounded-[32px] glass border-2 border-[var(--color-border)] p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Wrench size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-text)] uppercase tracking-wider">Previsão: v1.5.0</p>
              <p className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest">Rollout Gradual em breve</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-500/5 border border-zinc-500/10">
            <div className="flex items-start gap-3">
              <WarningCircle size={18} weight="duotone" className="text-zinc-400 mt-0.5" />
              <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest">
                Para dúvidas urgentes sobre faturas ou renovações, entre em contato com o suporte da sua frota.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="mt-12 px-10 py-5 rounded-[24px] glass border-2 border-[var(--color-border)] text-[var(--color-text)] font-black font-display tracking-widest uppercase text-xs hover:bg-zinc-500/5 transition-all shadow-sm"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}
