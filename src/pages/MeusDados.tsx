import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, Cpu, Route, Star } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function MeusDados() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    const dados = [
        { icon: User, label: 'Nome completo', value: user?.name ?? '—' },
        { icon: Mail, label: 'Email', value: user?.email ?? '—' },
        { icon: Phone, label: 'Telefone (WhatsApp)', value: user?.phone ?? '—' },
        { icon: Cpu, label: 'CPF', value: user?.cpf ?? '—' },
        { icon: Route, label: 'Linha padrão', value: user?.defaultRouteId ?? '—' },
        { icon: Star, label: 'Função', value: user?.role ?? '—' },
    ]

    return (
        <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
            <div className="sticky top-0 z-20 flex items-center gap-3 px-5 py-4"
                style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/perfil')}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white"
                    style={{ border: '1.5px solid var(--color-border)' }}>
                    <ArrowLeft size={18} style={{ color: 'var(--color-text)' }} />
                </button>
                <h1 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Meus Dados</h1>
            </div>

            <div className="flex-1 px-5 py-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl mb-3"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', fontFamily: 'var(--font-display)' }}>
                        {initials}
                    </div>
                    <p className="text-xs text-center" style={{ color: 'var(--color-text-3)' }}>
                        Para alterar seus dados, entre em contato com o gestor.
                    </p>
                </div>

                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    {dados.map((item, i) => (
                        <div key={i}>
                            <div className="flex items-center gap-4 px-5 py-4">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)' }}>
                                    <item.icon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-text-3)' }}>
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                            {i < dados.length - 1 && (
                                <div className="h-px mx-5" style={{ background: 'var(--color-border)' }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
