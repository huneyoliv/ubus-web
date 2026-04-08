import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LockSimple, FileText, Shield, CaretRight, SignOut, Gear, Wheelchair, Moon, Sun } from 'phosphor-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';

export default function Perfil() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const menuItems = [
    { icon: User, label: 'Dados Pessoais', sub: 'Nome, CPF e contato', route: '/me/dados', color: 'text-blue-500' },
    { icon: LockSimple, label: 'Alterar Senha', sub: 'Segurança da conta', route: '/me/alterar-senha', color: 'text-indigo-500' },
    { icon: FileText, label: 'Renovação Semestral', sub: 'Envio de documentos', route: '/me/renovar-semestre', color: 'text-amber-500' },
    { icon: Wheelchair, label: 'Acessibilidade', sub: 'Laudos e atendimento PCD', route: '/me/acessibilidade', color: 'text-emerald-500' },
    { icon: Shield, label: 'Regras de Uso', sub: 'Advertências e conduta', route: '/me/regras', color: 'text-rose-500' },
  ];

  const handleLogout = () => {
    console.log('[DEBUG] Tentando encerrar sessão...');
    logout();
    console.log('[DEBUG] Sessão encerrada, redirecionando para login');
    navigate('/login');
  };

  const roleLabel: Record<string, string> = {
    STUDENT: 'Estudante',
    LEADER: 'Líder',
    RIDE_SHARE: 'Caronista',
    DRIVER: 'Motorista',
    MANAGER: 'Gestor',
    SUPER_ADMIN: 'Diretor',
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-500 pb-24">
      <header className="px-6 pt-10 pb-6">
        <h1 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">Configurações</h1>
        <p className="text-[var(--color-text-2)] font-medium mt-1 uppercase tracking-widest text-[10px]">Privacidade & Preferências</p>
      </header>

      <div className="px-6 space-y-8 animate-spring-up overflow-hidden">
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-[32px] p-8 shadow-2xl border-2 border-white/10"
          style={{ background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 blur-[60px] rounded-full" />
          
          <div className="relative flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl glass border-2 border-white/20 flex items-center justify-center font-black text-2xl text-white font-display shadow-inner bg-gradient-to-br from-blue-600 to-indigo-600">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-black text-2xl font-display tracking-tight truncate">
                {user?.name ?? '—'}
              </h3>
              <p className="text-white/40 text-sm font-bold truncate mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {roleLabel[user?.role ?? ''] || 'Visitante'}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Ativo</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="space-y-4">
          <h4 className="px-1 text-xs font-black uppercase tracking-widest text-[var(--color-text-3)] flex items-center gap-2">
            <Gear size={16} weight="bold" /> Preferências do Sistema
          </h4>
          
          <div className="rounded-[28px] glass border-2 border-[var(--color-border)] overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[var(--color-text)]">
                  {isDarkMode ? <Moon size={24} weight="duotone" /> : <Sun size={24} weight="duotone" />}
                </div>
                <div>
                  <p className="font-black text-[var(--color-text)] font-display tracking-tight">Tema Escuro</p>
                  <p className="text-xs font-bold text-[var(--color-text-3)] uppercase tracking-widest">Interface Noturna</p>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isDarkMode ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${isDarkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="px-1 text-xs font-black uppercase tracking-widest text-[var(--color-text-3)] flex items-center gap-2">
            <User size={16} weight="bold" /> Conta & Documentos
          </h4>
          
          <div className="rounded-[28px] glass border-2 border-[var(--color-border)] divide-y divide-[var(--color-border)] overflow-hidden">
            {menuItems.map((item, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.route)}
                className="w-full flex items-center gap-4 p-5 text-left group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-2xl bg-${item.color.split('-')[1]}-500/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                  <item.icon size={26} weight="duotone" className={item.color} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-[var(--color-text)] font-display tracking-tight leading-tight">{item.label}</p>
                  <p className="text-xs font-bold text-[var(--color-text-3)] uppercase tracking-widest mt-0.5">{item.sub}</p>
                </div>
                <CaretRight size={20} weight="bold" className="text-[var(--color-text-3)] group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-4 p-6 rounded-[28px] glass border-2 border-red-500/20 text-red-500 font-black font-display tracking-widest uppercase text-sm hover:bg-red-500/5 transition-all shadow-sm"
        >
          <SignOut size={24} weight="bold" /> Sair da conta
        </button>

        <div className="flex flex-col items-center gap-2 pt-4 opacity-30">
          <div className="w-10 h-1 h-px bg-[var(--color-text-3)]" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">v1.2.0 · Ubus Prime</p>
        </div>
      </div>
    </div>
  );
}
