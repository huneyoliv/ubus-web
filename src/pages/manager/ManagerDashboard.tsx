import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Path, 
  Bus, 
  WarningCircle, 
  ChartLineUp, 
  MagnifyingGlass, 
  FadersHorizontal, 
  CornersOut, 
  TrendUp,
  Clock,
  Circle,
  CaretRight,
  DotsThreeVertical
} from 'phosphor-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface DashboardData {
  activeStudents: number;
  tripsToday: number;
  pendingApprovals: number;
  fleetActive: number;
  weeklyTrips: { date: string; count: number }[];
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function ManagerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[DEBUG] Iniciando busca de métricas do dashboard manager...');
    api.get<DashboardData>('/metrics/dashboard')
      .then(res => {
        console.log('[DEBUG] Dados do dashboard recebidos:', res);
        setData(res);
      })
      .catch(err => {
        console.error('[DEBUG] Erro ao carregar dashboard:', err);
        setData({
           activeStudents: 1240,
           tripsToday: 45,
           pendingApprovals: 12,
           fleetActive: 18,
           weeklyTrips: [
             { date: '2024-04-01', count: 120 },
             { date: '2024-04-02', count: 150 },
             { date: '2024-04-03', count: 180 },
             { date: '2024-04-04', count: 140 },
             { date: '2024-04-05', count: 210 },
             { date: '2024-04-06', count: 90 },
             { date: '2024-04-07', count: 40 },
           ]
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: 'Alunos Ativos', value: data?.activeStudents, icon: GraduationCap, color: 'blue', trend: '+12%' },
    { label: 'Viagens Hoje', value: data?.tripsToday, icon: Path, color: 'emerald', trend: '+5%' },
    { label: 'Frota em Uso', value: data?.fleetActive, icon: Bus, color: 'indigo', trend: 'Estável' },
    { label: 'Pendências', value: data?.pendingApprovals, icon: WarningCircle, color: 'rose', trend: '-2', isAlert: (data?.pendingApprovals ?? 0) > 0 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-text-3)]">Sincronizando Metadados</p>
      </div>
    );
  }

  const maxWeekly = Math.max(1, ...(data?.weeklyTrips?.map(w => w.count) ?? [1]));

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-10 animate-spring-up overflow-hidden">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-emerald-500">Sistema Online</span>
          </div>
          <h1 className="text-5xl font-black font-display tracking-tighter text-[var(--color-text)]">Analytics <span className="text-zinc-400">Hub</span></h1>
          <p className="text-xs font-medium text-[var(--color-text-3)] max-w-sm">Consolidação estratégica da operação municipal e indicadores de performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 rounded-2xl glass border-2 border-[var(--color-border)] text-[var(--color-text)] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-500/5 transition-all">
            <Clock size={16} weight="bold" /> Relatório Diário
          </button>
          <button className="h-12 px-6 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all">
            Exportar Dados
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-8 rounded-[40px] glass border-2 flex flex-col gap-6 relative overflow-hidden group transition-all hover:border-blue-500/30",
              kpi.isAlert ? "border-rose-500/30 shadow-2xl shadow-rose-500/5" : "border-[var(--color-border)]"
            )}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                kpi.color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                kpi.color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" :
                kpi.color === 'indigo' ? "bg-indigo-500/10 text-indigo-500" :
                "bg-rose-500/10 text-rose-500"
              )}>
                <kpi.icon size={28} weight="duotone" />
              </div>
              <div className="text-right">
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                  kpi.isAlert ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                )}>
                  {kpi.trend}
                </span>
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-5xl font-black font-display tracking-tighter text-[var(--color-text)]">{kpi.value ?? '--'}</p>
              <h3 className="text-[10px] font-black text-[var(--color-text-3)] uppercase tracking-[0.3em] mt-2">{kpi.label}</h3>
            </div>
            
            <div className={cn(
              "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl rounded-full opacity-20",
              kpi.color === 'blue' ? "bg-blue-500" : kpi.color === 'emerald' ? "bg-emerald-500" : kpi.color === 'indigo' ? "bg-indigo-500" : "bg-rose-500"
            )} />
          </motion.div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-[48px] glass border-2 border-[var(--color-border)] p-10 flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <ChartLineUp size={24} weight="duotone" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-text)]">Volume de Deslocamentos</h3>
            </div>
            <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-[var(--color-text-3)] outline-none cursor-pointer">
              <option>Últimos 7 dias</option>
              <option>Este mês</option>
            </select>
          </div>

          <div className="flex-1 flex items-end gap-4 min-h-[300px] px-2 relative">
            <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none opacity-5">
              {[0, 1, 2, 3].map(i => <div key={i} className="w-full h-px bg-white" />)}
            </div>
            
            {data?.weeklyTrips.map((w, idx) => {
              const pct = (w.count / maxWeekly) * 100;
              const dayNum = new Date(w.date + 'T12:00:00').getDay();
              return (
                <div key={w.date} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-all mb-2">
                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">{w.count}</span>
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ delay: idx * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "w-full max-w-[40px] rounded-t-2xl relative overflow-hidden",
                      idx === 4 ? "bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.3)]" : "bg-zinc-800"
                    )}
                  >
                     <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/10 to-transparent" />
                  </motion.div>
                  <span className="text-[10px] font-black text-[var(--color-text-3)] uppercase tracking-tighter">
                    {WEEKDAYS[dayNum]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1 rounded-[48px] glass border-2 border-[var(--color-border)] p-10 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-text)]">Monitoramento</h3>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl glass border border-[var(--color-border)] text-[var(--color-text-3)]">
              <CornersOut size={20} weight="bold" />
            </button>
          </div>
          
          <div className="flex-1 rounded-[32px] bg-zinc-950/20 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 opacity-20 pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-700">
               <div className="w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--color-bg)_100%)] absolute z-10" />
               <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-46.63,-23.55,10/800x600?access_token=mock')] bg-cover" />
             </div>
             
             <div className="relative z-20 flex flex-col items-center gap-4 text-center p-6">
               <div className="w-16 h-16 rounded-full glass border-2 border-white/10 flex items-center justify-center text-blue-500 shadow-2xl animate-pulse">
                 <Path size={32} weight="duotone" />
               </div>
               <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Rastreamento Inativo</p>
                 <p className="text-xs font-bold text-white/40 mt-1">Conecte-se ao módulo GPS para visualização remota.</p>
               </div>
               <button className="mt-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                 Iniciar Escaneamento
               </button>
             </div>
          </div>
        </div>
      </section>

      <section className="rounded-[48px] glass border-2 border-[var(--color-border)] overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <TrendUp size={28} weight="duotone" />
            </div>
            <div>
              <h3 className="text-lg font-black font-display tracking-tight text-[var(--color-text)]">Malha Operacional</h3>
              <p className="text-[10px] font-black text-[var(--color-text-3)] uppercase tracking-widest">Rotas e Fluxo em Tempo Real</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-3)]" />
              <input 
                type="text" 
                placeholder="PROCURAR ROTA..." 
                className="h-14 pl-12 pr-6 rounded-2xl glass border-2 border-[var(--color-border)] text-[var(--color-text)] text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all w-64"
              />
            </div>
            <button className="h-14 w-14 rounded-2xl glass border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-3)] hover:text-blue-500 transition-all">
              <FadersHorizontal size={24} weight="bold" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-500/5">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Linha / ID Operacional</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Operador</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Veículo</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Ocupação</th>
                <th className="px-10 py-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
               {[1, 2, 3].map(i => (
                 <tr key={i} className="group hover:bg-zinc-500/5 transition-colors">
                   <td className="px-10 py-8">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                         <Path size={20} weight="bold" />
                       </div>
                       <div>
                         <p className="text-sm font-black font-display tracking-tight text-[var(--color-text)]">Linha {100 + i} · Universitária</p>
                         <p className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest">Eixo Central - Campus {i}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-10 py-8">
                     <div className="flex items-center gap-2">
                       <Circle size={8} weight="fill" className="text-emerald-500 shadow-[0_0_8px_#10b981]" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Em Trânsito</span>
                     </div>
                   </td>
                   <td className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-[var(--color-text)]">Operador ID {78 + i}</td>
                   <td className="px-10 py-8">
                     <div className="flex items-center gap-2">
                       <Bus size={18} weight="duotone" className="text-blue-500" />
                       <span className="text-sm font-black font-display text-[var(--color-text)]">1042</span>
                     </div>
                   </td>
                   <td className="px-10 py-8">
                      <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: i === 1 ? '85%' : i === 2 ? '40%' : '12%' }} />
                      </div>
                   </td>
                   <td className="px-10 py-8 text-right">
                     <button className="w-10 h-10 rounded-xl glass border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-3)] hover:text-blue-500 transition-all ml-auto">
                       <DotsThreeVertical size={24} weight="bold" />
                     </button>
                   </td>
                 </tr>
               ))}
               <tr>
                 <td colSpan={6} className="px-10 py-12 text-center">
                    <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline flex items-center gap-2 mx-auto">
                       Ver Todas as Rotas Ativas <CaretRight size={14} weight="bold" />
                    </button>
                 </td>
               </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
