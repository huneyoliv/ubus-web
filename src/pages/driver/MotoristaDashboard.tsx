import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Bell, Users, Clock, MapPin, ChartLineUp, CaretRight, WarningCircle, CheckCircle } from 'phosphor-react';

export default function MotoristaDashboard() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  console.log('[DEBUG] Dashboard do Motorista montado às', time);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-500 overflow-x-hidden">
      <header className="pt-10 pb-6 px-8 flex flex-col gap-2 sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-xl z-20 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-[0.3em]">Operação Urbana</span>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-3xl font-black font-display tracking-tight text-[var(--color-text)]">UBUS <span className="text-blue-500">1042</span></h1>
              <div className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[8px] font-black uppercase tracking-widest">Ativo</div>
            </div>
          </div>
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="glass border-2 border-[var(--color-border)] px-4 py-2 rounded-2xl flex items-center gap-2"
          >
            <Clock size={16} weight="bold" className="text-blue-500" />
            <span className="text-[var(--color-text)] text-sm font-black tabular-nums font-display tracking-tight">{time}</span>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 p-8 grid grid-cols-1 gap-6 pb-40">
        <div className="grid grid-cols-2 gap-4 animate-spring-up overflow-hidden">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-[32px] glass border-2 border-[var(--color-border)] flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users size={20} weight="duotone" />
            </div>
            <div className="space-y-1">
              <p className="text-[40px] font-black font-display tracking-tighter leading-none text-[var(--color-text)]">32</p>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Confirmados</p>
            </div>
            <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-blue-500/5 blur-2xl rounded-full" />
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-[32px] glass border-2 border-[var(--color-border)] flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Bell size={20} weight="duotone" />
            </div>
            <div className="space-y-1">
              <p className="text-[40px] font-black font-display tracking-tighter leading-none text-[var(--color-text)]">08</p>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pendentes</p>
            </div>
            <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-amber-500/5 blur-2xl rounded-full" />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[40px] glass border-2 border-[var(--color-border)] space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            <div className="flex items-center gap-3">
              <ChartLineUp size={20} weight="bold" className="text-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-text)]">Logística em Tempo Real</h3>
            </div>
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] px-2 py-1 bg-emerald-500/10 rounded-full">Otimizado</span>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-500 to-transparent min-h-[40px]" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-widest">Próxima Parada · 400m</p>
                <h4 className="text-lg font-black font-display tracking-tight text-[var(--color-text)] mt-1">Terminal Central Unip</h4>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 glass rounded-md border border-white/5">
                    <CheckCircle size={10} weight="bold" className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">12 Desembarques</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-500/5 p-6 rounded-[28px] border border-[var(--color-border)] flex items-center justify-between group cursor-pointer hover:bg-zinc-500/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl glass border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-3)]">
                  <MapPin size={22} weight="duotone" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-3)] uppercase tracking-widest">Destino Final</p>
                  <p className="text-sm font-black font-display tracking-tight text-[var(--color-text)]">Campus Norte Avançado</p>
                </div>
              </div>
              <CaretRight size={20} weight="bold" className="text-[var(--color-text-3)] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 p-8 pointer-events-none">
        <div className="max-w-2xl mx-auto flex gap-4 pointer-events-auto">
          <button className="flex-1 h-20 rounded-[32px] bg-emerald-600 text-white font-black font-display text-sm uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 group border-2 border-emerald-500/20">
            <QrCode size={32} weight="bold" className="group-hover:rotate-12 transition-transform" />
            <span>Validar QR</span>
          </button>
          
          <button className="w-20 h-20 rounded-[32px] glass border-2 border-[var(--color-border)] text-red-500 flex items-center justify-center active:scale-90 transition-all">
            <WarningCircle size={28} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
