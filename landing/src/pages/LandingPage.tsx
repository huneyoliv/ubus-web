import { motion } from 'framer-motion'
import { ArrowRight, Shield, Leaf, TrendingUp, Users, Smartphone, Activity } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="w-full min-h-screen bg-[#030d0a] relative overflow-hidden flex flex-col font-sans text-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px]" />
            </div>

            <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl w-full mx-auto">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Ubus Logo" className="h-10 w-auto" />
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
                    <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
                    <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
                    <a href="#contato" className="hover:text-white transition-colors">Contato</a>
                </nav>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-8 py-16 gap-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 w-full">
                    <div className="flex flex-col justify-center max-w-xl flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs font-semibold mb-6 w-fit"
                        >
                            <Leaf size={12} /> Mobilidade Inteligente & Sustentável
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 text-[#F3F4F6]"
                        >
                            Revolucione a Gestão do Transporte Coletivo
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-base lg:text-lg text-white/70 mb-8 leading-relaxed"
                        >
                            Otimize rotas, reduza custos operacionais e ofereça passagens e reservas sob demanda com a plataforma mais completa de mobilidade inteligente.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                        >
                            <a
                                href="#contato"
                                className="bg-emerald-500 text-[#030d0a] font-bold text-base px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)] text-center"
                            >
                                Solicitar Demonstração <ArrowRight size={18} />
                            </a>
                            <a
                                href="#solucoes"
                                className="border border-white/20 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 text-center"
                            >
                                Conhecer Plataforma
                            </a>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex-1 relative flex justify-center lg:justify-end w-full"
                    >
                        <div className="relative w-full max-w-[340px] md:max-w-[400px]">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl filter blur-3xl opacity-30" />
                            <img
                                src="/celular.png"
                                alt="Ubus App"
                                className="relative w-full object-contain filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] border border-white/10 rounded-[40px] p-2 bg-[#030d0a]/80 backdrop-blur-md"
                            />
                        </div>
                    </motion.div>
                </div>

                <div id="solucoes" className="w-full py-12 border-t border-white/5">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Como a Ubus transforma sua cidade</h2>
                        <p className="text-white/60">Uma solução completa integrada para conectar operadores, motoristas e passageiros de forma inteligente.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Para Passageiros</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Reserva de assentos com antecedência, pagamento via app ou PIX e visualização da rota e horários do ônibus em tempo real.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                                <Smartphone size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Para Motoristas</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Roteirização integrada passo a passo e leitura de QR Code rápida para validação de passagens direto pelo aplicativo de bordo.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Para Gestores</h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Controle de frotas, monitoramento de viagens em tempo real, geração de relatórios de demanda e controle financeiro integrado.
                            </p>
                        </div>
                    </div>
                </div>

                <div id="recursos" className="w-full py-12 border-t border-white/5">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">Tecnologia avançada que impulsiona a mobilidade urbana</h2>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                Nossos algoritmos analisam os dados de transporte para otimizar as linhas, reduzindo o tempo de espera e otimizando a ocupação da frota.
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                                        <Shield size={14} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Segurança de Dados & Operação</h4>
                                        <p className="text-sm text-white/50">Criptografia em todas as transações financeiras e controle rígido de acesso dos operadores.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                                        <TrendingUp size={14} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Otimização Contínua de Rotas</h4>
                                        <p className="text-sm text-white/50">Rotas que se adaptam à demanda dos usuários, gerando economia real de pneus e combustível.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-20" />
                            <div className="relative p-8 rounded-2xl bg-white/[0.01] border border-white/10 backdrop-blur-md">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <span className="text-sm font-medium text-white/60">Taxa de Ocupação da Frota</span>
                                        <span className="text-emerald-400 font-bold">+34%</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                        <span className="text-sm font-medium text-white/60">Redução de Emissões de CO₂</span>
                                        <span className="text-emerald-400 font-bold">-22%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/60">Economia em Combustível</span>
                                        <span className="text-emerald-400 font-bold">-18%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="contato" className="w-full py-16 border-t border-white/5 flex flex-col items-center">
                    <div className="max-w-xl text-center mb-10">
                        <h2 className="text-3xl font-bold mb-4">Traga a Ubus para sua cidade ou empresa</h2>
                        <p className="text-white/60">Preencha o formulário abaixo e receba o contato de um de nossos especialistas em mobilidade.</p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md space-y-4">
                        <input
                            type="text"
                            placeholder="Nome Completo"
                            className="w-full px-5 py-4 bg-white/[0.02] border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-white"
                            required
                        />
                        <input
                            type="email"
                            placeholder="E-mail Corporativo"
                            className="w-full px-5 py-4 bg-white/[0.02] border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-white"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Empresa / Município"
                            className="w-full px-5 py-4 bg-white/[0.02] border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-white"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#030d0a] font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10 cursor-pointer"
                        >
                            Falar com um Consultor
                        </button>
                    </form>
                </div>
            </main>

            <footer className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-6 max-w-7xl w-full mx-auto text-sm text-white/40 border-t border-white/5">
                <span>© 2026 Ubus — Todos os direitos reservados</span>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white/70 transition-colors">Política de Privacidade</a>
                    <a href="#" className="hover:text-white/70 transition-colors">Termos de Uso</a>
                </div>
            </footer>
        </div>
    )
}
