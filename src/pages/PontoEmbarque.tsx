import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Check, Bus, NavigationArrow, CheckCircle, CaretRight, MapTrifold, Circle } from 'phosphor-react';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

interface PontoEmbarque {
  id: string;
  nome: string;
  endereco: string;
  lat: number;
  lng: number;
  idLinha: string;
  ordem: number;
}

interface Linha {
  id: string;
  nome: string;
  descricao?: string;
}

export default function SelecionarPontoEmbarque() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [selectedLinha, setSelectedLinha] = useState<string | null>(user?.defaultRouteId ?? null);
  const [pontos, setPontos] = useState<PontoEmbarque[]>([]);
  const [selectedPonto, setSelectedPonto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log('[DEBUG] Carregando rotas disponíveis...');
    api.get<Linha[]>('/fleet/routes')
      .then(setLinhas)
      .catch((err) => {
        console.error('[DEBUG] Erro ao carregar rotas:', err);
        setLinhas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedLinha) { setPontos([]); return; }
    console.log('[DEBUG] Carregando pontos para a linha:', selectedLinha);
    setLoading(true);
    api.get<PontoEmbarque[]>(`/fleet/routes/${selectedLinha}/points`)
      .then((data) => setPontos(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('[DEBUG] Erro ao carregar pontos:', err);
        setPontos([]);
      })
      .finally(() => setLoading(false));
  }, [selectedLinha]);

  const handleSave = async () => {
    if (!selectedPonto) return;
    console.log('[DEBUG] Salvando ponto de embarque selecionado:', selectedPonto);
    setSaving(true);
    try {
      await api.patch('/users/me/point', { pointId: selectedPonto });
      console.log('[DEBUG] Ponto de embarque atualizado com sucesso');
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[DEBUG] Erro ao salvar ponto:', err.body);
      }
    } finally {
      setSaving(false);
    }
  };

  const selectedPontoData = pontos.find(p => p.id === selectedPonto);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-500 pb-40">
      <header className="px-6 pt-10 pb-6 flex items-center gap-4 sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-xl z-20 border-b border-[var(--color-border)]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105"
        >
          <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">Embarque</h1>
          <p className="text-[var(--color-text-2)] font-medium mt-1 uppercase tracking-widest text-[10px]">Origem & Destino</p>
        </div>
      </header>

      <main className="px-6 mt-8 space-y-10 animate-spring-up overflow-hidden">
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-3)]">
            <Bus size={16} weight="duotone" /> 
            <span>Sua Linha</span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {linhas.map((linha) => {
              const isSelected = selectedLinha === linha.id;
              return (
                <motion.button
                  key={linha.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedLinha(linha.id); setSelectedPonto(null); }}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-[28px] text-left transition-all border-2 relative overflow-hidden group",
                    isSelected ? "glass border-blue-500 shadow-2xl shadow-blue-500/10" : "glass border-[var(--color-border)] opacity-60 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "bg-blue-600 text-white" : "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20"
                  )}>
                    <MapTrifold size={24} weight={isSelected ? "fill" : "duotone"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black font-display tracking-tight text-[var(--color-text)] uppercase">{linha.nome}</p>
                    {linha.descricao && <p className="text-[10px] font-bold text-[var(--color-text-3)] truncate mt-0.5">{linha.descricao}</p>}
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Check size={16} weight="bold" />
                    </div>
                  )}
                  {isSelected && <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-blue-500/10 blur-xl rounded-full" />}
                </motion.button>
              );
            })}
          </div>
        </section>

        <AnimatePresence mode="wait">
          {selectedLinha && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-3)]">
                <MapPin size={16} weight="duotone" /> 
                <span>Trajeto & Pontos</span>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-[32px] glass animate-pulse" />)}
                </div>
              ) : pontos.length === 0 ? (
                <div className="text-center py-16 rounded-[40px] border-2 border-dashed border-[var(--color-border)] glass space-y-4">
                  <MapPin size={40} className="mx-auto text-[var(--color-text-3)]" />
                  <div>
                    <p className="text-sm font-black text-[var(--color-text-2)] uppercase tracking-wider">Nenhum ponto configurado</p>
                    <p className="text-xs font-bold text-[var(--color-text-3)] mt-1">O administrador deve cadastrar o trajeto</p>
                  </div>
                </div>
              ) : (
                <div className="relative pl-8">
                  <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500/40 via-blue-400/20 to-blue-500/40 rounded-full" />

                  <div className="space-y-4">
                    {pontos.map((ponto, index) => {
                      const isFirst = index === 0;
                      const isLast = index === pontos.length - 1;
                      const isSelected = selectedPonto === ponto.id;

                      return (
                        <motion.button
                          key={ponto.id}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedPonto(ponto.id)}
                          className={cn(
                            "w-full flex items-center gap-4 p-5 rounded-[28px] text-left transition-all border-2 relative",
                            isSelected ? "glass border-blue-500 shadow-xl shadow-blue-500/5 bg-blue-500/5" : "glass border-transparent hover:border-[var(--color-border)]"
                          )}
                        >
                          <div className={cn(
                            "absolute left-[-25px] w-4 h-4 rounded-full border-4 z-10 transition-all",
                            isSelected ? "bg-blue-600 border-blue-200" : "bg-zinc-300 dark:bg-zinc-700 border-[var(--color-bg)]"
                          )} />
                          
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            isSelected ? "bg-blue-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                          )}>
                             {isFirst ? <NavigationArrow size={20} weight="duotone" /> : isLast ? <MapPin size={20} weight="duotone" /> : <Circle size={12} weight="fill" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-black text-[var(--color-text)] uppercase tracking-tight">{ponto.nome}</p>
                              {(isFirst || isLast) && (
                                <span className={cn(
                                  "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                                  isFirst ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                                )}>
                                  {isFirst ? 'Início' : 'Fim'}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-bold text-[var(--color-text-3)] truncate mt-1 uppercase tracking-widest">{ponto.endereco}</p>
                          </div>

                          <CaretRight size={16} weight="bold" className={cn("transition-all", isSelected ? "text-blue-500 translate-x-1" : "text-zinc-300")} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 p-6">
        <div className="max-w-xl mx-auto rounded-[32px] glass-dark border-t border-white/10 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="space-y-4">
            {selectedPontoData && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <MapPin size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Ponto Selecionado</p>
                  <p className="text-sm font-black text-white mt-0.5">{selectedPontoData.nome}</p>
                </div>
              </div>
            )}

            {success ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full h-16 rounded-[24px] bg-emerald-600 flex items-center justify-center gap-3 text-white font-black font-display text-sm tracking-widest uppercase"
              >
                <CheckCircle size={24} weight="fill" /> Localização Salva
              </motion.div>
            ) : (
              <button
                onClick={handleSave}
                disabled={!selectedPonto || saving}
                className={cn(
                  "w-full h-16 rounded-[24px] flex items-center justify-center gap-3 font-black font-display text-sm tracking-widest uppercase transition-all",
                  selectedPonto && !saving 
                    ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98] shadow-xl shadow-blue-500/20" 
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                {saving ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Sincronizando...</span>
                  </div>
                ) : 'Confirmar Embarque'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
