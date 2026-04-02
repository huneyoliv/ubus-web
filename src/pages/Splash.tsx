import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bus, ArrowRight, GraduationCap, Shield } from 'lucide-react'

const slides = [
    {
        icon: Bus,
        title: 'Seu transporte\nuniversitário',
        description: 'Reserve seu assento, acompanhe o ônibus e viaje com tranquilidade.',
        gradient: 'from-blue-600 via-blue-500 to-cyan-400',
        bg: 'from-slate-950 via-blue-950 to-slate-900',
        tag: 'Mobilidade',
    },
    {
        icon: GraduationCap,
        title: 'Exclusivo para\nestudantes',
        description: 'Cadastre-se com sua matrícula e tenha acesso ao transporte gratuito.',
        gradient: 'from-violet-600 via-purple-500 to-fuchsia-400',
        bg: 'from-slate-950 via-violet-950 to-slate-900',
        tag: 'Educação',
    },
    {
        icon: Shield,
        title: 'Bilhete digital\nantifraude',
        description: 'Seu bilhete é gerado em tempo real. Seguro e impossível de falsificar.',
        gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
        bg: 'from-slate-950 via-emerald-950 to-slate-900',
        tag: 'Segurança',
    },
]

export default function Splash() {
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    const [autoPlay, setAutoPlay] = useState(true)

    useEffect(() => {
        if (!autoPlay) return
        const timer = setInterval(() => {
            setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : prev))
        }, 3500)
        return () => clearInterval(timer)
    }, [autoPlay])

    const slide = slides[current]
    const Icon = slide.icon

    return (
        <div className="w-full min-h-dvh relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
                />
            </AnimatePresence>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />
                <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full opacity-15 blur-2xl"
                    style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
                <div className="absolute top-1/2 right-8 w-2 h-2 rounded-full bg-white/20" />
                <div className="absolute top-1/3 left-12 w-1 h-1 rounded-full bg-white/30" />
                <div className="absolute bottom-1/3 right-24 w-1.5 h-1.5 rounded-full bg-white/15" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col max-w-xl mx-auto w-full px-6 md:px-8">
                <div className="pt-14 pb-6">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg"
                            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.12)' }}>
                            <Bus size={16} className="text-white" />
                        </div>
                        <span className="text-white/70 text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>ubus.me</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-8"
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Icon size={12} className="text-white/70" />
                                <span className="text-white/70 text-xs font-semibold tracking-wide">{slide.tag}</span>
                            </div>

                            <h1 className="text-white text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-5"
                                style={{ fontFamily: 'var(--font-display)', whiteSpace: 'pre-line' }}>
                                {slide.title}
                            </h1>
                            <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-sm">
                                {slide.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="pb-12 flex flex-col gap-8">
                    <div className="flex gap-1.5">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setCurrent(i); setAutoPlay(false) }}
                                className="h-1 rounded-full transition-all duration-500"
                                style={{
                                    width: i === current ? '2rem' : '0.4rem',
                                    background: i === current ? 'white' : 'rgba(255,255,255,0.25)',
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/cadastro')}
                            className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl text-slate-900 font-bold text-base transition-all active:scale-[0.98] hover:opacity-95"
                            style={{
                                background: 'white',
                                fontFamily: 'var(--font-display)',
                                boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3)',
                            }}
                        >
                            Começar agora
                            <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl text-white font-semibold text-base transition-all active:scale-[0.98]"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(8px)',
                                fontFamily: 'var(--font-display)',
                            }}
                        >
                            Já tenho conta
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-white/30">
                        <span className="text-xs">© {new Date().getFullYear()} Ubus — Todos os direitos reservados</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
