import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Warning, Prohibit, Clock, CheckCircle, ShieldCheck, Info } from 'phosphor-react';

const rules = [
  {
    icon: Prohibit,
    title: 'Falta sem justificativa',
    description: 'Reservar e não comparecer ao embarque gera 1 advertência automática no sistema.',
    severity: 'warning' as const,
  },
  {
    icon: Warning,
    title: '3 advertências = Suspensão',
    description: 'Ao acumular 3 advertências, o acesso ao transporte é suspenso por 7 dias corridos.',
    severity: 'danger' as const,
  },
  {
    icon: Clock,
    title: 'Janela de Reserva',
    description: 'Reservas noturnas devem ser feitas até às 13:00. Após o limite, o sistema bloqueia novas vagas.',
    severity: 'info' as const,
  },
  {
    icon: Prohibit,
    title: 'Cancelamento Tardio',
    description: 'Cancelar a menos de 1h do embarque conta como falta injustificada.',
    severity: 'warning' as const,
  },
  {
    icon: CheckCircle,
    title: 'Liberação Antecipada',
    description: 'Cancele com mais de 1h de antecedência para liberar a vaga sem penalidades.',
    severity: 'success' as const,
  },
  {
    icon: Warning,
    title: 'Uso de Bilhete',
    description: 'O bilhete é nominal e intransferível. Compartilhar dados gera suspensão imediata.',
    severity: 'danger' as const,
  },
];

const severityThemes = {
  info: { accent: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
  warning: { accent: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
  danger: { accent: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/20' },
  success: { accent: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
};

export default function Regras() {
  const navigate = useNavigate();

  console.log('[DEBUG] Acessando diretrizes de conduta e regras do sistema');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-500 pb-24">
      <header className="px-6 pt-10 pb-6 flex items-center gap-4 sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-xl z-20 border-b border-[var(--color-border)]">
        <button
          onClick={() => navigate('/me')}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105"
        >
          <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">Diretrizes</h1>
          <p className="text-[var(--color-text-2)] font-medium mt-1 uppercase tracking-widest text-[10px]">Conduta & Penalidades</p>
        </div>
      </header>

      <div className="px-6 mt-8 flex-1 animate-spring-up overflow-hidden space-y-8">
        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden rounded-[32px] p-8 glass border-2 border-[var(--color-border)] shadow-sm"
        >
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-3)] mb-2">SeU Score de Conduta</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-emerald-500 font-display leading-none">0</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Advertências</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.1em]">Status Limpo</span>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
        </motion.div>

        <section className="space-y-4">
          <h4 className="px-1 text-xs font-black uppercase tracking-widest text-[var(--color-text-3)] flex items-center gap-2">
            <ShieldCheck size={16} weight="bold" /> Regulamento Interno
          </h4>

          <div className="grid grid-cols-1 gap-4">
            {rules.map((rule, i) => {
              const theme = severityThemes[rule.severity];
              return (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className={`flex items-start gap-4 p-5 rounded-[28px] glass border-2 ${theme.border} transition-all`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${theme.bg} ${theme.accent} flex items-center justify-center shrink-0`}>
                    <rule.icon size={26} weight="duotone" />
                  </div>
                  <div className="space-y-1">
                    <p className={`font-black font-display tracking-tight text-sm ${theme.accent} uppercase tracking-wider`}>{rule.title}</p>
                    <p className="text-xs font-medium text-[var(--color-text-2)] leading-relaxed">{rule.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <div className="p-6 rounded-[32px] bg-zinc-500/5 border-2 border-[var(--color-border)] flex gap-4 opacity-50">
          <Info size={24} weight="duotone" className="text-[var(--color-text-3)] shrink-0" />
          <p className="text-[10px] font-black text-[var(--color-text-3)] leading-relaxed uppercase tracking-[0.2em]">
            Este regulamento foi aprovado pelo conselho municipal de transporte. Atualizado em Março de 2024.
          </p>
        </div>
      </div>
    </div>
  );
}
