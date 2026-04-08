import { useState, useEffect } from 'react'
import {
  Building2,
  Activity,
  ShieldCheck,
  PlusCircle,
  UserPlus,
  Filter,
  Download,
  Edit3,
  Search,
  Bell,
  Loader2
} from 'lucide-react'
import { api } from '@/lib/api'

interface Municipality {
  id: string
  name: string
  active: boolean
  managerId?: string | null
  createdAt?: string
}

export default function SuperAdminDashboard() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    api.get<Municipality[]>('/management')
      .then(setMunicipalities)
      .catch(() => setMunicipalities([]))
      .finally(() => setLoading(false))
  }, [])

  const totalActive = municipalities.filter(m => m.active !== false).length
  const totalSuspended = municipalities.filter(m => m.active === false).length

  const kpis = [
    {
      title: 'Total de Prefeituras',
      value: String(municipalities.length),
      sub: `${totalActive} ativas, ${totalSuspended} suspensas`,
      icon: Building2,
      color: 'var(--color-primary)',
      bgColor: 'rgba(37,99,235,0.08)',
    },
    {
      title: 'Prefeituras Ativas',
      value: String(totalActive),
      sub: 'Operando normalmente',
      icon: Activity,
      color: 'var(--color-success)',
      bgColor: 'rgba(16,185,129,0.08)',
    },
    {
      title: 'Com Gestor Vinculado',
      value: String(municipalities.filter(m => m.managerId).length),
      sub: `${municipalities.filter(m => !m.managerId).length} sem gestor`,
      icon: ShieldCheck,
      color: '#D97706',
      bgColor: 'rgba(245,158,11,0.08)',
    }
  ]

  const filtered = municipalities.filter(m =>
    (m.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full" style={{ background: 'var(--color-bg)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full" style={{ background: 'var(--color-bg)' }}>
      <div className="flex-1 overflow-y-auto p-5 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 md:space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
              Console de Comando Central
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-2)' }}>
              Visão global do ecossistema Ubus
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-3)' }} />
              <input
                type="text"
                placeholder="Buscar prefeitura..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-blue-500/20 w-full md:w-64"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>
            <button className="p-2.5 rounded-xl transition-colors relative" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-3)' }}>
              <Bell size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.title} className="p-6 rounded-2xl transition-all hover:-translate-y-1" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px -4px rgba(0,0,0,0.05)' }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-3)' }}>{kpi.title}</p>
                  <h3 className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{kpi.value}</h3>
                </div>
                <div className="p-3 rounded-xl flex items-center justify-center shrink-0" style={{ background: kpi.bgColor, color: kpi.color }}>
                  <kpi.icon size={22} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--color-text-3)' }}>
                <span>{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <h4 className="text-sm font-bold w-full sm:w-auto mb-2 sm:mb-0" style={{ color: 'var(--color-text)' }}>Ações Rápidas:</h4>
            <button className="btn-primary px-4 h-10 flex items-center gap-2 flex-1 sm:flex-none justify-center">
              <PlusCircle size={16} />
              <span>Nova Prefeitura</span>
            </button>
            <button className="px-4 h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all hover:bg-slate-50 flex-1 sm:flex-none"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
              <UserPlus size={16} />
              <span>Novo Gestor</span>
            </button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
            <button className="p-2.5 rounded-xl transition-colors hover:bg-slate-100" style={{ color: 'var(--color-text-3)' }}>
              <Filter size={18} />
            </button>
            <button className="p-2.5 rounded-xl transition-colors hover:bg-slate-100" style={{ color: 'var(--color-text-3)' }}>
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Prefeituras Cadastradas</h3>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-wider" style={{ background: 'rgba(37,99,235,0.03)', color: 'var(--color-text-3)' }}>
                    <th className="px-6 py-4">Prefeitura</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Gestor</th>
                    <th className="px-6 py-4">Criada em</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm font-semibold" style={{ color: 'var(--color-text-3)' }}>
                        Nenhuma prefeitura encontrada
                      </td>
                    </tr>
                  ) : filtered.map((pref) => (
                    <tr key={pref.id} className="hover:bg-slate-50 transition-colors group" style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0"
                            style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)', border: '1px solid rgba(37,99,235,0.1)' }}>
                            {(pref.name || '-').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold">{pref.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          pref.active !== false
                            ? 'text-emerald-700'
                            : 'text-rose-700'
                        }`}
                          style={{ background: pref.active !== false ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pref.active !== false ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {pref.active !== false ? 'Ativo' : 'Suspenso'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold" style={{ color: 'var(--color-text-2)' }}>
                        {pref.managerId ? '✓ Vinculado' : '— Sem gestor'}
                      </td>
                      <td className="px-6 py-4 font-semibold" style={{ color: 'var(--color-text-2)' }}>
                        {pref.createdAt ? new Date(pref.createdAt).toLocaleDateString('pt-BR') : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 -mr-2 rounded-lg transition-colors hover:bg-slate-100" style={{ color: 'var(--color-text-3)' }}>
                          <Edit3 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
