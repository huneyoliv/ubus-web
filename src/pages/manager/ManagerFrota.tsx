import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Plus, IdentificationCard, Snowflake, Toilet, UsersFour, X, Gear, CaretRight, Check } from 'phosphor-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ManagerFrota() {
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBus, setNewBus] = useState({
    identificationNumber: '',
    plate: '',
    standardCapacity: 44,
    hasBathroom: false,
    hasAirConditioning: true
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  async function fetchBuses() {
    console.log('[DEBUG] Sincronizando inventário de frota...');
    try {
      const data = await api.get<any[]>('/fleet/buses');
      console.log('[DEBUG] Veículos carregados:', data.length);
      setBuses(data);
    } catch (err) {
      console.error('[DEBUG] Erro ao buscar frota:', err);
      setBuses([
        { id: '1', identificationNumber: '2024-A', plate: 'UBUS-001', standardCapacity: 44, hasAirConditioning: true, hasBathroom: true, active: true },
        { id: '2', identificationNumber: '2024-B', plate: 'UBUS-002', standardCapacity: 52, hasAirConditioning: true, hasBathroom: false, active: false }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBus(e: React.FormEvent) {
    e.preventDefault();
    console.log('[DEBUG] Registrando nova unidade operacional:', newBus.identificationNumber);
    try {
      await api.post('/fleet/buses', newBus);
      console.log('[DEBUG] Unidade registrada com sucesso');
      setShowAddModal(false);
      setNewBus({
        identificationNumber: '',
        plate: '',
        standardCapacity: 44,
        hasBathroom: false,
        hasAirConditioning: true
      });
      fetchBuses();
    } catch (err) {
      console.error('[DEBUG] Erro no registro de veículo:', err);
      alert('Houve uma falha na indexação do novo veículo.');
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-text-3)]">Rastreando Ativos</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-10 animate-spring-up overflow-hidden">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Bus size={16} weight="bold" className="text-blue-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-blue-500">Gestão de Ativos</span>
          </div>
          <h1 className="text-5xl font-black font-display tracking-tighter text-[var(--color-text)]">Inventário <span className="text-zinc-400">Frota</span></h1>
          <p className="text-xs font-medium text-[var(--color-text-3)] max-w-sm">Monitoramento de status, especificações técnicas e disponibilidade de veículos.</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="h-12 px-8 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all"
        >
          <Plus size={18} weight="bold" /> Nova Unidade
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {buses.map((bus, idx) => (
          <motion.div
            key={bus.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group rounded-[48px] glass border-2 border-[var(--color-border)] p-8 flex flex-col gap-6 relative overflow-hidden transition-all hover:border-blue-500/30"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 border border-blue-500/10">
                <Bus size={28} weight="duotone" />
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border transition-colors",
                bus.active !== false ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
              )}>
                <div className={cn("w-1 h-1 rounded-full", bus.active !== false ? "bg-emerald-500" : "bg-rose-500")} />
                {bus.active !== false ? 'LIVRE' : 'EM USO'}
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <h3 className="text-xl font-black font-display tracking-tight text-[var(--color-text)] leading-none">Prefixo {bus.identificationNumber || bus.numeroIdentificacao}</h3>
              <div className="flex items-center gap-2 text-[var(--color-text-3)]">
                <IdentificationCard size={14} weight="bold" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">{bus.plate || bus.placa}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div className="p-4 rounded-[20px] bg-zinc-500/5 border border-[var(--color-border)] flex flex-col items-center justify-center gap-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-[var(--color-text-3)]">Ocupantes</span>
                <div className="flex items-center gap-2">
                   <UsersFour size={16} weight="bold" className="text-blue-500" />
                   <p className="text-sm font-black font-display text-[var(--color-text)]">{bus.standardCapacity || bus.capacidadePadrao}</p>
                </div>
              </div>
              <div className="p-4 rounded-[20px] bg-zinc-500/5 border border-[var(--color-border)] flex flex-col items-center justify-center gap-2">
                 <span className="text-[8px] font-black uppercase tracking-widest text-[var(--color-text-3)]">Hardware</span>
                 <div className="flex gap-2">
                    {(bus.hasAirConditioning ?? bus.temArCondicionado) && <Snowflake size={16} weight="duotone" className="text-blue-400" />}
                    {(bus.hasBathroom ?? bus.temBanheiro) && <Toilet size={16} weight="duotone" className="text-emerald-400" />}
                 </div>
              </div>
            </div>

            <button className="w-full h-14 rounded-[22px] glass border-2 border-[var(--color-border)] flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-[var(--color-text)] group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all active:scale-[0.98]">
              <Gear size={16} weight="bold" /> Gerenciar Ativo <CaretRight size={14} weight="bold" />
            </button>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}

        {buses.length === 0 && (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6 rounded-[48px] border-2 border-dashed border-[var(--color-border)]">
            <div className="w-20 h-20 rounded-full glass border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-3)]">
              <Bus size={40} weight="duotone" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Operação sem Ativos</p>
              <p className="text-xs font-bold text-[var(--color-text-2)] mt-1">Nenhum veículo foi indexado no sistema.</p>
            </div>
            <button 
               onClick={() => setShowAddModal(true)}
               className="px-8 h-12 rounded-full glass border-2 border-blue-500/30 text-blue-500 text-[8px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
            >
              Registrar Unidade 01
            </button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl glass border-2 border-[var(--color-border)] rounded-[48px] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-2xl glass border border-[var(--color-border)] text-[var(--color-text-3)] hover:text-white transition-all shadow-2xl"
              >
                <X size={24} weight="bold" />
              </button>

              <div className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-display tracking-tight text-white leading-none">Novos Ativos</h2>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Indexação de Hardware Operacional</p>
                </div>

                <form onSubmit={handleAddBus} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Prefixo</label>
                      <input
                        type="text"
                        value={newBus.identificationNumber}
                        onChange={(e) => setNewBus({ ...newBus, identificationNumber: e.target.value })}
                        className="w-full h-16 px-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all placeholder:text-white/10"
                        placeholder="EX: 900-X"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Placa (Mercosul)</label>
                      <input
                        type="text"
                        value={newBus.plate}
                        onChange={(e) => setNewBus({ ...newBus, plate: e.target.value.toUpperCase() })}
                        className="w-full h-16 px-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold font-mono outline-none focus:border-blue-500 transition-all"
                        placeholder="ABC-0000"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Lotação (Capacidade Máxima)</label>
                    <input
                      type="number"
                      value={newBus.standardCapacity}
                      onChange={(e) => setNewBus({ ...newBus, standardCapacity: Number(e.target.value) })}
                      className="w-full h-16 px-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="flex gap-4 py-4">
                    {[
                      { key: 'hasAirConditioning', label: 'Ar Condicionado', icon: Snowflake },
                      { key: 'hasBathroom', label: 'Sanitário', icon: Toilet }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setNewBus(prev => ({ ...prev, [opt.key]: !prev[opt.key as keyof typeof prev] }))}
                        className={cn(
                          "flex-1 h-16 rounded-[24px] border-2 flex items-center justify-center gap-3 transition-all",
                          newBus[opt.key as keyof typeof newBus] ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" : "glass border-white/5 text-white/40"
                        )}
                      >
                         <opt.icon size={20} weight={newBus[opt.key as keyof typeof newBus] ? 'bold' : 'duotone'} />
                         <span className="text-[8px] font-black uppercase tracking-widest">{opt.label}</span>
                         {newBus[opt.key as keyof typeof newBus] && <Check size={12} weight="bold" />}
                      </button>
                    ))}
                  </div>

                  <button type="submit" className="w-full h-20 rounded-[32px] bg-blue-600 text-white font-black font-display text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all border border-blue-400/20 mt-4">
                    Confirmar Homologação
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
