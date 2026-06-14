import { motion } from 'framer-motion'
import { ArrowRight, Check, Activity, TrendingUp, Target, Users, Shield, Zap, Instagram } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="w-full min-h-screen bg-[#F0F4FF] relative overflow-hidden flex flex-col font-sans text-[#0F172A]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2563EB]/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#7C3AED]/5 blur-[150px]" />
            </div>

            <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl w-full mx-auto">
                <div className="flex items-center gap-2">
                    <img src="/logo-v2.png" alt="Ubus Logo" className="h-10 w-auto" />
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#64748B]">
                    <a href="#inicio" className="hover:text-[#2563EB] transition-colors">Início</a>
                    <a href="#recursos" className="hover:text-[#2563EB] transition-colors">Recursos</a>
                    <a href="#precos" className="hover:text-[#2563EB] transition-colors">Planos</a>
                    <a href="#contato" className="hover:text-[#2563EB] transition-colors">Contato</a>
                </nav>

                <div>
                    <a href="/manager" className="px-5 py-2.5 rounded-full border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] text-sm font-bold transition-all text-[#0F172A] bg-white shadow-sm">
                        Entrar
                    </a>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-6 py-12 gap-24">
                <section id="inicio" className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full py-6">
                    <div className="flex flex-col justify-center max-w-xl flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 text-[#0F172A]"
                        >
                            Gerencie sua frota <span className="font-serif italic font-normal text-[#64748B]">com confiança</span> e controle em cada viagem
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-lg text-[#64748B] mb-8 leading-relaxed"
                        >
                            Otimize rotas, reduza custos operacionais e ofereça reservas sob demanda com a plataforma mais completa de mobilidade inteligente.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <a
                                href="#contato"
                                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-base px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md text-center"
                            >
                                Solicitar Demonstração <ArrowRight size={18} />
                            </a>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex-1 relative flex justify-center lg:justify-end w-full"
                    >
                        <div className="relative w-full max-w-[420px]">
                            <div className="absolute inset-0 bg-[#2563EB]/5 rounded-3xl filter blur-3xl opacity-30" />
                            <img
                                src="/hero_phone_hand.png"
                                alt="Ubus Dashboard App"
                                className="relative w-full object-contain rounded-2xl"
                            />
                        </div>
                    </motion.div>
                </section>

                <section id="recursos" className="w-full py-12 border-t border-[#E2E8F0]">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] text-xs font-bold uppercase tracking-wider mb-4">Recursos</span>
                        <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">Veja sua operação com clareza em um só lugar</h2>
                        <p className="text-lg text-[#64748B]">Monitore rotas, controle financeiro e gerencie passageiros com total transparência e sem complicações.</p>
                    </div>

                    <div className="space-y-24">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="flex-1 max-w-xl">
                                <h3 className="text-3xl font-extrabold mb-4 text-[#0F172A]">Acompanhe sua frota</h3>
                                <p className="text-[#64748B] mb-8 leading-relaxed">
                                    Tudo em uma única tela. Monitore seus veículos, rotas escolares e universitárias e garanta a ocupação ideal de cada linha.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3 text-[#64748B]">
                                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#2563EB] flex items-center justify-center mt-1 shrink-0"><Target size={12} /></div>
                                        <span>Monitore a rota e localização dos veículos em tempo real</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#64748B]">
                                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#2563EB] flex items-center justify-center mt-1 shrink-0"><Activity size={12} /></div>
                                        <span>Acompanhe a taxa de ocupação e evite superlotação</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#64748B]">
                                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#2563EB] flex items-center justify-center mt-1 shrink-0"><Users size={12} /></div>
                                        <span>Gere relatórios automatizados de passageiros transportados</span>
                                    </li>
                                </ul>
                                <a href="#contato" className="inline-block px-6 py-3 bg-white border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] font-bold text-sm rounded-full transition-all text-[#0F172A]">
                                    Ver Ocupação
                                </a>
                            </div>
                            <div className="flex-1 w-full flex justify-center lg:justify-end">
                                <div className="w-full max-w-[400px] bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xs font-bold text-[#94A3B8] uppercase">Pontualidade da Frota</span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">+24%</span>
                                    </div>
                                    <div className="text-4xl font-extrabold text-[#0F172A] mb-6">94.8%</div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-[#64748B] mb-1">
                                                <span>Rotas Concluídas</span>
                                                <span>78%</span>
                                            </div>
                                            <div className="w-full h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#2563EB]" style={{ width: '78%' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-[#64748B] mb-1">
                                                <span>Ocupação Média</span>
                                                <span>60%</span>
                                            </div>
                                            <div className="w-full h-2 bg-[#F0F4FF] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#0F172A]" style={{ width: '60%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
                            <div className="flex-1 max-w-xl">
                                <h3 className="text-3xl font-extrabold mb-4 text-[#0F172A]">Otimize seus custos</h3>
                                <p className="text-[#64748B] mb-8 leading-relaxed">
                                    Reduza gastos operacionais. Monitore o consumo de combustível, quilometragem rodada e a eficiência de cada trajeto.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3 text-[#64748B]">
                                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#2563EB] flex items-center justify-center mt-1 shrink-0"><TrendingUp size={12} /></div>
                                        <span>Monitore o custo por km de cada veículo da frota</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#64748B]">
                                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#2563EB] flex items-center justify-center mt-1 shrink-0"><Check size={12} /></div>
                                        <span>Identifique gargalos e reduza o desperdício de combustível</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#64748B]">
                                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#2563EB] flex items-center justify-center mt-1 shrink-0"><Shield size={12} /></div>
                                        <span>Planeje rotas inteligentes para reduzir a quilometragem</span>
                                    </li>
                                </ul>
                                <a href="#contato" className="inline-block px-6 py-3 bg-white border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] font-bold text-sm rounded-full transition-all text-[#0F172A]">
                                    Ver Economia
                                </a>
                            </div>
                            <div className="flex-1 w-full flex justify-center lg:justify-start">
                                <div className="w-full max-w-[400px] bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xs font-bold text-[#94A3B8] uppercase">Economia Mensal</span>
                                        <span className="text-sm font-bold text-[#2563EB]">-18%</span>
                                    </div>
                                    <div className="h-40 w-full relative">
                                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                                                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M 0,35 Q 20,25 40,20 T 80,10 T 100,5 L 100,40 L 0,40 Z" fill="url(#gradient)" />
                                            <path d="M 0,35 Q 20,25 40,20 T 80,10 T 100,5" fill="none" stroke="#2563EB" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="flex-1 max-w-xl">
                                <h3 className="text-3xl font-extrabold mb-4 text-[#0F172A]">Alertas em tempo real</h3>
                                <p className="text-[#64748B] mb-8 leading-relaxed">
                                    Foque nos eventos críticos da operação. Receba notificações instantâneas sobre desvios de rota, velocidade ou problemas mecânicos.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3 text-[#64748B]">
                                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#2563EB] flex items-center justify-center mt-1 shrink-0"><Zap size={12} /></div>
                                        <span>Alertas imediatos de atrasos e paradas não autorizadas</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#64748B]">
                                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#2563EB] flex items-center justify-center mt-1 shrink-0"><Check size={12} /></div>
                                        <span>Comunicação direta bidirecional com os motoristas</span>
                                    </li>
                                </ul>
                                <a href="#contato" className="inline-block px-6 py-3 bg-white border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] font-bold text-sm rounded-full transition-all text-[#0F172A]">
                                    Ver Alertas
                                </a>
                            </div>
                            <div className="flex-1 w-full flex justify-center lg:justify-end">
                                <div className="w-full max-w-[400px] bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-[#F0F4FF] border-t-[#2563EB] flex items-center justify-center mb-6 relative">
                                        <span className="text-xl font-extrabold text-[#0F172A]">99%</span>
                                    </div>
                                    <p className="text-sm font-semibold text-[#64748B] max-w-[240px]">Redução de incidentes e atrasos operacionais reportados.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="precos" className="w-full py-12 border-t border-[#E2E8F0]">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] text-xs font-bold uppercase tracking-wider mb-4">Preços</span>
                        <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">Planos que acompanham sua frota</h2>
                        <p className="text-lg text-[#64748B]">Escolha a melhor opção para a gestão de transporte do seu município ou empresa.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-[#F0F4FF] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">Plano Standard</span>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-5xl font-extrabold text-[#0F172A]">Grátis</span>
                                    <span className="text-sm font-semibold text-[#94A3B8]"> / 30 dias</span>
                                </div>
                                <p className="text-[#64748B] text-sm mb-8">Ideal para testar a plataforma e planejar a roteirização de pequenas operações.</p>
                                <ul className="space-y-4 mb-8">
                                    {['Até 3 ônibus monitorados', 'Acesso básico ao painel do gestor', 'Aplicativo do motorista integrado', 'Suporte por e-mail em horário comercial'].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-[#64748B]">
                                            <Check size={16} className="text-[#2563EB] shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <a href="#contato" className="w-full py-3.5 border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] text-sm font-bold rounded-xl transition-all text-[#0F172A] text-center bg-white">
                                Começar Teste
                            </a>
                        </div>

                        <div className="bg-white border border-[#2563EB] rounded-3xl p-8 shadow-sm flex flex-col justify-between relative">
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-bold uppercase">Recomendado</div>
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider mb-6">Plano Profissional</span>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-5xl font-extrabold text-[#0F172A]">R$ 120</span>
                                    <span className="text-sm font-semibold text-[#94A3B8]">/ veículo / mês</span>
                                </div>
                                <p className="text-[#64748B] text-sm mb-8">Controle total e escalabilidade. Projetado para frotas maiores e municípios com alta demanda escolar.</p>
                                <ul className="space-y-4 mb-8">
                                    {['Veículos e rotas ilimitados', 'Roteirização inteligente otimizada por IA', 'Aplicativos completos para motorista e aluno', 'Suporte prioritário 24/7 com SLA'].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-[#64748B]">
                                            <Check size={16} className="text-[#2563EB] shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <a href="#contato" className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-xl transition-all shadow-sm text-center">
                                Solicitar Demonstração
                            </a>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 border-t border-[#E2E8F0] flex flex-col items-center gap-16">
                    <div className="w-full max-w-4xl">
                        <img
                            src="/phone_mockups_group.png"
                            alt="Mockups de celulares Ubus"
                            className="w-full object-contain rounded-2xl"
                        />
                    </div>

                    <div className="max-w-2xl text-center flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mb-6 bg-blue-100 flex items-center justify-center text-[#2563EB] text-sm font-bold">
                            CS
                        </div>
                        <blockquote className="text-xl font-medium text-[#0F172A] leading-relaxed mb-6">
                            "A plataforma Ubus nos ajuda a entender a nossa operação de transporte com muito mais clareza. O monitoramento em tempo real e a roteirização otimizada facilitaram a mobilidade diária dos nossos alunos."
                        </blockquote>
                        <cite className="not-italic">
                            <span className="block font-bold text-sm text-[#0F172A]">Consélio Souza</span>
                            <span className="block text-xs font-semibold text-[#94A3B8]">Secretário dos Transportes</span>
                        </cite>
                    </div>
                </section>

                <section id="insights" className="w-full py-12 border-t border-[#E2E8F0]">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] text-xs font-bold uppercase tracking-wider mb-4">Novidades</span>
                        <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">Insights, guias e ideias para melhorar sua operação</h2>
                        <p className="text-lg text-[#64748B]">Acompanhe as últimas novidades e técnicas de gestão de frotas preparadas pelos nossos especialistas.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden bg-gray-100">
                                <img src="/blog_image_1.png" alt="Otimização de consumo" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold">Dicas</span>
                                    <span className="text-xs text-[#94A3B8]">Por Alexandre Sousa</span>
                                </div>
                                <h4 className="text-lg font-bold text-[#0F172A] mb-4 hover:text-[#2563EB] transition-colors cursor-pointer">
                                    Como reduzir o consumo de combustível da frota em até 20%
                                </h4>
                                <span className="text-xs font-semibold text-[#94A3B8]">12 de Outubro, 2026</span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden bg-gray-100">
                                <img src="/blog_image_2.png" alt="Roteirização por IA" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">Tecnologia</span>
                                    <span className="text-xs text-[#94A3B8]">Por Sara Santos</span>
                                </div>
                                <h4 className="text-lg font-bold text-[#0F172A] mb-4 hover:text-[#2563EB] transition-colors cursor-pointer">
                                    O papel da IA na otimização do transporte universitário
                                </h4>
                                <span className="text-xs font-semibold text-[#94A3B8]">12 de Outubro, 2026</span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden bg-gray-100">
                                <img src="/blog_image_3.png" alt="Manutenção preventiva" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-xs font-bold">Segurança</span>
                                    <span className="text-xs text-[#94A3B8]">Por Davi Lima</span>
                                </div>
                                <h4 className="text-lg font-bold text-[#0F172A] mb-4 hover:text-[#2563EB] transition-colors cursor-pointer">
                                    Manual de segurança e manutenção preventiva para ônibus
                                </h4>
                                <span className="text-xs font-semibold text-[#94A3B8]">8 de Outubro, 2026</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-16 px-8 rounded-3xl bg-[#0F172A] text-white relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 relative z-10 max-w-2xl">
                        Evolua a gestão do transporte coletivo com a Ubus
                    </h2>
                    <p className="text-white/70 text-lg mb-8 relative z-10 max-w-xl">
                        Acompanhe rotas, otimize o consumo da frota e garanta pontualidade e segurança para os alunos.
                    </p>
                    <a href="#contato" className="px-8 py-4 bg-white hover:bg-white/90 text-[#0F172A] font-bold text-base rounded-full transition-all active:scale-95 mb-16 relative z-10">
                        Começar Agora
                    </a>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl relative z-10 border-t border-white/10 pt-12">
                        <div>
                            <div className="text-3xl font-extrabold mb-1">14.5K</div>
                            <div className="text-xs font-semibold text-white/50 uppercase">Alunos Atendidos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold mb-1">8.2K</div>
                            <div className="text-xs font-semibold text-white/50 uppercase">Viagens Mensais</div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold mb-1">12.3K</div>
                            <div className="text-xs font-semibold text-white/50 uppercase">Km Otimizados</div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold mb-1">350+</div>
                            <div className="text-xs font-semibold text-white/50 uppercase">Ônibus Monitorados</div>
                        </div>
                    </div>
                </section>

                <section id="contato" className="w-full py-16 flex flex-col items-center border-t border-[#E2E8F0]">
                    <div className="max-w-xl text-center mb-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-4">Contato</span>
                        <h2 className="text-3xl font-extrabold text-[#0F172A] mb-4">Traga a Ubus para sua cidade ou empresa</h2>
                        <p className="text-[#64748B]">Preencha o formulário abaixo e receba o contato de um de nossos especialistas em mobilidade.</p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md space-y-4 bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
                        <div>
                            <label className="block text-xs font-bold text-[#64748B] uppercase mb-2">Nome Completo</label>
                            <input
                                type="text"
                                placeholder="Seu nome"
                                className="w-full px-4 py-3 bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl focus:border-[#2563EB] focus:outline-none transition-colors text-[#0F172A] text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#64748B] uppercase mb-2">E-mail Corporativo</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                className="w-full px-4 py-3 bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl focus:border-[#2563EB] focus:outline-none transition-colors text-[#0F172A] text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#64748B] uppercase mb-2">Empresa / Município</label>
                            <input
                                type="text"
                                placeholder="Nome da instituição ou cidade"
                                className="w-full px-4 py-3 bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl focus:border-[#2563EB] focus:outline-none transition-colors text-[#0F172A] text-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-sm shadow-[#2563EB]/10 cursor-pointer text-sm"
                        >
                            Falar com um Consultor
                        </button>
                    </form>
                </section>
            </main>

            <footer className="relative z-10 bg-white border-t border-[#E2E8F0] pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
                    <div className="md:col-span-1">
                        <img src="/logo-v2.png" alt="Ubus Logo" className="h-10 w-auto mb-4" />
                        <p className="text-sm text-[#64748B] leading-relaxed">
                            Tecnologia inteligente para otimização e gestão do transporte coletivo escolar e universitário.
                        </p>
                    </div>

                    <div>
                        <h5 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider mb-4">Soluções</h5>
                        <ul className="space-y-3 text-sm font-semibold text-[#64748B]">
                            <li><a href="#recursos" className="hover:text-[#2563EB] transition-colors">Recursos</a></li>
                            <li><a href="#precos" className="hover:text-[#2563EB] transition-colors">Preços</a></li>
                            <li><a href="#contato" className="hover:text-[#2563EB] transition-colors">Contato</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider mb-4">Funcionalidades</h5>
                        <ul className="space-y-3 text-sm font-semibold text-[#64748B]">
                            <li><a href="#recursos" className="hover:text-[#2563EB] transition-colors">Gestão de Frotas</a></li>
                            <li><a href="#recursos" className="hover:text-[#2563EB] transition-colors">Otimização de Rotas</a></li>
                            <li><a href="#recursos" className="hover:text-[#2563EB] transition-colors">Aplicativo do Aluno</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider mb-4">Social</h5>
                        <ul className="space-y-3 text-sm font-semibold text-[#64748B]">
                            <li>
                                <a
                                    href="https://instagram.com/ubusmobi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-[#2563EB] transition-colors"
                                >
                                    <Instagram size={14} /> @ubusmobi
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#94A3B8]">
                    <span>© 2026 Ubus. Todos os direitos reservados.</span>
                    <div className="flex items-center gap-6 mt-4 md:mt-0 font-semibold text-[#64748B]">
                        <a href="#" className="hover:text-[#2563EB] transition-colors">Política de Privacidade</a>
                        <a href="#" className="hover:text-[#2563EB] transition-colors">Termos de Uso</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
