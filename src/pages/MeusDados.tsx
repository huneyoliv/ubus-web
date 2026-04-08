import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Envelope, WhatsappLogo, IdentificationCard, GitMerge, Star, WarningCircle } from 'phosphor-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function MeusDados() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const dados = [
    { icon: User, label: 'Nome completo', value: user?.name ?? '—' },
    { icon: Envelope, label: 'Email Institucional', value: user?.email ?? '—' },
    { icon: WhatsappLogo, label: 'WhatsApp', value: user?.phone ?? '—' },
    { icon: IdentificationCard, label: 'CPF', value: user?.cpf ?? '—' },
    { icon: GitMerge, label: 'Linha de Preferência', value: user?.defaultRouteId ?? 'Não definida' },
    { icon: Star, label: 'Tipo de Usuário', value: user?.role ?? '—' },
  ];

  console.log('[DEBUG] Visualizando dados do usuário:', user?.id);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors duration-500">
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate('/me')}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105"
          >
            <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
          </button>
          <h1 className="text-xl font-black text-[var(--color-text)] font-display tracking-tight">Identidade</h1>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-6 animate-spring-up">
        <div className="flex flex-col items-center mb-10 space-y-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-[32px] glass border-2 border-white/20 flex items-center justify-center font-black text-3xl text-white font-display shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-600"
          >
            {initials}
          </motion.div>
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">{user?.name}</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
              Perfil {user?.role}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] glass border-2 border-[var(--color-border)] divide-y divide-[var(--color-border)] overflow-hidden shadow-sm">
          {dados.map((item, idx) => (
            <div key={idx} className="flex items-center gap-5 p-5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[var(--color-text-3)] shrink-0">
                <item.icon size={24} weight="duotone" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-3)] mb-0.5">{item.label}</p>
                <p className="text-sm font-bold text-[var(--color-text)] truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 rounded-3xl bg-amber-500/5 border-2 border-dashed border-amber-500/20 flex gap-4">
          <WarningCircle size={24} weight="duotone" className="text-amber-500 shrink-0" />
          <p className="text-xs font-bold text-amber-700 leading-relaxed uppercase tracking-wider">
            Para atualizar informações cadastrais, procure o setor de mobilidade ou o administrador do seu sistema.
          </p>
        </div>
      </main>
    </div>
  );
}
