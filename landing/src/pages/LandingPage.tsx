import { motion } from 'framer-motion'
import { ArrowRight, Check, Activity, TrendingUp, Target, Users, Shield, Zap, ExternalLink } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="w-full min-h-screen bg-[#FAFAFA] relative overflow-hidden flex flex-col font-sans text-[#0F172A]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#7C3AED]/5 blur-[150px]" />
            </div>

            <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl w-full mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold text-lg">S</div>
                    <span className="text-xl font-bold tracking-tight text-[#0F172A]">Salez</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4B5563]">
                    <a href="#inicio" className="hover:text-[#F97316] transition-colors">Início</a>
                    <a href="#recursos" className="hover:text-[#F97316] transition-colors">Recursos</a>
                    <a href="#precos" className="hover:text-[#F97316] transition-colors">Preços</a>
                    <a href="#insights" className="hover:text-[#F97316] transition-colors">Insights</a>
                </nav>

                <div>
                    <a href="#login" className="px-5 py-2.5 rounded-full border border-[#E5E7EB] hover:border-[#0F172A] text-sm font-bold transition-all text-[#0F172A]">
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
                            Impulsione o crescimento <span className="font-serif italic font-normal text-[#4B5563]">com confiança</span> e insights em cada etapa
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-lg text-[#4B5563] mb-8 leading-relaxed"
                        >
                            Entenda processos, encontre detalhes na construção de itens, recursos e negócios com clareza, flexibilidade e dinamismo total.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <a
                                href="#cadastro"
                                className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-base px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md text-center"
                            >
                                Começar Agora <ArrowRight size={18} />
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
                            <div className="absolute inset-0 bg-[#F97316]/5 rounded-3xl filter blur-3xl opacity-30" />
                            <img
                                src="/hero_phone_hand.png"
                                alt="Salez Dashboard App"
                                className="relative w-full object-contain rounded-2xl"
                            />
                        </div>
                    </motion.div>
                </section>

                <section id="recursos" className="w-full py-12 border-t border-[#E5E7EB]">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563] text-xs font-bold uppercase tracking-wider mb-4">Recursos</span>
                        <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">Veja seus negócios claramente em um só lugar</h2>
                        <p className="text-lg text-[#4B5563]">Monitore e controle recursos, ativos e saldo em um único painel. E desenvolva seus negócios sem atritos ou ajustes complexos.</p>
                    </div>

                    <div className="space-y-24">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="flex-1 max-w-xl">
                                <h3 className="text-3xl font-extrabold mb-4 text-[#0F172A]">Acompanhe suas metas</h3>
                                <p className="text-[#4B5563] mb-8 leading-relaxed">
                                    Tudo em uma única página. Tudo o que você precisa para acompanhar seus negócios e fazê-los fluir sem obstáculos.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3 text-[#4B5563]">
                                        <div className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#F97316] flex items-center justify-center mt-1 shrink-0"><Target size={12} /></div>
                                        <span>Aumente as metas, acompanhe visões mensais e em grupo</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#4B5563]">
                                        <div className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#F97316] flex items-center justify-center mt-1 shrink-0"><Activity size={12} /></div>
                                        <span>Registre marcos e gerencie o acompanhamento de projetos</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#4B5563]">
                                        <div className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#F97316] flex items-center justify-center mt-1 shrink-0"><Users size={12} /></div>
                                        <span>Recursos de colaboração instantânea e insights em tempo real</span>
                                    </li>
                                </ul>
                                <button className="px-6 py-3 border border-[#E5E7EB] hover:border-[#0F172A] font-bold text-sm rounded-full transition-all text-[#0F172A]">
                                    Ver Metas
                                </button>
                            </div>
                            <div className="flex-1 w-full flex justify-center lg:justify-end">
                                <div className="w-full max-w-[400px] bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xs font-bold text-[#9CA3AF] uppercase">Checagem de Saldo</span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">+24%</span>
                                    </div>
                                    <div className="text-4xl font-extrabold text-[#0F172A] mb-6">$48,920</div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-[#4B5563] mb-1">
                                                <span>Meta de Receita</span>
                                                <span>78%</span>
                                            </div>
                                            <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#F97316]" style={{ width: '78%' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-[#4B5563] mb-1">
                                                <span>Fluxo de Caixa</span>
                                                <span>60%</span>
                                            </div>
                                            <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#0F172A]" style={{ width: '60%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
                            <div className="flex-1 max-w-xl">
                                <h3 className="text-3xl font-extrabold mb-4 text-[#0F172A]">Entenda seu saldo</h3>
                                <p className="text-[#4B5563] mb-8 leading-relaxed">
                                    Tudo em uma única página. Tudo o que você precisa para acompanhar seus negócios e fazê-los fluir sem obstáculos.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3 text-[#4B5563]">
                                        <div className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#F97316] flex items-center justify-center mt-1 shrink-0"><TrendingUp size={12} /></div>
                                        <span>Visualize fluxos de receita, segmentados por categoria</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#4B5563]">
                                        <div className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#F97316] flex items-center justify-center mt-1 shrink-0"><Check size={12} /></div>
                                        <span>Registre transações mensais e controle o fluxo de caixa</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#4B5563]">
                                        <div className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#F97316] flex items-center justify-center mt-1 shrink-0"><Shield size={12} /></div>
                                        <span>Filtre insights, detalhes e otimize suas despesas</span>
                                    </li>
                                </ul>
                                <button className="px-6 py-3 border border-[#E5E7EB] hover:border-[#0F172A] font-bold text-sm rounded-full transition-all text-[#0F172A]">
                                    Ver Saldo
                                </button>
                            </div>
                            <div className="flex-1 w-full flex justify-center lg:justify-start">
                                <div className="w-full max-w-[400px] bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xs font-bold text-[#9CA3AF] uppercase">Estatísticas Diárias</span>
                                        <span className="text-sm font-bold text-[#F97316]">$48,920</span>
                                    </div>
                                    <div className="h-40 w-full relative">
                                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.2" />
                                                    <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M 0,35 Q 20,25 40,20 T 80,10 T 100,5 L 100,40 L 0,40 Z" fill="url(#gradient)" />
                                            <path d="M 0,35 Q 20,25 40,20 T 80,10 T 100,5" fill="none" stroke="#F97316" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="flex-1 max-w-xl">
                                <h3 className="text-3xl font-extrabold mb-4 text-[#0F172A]">Destaque o que importa</h3>
                                <p className="text-[#4B5563] mb-8 leading-relaxed">
                                    Nenhum filtro é necessário quando você foca no que é importante. Identifique detalhes, encontre padrões e obtenha insights.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3 text-[#4B5563]">
                                        <div className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#F97316] flex items-center justify-center mt-1 shrink-0"><Zap size={12} /></div>
                                        <span>Monitore métricas mensais e mantenha o foco nos marcos</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-[#4B5563]">
                                        <div className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#F97316] flex items-center justify-center mt-1 shrink-0"><Check size={12} /></div>
                                        <span>Nunca perca eventos importantes com notificações de alerta</span>
                                    </li>
                                </ul>
                                <button className="px-6 py-3 border border-[#E5E7EB] hover:border-[#0F172A] font-bold text-sm rounded-full transition-all text-[#0F172A]">
                                    Ver Perfil
                                </button>
                            </div>
                            <div className="flex-1 w-full flex justify-center lg:justify-end">
                                <div className="w-full max-w-[400px] bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-[#F3F4F6] border-t-[#F97316] flex items-center justify-center mb-6 relative">
                                        <span className="text-xl font-extrabold text-[#0F172A]">82%</span>
                                    </div>
                                    <p className="text-sm font-semibold text-[#4B5563] max-w-[240px]">Eles continuam crescendo ao longo do ano com nossa plataforma.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="precos" className="w-full py-12 border-t border-[#E5E7EB]">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563] text-xs font-bold uppercase tracking-wider mb-4">Preços</span>
                        <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">Planos simples e transparentes</h2>
                        <p className="text-lg text-[#4B5563]">Comece gratuitamente e faça o upgrade conforme seu negócio cresce. Sem taxas ocultas, sem complicações cadastrais.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-[#F3F4F6] text-[#0F172A] text-xs font-bold uppercase tracking-wider mb-6">Plano Iniciante</span>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-5xl font-extrabold text-[#0F172A]">$0</span>
                                    <span className="text-sm font-semibold text-[#9CA3AF]">/ Mês</span>
                                </div>
                                <p className="text-[#4B5563] text-sm mb-8">Essencial para projetos pessoais, operações simples e pequenas equipes começarem sem custos de infraestrutura.</p>
                                <ul className="space-y-4 mb-8">
                                    {['10 áreas de trabalho de projeto', 'Todas as integrações e insights básicos', 'Atualizações e notificações em tempo real', 'Suporte ao cliente 24/7'].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-[#4B5563]">
                                            <Check size={16} className="text-[#F97316] shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="w-full py-3.5 border border-[#E5E7EB] hover:border-[#0F172A] text-sm font-bold rounded-xl transition-all text-[#0F172A]">
                                Criar Conta
                            </button>
                        </div>

                        <div className="bg-white border border-[#0F172A] rounded-3xl p-8 shadow-sm flex flex-col justify-between relative">
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#F97316] text-white text-xs font-bold uppercase">Recomendado</div>
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider mb-6">Plano Enterprise</span>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-5xl font-extrabold text-[#0F172A]">$120</span>
                                    <span className="text-sm font-semibold text-[#9CA3AF]">/ Mês</span>
                                </div>
                                <p className="text-[#4B5563] text-sm mb-8">Ferramentas avançadas e escalabilidade completa. Projetado para equipes maiores e empresas que exigem suporte premium.</p>
                                <ul className="space-y-4 mb-8">
                                    {['Áreas de trabalho ilimitadas', 'Integrações premium ilimitadas', 'Relatórios personalizados e análises completas', 'Suporte prioritário com SLA garantido'].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-[#4B5563]">
                                            <Check size={16} className="text-[#F97316] shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                                Começar Agora
                            </button>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 border-t border-[#E5E7EB] flex flex-col items-center gap-16">
                    <div className="w-full max-w-4xl">
                        <img
                            src="/phone_mockups_group.png"
                            alt="Mockups de celulares"
                            className="w-full object-contain rounded-2xl"
                        />
                    </div>

                    <div className="max-w-2xl text-center flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mb-6 bg-gray-200">
                            <div className="w-full h-full bg-[#0F172A] flex items-center justify-center text-white text-xs font-bold">SL</div>
                        </div>
                        <blockquote className="text-xl font-medium text-[#0F172A] leading-relaxed mb-6">
                            "Esta plataforma nos ajuda a entender nossos negócios com muito mais clareza. Os insights parecem simples, relevantes e fáceis de agir à medida que crescemos dia após dia."
                        </blockquote>
                        <cite className="not-italic">
                            <span className="block font-bold text-sm text-[#0F172A]">Stacy Long</span>
                            <span className="block text-xs font-semibold text-[#9CA3AF]">Product Owner na Netbook</span>
                        </cite>
                    </div>
                </section>

                <section id="insights" className="w-full py-12 border-t border-[#E5E7EB]">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563] text-xs font-bold uppercase tracking-wider mb-4">Insights</span>
                        <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">Insights, guias e ideias para expandir seu negócio</h2>
                        <p className="text-lg text-[#4B5563]">Aprenda com nossa equipe de especialistas, desenvolvedores e parceiros com guias claros e fáceis de seguir.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden bg-gray-100">
                                <img src="/blog_image_1.png" alt="Workshop" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">Workshops</span>
                                    <span className="text-xs text-[#9CA3AF]">Por Alex Johnson</span>
                                </div>
                                <h4 className="text-lg font-bold text-[#0F172A] mb-4 hover:text-[#F97316] transition-colors cursor-pointer">
                                    Como acompanhar o progresso das metas
                                </h4>
                                <span className="text-xs font-semibold text-[#9CA3AF]">12 de Outubro, 2026</span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden bg-gray-100">
                                <img src="/blog_image_2.png" alt="Team meeting" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">Insights</span>
                                    <span className="text-xs text-[#9CA3AF]">Por Sarah Dev</span>
                                </div>
                                <h4 className="text-lg font-bold text-[#0F172A] mb-4 hover:text-[#F97316] transition-colors cursor-pointer">
                                    Modelos e Templates de Crescimento
                                </h4>
                                <span className="text-xs font-semibold text-[#9CA3AF]">12 de Outubro, 2026</span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden bg-gray-100">
                                <img src="/blog_image_3.png" alt="Whiteboard" className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">Tutoriais</span>
                                    <span className="text-xs text-[#9CA3AF]">Por David Lee</span>
                                </div>
                                <h4 className="text-lg font-bold text-[#0F172A] mb-4 hover:text-[#F97316] transition-colors cursor-pointer">
                                    Entendendo a Performance de Equipe
                                </h4>
                                <span className="text-xs font-semibold text-[#9CA3AF]">8 de Outubro, 2026</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button className="px-8 py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                            Ver todos os posts
                        </button>
                    </div>
                </section>

                <section className="w-full py-16 px-8 rounded-3xl bg-[#0F172A] text-white relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 relative z-10 max-w-2xl">
                        Vamos crescer com confiança, apoiados por insights reais
                    </h2>
                    <p className="text-white/70 text-lg mb-8 relative z-10 max-w-xl">
                        Acompanhe, analise e otimize seus negócios com uma plataforma construída para impulsionar o seu crescimento.
                    </p>
                    <button className="px-8 py-4 bg-white hover:bg-white/90 text-[#0F172A] font-bold text-base rounded-full transition-all active:scale-95 mb-16 relative z-10">
                        Começar Agora
                    </button>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl relative z-10 border-t border-white/10 pt-12">
                        <div>
                            <div className="text-3xl font-extrabold mb-1">14.5K</div>
                            <div className="text-xs font-semibold text-white/50 uppercase">Usuários Ativos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold mb-1">8.2K</div>
                            <div className="text-xs font-semibold text-white/50 uppercase">Clientes</div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold mb-1">12.3K</div>
                            <div className="text-xs font-semibold text-white/50 uppercase">Projetos</div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold mb-1">350+</div>
                            <div className="text-xs font-semibold text-white/50 uppercase">Integrações</div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 bg-white border-t border-[#E5E7EB] pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center text-white font-bold text-lg">S</div>
                            <span className="text-xl font-bold tracking-tight text-[#0F172A]">Salez</span>
                        </div>
                        <p className="text-sm text-[#4B5563] leading-relaxed">
                            Impulsione o crescimento com confiança e insights em cada etapa do seu negócio.
                        </p>
                    </div>

                    <div>
                        <h5 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider mb-4">Uso</h5>
                        <ul className="space-y-3 text-sm font-semibold text-[#4B5563]">
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">Recursos</a></li>
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">Preços</a></li>
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">Clientes</a></li>
                            <li><a href="#" className="hover:text-[#F97316] transition-colors flex items-center gap-1">Demonstrações <ExternalLink size={12} /></a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider mb-4">Recursos</h5>
                        <ul className="space-y-3 text-sm font-semibold text-[#4B5563]">
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">Painel de Acompanhamento</a></li>
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">Planilha de Balanço</a></li>
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">Insights Acionáveis</a></li>
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">Plano Premium</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider mb-4">Mais</h5>
                        <ul className="space-y-3 text-sm font-semibold text-[#4B5563]">
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">Carreiras</a></li>
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">API</a></li>
                            <li><a href="#" className="hover:text-[#F97316] transition-colors">Central de Ajuda</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 border-t border-[#E5E7EB] pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#9CA3AF]">
                    <span>© 2026 Salez. Todos os direitos reservados.</span>
                    <div className="flex items-center gap-6 mt-4 md:mt-0 font-semibold text-[#4B5563]">
                        <a href="#" className="hover:text-[#F97316] transition-colors">Política de Privacidade</a>
                        <a href="#" className="hover:text-[#F97316] transition-colors">Termos de Uso</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
