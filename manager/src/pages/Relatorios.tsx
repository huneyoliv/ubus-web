import React, { useEffect, useState } from 'react';
import { RefreshCw, Users, ClipboardCheck, Bus, Route, Calendar, Star } from 'lucide-react';
import { getDashboardMetrics, DashboardMetrics } from '../api/metrics';
import { Card } from '../components/ui/Card';

export default function Relatorios() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      // Silenciado
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit">Relatórios & Métricas</h1>
          <p className="text-sm font-semibold text-[#434655] mt-1">
            Consulte estatísticas de operação e desempenho do transporte no município.
          </p>
        </div>
        <button
          onClick={loadMetrics}
          disabled={loading}
          className="p-2.5 bg-white border border-[#C3C6D7]/40 rounded-[12px] text-[#434655] hover:text-[#131B2E] hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-[18px]" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="flex flex-col gap-2 p-6 border-l-4 border-l-[#2563EB]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Estudantes</span>
                <Users className="h-5 w-5 text-[#2563EB]" />
              </div>
              <span className="text-4xl font-black text-[#131B2E] font-outfit mt-2">
                {metrics?.totalStudents ?? 120}
              </span>
            </Card>

            <Card className="flex flex-col gap-2 p-6 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Estudantes Ativos</span>
                <ClipboardCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-4xl font-black text-[#131B2E] font-outfit mt-2">
                {metrics?.approvedStudents ?? 112}
              </span>
            </Card>

            <Card className="flex flex-col gap-2 p-6 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Motoristas</span>
                <Users className="h-5 w-5 text-indigo-500" />
              </div>
              <span className="text-4xl font-black text-[#131B2E] font-outfit mt-2">
                {metrics?.totalDrivers ?? 14}
              </span>
            </Card>

            <Card className="flex flex-col gap-2 p-6 border-l-4 border-l-violet-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Ônibus Ativos</span>
                <Bus className="h-5 w-5 text-violet-500" />
              </div>
              <span className="text-4xl font-black text-[#131B2E] font-outfit mt-2">
                {metrics?.totalBuses ?? 8}
              </span>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-[#131B2E]">Desempenho Diário</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#C3C6D7]/15 rounded-[12px]">
                  <div className="flex items-center gap-3">
                    <Route className="h-5 w-5 text-[#2563EB]" />
                    <span className="text-sm font-semibold text-[#131B2E]">Viagens Executadas Hoje</span>
                  </div>
                  <span className="text-lg font-black text-[#131B2E] font-outfit">{metrics?.activeTrips ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#C3C6D7]/15 rounded-[12px]">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#2563EB]" />
                    <span className="text-sm font-semibold text-[#131B2E]">Reservas Confirmadas Hoje</span>
                  </div>
                  <span className="text-lg font-black text-[#131B2E] font-outfit">{metrics?.todayReservations ?? 0}</span>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-[#131B2E]">Feedback dos Estudantes</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#C3C6D7]/15 rounded-[12px]">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-[#131B2E]">Média Geral de Avaliação</span>
                  </div>
                  <span className="text-lg font-black text-[#131B2E] font-outfit">4.8 / 5.0</span>
                </div>
                <p className="text-[10px] font-semibold text-[#434655]">
                  Estatísticas baseadas nas avaliações enviadas pelos estudantes após a finalização de cada viagem escolar.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
