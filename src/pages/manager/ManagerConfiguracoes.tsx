import { motion } from 'framer-motion';
import { Gear, ShieldChevron, Globe, Palette } from 'phosphor-react';

export default function ManagerConfiguracoes() {
  console.log('[DEBUG] Inicializando kernel de configurações...');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-10 text-center animate-spring-up">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-32 h-32 rounded-[40px] glass border-2 border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/10 mb-10"
      >
        <Gear size={56} weight="duotone" />
      </motion.div>
      
      <div className="space-y-4 max-w-lg">
        <div className="flex items-center justify-center gap-2">
          <ShieldChevron size={16} weight="bold" className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">System Kernel</span>
        </div>
        <h1 className="text-4xl font-black font-display tracking-tighter text-[var(--color-text)]">Parâmetros do <span className="text-zinc-500">Sistema</span></h1>
        <p className="text-sm font-medium text-[var(--color-text-3)] leading-relaxed">
          O centro de comando Ubus está sendo configurado. Aqui você poderá gerenciar permissões biométricas, integrações de GPS e políticas de acessibilidade.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-6 rounded-[32px] glass border border-white/5 space-y-2">
           <Globe size={24} className="text-zinc-700" />
           <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Regiões Geográficas</p>
        </div>
        <div className="p-6 rounded-[32px] glass border border-white/5 space-y-2">
           <Palette size={24} className="text-zinc-700" />
           <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Customização Visual</p>
        </div>
      </div>
    </div>
  );
}
