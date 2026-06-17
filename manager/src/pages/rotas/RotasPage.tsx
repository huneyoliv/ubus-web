import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route as RouteIcon, Plus, X, Calendar } from 'lucide-react';
import { listRoutes, createRoute, Route } from '../../api/fleet';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function RotasPage() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [listError, setListError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [departureTimeOutbound, setDepartureTimeOutbound] = useState('07:00');
  const [departureTimeInbound, setDepartureTimeInbound] = useState('12:00');
  const [votingOpenTime, setVotingOpenTime] = useState('06:00');
  const [votingOpenDaysBefore, setVotingOpenDaysBefore] = useState(0);
  const [votingCloseTime, setVotingCloseTime] = useState('18:00');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadRoutes = async () => {
    setLoading(true);
    setListError('');
    try {
      const data = await listRoutes();
      setRoutes(data);
    } catch (err: any) {
      setListError(err.response?.data?.message || err.message || 'Erro ao carregar as rotas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome da rota é obrigatório.');
      return;
    }

    setSubmitLoading(true);
    setError('');
    try {
      await createRoute({
        name,
        description,
        departureTimeOutbound,
        departureTimeInbound,
        votingOpenTime,
        votingCloseTime,
        votingOpenDaysBefore,
        active: true,
      });
      setName('');
      setDescription('');
      setDepartureTimeOutbound('07:00');
      setDepartureTimeInbound('12:00');
      setVotingOpenTime('06:00');
      setVotingOpenDaysBefore(0);
      setVotingCloseTime('18:00');
      setShowDrawer(false);
      loadRoutes();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao criar a rota.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit">Rotas</h1>
          <p className="text-sm font-semibold text-[#434655] mt-1">
            Gerencie as linhas de ônibus e trajetos do município.
          </p>
        </div>
        <Button onClick={() => setShowDrawer(true)} className="flex items-center gap-2 py-2.5">
          <Plus className="h-5 w-5" />
          <span>Criar Rota</span>
        </Button>
      </div>

      {listError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[18px] text-sm font-semibold text-[#BA1A1A]">
          {listError}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-white rounded-[18px]" />
          ))}
        </div>
      ) : routes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2">
          <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
            <RouteIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[#131B2E]">Nenhuma rota cadastrada</h3>
          <p className="text-xs font-semibold text-[#434655] mt-1.5 mb-6">
            Comece criando a primeira rota escolar do município.
          </p>
          <Button onClick={() => setShowDrawer(true)}>Criar Primeira Rota</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((route) => (
            <div key={route.id} onClick={() => navigate(`/rotas/${route.id}`)} className="group cursor-pointer">
              <Card className="h-full flex flex-col justify-between p-6 hover:shadow-lg hover:border-[#2563EB]/30 transition-all duration-200">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-[#131B2E] group-hover:text-[#2563EB] transition-all font-outfit">
                      {route.name}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      route.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {route.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#434655] leading-relaxed line-clamp-2">
                    {route.description || 'Sem descrição.'}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-[#C3C6D7]/20 pt-4 mt-6">
                  <div className="flex flex-col gap-0.5 text-[10px] font-bold text-[#434655]">
                    <span>Ida: {route.departureTimeOutbound || '--:--'}</span>
                    <span>Volta: {route.departureTimeInbound || '--:--'}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {showDrawer && (
        <div className="fixed inset-0 bg-[#0F172A]/50 z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setShowDrawer(false)} />
          <div className="relative w-full max-w-lg bg-white h-full flex flex-col p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-[#C3C6D7]/20 pb-4 mb-6">
              <h2 className="text-xl font-bold text-[#131B2E]">Nova Rota Escolar</h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1.5 text-[#434655] hover:text-[#131B2E] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] text-xs font-semibold text-[#BA1A1A]">
                  {error}
                </div>
              )}

              <Input
                id="name"
                label="Nome da Rota"
                placeholder="Ex: Rota Centro - IFSP"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#434655]">Descrição</label>
                <textarea
                  placeholder="Descreva o itinerário resumido desta rota..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#C3C6D7] rounded-[12px] text-sm text-[#131B2E] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="departureTimeOutbound"
                  type="time"
                  label="Partida (Ida)"
                  value={departureTimeOutbound}
                  onChange={(e) => setDepartureTimeOutbound(e.target.value)}
                />
                <Input
                  id="departureTimeInbound"
                  type="time"
                  label="Partida (Volta)"
                  value={departureTimeInbound}
                  onChange={(e) => setDepartureTimeInbound(e.target.value)}
                />
              </div>

              {departureTimeOutbound && (
                <>
                  <div className="border-t border-[#C3C6D7]/20 pt-4 mt-2">
                    <h4 className="text-sm font-bold text-[#131B2E] mb-3">Configurações de Votação (Ida/Volta)</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="votingOpenTime"
                      type="time"
                      label="Abertura da Votação"
                      value={votingOpenTime}
                      onChange={(e) => setVotingOpenTime(e.target.value)}
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-[#434655]">Dia de Abertura</label>
                      <select
                        value={votingOpenDaysBefore}
                        onChange={(e) => setVotingOpenDaysBefore(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-white border border-[#C3C6D7] rounded-[12px] text-sm text-[#131B2E] outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 h-[42px]"
                      >
                        <option value={0}>No mesmo dia da viagem</option>
                        <option value={1}>No dia anterior à viagem</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="votingCloseTime"
                      type="time"
                      label="Fechamento da Votação"
                      value={votingCloseTime}
                      onChange={(e) => setVotingCloseTime(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4 mt-auto pt-6 border-t border-[#C3C6D7]/20">
                <Button type="submit" loading={submitLoading} className="flex-1 py-3">
                  Salvar Rota
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowDrawer(false)} className="flex-1 py-3">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
