import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IdentificationBadge, Fingerprint, UserSquare, ArrowRight, ShieldCheck, Bus } from 'phosphor-react';

export default function MotoristaSplash() {
  const navigate = useNavigate();
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[DEBUG] Tentativa de início de jornada - ID:', driverId);
    navigate('/selecionar-veiculo');
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen flex flex-col items-center justify-center p-6 selection:bg-blue-500 selection:text-white w-full overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-sm flex flex-col justify-between gap-12 relative z-10 animate-spring-up">
        <div className="flex flex-col items-center justify-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="w-24 h-24 rounded-3xl glass border-2 border-[var(--color-border)] flex items-center justify-center text-blue-500 shadow-2xl bg-gradient-to-br from-blue-500/20 to-transparent"
          >
            <IdentificationBadge size={48} weight="duotone" />
          </motion.div>

          <div className="text-center space-y-2">
            <h1 className="text-[var(--color-text)] text-4xl font-black font-display tracking-tighter leading-none">
              Início de<br /><span className="text-blue-500">Jornada</span>
            </h1>
            <div className="flex items-center justify-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 w-fit mx-auto">
              <ShieldCheck size={12} weight="bold" className="text-blue-500" />
              <span className="text-blue-500 text-[8px] font-black uppercase tracking-[0.2em]">Painel Operacional</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-[0.3em] px-1 ml-1" htmlFor="driver-id">
              Credencial ID
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-[var(--color-text-3)]">
                <UserSquare size={24} weight="duotone" />
              </div>
              <input
                id="driver-id"
                type="text"
                placeholder="ID do Operador"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="block w-full h-18 rounded-[24px] glass border-2 border-[var(--color-border)] pl-14 pr-6 text-[var(--color-text)] placeholder:text-[var(--color-text-3)] focus:border-blue-500 focus:bg-blue-500/5 transition-all font-black text-sm outline-none font-display tracking-tight"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 ml-1">
              <label className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-[0.3em]" htmlFor="password">
                Senha de Acesso
              </label>
              <button type="button" className="text-[8px] font-black text-blue-500 uppercase tracking-widest hover:underline">Recuperar</button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-[var(--color-text-3)]">
                <Fingerprint size={24} weight="duotone" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full h-18 rounded-[24px] glass border-2 border-[var(--color-border)] pl-14 pr-6 text-[var(--color-text)] placeholder:text-[var(--color-text-3)] focus:border-blue-500 focus:bg-blue-500/5 transition-all font-black text-sm outline-none font-display tracking-tight"
              />
            </div>
          </div>

          <div className="pt-6 space-y-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98] transition-all h-20 rounded-[30px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 group font-display"
            >
              <span>Autenticar Shift</span>
              <ArrowRight size={24} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-col items-center gap-2 opacity-30">
              <div className="w-10 h-[1.5px] bg-[var(--color-text-3)]" />
              <p className="text-[8px] font-black uppercase tracking-[0.5em]">v2.4.0 · Operação Ubus</p>
            </div>
          </div>
        </form>
      </div>

      <div className="absolute bottom-8 flex items-center gap-2 text-[var(--color-text-3)] opacity-40">
        <Bus size={16} weight="duotone" />
        <span className="text-[10px] font-black uppercase tracking-widest">MuniMobility Systems</span>
      </div>
    </div>
  );
}
