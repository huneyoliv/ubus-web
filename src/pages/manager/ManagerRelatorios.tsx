import { motion } from 'framer-motion';
import { ChartBar, Lightning, Browser, Compass } from 'phosphor-react';

export default function ManagerRelatorios() {
  console.log('[DEBUG] Acessando hub de analytics...');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-10 text-center animate-spring-up">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-32 h-32 rounded-[40px] glass border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/10 mb-10"
      >
        <ChartBar size={56} weight="duotone" />
      </motion.div>
      
      <div className="space-y-4 max-w-lg">
        <div className="flex items-center justify-center gap-2">
          <Lightning size={16} weight="bold" className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">Pipeline de Dados</span>
        </div>
        <h1 className="text-4xl font-black font-display tracking-tighter text-[var(--color-text)]">Inteligência <span className="text-zinc-500">Operacional</span></h1>
        <p className="text-sm font-medium text-[var(--color-text-3)] leading-relaxed">
          O motor de processamento analítico está sendo calibrado. Em breve, você terá acesso a dashboards preditivos e relatórios de eficiência em tempo real.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="p-6 rounded-[32px] glass border border-white/5 space-y-2">
           <Browser size={24} className="text-zinc-700" />
           <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Exportação Agendada</p>
        </div>
        <div className="p-6 rounded-[32px] glass border border-white/5 space-y-2">
           <Compass size={24} className="text-zinc-700" />
           <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Mapas Térmicos</p>
        </div>
      </div>
    </div>
  );
}
