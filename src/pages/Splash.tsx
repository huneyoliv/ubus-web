import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bus, ArrowRight, GraduationCap, Shield } from 'lucide-react'

const slides = [
    {
        icon: Bus,
        title: 'Seu transporte universitário na palma da mão',
        description: 'Reserve seu assento, acompanhe o ônibus e viaje com tranquilidade.',
        color: 'from-cyan-500 via-blue-500 to-primary',
    },
    {
        icon: GraduationCap,
        title: 'Exclusivo para estudantes',
        description: 'Cadastre-se com sua matrícula e tenha acesso ao transporte gratuito.',
        color: 'from-violet-500 via-purple-500 to-indigo-600',
    },
    {
        icon: Shield,
        title: 'Bilhete digital antifraude',
        description: 'Seu bilhete é gerado em tempo real. Seguro e impossível de falsificar.',
        color: 'from-emerald-500 via-green-500 to-teal-600',
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
        }, 3000)
        return () => clearInterval(timer)
    }, [autoPlay])

    const slide = slides[current]
    const Icon = slide.icon

    return (
        <div className="w-full max-w-md mx-auto min-h-screen relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-gradient-to-br ${slide.color}`}
                />
            </AnimatePresence>

            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

            <div className="relative flex-1 flex flex-col items-center justify-center px-8 text-center z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
                            <Icon size={40} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-white text-3xl font-bold leading-tight mb-4 tracking-tight">
                            {slide.title}
                        </h1>
                        <p className="text-white/80 text-base leading-relaxed max-w-xs">
                            {slide.description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative z-10 px-8 pb-12 flex flex-col items-center gap-8">
                <div className="flex gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { setCurrent(i); setAutoPlay(false) }}
                            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'
                                }`}
                        />
                    ))}
                </div>

                <div className="flex w-full gap-3">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex-1 py-4 rounded-xl bg-white/20 backdrop-blur-sm text-white text-base font-semibold transition-all active:scale-[0.98] hover:bg-white/30"
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => navigate('/cadastro')}
                        className="flex-1 py-4 rounded-xl bg-white text-slate-900 text-base font-bold shadow-lg transition-all active:scale-[0.98] hover:bg-white/90 flex items-center justify-center gap-2"
                    >
                        Cadastrar
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
