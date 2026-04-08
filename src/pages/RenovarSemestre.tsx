import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CloudArrowUp, Checks, Info } from 'phosphor-react';

export default function RenovarSemestre() {
  const navigate = useNavigate();

  console.log('[DEBUG] Acessando módulo de Renovação Semestral (Em desenvolvimento)');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-500 pb-24">
      <header className="px-6 pt-10 pb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/me')}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105"
        >
          <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">Renovação</h1>
          <p className="text-[var(--color-text-2)] font-medium mt-1 uppercase tracking-widest text-[10px]">Semestre & Documentos</p>
        </div>
      </header>

      <div className="px-6 flex-1 flex flex-col items-center justify-center animate-spring-up overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-32 h-32 rounded-[40px] glass border-2 border-white/10 flex items-center justify-center shadow-2xl bg-gradient-to-br from-emerald-600 to-teal-600"
          >
            <FileText size={56} weight="duotone" className="text-white" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border-2 border-[var(--color-border)] flex items-center justify-center shadow-lg">
              <CloudArrowUp size={24} weight="bold" className="text-emerald-500" />
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center max-w-xs space-y-4">
          <h3 className="text-2xl font-black text-[var(--color-text)] font-display tracking-tight">Portal de Documentação</h3>
          <p className="text-sm font-medium text-[var(--color-text-3)] leading-relaxed uppercase tracking-widest text-[10px]">
            Estamos preparando o sistema de upload inteligente para sua grade curricular e comprovantes.
          </p>
        </div>

        <div className="mt-12 w-full max-w-sm space-y-4">
           <div className="rounded-[32px] glass border-2 border-[var(--color-border)] p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Checks size={28} weight="duotone" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-[var(--color-text)] uppercase tracking-wider">Validação Automática</p>
                <p className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest mt-0.5">Tecnologia OCR em breve</p>
              </div>
           </div>

           <div className="p-5 rounded-[28px] bg-emerald-500/5 border-2 border-emerald-500/10 flex gap-4">
              <Info size={24} weight="duotone" className="text-emerald-600 shrink-0" />
              <p className="text-[10px] font-black text-emerald-700/70 leading-relaxed uppercase tracking-widest">
                Importante: Fique atento ao calendário acadêmico. As renovações serão abertas 30 dias antes do início do período.
              </p>
           </div>
        </div>

        <button
          onClick={() => navigate('/me')}
          className="mt-12 px-10 py-5 rounded-[24px] glass border-2 border-[var(--color-border)] text-[var(--color-text)] font-black font-display tracking-widest uppercase text-xs hover:bg-zinc-500/5 transition-all shadow-sm"
        >
          Voltar ao Perfil
        </button>
      </div>
    </div>
  );
}
