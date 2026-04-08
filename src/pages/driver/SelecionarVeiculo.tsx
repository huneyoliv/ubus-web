import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bus, Clock, PlusCircle, CaretRight, MapPinLine, ShieldCheck } from 'phosphor-react';
import { cn } from '@/lib/utils';

const savedBuses = [
  { id: '1042', plate: 'ABC-1234', lastUse: 'Hoje, 08:30', status: 'Operacional' },
  { id: '2056', plate: 'XYZ-9876', lastUse: 'Ontem, 18:45', status: 'Manutenção' },
  { id: '3010', plate: 'DEF-5678', lastUse: '12/05/2023, 10:15', status: 'Operacional' },
];

export default function SelecionarVeiculo() {
  const navigate = useNavigate();

  console.log('[DEBUG] Painel de Frota Operacional carregado às', new Date().toLocaleTimeString());

  return (
    <div className="bg-[var(--color-bg)] min-h-screen text-[var(--color-text)] flex justify-center w-full transition-colors duration-500 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <div className="relative flex min-h-screen w-full max-w-md flex-col px-6">
        <header className="sticky top-0 z-30 flex items-center py-10 gap-6 bg-[var(--color-bg)]/80 backdrop-blur-3xl">
          <button
            onClick={() => {
               console.log('[DEBUG] Retornando ao login de jornada');
               navigate(-1);
            }}
            className="w-14 h-14 flex items-center justify-center rounded-[24px] glass border-2 border-[var(--color-border)] text-[var(--color-text)] active:scale-90 transition-all hover:border-blue-500/30"
          >
            <ArrowLeft size={24} weight="bold" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} weight="bold" className="text-blue-500" />
              <span className="text-blue-500 text-[8px] font-black uppercase tracking-[0.4em]">Sincronizado</span>
            </div>
            <h1 className="text-3xl font-black font-display tracking-tighter leading-none mt-1">
              Frota <span className="text-zinc-500">Ativa</span>
            </h1>
          </div>
        </header>

        <main className="flex-1 space-y-4 pb-40">
          <div className="flex items-center justify-between px-2 mb-6">
             <span className="text-[10px] font-black text-[var(--color-text-3)] uppercase tracking-widest">Selecione a Unidade</span>
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">{savedBuses.length} Veículos</span>
          </div>

          {savedBuses.map((bus, idx) => (
            <motion.div
              key={bus.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', damping: 20 }}
              onClick={() => {
                console.log('[DEBUG] Selecionando terminal biológico:', bus.id);
                navigate('/dashboard-motorista');
              }}
              className="group flex gap-5 p-6 rounded-[40px] glass border-2 border-[var(--color-border)] hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-pointer relative overflow-hidden shadow-2xl shadow-black/20"
            >
              <div className="w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 bg-zinc-800 border border-white/5 text-blue-500 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500 shadow-inner">
                <Bus size={32} weight="duotone" />
              </div>

              <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-black font-display tracking-tight text-[var(--color-text)]">UBUS {bus.id}</h2>
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    bus.status === 'Operacional' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
                  )} />
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center gap-2">
                    <MapPinLine size={14} weight="bold" className="text-[var(--color-text-3)]" />
                    <span className="text-[10px] font-black text-[var(--color-text-3)] uppercase tracking-[0.1em]">{bus.plate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} weight="bold" className="text-[var(--color-text-3)]" />
                    <span className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest">{bus.lastUse}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <div className="w-12 h-12 rounded-2xl glass border border-white/5 flex items-center justify-center text-[var(--color-text-3)] group-hover:text-blue-500 group-hover:border-blue-500/20 transition-all duration-500">
                  <CaretRight size={20} weight="bold" />
                </div>
              </div>
              
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-40 p-8 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => {
                console.log('[DEBUG] Auditando registro de novo veículo');
                navigate('/cadastro-veiculo');
              }}
              className="flex w-full items-center justify-center gap-4 h-22 rounded-[40px] bg-blue-600 text-white font-black font-display text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-[0.98] transition-all group"
            >
              <PlusCircle size={32} weight="bold" className="group-hover:rotate-90 transition-transform duration-500" />
              <span>Novo Registro</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
