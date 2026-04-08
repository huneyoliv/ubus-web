import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Check, X, WarningCircle, MagnifyingGlass, IdentificationCard, FileText, CaretRight, User, Phone, EnvelopeSimple, Fingerprint, CalendarBlank } from 'phosphor-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  role: string;
  profilePictureUrl?: string;
  scheduleUrl?: string;
  createdAt?: string;
  defaultRouteId?: string;
}

export default function ManagerValidations() {
  const [students, setStudents] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendentes();
  }, []);

  async function fetchPendentes() {
    setLoading(true);
    setError(null);
    console.log('[DEBUG] Buscando solicitações pendentes...');
    try {
      const data = await api.get<PendingUser[]>('/users/pending');
      console.log('[DEBUG] Solicitações encontradas:', data.length);
      setStudents(data);
      if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
    } catch (err) {
      console.error('[DEBUG] Erro ao carregar pendentes:', err);
      setError('Erro operacional ao sincronizar fila de aprovação.');
      setStudents([
        { id: '1', name: 'Arthur Henrique Carvalho', email: 'arthur@exemplo.com', cpf: '123.456.789-00', role: 'STUDENT', createdAt: new Date().toISOString() },
        { id: '2', name: 'Beatriz Silva Martins', email: 'beatriz@exemplo.com', cpf: '987.654.321-11', role: 'STUDENT', createdAt: new Date().toISOString() }
      ]);
      setSelectedId('1');
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, status: 'APROVADO' | 'REJEITADO') {
    setActionLoading(true);
    console.log(`[DEBUG] Executando ação [${status}] para ID:`, id);
    try {
      await api.patch(`/users/${id}/status`, { status });
      console.log('[DEBUG] Ação concluída com sucesso');
      setStudents(prev => prev.filter(s => s.id !== id));
      setSelectedId(() => {
        const remaining = students.filter(s => s.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      });
    } catch (err) {
      console.error('[DEBUG] Erro na execução da ação:', err);
      alert('Falha crítica na comunicação com o servidor biológico.');
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.cpf || '').includes(searchTerm)
  );

  const selected = students.find(s => s.id === selectedId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-text-3)]">Auditando Registros</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen bg-[var(--color-bg)] transition-colors duration-500 overflow-hidden">
      <aside className="w-[450px] border-r border-[var(--color-border)] flex flex-col glass shrink-0 relative z-20">
        <header className="p-10 space-y-8 border-b border-[var(--color-border)] bg-[var(--color-bg)]/50 backdrop-blur-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} weight="bold" className="text-blue-500" />
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-blue-500">Compliance</span>
            </div>
            <h1 className="text-4xl font-black font-display tracking-tighter text-[var(--color-text)] leading-none">Validação</h1>
            <p className="text-[10px] font-black text-[var(--color-text-3)] uppercase tracking-widest">{students.length} Protocolos Pendentes</p>
          </div>

          <div className="relative group">
            <MagnifyingGlass size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="PESQUISAR CPF OU NOME..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-[24px] glass border-2 border-[var(--color-border)] text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </header>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-10 py-4 bg-rose-500/10 border-b border-rose-500/20 text-rose-500 flex items-center gap-3"
            >
              <WarningCircle size={16} weight="bold" />
              <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto no-scrollbar py-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((student, idx) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedId(student.id)}
                className={cn(
                  "px-10 py-6 cursor-pointer border-l-4 transition-all relative group",
                  selectedId === student.id ? "bg-blue-500/5 border-blue-500" : "border-transparent hover:bg-zinc-500/5 hover:border-zinc-500/20"
                )}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden border border-white/5 shadow-inner">
                    {student.profilePictureUrl ? (
                      <img src={student.profilePictureUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <User size={24} weight="duotone" className="text-zinc-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "text-sm font-black font-display tracking-tight truncate",
                      selectedId === student.id ? "text-blue-500" : "text-[var(--color-text)]"
                    )}>
                      {student.name}
                    </h4>
                    <p className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest mt-1">{student.cpf}</p>
                  </div>
                  <CaretRight size={16} weight="bold" className={cn(
                    "transition-all",
                    selectedId === student.id ? "text-blue-500 translate-x-1" : "text-zinc-800"
                  )} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-zinc-950/20 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col"
            >
              <header className="p-10 flex items-center justify-between border-b border-[var(--color-border)] glass relative z-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                     <IdentificationCard size={32} weight="duotone" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-black font-display tracking-tighter text-white">Revisão de Protocolo</h2>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">SLA Operacional: 24 Horas</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleAction(selected.id, 'REJEITADO')}
                    disabled={actionLoading}
                    className="h-14 px-8 rounded-2xl glass border-2 border-rose-500/20 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/5 flex items-center gap-2"
                  >
                    <X size={16} weight="bold" /> Indeferir
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, 'APROVADO')}
                    disabled={actionLoading}
                    className="h-14 px-10 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 flex items-center gap-2"
                  >
                    <Check size={16} weight="bold" /> Homologar
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto no-scrollbar p-10 grid grid-cols-12 gap-10">
                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <section className="glass border-2 border-[var(--color-border)] rounded-[48px] p-10 space-y-8 relative overflow-hidden">
                    <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                      <div className="w-32 h-32 rounded-[40px] bg-zinc-800 border-2 border-[var(--color-border)] shadow-2xl overflow-hidden group">
                        {selected.profilePictureUrl ? (
                          <img src={selected.profilePictureUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900">
                             <User size={48} weight="duotone" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black font-display text-white tracking-tight leading-none">{selected.name}</h3>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">{selected.role}</span>
                          <span className="px-3 py-1 glass text-white/40 text-[8px] font-black uppercase tracking-widest rounded-full border border-white/5">Novo Ingresso</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                      {[
                        { icon: EnvelopeSimple, label: 'E-mail Global', value: selected.email },
                        { icon: Phone, label: 'Terminal Móvel', value: selected.phone || 'N/A' },
                        { icon: Fingerprint, label: 'Documento ID (CPF)', value: selected.cpf },
                        { icon: CalendarBlank, label: 'Data do Registro', value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('pt-BR') : '--/--/----' }
                      ].map(item => (
                        <div key={item.label} className="flex gap-4">
                          <item.icon size={20} className="text-blue-500 mt-1" weight="duotone" />
                          <div>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{item.label}</p>
                            <p className="text-sm font-bold text-white mt-1">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full" />
                  </section>
                </div>

                <div className="col-span-12 lg:col-span-8 space-y-10 pb-20">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 ml-4">
                      <FileText size={20} weight="bold" className="text-blue-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Documentação Anexada</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="rounded-[40px] glass border-2 border-[var(--color-border)] p-8 space-y-6 group hover:border-blue-500/30 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Autenticação Facial</span>
                            <CheckCircle size={18} weight="bold" className="text-blue-500" />
                          </div>
                          <div className="aspect-[4/5] rounded-[32px] bg-zinc-900 border border-white/5 overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                            {selected.profilePictureUrl ? (
                              <img src={selected.profilePictureUrl} className="w-full h-full object-cover" alt="Biometria" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                                <User size={40} weight="duotone" />
                                <p className="text-[10px] font-black uppercase tracking-widest mt-4">Pendente</p>
                              </div>
                            )}
                          </div>
                       </div>

                       <div className="rounded-[40px] glass border-2 border-[var(--color-border)] p-8 space-y-6 group hover:border-blue-500/30 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Manifesto de Horários</span>
                            <FileText size={18} weight="bold" className="text-blue-500" />
                          </div>
                          <div className="aspect-[4/5] rounded-[32px] bg-zinc-900 border border-white/5 overflow-hidden shadow-inner flex flex-col items-center justify-center p-8 text-center group-hover:scale-[1.02] transition-transform duration-500">
                            {selected.scheduleUrl ? (
                              <div className="space-y-6">
                                <div className="w-20 h-20 rounded-full glass border-2 border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl">
                                  <FileText size={40} weight="bold" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-white uppercase tracking-widest">Documento PDF/IMG</p>
                                  <p className="text-[10px] font-medium text-white/40 mt-1">Sincronizado via WebApp</p>
                                </div>
                                <a 
                                  href={selected.scheduleUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-block px-6 py-3 rounded-full bg-blue-500 text-white text-[8px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
                                >
                                  Abrir Auditoria
                                </a>
                              </div>
                            ) : (
                              <div className="text-zinc-700">
                                <WarningCircle size={40} weight="duotone" />
                                <p className="text-[10px] font-black uppercase tracking-widest mt-4">Ausente</p>
                              </div>
                            )}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-6">
              <div className="w-24 h-24 rounded-full glass border-2 border-[var(--color-border)] flex items-center justify-center text-zinc-800 shadow-2xl shadow-black/50">
                <CheckCircle size={48} weight="duotone" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black font-display text-white tracking-tight">Fila Consolidada</h3>
                <p className="text-xs font-medium text-white/40 max-w-xs mx-auto">Selecione uma pendência na lateral para iniciar o processo de homologação.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
