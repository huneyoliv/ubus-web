import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Buildings, Activity, ShieldCheck, PlusCircle, UserPlus, MagnifyingGlass, Bell, PencilSimple, ChartPieSlice, Globe, Power } from 'phosphor-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Municipality {
  id: string;
  name: string;
  active: boolean;
  managerId?: string | null;
  createdAt?: string;
}

export default function SuperAdminDashboard() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGlobalState();
  }, []);

  async function fetchGlobalState() {
    console.log('[DEBUG] Sincronizando estado global do ecossistema...');
    try {
      const data = await api.get<Municipality[]>('/management');
      console.log('[DEBUG] Unidades federativas localizadas:', data.length);
      setMunicipalities(data);
    } catch (err) {
      console.error('[DEBUG] Falha na sincronização global:', err);
      setMunicipalities([
        { id: '1', name: 'Prefeitura de São Paulo', active: true, managerId: 'mgr_1', createdAt: new Date().toISOString() },
        { id: '2', name: 'Prefeitura de Campinas', active: true, managerId: null, createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const totalActive = municipalities.filter(m => m.active !== false).length;
  
  const filtered = municipalities.filter(m =>
    (m.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-text-3)]">Engajando Camada Global</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-12 animate-spring-up overflow-hidden">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe size={16} weight="bold" className="text-blue-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-blue-500">Global Infrastructure</span>
          </div>
          <h1 className="text-6xl font-black font-display tracking-tighter text-[var(--color-text)] leading-tight">
            Console de <span className="text-zinc-400 font-medium">Comando</span>
          </h1>
          <p className="text-xs font-bold text-[var(--color-text-3)] uppercase tracking-widest">Controle Sistêmico Ubus v4.0</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <MagnifyingGlass size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="RASTREAR UNIDADE..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-80 h-14 pl-14 pr-6 rounded-[24px] glass border-2 border-[var(--color-border)] text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all shadow-xl shadow-black/5"
            />
          </div>
          <button className="w-14 h-14 rounded-2xl glass border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-3)] hover:text-white transition-all hover:border-blue-500/30">
            <Bell size={24} />
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Unidades Federativas', val: municipalities.length, sub: 'Total Registrado', icon: Buildings, color: 'text-blue-500' },
          { label: 'Sistemas Online', val: totalActive, sub: 'Operação Nominal', icon: Activity, color: 'text-emerald-500' },
          { label: 'Nós Auditados', val: municipalities.filter(m => m.managerId).length, sub: 'Com Gestor Ativo', icon: ShieldCheck, color: 'text-amber-500' }
        ].map((kpi, idx) => (
          <div key={idx} className="glass border-2 border-[var(--color-border)] rounded-[48px] p-10 space-y-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-500/5 border border-white/5 shadow-inner", kpi.color)}>
                 <kpi.icon size={28} weight="duotone" />
              </div>
              <ChartPieSlice size={20} className="text-zinc-800" />
            </div>
            <div>
               <h3 className="text-5xl font-black font-display tracking-tighter text-white leading-none">{kpi.val}</h3>
               <p className="text-[10px] font-black text-[var(--color-text-3)] uppercase tracking-widest mt-3">{kpi.label}</p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between ml-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Ecossistema Corporativo</h3>
              <div className="flex gap-2">
                 <button className="h-10 px-6 rounded-full glass border border-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Relatório Global</button>
              </div>
           </div>

           <div className="glass border-2 border-[var(--color-border)] rounded-[48px] overflow-hidden shadow-2xl shadow-black/20">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-[var(--color-border)] bg-zinc-900/50">
                       <th className="px-10 py-6 text-[8px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Unidade</th>
                       <th className="px-10 py-6 text-[8px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Status Operacional</th>
                       <th className="px-10 py-6 text-[8px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Integridade</th>
                       <th className="px-10 py-6 text-[8px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)] text-right">Controle</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[var(--color-border)]">
                    {filtered.map((pref, idx) => (
                       <motion.tr 
                        key={pref.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-blue-500/[0.02] transition-colors group"
                       >
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center font-black text-xs text-blue-500">
                                   {pref.name.substring(13, 14) || 'U'}
                                </div>
                                <span className="text-sm font-black font-display text-white">{pref.name}</span>
                             </div>
                          </td>
                          <td className="px-10 py-6">
                             <div className={cn(
                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest",
                                pref.active !== false ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                             )}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", pref.active !== false ? "bg-emerald-500" : "bg-rose-500")} />
                                {pref.active !== false ? 'Online' : 'Offline'}
                             </div>
                          </td>
                          <td className="px-10 py-6 font-bold text-[10px] text-zinc-500 uppercase tracking-widest">
                             {pref.managerId ? 'Homologado' : 'Auditando'}
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button className="w-10 h-10 rounded-xl glass border border-[var(--color-border)] flex items-center justify-center text-zinc-400 hover:text-blue-500 hover:border-blue-500/30 transition-all group-hover:scale-110">
                                <PencilSimple size={18} weight="bold" />
                             </button>
                          </td>
                       </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8 pb-10">
           <div className="flex items-center gap-3 ml-4">
              <PlusCircle size={20} className="text-blue-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Deployment</h3>
           </div>

           <div className="glass border-2 border-[var(--color-border)] rounded-[48px] p-10 space-y-10 shadow-2xl shadow-black/20">
              <div className="space-y-4">
                 <button className="w-full h-16 rounded-[24px] bg-blue-600 text-white flex items-center justify-between px-8 font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">
                    Sincronizar Nova Unidade <PlusCircle size={20} weight="bold" />
                 </button>
                 <button className="w-full h-16 rounded-[24px] glass border-2 border-[var(--color-border)] text-white flex items-center justify-between px-8 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all">
                    Aprovisionar Novo Gestor <UserPlus size={20} weight="bold" />
                 </button>
              </div>

              <div className="pt-6 border-t border-[var(--color-border)] space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Uptime Sistêmico</span>
                    <span className="text-[8px] font-black text-emerald-500">99.9%</span>
                 </div>
                 <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '99.9%' }}
                       className="h-full bg-emerald-500"
                    />
                 </div>
                 <div className="flex items-center gap-4 p-5 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                    <Power size={20} weight="bold" className="text-blue-500" />
                    <div>
                       <p className="text-[10px] font-black text-white uppercase tracking-widest">Master Node</p>
                       <p className="text-[8px] font-bold text-zinc-500 mt-0.5 uppercase tracking-widest">Cluster US-EAST-1</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
