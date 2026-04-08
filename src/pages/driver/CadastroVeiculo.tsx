import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Bus, IdentificationCard, Suitcase, WifiHigh, Snowflake, Toilet, Wheelchair, CaretRight, WarningCircle, ListNumbers, SquaresFour, HardDrive } from 'phosphor-react';
import { cn } from '@/lib/utils';

export default function CadastroVeiculo() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    numero: '',
    assentos: '',
    temNumeracao: null as boolean | null,
    cadeirasPrimeiraFila: '',
    logicaNumeracao: '',
    facilidades: {
      arCondicionado: false,
      wifi: false,
      banheiro: false,
      acessibilidade: false
    }
  });

  const totalSteps = 6;

  console.log('[DEBUG] Entrada em nova etapa de configuração do host:', step);

  const handleNext = () => {
    if (step < 7) {
      if (step === 3 && formData.temNumeracao === false) {
        console.log('[DEBUG] Segmentação ignorada: Pular para facilidades');
        setStep(6);
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step === 6 && formData.temNumeracao === false) {
      setStep(3);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      console.log('[DEBUG] Abortando registro de unidade');
      navigate(-1);
    }
  };

  const handleToggleFacilidade = (key: keyof typeof formData.facilidades) => {
    console.log('[DEBUG] Alternando módulo de hardware:', key);
    setFormData(prev => ({
      ...prev,
      facilidades: {
        ...prev.facilidades,
        [key]: !prev.facilidades[key]
      }
    }));
  };

  const isStepValid = () => {
    if (step === 1) return formData.numero.trim() !== '';
    if (step === 2) return formData.assentos.trim() !== '';
    if (step === 3) return formData.temNumeracao !== null;
    if (step === 4) return formData.cadeirasPrimeiraFila.trim() !== '';
    if (step === 5) return formData.logicaNumeracao !== '';
    return true;
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen text-[var(--color-text)] flex justify-center w-full transition-colors duration-500 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <div className="relative flex min-h-screen w-full max-w-md flex-col px-6">
        <header className="sticky top-0 z-30 flex items-center py-10 gap-6 bg-[var(--color-bg)]/80 backdrop-blur-3xl">
          <button
            onClick={handleBack}
            className="w-14 h-14 flex items-center justify-center rounded-[24px] glass border-2 border-[var(--color-border)] text-[var(--color-text)] active:scale-90 transition-all hover:border-blue-500/30"
          >
            <ArrowLeft size={24} weight="bold" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <HardDrive size={12} weight="bold" className="text-blue-500" />
              <span className="text-blue-500 text-[8px] font-black uppercase tracking-[0.4em]">Configurador</span>
            </div>
            <h1 className="text-3xl font-black font-display tracking-tighter leading-none mt-1">
              Registro <span className="text-zinc-500">Host</span>
            </h1>
          </div>
        </header>

        {step <= totalSteps && (
          <div className="px-2 pb-6 flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={cn(
                "h-1 rounded-full transition-all duration-700",
                (i + 1) === step ? "flex-1 bg-blue-500" : (i + 1) < step ? "w-4 bg-blue-500/30" : "w-2 bg-[var(--color-border)]"
              )} />
            ))}
          </div>
        )}

        <main className="flex-1 flex flex-col pt-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-2xl">
                    <IdentificationCard size={32} weight="duotone" />
                  </div>
                  <h2 className="text-4xl font-black font-display tracking-tight leading-none text-white">Prefixo de<br />Identificação?</h2>
                  <p className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">Número serial atribuído à lateral do chassis da unidade.</p>
                </div>
                <div className="relative group">
                   <input
                    type="tel"
                    placeholder="0000"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    className="w-full h-32 text-center text-6xl font-black font-display glass border-4 border-[var(--color-border)] rounded-[40px] focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all tracking-tight text-white placeholder:text-zinc-900"
                   />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-2xl">
                    <Suitcase size={32} weight="duotone" />
                  </div>
                  <h2 className="text-4xl font-black font-display tracking-tight leading-none text-white">Capacidade do<br />Compartimento</h2>
                  <p className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Volume total de assentos homologados para operação.</p>
                </div>
                <input
                  type="tel"
                  placeholder="00"
                  value={formData.assentos}
                  onChange={(e) => setFormData({ ...formData, assentos: e.target.value })}
                  className="w-full h-32 text-center text-6xl font-black font-display glass border-4 border-[var(--color-border)] rounded-[40px] focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all tracking-tight text-white placeholder:text-zinc-900"
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-2xl">
                    <ListNumbers size={32} weight="duotone" />
                  </div>
                  <h2 className="text-4xl font-black font-display tracking-tight leading-none text-white">Mapa de<br />Poltronas?</h2>
                  <p className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Habilitar seleção por ID individual para os usuários.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => setFormData({ ...formData, temNumeracao: true })} className={cn(
                    "p-8 rounded-[40px] border-2 text-left transition-all flex items-center gap-6 relative overflow-hidden",
                    formData.temNumeracao === true ? "glass border-blue-500 bg-blue-500/5 shadow-2xl" : "glass border-white/5 opacity-40 hover:opacity-100"
                  )}>
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", formData.temNumeracao === true ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50" : "bg-zinc-800 text-zinc-500")}>
                      <CheckCircle size={28} weight="bold" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black font-display tracking-tight uppercase">Assento Individual</h3>
                      <p className="text-[8px] font-black text-blue-500/60 uppercase tracking-widest mt-1">SLA Ativo</p>
                    </div>
                  </button>
                  <button onClick={() => setFormData({ ...formData, temNumeracao: false })} className={cn(
                    "p-8 rounded-[40px] border-2 text-left transition-all flex items-center gap-6 relative overflow-hidden",
                    formData.temNumeracao === false ? "glass border-blue-500 bg-blue-500/5 shadow-2xl" : "glass border-white/5 opacity-40 hover:opacity-100"
                  )}>
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", formData.temNumeracao === false ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50" : "bg-zinc-800 text-zinc-500")}>
                      <WarningCircle size={28} weight="bold" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black font-display tracking-tight uppercase">Fluxo Livre</h3>
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Escolha por Embarque</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-2xl">
                    <SquaresFour size={32} weight="duotone" />
                  </div>
                  <h2 className="text-4xl font-black font-display tracking-tight leading-none text-white">Matriz de<br />Front-Row</h2>
                  <p className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed text-zinc-500">Unidades na primeira fileira operacional.</p>
                </div>
                <input
                  type="tel"
                  placeholder="0"
                  value={formData.cadeirasPrimeiraFila}
                  onChange={(e) => setFormData({ ...formData, cadeirasPrimeiraFila: e.target.value })}
                  className="w-full h-32 text-center text-6xl font-black font-display glass border-4 border-[var(--color-border)] rounded-[40px] focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all tracking-tight text-white placeholder:text-zinc-900"
                />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-2xl">
                    <ListNumbers size={32} weight="duotone" />
                  </div>
                  <h2 className="text-4xl font-black font-display tracking-tight leading-none text-white">Algoritmo de<br />Indexação</h2>
                  <p className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Defina o comportamento da numeração.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'sequencial', label: 'Eixo Sequencial', desc: '1, 2, 3, 4 (Padrão Urbano)' },
                    { id: 'impar-par', label: 'Janela Alternada', desc: 'Ímpares Janela / Pares Corredor' }
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setFormData({ ...formData, logicaNumeracao: opt.id })} className={cn(
                      "p-8 rounded-[40px] border-2 text-left transition-all flex items-center gap-6 relative overflow-hidden",
                      formData.logicaNumeracao === opt.id ? "glass border-blue-500 bg-blue-500/5 shadow-2xl" : "glass border-white/5 opacity-40 hover:opacity-100"
                    )}>
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", formData.logicaNumeracao === opt.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50" : "bg-zinc-800 text-zinc-500")}>
                        <CaretRight size={20} weight="bold" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black font-display tracking-tight uppercase">{opt.label}</h3>
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-2xl">
                    <Bus size={32} weight="duotone" />
                  </div>
                  <h2 className="text-4xl font-black font-display tracking-tight leading-none text-white">Módulos de<br />Hardware</h2>
                  <p className="text-[var(--color-text-3)] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Sistemas auxiliares ativos na unidade.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'arCondicionado' as const, label: 'Climatização', icon: Snowflake },
                    { id: 'wifi' as const, label: 'WIFI Host', icon: WifiHigh },
                    { id: 'banheiro' as const, label: 'Sanitário', icon: Toilet },
                    { id: 'acessibilidade' as const, label: 'Elevador PCD', icon: Wheelchair }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleToggleFacilidade(opt.id)}
                      className={cn(
                        "p-8 rounded-[45px] border-2 flex flex-col justify-center items-center gap-4 transition-all relative overflow-hidden group",
                        formData.facilidades[opt.id] ? "glass border-blue-500 bg-blue-500/5 text-blue-500 shadow-2xl shadow-blue-500/10" : "glass border-white/5 text-zinc-600 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                      )}
                    >
                      <opt.icon size={36} weight={formData.facilidades[opt.id] ? "fill" : "duotone"} className="group-hover:scale-110 transition-transform duration-500" />
                      <div className="font-black text-[9px] uppercase tracking-[0.25em] text-center leading-tight">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 7 && (
              <motion.div key="s7" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-[35px] flex items-center justify-center text-emerald-500 border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/10 animate-spring-up">
                    <CheckCircle size={48} weight="bold" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black font-display tracking-tighter text-white leading-none">Status: Pronto</h2>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-3">Manifesto Operacional Sincronizado</p>
                  </div>
                </div>

                <div className="glass border-2 border-white/5 rounded-[48px] p-10 space-y-6 relative overflow-hidden group">
                  <div className="flex justify-between items-center border-b border-white/5 pb-5">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identidade Unit</span>
                    <span className="font-black font-display text-2xl text-blue-500 tracking-tight">#{formData.numero || '----'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-5">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Capacidade Total</span>
                    <span className="font-black font-display text-lg text-white tracking-tight">{formData.assentos || '--'} Poltronas</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-5">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Grid de Reserva</span>
                    <span className="font-black font-display text-[10px] uppercase tracking-widest text-white">{formData.temNumeracao ? 'Ativado' : 'Automático'}</span>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Módulos de Hardware</span>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(formData.facilidades).map(([k, v]) => v && (
                        <div key={k} className="px-4 py-2 glass rounded-2xl text-[8px] font-black uppercase tracking-widest border border-blue-500/20 text-blue-400">
                          {k.replace('arCondicionado', 'Climate Control').replace('wifi', 'Starlink').replace('acessibilidade', 'PCD Access')}
                        </div>
                      ))}
                      {!Object.values(formData.facilidades).some(Boolean) && <span className="text-[10px] font-black text-zinc-800 uppercase">Configuração Base</span>}
                    </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors duration-700" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="py-12 mt-auto">
          <button
            onClick={() => {
              if (step === 7) {
                console.log('[DEBUG] Persistindo novo registro de host no backend:', formData);
                navigate('/selecionar-veiculo');
              } else {
                handleNext();
              }
            }}
            disabled={!isStepValid()}
            className={cn(
              "w-full h-24 rounded-[40px] font-black font-display text-sm uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all relative overflow-hidden",
              isStepValid() 
                ? "bg-blue-600 text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-[0.98]" 
                : "bg-zinc-800/50 text-zinc-700 border-2 border-white/5 cursor-not-allowed"
            )}
          >
            <span>{step === 7 ? "Integrar Unidade" : "Próxima Etapa"}</span>
            <CaretRight size={24} weight="bold" />
            
            {isStepValid() && step < 7 && (
               <motion.div 
                 className="absolute inset-0 bg-white/10" 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
               />
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}
