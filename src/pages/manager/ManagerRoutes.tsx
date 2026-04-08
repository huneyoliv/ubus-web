import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Path, MagnifyingGlass, Plus, Clock, Calendar, MapTrifold, X, CaretRight, Bus, Info } from 'phosphor-react';
import { api } from '@/lib/api';

export default function ManagerRoutes() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    description: '',
    weekDays: [1, 2, 3, 4, 5],
    votingOpenTime: '06:00',
    votingCloseTime: '20:00'
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    console.log('[DEBUG] Buscando listagem de rotas...');
    try {
      const data = await api.get<any[]>('/fleet/routes');
      console.log('[DEBUG] Rotas carregadas:', data.length);
      setRoutes(data);
    } catch (err) {
      console.error('[DEBUG] Erro ao buscar rotas:', err);
      setRoutes([
        { id: '1', name: 'Eixo Norte - Universitário', description: 'Atendimento aos campi I e II via Corredor Central.', votingOpenTime: '06:00', votingCloseTime: '20:00', weekDays: [1,2,3,4,5] },
        { id: '2', name: 'Circular Noturno', description: 'Rota de integração circular para o período noturno.', votingOpenTime: '18:00', votingCloseTime: '22:00', weekDays: [1,2,3,4,5] }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddRoute(e: React.FormEvent) {
    e.preventDefault();
    console.log('[DEBUG] Iniciando criação de nova rota:', newRoute.name);
    try {
      await api.post('/fleet/routes', newRoute);
      console.log('[DEBUG] Rota criada com sucesso');
      setShowAddModal(false);
      setNewRoute({
        name: '',
        description: '',
        weekDays: [1, 2, 3, 4, 5],
        votingOpenTime: '06:00',
        votingCloseTime: '20:00'
      });
      fetchRoutes();
    } catch (err) {
      console.error('[DEBUG] Erro ao criar rota:', err);
      alert('Erro operacional ao registrar rota.');
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-text-3)]">Indexando Malha Viária</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full space-y-10 animate-spring-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Path size={16} weight="bold" className="text-blue-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-blue-500">Logística Global</span>
          </div>
          <h1 className="text-5xl font-black font-display tracking-tighter text-[var(--color-text)]">Malha <span className="text-zinc-400">Viária</span></h1>
          <p className="text-xs font-medium text-[var(--color-text-3)] max-w-sm">Estruturação e parametrização de trajetos operacionais e janelas de votação.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden lg:block">
            <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="FILTRAR TRAJETOS..." 
              className="h-12 pl-12 pr-6 rounded-2xl glass border-2 border-[var(--color-border)] text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all w-64"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-12 px-8 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all"
          >
            <Plus size={18} weight="bold" /> Nova Rota
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {routes.map((route, idx) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group rounded-[48px] glass border-2 border-[var(--color-border)] p-10 flex flex-col gap-8 transition-all hover:border-blue-500/30 relative overflow-hidden"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Bus size={32} weight="duotone" />
              </div>
              <button className="w-10 h-10 rounded-full glass border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-3)] hover:text-blue-500 transition-all">
                <Info size={20} weight="bold" />
              </button>
            </div>

            <div className="space-y-2 relative z-10 flex-1">
              <h3 className="text-xl font-black font-display tracking-tight text-[var(--color-text)] leading-none">{route.name || route.nome}</h3>
              <p className="text-xs font-medium text-[var(--color-text-3)] line-clamp-2 leading-relaxed uppercase tracking-tight opacity-60">
                {route.description || route.descricao || 'Nenhuma diretriz estratégica definida para este trajeto.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="p-5 rounded-[24px] bg-zinc-500/5 border border-[var(--color-border)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--color-text-3)]">
                  <Clock size={14} weight="bold" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Votação</span>
                </div>
                <p className="text-xs font-black font-display text-[var(--color-text)]">
                  {route.votingOpenTime || route.horarioAberturaVotacao} — {route.votingCloseTime || route.horarioFechamentoVotacao}
                </p>
              </div>
              <div className="p-5 rounded-[24px] bg-zinc-500/5 border border-[var(--color-border)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--color-text-3)]">
                  <Calendar size={14} weight="bold" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Frequência</span>
                </div>
                <p className="text-xs font-black font-display text-[var(--color-text)]">
                  {route.weekDays?.length || route.diasDaSemana?.length || 0} Dias Úteis
                </p>
              </div>
            </div>

            <button className="w-full h-16 rounded-[24px] glass border-2 border-[var(--color-border)] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--color-text)] group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all relative z-10 shadow-sm shadow-black/20">
              <MapTrifold size={20} weight="bold" /> Ver Detalhes <CaretRight size={16} weight="bold" />
            </button>
            
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}

        {routes.length === 0 && (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6 rounded-[48px] border-2 border-dashed border-[var(--color-border)]">
            <div className="w-20 h-20 rounded-full glass border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-3)]">
              <Path size={40} weight="duotone" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-3)]">Malha Viária Vazia</p>
              <p className="text-xs font-bold text-[var(--color-text-2)] mt-1">Intermeie rotas para iniciar a operação.</p>
            </div>
            <button 
               onClick={() => setShowAddModal(true)}
               className="px-8 h-12 rounded-full glass border-2 border-blue-500/30 text-blue-500 text-[8px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
            >
              Adicionar Primeira Rota
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
                  <h2 className="text-3xl font-black font-display tracking-tight text-white leading-none">Configurar Rota</h2>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Estabeleça os parâmetros operacionais</p>
                </div>

                <form onSubmit={handleAddRoute} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Nome da Linha</label>
                    <input
                      type="text"
                      value={newRoute.name}
                      onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                      className="w-full h-16 px-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all placeholder:text-white/10"
                      placeholder="EX: CAMPUS EXPRESSO II"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Descrição Técnica</label>
                    <textarea
                      value={newRoute.description}
                      onChange={(e) => setNewRoute({ ...newRoute, description: e.target.value })}
                      rows={3}
                      className="w-full p-8 rounded-[32px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all placeholder:text-white/10 resize-none leading-relaxed"
                      placeholder="DETALHE O TRAJETO E PONTOS CRÍTICOS..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Janela Abertura</label>
                      <input
                        type="time"
                        value={newRoute.votingOpenTime}
                        onChange={(e) => setNewRoute({ ...newRoute, votingOpenTime: e.target.value })}
                        className="w-full h-16 px-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Janela Fechamento</label>
                      <input
                        type="time"
                        value={newRoute.votingCloseTime}
                        onChange={(e) => setNewRoute({ ...newRoute, votingCloseTime: e.target.value })}
                        className="w-full h-16 px-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full h-20 rounded-[32px] bg-blue-600 text-white font-black font-display text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all border border-blue-400/20 mt-4">
                    Confirmar Parâmetros
                  </button>
                </form>
              </div>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
