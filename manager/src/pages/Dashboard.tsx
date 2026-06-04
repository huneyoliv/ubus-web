import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Route,
  Bus,
  Users,
  BarChart3,
  Bell,
  Settings,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getDashboardMetrics, DashboardMetrics } from '../api/metrics';
import { Card } from '../components/ui/Card';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        // Silenciado
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const menuItems = [
    {
      title: 'Validações',
      desc: 'Analise documentos, renovações e pedidos de acessibilidade.',
      path: '/validacoes',
      icon: ClipboardCheck,
      badge: metrics?.pendingRegistrations,
      color: 'text-amber-500 bg-amber-50',
    },
    {
      title: 'Rotas',
      desc: 'Crie e configure rotas, paradas e calendários de viagens.',
      path: '/rotas',
      icon: Route,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      title: 'Frota de Ônibus',
      desc: 'Cadastre veículos, consulte banheiros, A/C e acessibilidade.',
      path: '/frota',
      icon: Bus,
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      title: 'Motoristas',
      desc: 'Gerencie cadastros de motoristas do município.',
      path: '/motoristas',
      icon: Users,
      color: 'text-indigo-500 bg-indigo-50',
    },
    {
      title: 'Relatórios & Métricas',
      desc: 'Consulte taxas de ocupação, feedbacks e presença.',
      path: '/relatorios',
      icon: BarChart3,
      color: 'text-violet-500 bg-violet-50',
    },
    {
      title: 'Notificações Push',
      desc: 'Envie comunicados para todo o município ou rotas específicas.',
      path: '/notificacoes',
      icon: Bell,
      color: 'text-rose-500 bg-rose-50',
    },
    {
      title: 'Configurações',
      desc: 'Atualize seus dados profissionais e configurações de conta.',
      path: '/configuracoes',
      icon: Settings,
      color: 'text-slate-500 bg-slate-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-16 bg-white rounded-[18px] w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="h-28 bg-white rounded-[18px]" />
          <div className="h-28 bg-white rounded-[18px]" />
          <div className="h-28 bg-white rounded-[18px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-[18px]" />
          ))}
        </div>
      </div>
    );
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Gestor';

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit">
          Olá, {firstName}!
        </h1>
        <p className="text-sm font-semibold text-[#434655] mt-1">
          Bem-vindo de volta ao painel administrativo escolar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-2 p-6 border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Viagens Ativas</span>
          <span className="text-4xl font-black text-[#131B2E] font-outfit">
            {metrics?.activeTrips ?? 0}
          </span>
        </Card>
        <Card className="flex flex-col gap-2 p-6 border-l-4 border-l-amber-500">
          <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Validações Pendentes</span>
          <span className="text-4xl font-black text-[#131B2E] font-outfit">
            {metrics?.pendingRegistrations ?? 0}
          </span>
        </Card>
        <Card className="flex flex-col gap-2 p-6 border-l-4 border-l-blue-500">
          <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Reservas Hoje</span>
          <span className="text-4xl font-black text-[#131B2E] font-outfit">
            {metrics?.todayReservations ?? 0}
          </span>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#131B2E] mb-6">Atalhos e Gestão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className="group">
                <Card className="h-full flex flex-col justify-between p-6 hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-[12px] ${item.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="bg-[#BA1A1A] text-white text-xs font-black px-2.5 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#131B2E] group-hover:text-[#2563EB] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#434655] mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] mt-5 self-start group-hover:gap-2.5 transition-all">
                    <span>Acessar</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
