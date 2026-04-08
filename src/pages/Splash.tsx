import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, ArrowRight, GraduationCap, Shield, RocketLaunch, Sparkle } from 'phosphor-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    icon: RocketLaunch,
    title: 'Mobilidade\nInteligente',
    description: 'A revolução do transporte universitário chegou. Reserve, acompanhe e viaje com tecnologia.',
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    bg: 'from-zinc-950 via-zinc-900 to-zinc-950',
    tag: 'FUTURO',
    accent: 'blue'
  },
  {
    icon: GraduationCap,
    title: 'Exclusivo para\nEstudantes',
    description: 'Sua jornada acadêmica merece o melhor trajeto. Acesso gratuito com sua matrícula.',
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
    bg: 'from-zinc-950 via-purple-950/20 to-zinc-950',
    tag: 'COMUNIDADE',
    accent: 'purple'
  },
  {
    icon: Shield,
    title: 'Segurança\nPrime Rate',
    description: 'Bilhete digital dinâmico e monitoramento em tempo real para sua total tranquilidade.',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
    bg: 'from-zinc-950 via-emerald-950/10 to-zinc-950',
    tag: 'CONFIANÇA',
    accent: 'emerald'
  },
];

export default function Splash() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    console.log('[DEBUG] Splash inicializada, slide atual:', current);
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, [autoPlay, current]);

  const slide = slides[current];


  return (
    <div className="w-full min-h-screen relative overflow-hidden flex flex-col bg-zinc-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={cn("absolute inset-0 bg-gradient-to-br", slide.bg)}
        />
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className={cn(
            "absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full opacity-20 blur-[120px]",
            current === 0 ? "bg-blue-500" : current === 1 ? "bg-purple-500" : "bg-emerald-500"
          )} 
        />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-xl mx-auto w-full px-8">
        <header className="pt-16 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl glass border border-white/10 flex items-center justify-center shadow-2xl">
              <Bus size={20} weight="fill" className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-lg font-display tracking-tighter leading-none">UBUS</span>
              <span className="text-white/30 text-[8px] font-black uppercase tracking-[0.4em]">Prime Edition</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 glass border border-white/10">
                <Sparkle size={12} weight="fill" className={cn(
                  current === 0 ? "text-blue-400" : current === 1 ? "text-purple-400" : "text-emerald-400"
                )} />
                <span className="text-white/60 text-[10px] font-black tracking-[0.2em] uppercase">{slide.tag}</span>
              </div>

              <h1 className="text-white text-6xl font-black leading-[0.9] tracking-tighter mb-6 font-display whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="text-white/40 text-lg leading-relaxed max-w-xs font-medium">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="pb-16 flex flex-col gap-10">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setAutoPlay(false); }}
                className="h-1.5 rounded-full transition-all duration-500 overflow-hidden bg-white/10"
                style={{ width: i === current ? '3rem' : '0.8rem' }}
              >
                {i === current && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                    className="w-full h-full bg-white"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                console.log('[DEBUG] Navegando para cadastro');
                navigate('/cadastro');
              }}
              className="group relative flex items-center justify-center gap-3 w-full h-20 rounded-[32px] bg-white text-zinc-950 font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <span>Começar Jornada</span>
              <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => {
                console.log('[DEBUG] Navegando para login');
                navigate('/login');
              }}
              className="flex items-center justify-center w-full h-18 rounded-[28px] glass border-2 border-white/5 text-white/80 font-black text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
            >
              Acessar minha conta
            </button>
          </div>
        </footer>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-10">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Advanced Mobility Systems · 2024</p>
      </div>
    </div>
  );
}
