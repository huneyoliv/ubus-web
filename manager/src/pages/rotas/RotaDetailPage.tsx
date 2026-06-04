import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Plus, Calendar, Save, Bus as BusIcon, User as UserIcon } from 'lucide-react';
import {
  listRoutes,
  updateRoute,
  listBuses,
  updateBus,
  listPickupPoints,
  deletePickupPoint,
  getRouteCalendar,
  scheduleTrips,
  Route,
  Bus,
  PickupPoint
} from '../../api/fleet';
import { listUsers } from '../../api/users';
import { User } from '../../stores/auth.store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PickupPointModal } from './PickupPointModal';

const WEEK_DAYS = [
  { value: 'SEG', label: 'Segunda-feira' },
  { value: 'TER', label: 'Terça-feira' },
  { value: 'QUA', label: 'Quarta-feira' },
  { value: 'QUI', label: 'Quinta-feira' },
  { value: 'SEX', label: 'Sexta-feira' },
  { value: 'SAB', label: 'Sábado' },
  { value: 'DOM', label: 'Domingo' },
];

export default function RotaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [route, setRoute] = useState<Route | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [allBuses, setAllBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [scheduledDates, setScheduledDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [routeName, setRouteName] = useState('');
  const [routeDesc, setRouteDesc] = useState('');
  const [routeWeekDays, setRouteWeekDays] = useState<string[]>([]);
  const [votingOpen, setVotingOpen] = useState('06:00');
  const [votingClose, setVotingClose] = useState('22:00');
  const [routeActive, setRouteActive] = useState(true);
  const [requiresElevator, setRequiresElevator] = useState(false);

  const [selectedBusId, setSelectedBusId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState('2026-06');

  const [showPointModal, setShowPointModal] = useState(false);
  const [pointToEdit, setPointToEdit] = useState<PickupPoint | null>(null);

  const [generalLoading, setGeneralLoading] = useState(false);
  const [busLoading, setBusLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!id) return;
    try {
      const [routesList, busesList, pointsList, calendarData, driversList] = await Promise.all([
        listRoutes(),
        listBuses(),
        listPickupPoints(id),
        getRouteCalendar(id, calendarMonth),
        listUsers({ role: 'DRIVER', status: 'APPROVED' }),
      ]);

      const foundRoute = routesList.find((r) => r.id === id);
      if (foundRoute) {
        setRoute(foundRoute);
        setRouteName(foundRoute.name);
        setRouteDesc(foundRoute.description || '');
        setRouteWeekDays(foundRoute.weekDays);
        setVotingOpen(foundRoute.votingOpen);
        setVotingClose(foundRoute.votingClose);
        setRouteActive(foundRoute.active);
        setRequiresElevator(foundRoute.requiresElevator || false);
      }

      setPoints(pointsList);
      setAllBuses(busesList);
      setDrivers(driversList);
      setBuses(busesList.filter((b) => b.routeId === id));
      setScheduledDates(calendarData.scheduledDates || []);
    } catch (err) {
      // Silenciado
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, calendarMonth]);

  const handleWeekDayToggle = (day: string) => {
    setRouteWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleUpdateGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !route) return;
    setGeneralLoading(true);
    setError('');
    try {
      const updated = await updateRoute(id, {
        name: routeName,
        description: routeDesc,
        weekDays: routeWeekDays,
        votingOpen,
        votingClose,
        active: routeActive,
        requiresElevator,
      });
      setRoute(updated);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar dados gerais.');
    } finally {
      setGeneralLoading(false);
    }
  };

  const handleAssignBus = async () => {
    if (!id || !selectedBusId) return;
    setBusLoading(true);
    setError('');
    try {
      await updateBus(selectedBusId, { routeId: id });
      setSelectedBusId('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao vincular ônibus.');
    } finally {
      setBusLoading(false);
    }
  };

  const handleRemoveBus = async (busId: string) => {
    if (!confirm('Deseja desvincular este ônibus da rota?')) return;
    try {
      await updateBus(busId, { routeId: null });
      loadData();
    } catch (err: any) {
      setError('Erro ao desvincular ônibus.');
    }
  };

  const handleDeletePoint = async (pointId: string) => {
    if (!id || !confirm('Excluir ponto de embarque?')) return;
    try {
      await deletePickupPoint(id, pointId);
      loadData();
    } catch (err: any) {
      setError('Erro ao excluir ponto.');
    }
  };

  const handleDaySelect = (day: number) => {
    const formatted = `${calendarMonth}-${String(day).padStart(2, '0')}`;
    setSelectedDates((prev) =>
      prev.includes(formatted) ? prev.filter((d) => d !== formatted) : [...prev, formatted]
    );
  };

  const handleScheduleTrips = async () => {
    if (!id || selectedDates.length === 0) {
      alert('Selecione pelo menos um dia no calendário.');
      return;
    }
    const allocatedBus = buses[0];
    if (!allocatedBus) {
      alert('Por favor, vincule um ônibus à rota antes de agendar viagens.');
      return;
    }

    setScheduleLoading(true);
    try {
      await scheduleTrips({
        routeId: id,
        busId: allocatedBus.id,
        driverId: selectedDriverId || undefined,
        dates: selectedDates,
        shifts: ['MORNING', 'AFTERNOON'],
        directions: ['OUTBOUND', 'INBOUND'],
      });
      setSelectedDates([]);
      loadData();
      alert('Viagens geradas com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao gerar viagens.');
    } finally {
      setScheduleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-10 bg-white rounded-[12px] w-1/4" />
        <div className="h-64 bg-white rounded-[18px]" />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="flex flex-col gap-6">
        <button onClick={() => navigate('/rotas')} className="flex items-center gap-2 text-sm font-bold text-[#2563EB]">
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar para rotas</span>
        </button>
        <Card className="p-8 text-center text-[#BA1A1A]">Rota não encontrada.</Card>
      </div>
    );
  }

  const availableBuses = allBuses.filter((b) => !b.routeId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/rotas')} className="p-2 bg-white border border-[#C3C6D7]/40 rounded-[12px] text-[#434655] hover:text-[#131B2E]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit">{route.name}</h1>
          <p className="text-sm font-semibold text-[#434655] mt-1">Configurações e escala da linha.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card>
            <form onSubmit={handleUpdateGeneral} className="flex flex-col gap-6">
              <h2 className="text-lg font-bold text-[#131B2E]">Dados Gerais</h2>
              {error && <div className="text-xs font-bold text-[#BA1A1A]">{error}</div>}
              <Input id="name" label="Nome da Rota" value={routeName} onChange={(e) => setRouteName(e.target.value)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#434655]">Descrição</label>
                <textarea
                  value={routeDesc}
                  onChange={(e) => setRouteDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#C3C6D7] rounded-[12px] text-sm text-[#131B2E] outline-none focus:border-[#2563EB] h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input id="votingOpen" type="time" label="Abertura Votação" value={votingOpen} onChange={(e) => setVotingOpen(e.target.value)} />
                <Input id="votingClose" type="time" label="Fechamento Votação" value={votingClose} onChange={(e) => setVotingClose(e.target.value)} />
              </div>

              <div className="flex flex-wrap gap-4 border-t border-b border-slate-100 py-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#131B2E] cursor-pointer">
                  <input type="checkbox" checked={routeActive} onChange={(e) => setRouteActive(e.target.checked)} className="rounded" />
                  Rota Ativa
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#131B2E] cursor-pointer">
                  <input type="checkbox" checked={requiresElevator} onChange={(e) => setRequiresElevator(e.target.checked)} className="rounded" />
                  Exige Ônibus com Elevador
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#434655]">Dias da Semana</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WEEK_DAYS.map((day) => {
                    const selected = routeWeekDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleWeekDayToggle(day.value)}
                        className={`px-3 py-2 text-xs font-bold rounded-[8px] border transition-all duration-200 ${
                          selected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-[#C3C6D7] text-[#434655]'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" loading={generalLoading} className="self-start py-2.5">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </form>
          </Card>

          <Card className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#C3C6D7]/20 pb-4">
              <h2 className="text-lg font-bold text-[#131B2E]">Pontos de Embarque</h2>
              <Button
                onClick={() => {
                  setPointToEdit(null);
                  setShowPointModal(true);
                }}
                className="py-2 px-3 text-xs"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Adicionar Ponto
              </Button>
            </div>
            {points.length === 0 ? (
              <p className="text-xs font-semibold text-[#434655]">Nenhum ponto de embarque cadastrado nesta rota.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {points.map((pt) => (
                  <div key={pt.id} className="flex items-center justify-between p-4 bg-slate-50 border border-[#C3C6D7]/20 rounded-[12px]">
                    <div>
                      <h4 className="text-sm font-bold text-[#131B2E]">{pt.name}</h4>
                      <span className="text-[10px] font-semibold text-[#434655]">Lat: {pt.lat.toFixed(6)} | Lng: {pt.lng.toFixed(6)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setPointToEdit(pt);
                          setShowPointModal(true);
                        }}
                        className="p-1.5 bg-white border border-[#C3C6D7]/30 text-slate-500 hover:text-[#2563EB] rounded-[8px]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePoint(pt.id)}
                        className="p-1.5 bg-white border border-red-100 text-red-500 hover:bg-red-50 rounded-[8px]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-6">
            <h2 className="text-lg font-bold text-[#131B2E]">Calendário e Escala de Viagens</h2>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#2563EB]" />
                <input
                  type="month"
                  value={calendarMonth}
                  onChange={(e) => setCalendarMonth(e.target.value)}
                  className="px-3 py-1.5 border border-[#C3C6D7] rounded-[8px] text-sm"
                />
              </div>
              <Button onClick={handleScheduleTrips} loading={scheduleLoading} className="py-2.5">
                Gerar Viagens nos Dias Selecionados
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#434655] border-t border-slate-100 pt-4">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {[...Array(30)].map((_, index) => {
                const day = index + 1;
                const formatted = `${calendarMonth}-${String(day).padStart(2, '0')}`;
                const isScheduled = scheduledDates.includes(formatted);
                const isSelected = selectedDates.includes(formatted);

                return (
                  <button
                    key={day}
                    onClick={() => handleDaySelect(day)}
                    className={`h-11 rounded-[8px] font-bold text-sm flex flex-col items-center justify-center relative border transition-all ${
                      isSelected
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : isScheduled
                        ? 'bg-blue-50 text-[#2563EB] border-[#2563EB]/40'
                        : 'bg-white border-[#C3C6D7]/20 hover:border-[#131B2E]'
                    }`}
                  >
                    <span>{day}</span>
                    {isScheduled && !isSelected && (
                      <span className="absolute bottom-1 h-1.5 w-1.5 bg-[#2563EB] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-5">
            <h3 className="text-base font-bold text-[#131B2E] flex items-center gap-2">
              <BusIcon className="h-5 w-5 text-[#2563EB]" />
              Ônibus Vinculado
            </h3>
            {buses.length > 0 ? (
              <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-[12px]">
                <div>
                  <h4 className="text-sm font-bold text-[#131B2E]">{buses[0].plate}</h4>
                  <span className="text-xs font-semibold text-[#434655]">Capacidade: {buses[0].capacity} alunos</span>
                </div>
                <button
                  onClick={() => handleRemoveBus(buses[0].id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-[8px]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <select
                  value={selectedBusId}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#C3C6D7] rounded-[12px] text-sm text-[#131B2E] outline-none"
                >
                  <option value="">Selecione um ônibus disponível...</option>
                  {availableBuses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.plate} (Capacidade: {b.capacity})
                    </option>
                  ))}
                </select>
                <Button onClick={handleAssignBus} loading={busLoading} className="py-2">
                  Atribuir Veículo
                </Button>
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-5">
            <h3 className="text-base font-bold text-[#131B2E] flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-[#2563EB]" />
              Escalar Motorista
            </h3>
            <div className="flex flex-col gap-4">
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#C3C6D7] rounded-[12px] text-sm text-[#131B2E] outline-none"
              >
                <option value="">Selecione o motorista para viagem...</option>
                {drivers.map((drv) => (
                  <option key={drv.id} value={drv.id}>
                    {drv.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] font-semibold text-[#434655]">
                O motorista selecionado será vinculado por padrão ao gerar a escala de viagens desta rota.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {showPointModal && (
        <PickupPointModal
          routeId={id!}
          pointToEdit={pointToEdit}
          onClose={() => {
            setShowPointModal(false);
            setPointToEdit(null);
          }}
          onSaved={() => {
            setShowPointModal(false);
            setPointToEdit(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
