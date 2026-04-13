import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Clock, ShieldCheck, CheckSquare, ArrowRight } from 'lucide-react'

export default function Splash() {
    console.log("[DEBUG] Renderizando Splash screen - Layout Original")
    const navigate = useNavigate()

    return (
        <div className="w-full min-h-screen bg-[#0A1A14] relative overflow-hidden flex flex-col font-sans text-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                    src="/fundo.png"
                    alt=""
                    className="w-full h-full object-cover opacity-120 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1A14]/80" />
            </div>

            <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl w-full mx-auto">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-white/5">
                        <Globe size={16} className="text-white" />
                    </div>
                    <span className="text-base font-semibold tracking-wide">Ubus</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
                    <button className="hover:text-white transition-colors">Início</button>
                    <button onClick={() => { console.log("[DEBUG] Navegando para /login a partir da nav"); navigate('/login'); }} className="hover:text-white transition-colors">Entrar</button>
                </nav>
            </header>

            <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl w-full mx-auto px-8 gap-8 lg:gap-24 pb-16">
                <div className="flex flex-col justify-center max-w-xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-12 text-[#F3F4F6]"
                    >
                        Seu aplicativo<br />de mobilidade
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-start gap-4"
                    >
                        <button
                            onClick={() => { console.log("[DEBUG] Navegando para /cadastro"); navigate('/cadastro'); }}
                            className="bg-white text-black font-bold text-base px-8 py-4 rounded-full flex items-center gap-2 hover:bg-white/90 transition-all active:scale-95"
                        >
                            Começar agora <ArrowRight size={18} />
                        </button>
                        <span className="text-sm text-white/60 pl-4">
                            Já tem conta? <button onClick={() => { console.log("[DEBUG] Navegando para /login do texto no final"); navigate('/login'); }} className="text-white underline hover:text-white/80 font-medium">Entrar</button>
                        </span>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex-[0.8] right-0 relative flex justify-center lg:justify-end"
                >
                    <img
                        src="/celular.png"
                        alt="Ubus Digital Ticket no Celular"
                        className="max-w-[340px] md:max-w-[400px] w-full object-contain filter drop-shadow-2xl"
                    />
                </motion.div>
            </main>

            <footer className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-6 max-w-7xl w-full mx-auto text-sm text-white/40">
                <span>© 2026 Ubus — Todos os direitos reservados</span>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white/70 transition-colors">Política de Privacidade</a>
                    <a href="#" className="hover:text-white/70 transition-colors">Termos de Uso</a>
                </div>
            </footer>
        </div>
    )
}
