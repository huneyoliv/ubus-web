import { useState, useEffect } from 'react'
import { Search, Check, X, FileText, UserCheck, Loader2, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'

interface PendingUser {
    id: string
    nome: string
    email: string
    cpf: string
    telefone?: string
    role: string
    fotoPerfilUrl?: string
    gradeHorarioUrl?: string
    criadoEm?: string
    idLinhaPadrao?: string
}

export default function ManagerValidations() {
    const [students, setStudents] = useState<PendingUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchPendentes()
    }, [])

    async function fetchPendentes() {
        setLoading(true)
        setError(null)
        try {
            const data = await api.get<PendingUser[]>('/users/pending')
            setStudents(data)
            if (data.length > 0 && !selectedId) setSelectedId(data[0].id)
        } catch {
            setError('Erro ao carregar lista de pendentes.')
        } finally {
            setLoading(false)
        }
    }

    async function handleAction(id: string, status: 'APROVADO' | 'REJEITADO') {
        setActionLoading(true)
        try {
            await api.patch(`/users/${id}/status`, { status })
            setStudents(prev => prev.filter(s => s.id !== id))
            setSelectedId(() => {
                const remaining = students.filter(s => s.id !== id)
                return remaining.length > 0 ? remaining[0].id : null
            })
        } catch {
            alert(status === 'APROVADO' ? 'Erro ao aprovar.' : 'Erro ao reprovar.')
        } finally {
            setActionLoading(false)
        }
    }

    const filtered = students.filter(s =>
        s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.cpf.includes(searchTerm)
    )

    const selected = students.find(s => s.id === selectedId)
    const initials = selected?.nome ? selected.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '?'

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full" style={{ background: 'var(--color-bg)' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8" style={{ background: 'var(--color-bg)' }}>
                <AlertCircle size={32} style={{ color: '#EF4444' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-2)' }}>{error}</p>
                <button onClick={fetchPendentes} className="btn-primary px-6 h-10">Tentar novamente</button>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row h-full overflow-hidden absolute inset-0" style={{ background: 'var(--color-bg)' }}>
            <div className="w-full md:w-[340px] lg:w-[400px] flex flex-col shrink-0 h-[40vh] md:h-full z-10"
                style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
                <div className="p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Fila de Aprovação</h2>
                        <span className="text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide"
                            style={{ background: 'rgba(245,158,11,0.1)', color: '#D97706' }}>
                            {students.length} Pendente{students.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-3)' }} />
                        <input
                            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                            placeholder="Buscar aluno..."
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                            <UserCheck size={28} className="mb-3" style={{ color: 'var(--color-text-3)' }} />
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-2)' }}>
                                {students.length === 0 ? 'Nenhum aluno pendente.' : 'Nenhum resultado encontrado.'}
                            </p>
                        </div>
                    )}
                    {filtered.map(student => (
                        <div
                            key={student.id}
                            onClick={() => setSelectedId(student.id)}
                            className="p-4 cursor-pointer relative transition-colors"
                            style={{
                                borderBottom: '1px solid var(--color-border)',
                                background: selectedId === student.id ? 'rgba(37,99,235,0.04)' : undefined,
                            }}
                        >
                            {selectedId === student.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'var(--color-primary)' }} />
                            )}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm overflow-hidden"
                                        style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)' }}>
                                        {student.fotoPerfilUrl ? (
                                            <img src={student.fotoPerfilUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            student.nome.substring(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{student.nome}</h4>
                                        <p className="text-xs truncate" style={{ color: 'var(--color-text-3)' }}>{student.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-[10px]" style={{ color: 'var(--color-text-3)' }}>
                                        {student.criadoEm ? new Date(student.criadoEm).toLocaleDateString('pt-BR') : '—'}
                                    </span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                                        style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)' }}>
                                        Novo
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-y-auto md:overflow-hidden relative" style={{ background: 'var(--color-bg)' }}>
                {!selected ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <UserCheck size={40} className="mb-4" style={{ color: 'var(--color-text-3)' }} />
                        <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                            {students.length === 0 ? 'Fila vazia!' : 'Selecione um aluno'}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
                            {students.length === 0 ? 'Todos os cadastros foram revisados.' : 'Clique em um aluno na lista para revisar.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 z-10 sticky top-0 md:static"
                            style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                    Revisão de Cadastro
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                                        style={{ background: 'rgba(245,158,11,0.1)', color: '#D97706' }}>Aguardando</span>
                                </h2>
                                <p className="text-sm mt-1" style={{ color: 'var(--color-text-2)' }}>Verifique os dados e aprove ou rejeite a solicitação.</p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={() => handleAction(selected.id, 'REJEITADO')}
                                    disabled={actionLoading}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
                                    style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#DC2626', background: 'rgba(239,68,68,0.04)' }}>
                                    <X className="w-5 h-5" />
                                    Reprovar
                                </button>
                                <button
                                    onClick={() => handleAction(selected.id, 'APROVADO')}
                                    disabled={actionLoading}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-sm"
                                    style={{ background: 'var(--color-success)' }}>
                                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Check className="w-5 h-5" />}
                                    Aprovar
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto md:overflow-hidden">
                            <div className="w-full lg:w-1/3 p-6 flex flex-col gap-6 lg:overflow-y-auto min-w-0"
                                style={{ borderRight: '1px solid var(--color-border)', background: 'rgba(37,99,235,0.01)' }}>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-2xl font-bold overflow-hidden"
                                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white', fontFamily: 'var(--font-display)', border: '4px solid var(--color-surface)', boxShadow: '0 4px 16px -4px rgba(37,99,235,0.3)' }}>
                                        {selected.fotoPerfilUrl ? (
                                            <img src={selected.fotoPerfilUrl} alt="" className="w-full h-full object-cover" />
                                        ) : initials}
                                    </div>
                                    <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{selected.nome}</h3>
                                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-3)' }}>CPF: {selected.cpf}</p>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-3)' }}>Dados Pessoais</h4>
                                        <div className="rounded-xl p-5 space-y-4 shadow-sm"
                                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                            {[
                                                ['Email', selected.email],
                                                ['Telefone', selected.telefone || '—'],
                                                ['Tipo', selected.role],
                                                ['Data Cadastro', selected.criadoEm ? new Date(selected.criadoEm).toLocaleDateString('pt-BR') : '—'],
                                            ].map(([label, value]) => (
                                                <div key={label}>
                                                    <span className="text-xs block" style={{ color: 'var(--color-text-3)' }}>{label}</span>
                                                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-2/3 p-6 flex flex-col gap-4 lg:overflow-y-auto min-w-0">
                                <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-3)' }}>Documentos Anexados</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 md:pb-0">
                                    <div className="flex flex-col rounded-2xl overflow-hidden h-full min-h-[300px]"
                                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                        <div className="p-3 flex items-center justify-between"
                                            style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                                            <span className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                                <UserCheck className="w-4 h-4" style={{ color: 'var(--color-text-3)' }} />
                                                Foto de Perfil
                                            </span>
                                        </div>
                                        <div className="flex-1 p-4 flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
                                            {selected.fotoPerfilUrl ? (
                                                <img src={selected.fotoPerfilUrl} alt="Selfie" className="max-h-full max-w-full object-contain rounded-lg shadow-md" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-center p-6">
                                                    <UserCheck size={32} className="mb-3" style={{ color: 'var(--color-text-3)' }} />
                                                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>Nenhuma foto enviada</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col rounded-2xl overflow-hidden h-full min-h-[300px]"
                                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                        <div className="p-3 flex items-center justify-between"
                                            style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                                            <span className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                                                <FileText className="w-4 h-4" style={{ color: 'var(--color-text-3)' }} />
                                                Grade de Horários
                                            </span>
                                        </div>
                                        <div className="flex-1 p-4 flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
                                            {selected.gradeHorarioUrl ? (
                                                <a href={selected.gradeHorarioUrl} target="_blank" rel="noopener noreferrer"
                                                    className="flex flex-col items-center justify-center text-center p-6">
                                                    <FileText size={32} className="mb-3" style={{ color: 'var(--color-primary)' }} />
                                                    <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>Visualizar documento</p>
                                                </a>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-center p-6">
                                                    <FileText size={32} className="mb-3" style={{ color: 'var(--color-text-3)' }} />
                                                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>Nenhuma grade enviada</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
