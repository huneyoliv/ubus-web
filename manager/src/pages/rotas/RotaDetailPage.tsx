import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Plus, Calendar, Save, Bus as BusIcon, User as UserIcon } from 'lucide-react';
import {
  listRoutes,
  updateRoute,
  listBuses,
  listPickupPoints,
  deletePickupPoint,
  listDropoffPoints,
  deleteDropoffPoint,
  getRouteCalendar,
  scheduleTrips,
  Route,
  Bus,
  PickupPoint,
  DropoffPoint,
  assignDefaultBus,
  assignDefaultDriver
} from '../../api/fleet';
import { listUsers } from '../../api/users';
import { User } from '../../stores/auth.store';
import { api } from '../../api/client';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PickupPointModal } from './PickupPointModal';
import { DropoffPointModal } from './DropoffPointModal';
import { useToast } from '../../hooks/useToast';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const getEasterDate = (year: number) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
};

const getVariableHolidays = (year: number): Record<string, string> => {
  const { month, day } = getEasterDate(year);
  const easterDate = new Date(year, month - 1, day);
  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const carnivalMonday = new Date(easterDate);
  carnivalMonday.setDate(easterDate.getDate() - 48);
  const carnivalTuesday = new Date(easterDate);
  carnivalTuesday.setDate(easterDate.getDate() - 47);
  const ashWednesday = new Date(easterDate);
  ashWednesday.setDate(easterDate.getDate() - 46);
  const goodFriday = new Date(easterDate);
  goodFriday.setDate(easterDate.getDate() - 2);
  const corpusChristi = new Date(easterDate);
  corpusChristi.setDate(easterDate.getDate() + 60);
  return {
    [formatDate(carnivalMonday)]: 'Carnaval',
    [formatDate(carnivalTuesday)]: 'Carnaval',
    [formatDate(ashWednesday)]: 'Quarta-feira de Cinzas',
    [formatDate(goodFriday)]: 'Sexta-feira Santa',
    [formatDate(corpusChristi)]: 'Corpus Christi',
  };
};

const getHolidayName = (dateStr: string): string | null => {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parts[1];
  const day = parts[2];
  const fixedHoliday = {
    '01-01': 'Confraternização Universal',
    '04-21': 'Tiradentes',
    '05-01': 'Dia do Trabalho',
    '09-07': 'Independência do Brasil',
    '10-12': 'Nossa Senhora Aparecida',
    '11-02': 'Finados',
    '11-15': 'Proclamação da República',
    '11-20': 'Consciência Negra',
    '12-25': 'Natal',
  }[`${month}-${day}`];
  if (fixedHoliday) return fixedHoliday;
  return getVariableHolidays(year)[dateStr] || null;
};

export default function RotaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [route, setRoute] = useState<Route | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [allBuses, setAllBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [dropoffPoints, setDropoffPoints] = useState<DropoffPoint[]>([]);
  const [scheduledDates, setScheduledDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [routeName, setRouteName] = useState('');
  const [routeDesc, setRouteDesc] = useState('');
  const [departureTimeOutbound, setDepartureTimeOutbound] = useState('07:00');
  const [departureTimeInbound, setDepartureTimeInbound] = useState('12:00');
  const [routeActive, setRouteActive] = useState(true);
  const [requiresElevator, setRequiresElevator] = useState(false);

  const [selectedBusId, setSelectedBusId] = useState(() => {
    return localStorage.getItem(`ubus-route-bus-${id}`) || '';
  });
  const [selectedDriverId, setSelectedDriverId] = useState(() => {
    return localStorage.getItem(`ubus-route-driver-${id}`) || '';
  });
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState('2026-06');

  const [showPointModal, setShowPointModal] = useState(false);
  const [pointToEdit, setPointToEdit] = useState<PickupPoint | null>(null);
  const [showDropoffPointModal, setShowDropoffPointModal] = useState(false);
  const [dropoffPointToEdit, setDropoffPointToEdit] = useState<DropoffPoint | null>(null);

  const [generalLoading, setGeneralLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [busLoading, setBusLoading] = useState(false);
  const [driverLoading, setDriverLoading] = useState(false);
  const [error, setError] = useState('');

  const [confirmConfig, setConfirmConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant?: 'danger' | 'default';
    onConfirm: () => void;
  } | null>(null);

  const loadData = async () => {
    if (!id) return;
    try {
      const [routesList, busesList, pointsList, dropoffPointsList, calendarData, driversList] = await Promise.all([
        listRoutes(),
        listBuses(),
        listPickupPoints(id),
        listDropoffPoints(id),
        getRouteCalendar(id, calendarMonth),
        listUsers({ role: 'DRIVER', status: 'APPROVED' }),
      ]);

      const foundRoute = routesList.find((r) => r.id === id);
      if (foundRoute) {
        setRoute(foundRoute);
        setRouteName(foundRoute.name);
        setRouteDesc(foundRoute.description || '');
        setDepartureTimeOutbound(foundRoute.departureTimeOutbound || '07:00');
        setDepartureTimeInbound(foundRoute.departureTimeInbound || '12:00');
        setRouteActive(foundRoute.active);
        setRequiresElevator(foundRoute.requiresElevator || false);
      }

      setPoints(pointsList);
      setDropoffPoints(dropoffPointsList);
      setAllBuses(busesList);
      setDrivers(driversList);
      setBuses(busesList);
      setScheduledDates(calendarData.scheduledDates || []);
      setTrips(calendarData.trips || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao carregar dados da rota.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, calendarMonth]);

  const handleUpdateGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !route) return;
    setGeneralLoading(true);
    setError('');
    try {
      const updated = await updateRoute(id, {
        name: routeName,
        description: routeDesc,
        departureTimeOutbound,
        departureTimeInbound,
        active: routeActive,
        requiresElevator,
      });
      setRoute(updated);
      showToast('Dados gerais atualizados com sucesso!', 'success');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao atualizar dados gerais.');
      showToast(err.response?.data?.message || err.message || 'Erro ao atualizar dados gerais.', 'error');
    } finally {
      setGeneralLoading(false);
    }
  };

  const handleDeletePoint = (pointId: string) => {
    if (!id) return;
    setConfirmConfig({
      open: true,
      title: 'Excluir ponto de embarque?',
      description: 'Deseja realmente excluir este ponto de embarque? Esta ação não poderá ser desfeita.',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmConfig(null);
        try {
          await deletePickupPoint(id, pointId);
          loadData();
          showToast('Ponto de embarque excluído com sucesso!', 'success');
        } catch (err: any) {
          showToast(err.response?.data?.message || err.message || 'Erro ao excluir ponto.', 'error');
        }
      }
    });
  };

  const handleDeleteDropoffPoint = (pointId: string) => {
    if (!id) return;
    setConfirmConfig({
      open: true,
      title: 'Excluir ponto de desembarque?',
      description: 'Deseja realmente excluir este ponto de desembarque? Esta ação não poderá ser desfeita.',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmConfig(null);
        try {
          await deleteDropoffPoint(id, pointId);
          loadData();
          showToast('Ponto de desembarque excluído com sucesso!', 'success');
        } catch (err: any) {
          showToast(err.response?.data?.message || err.message || 'Erro ao excluir ponto.', 'error');
        }
      }
    });
  };

  const handleBusChange = (busId: string) => {
    setSelectedBusId(busId);
  };

  const handleDriverChange = (driverId: string) => {
    setSelectedDriverId(driverId);
  };

  const handleSaveBus = async () => {
    if (!id) return;
    if (!selectedBusId) {
      showToast('Por favor, selecione um ônibus.', 'warning');
      return;
    }
    setBusLoading(true);
    try {
      await assignDefaultBus(id, selectedBusId);
      localStorage.setItem(`ubus-route-bus-${id}`, selectedBusId);
      showToast('Ônibus atribuído com sucesso!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Erro ao atribuir ônibus.', 'error');
    } finally {
      setBusLoading(false);
    }
  };

  const handleSaveDriver = async () => {
    if (!id) return;
    setDriverLoading(true);
    try {
      await assignDefaultDriver(id, selectedDriverId || '');
      if (selectedDriverId) {
        localStorage.setItem(`ubus-route-driver-${id}`, selectedDriverId);
      } else {
        localStorage.removeItem(`ubus-route-driver-${id}`);
      }
      showToast('Motorista escalado com sucesso!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Erro ao escalar motorista.', 'error');
    } finally {
      setDriverLoading(false);
    }
  };

  const handleSelectWorkdays = () => {
    if (!calendarMonth) return;
    const [yearStr, monthStr] = calendarMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const date = new Date(year, month, 1);
    const workdays: string[] = [];
    while (date.getMonth() === month) {
      const dayOfWeek = date.getDay();
      const formattedDate = `${calendarMonth}-${String(date.getDate()).padStart(2, '0')}`;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isScheduled = scheduledDates.includes(formattedDate);
      const isHoliday = getHolidayName(formattedDate) !== null;
      if (!isWeekend && !isScheduled && !isHoliday) {
        workdays.push(formattedDate);
      }
      date.setDate(date.getDate() + 1);
    }
    setSelectedDates(workdays);
  };

  const getDaysInMonth = (monthString: string) => {
    if (!monthString) return 30;
    const [year, month] = monthString.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const getDayOfWeekOffset = (monthString: string): number => {
    if (!monthString) return 0;
    const [year, month] = monthString.split('-').map(Number);
    return new Date(year, month - 1, 1).getDay();
  };

  const handleDayClick = async (day: number) => {
    const formatted = `${calendarMonth}-${String(day).padStart(2, '0')}`;
    if (scheduledDates.includes(formatted)) {
      setConfirmConfig({
        open: true,
        title: 'Desmarcar viagens?',
        description: `Deseja realmente desmarcar e cancelar as viagens agendadas para o dia ${day}?`,
        variant: 'danger',
        onConfirm: async () => {
          setConfirmConfig(null);
          setScheduleLoading(true);
          try {
            const tripsOnDay = trips.filter((t) => t.tripDate === formatted && t.status !== 'CANCELLED');
            await Promise.all(
              tripsOnDay.map((t) => api.patch(`/trips/${t.id}`, { status: 'CANCELLED' }))
            );
            loadData();
            showToast('Viagens do dia canceladas com sucesso!', 'success');
          } catch (err: any) {
            showToast(err.response?.data?.message || 'Erro ao cancelar viagens do dia.', 'error');
          } finally {
            setScheduleLoading(false);
          }
        }
      });
      return;
    }
    setSelectedDates((prev) =>
      prev.includes(formatted) ? prev.filter((d) => d !== formatted) : [...prev, formatted]
    );
  };

  const handleScheduleTrips = async () => {
    if (!id || selectedDates.length === 0) {
      showToast('Selecione pelo menos um dia no calendário.', 'warning');
      return;
    }
    if (!selectedBusId) {
      showToast('Por favor, selecione um ônibus antes de agendar viagens.', 'warning');
      return;
    }
    setScheduleLoading(true);
    try {
      await scheduleTrips({
        routeId: id,
        busId: selectedBusId,
        driverId: selectedDriverId || undefined,
        dates: selectedDates,
        shifts: ['MORNING'],
        directions: ['OUTBOUND', 'INBOUND'],
      });
      setSelectedDates([]);
      loadData();
      showToast('Viagens geradas com sucesso!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erro ao gerar viagens.', 'error');
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

  const availableBuses = allBuses;

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
                <Input id="departureTimeOutbound" type="time" label="Partida (Ida)" value={departureTimeOutbound} onChange={(e) => setDepartureTimeOutbound(e.target.value)} />
                <Input id="departureTimeInbound" type="time" label="Partida (Volta)" value={departureTimeInbound} onChange={(e) => setDepartureTimeInbound(e.target.value)} />
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
            <div className="flex items-center justify-between border-b border-[#C3C6D7]/20 pb-4">
              <h2 className="text-lg font-bold text-[#131B2E]">Pontos de Desembarque</h2>
              <Button
                onClick={() => {
                  setDropoffPointToEdit(null);
                  setShowDropoffPointModal(true);
                }}
                className="py-2 px-3 text-xs"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Adicionar Ponto
              </Button>
            </div>
            {dropoffPoints.length === 0 ? (
              <p className="text-xs font-semibold text-[#434655]">Nenhum ponto de desembarque cadastrado nesta rota.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {dropoffPoints.map((pt) => (
                  <div key={pt.id} className="flex items-center justify-between p-4 bg-slate-50 border border-[#C3C6D7]/20 rounded-[12px]">
                    <div>
                      <h4 className="text-sm font-bold text-[#131B2E]">{pt.name}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setDropoffPointToEdit(pt);
                          setShowDropoffPointModal(true);
                        }}
                        className="p-1.5 bg-white border border-[#C3C6D7]/30 text-slate-500 hover:text-[#2563EB] rounded-[8px]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDropoffPoint(pt.id)}
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
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#2563EB]" />
                  <input
                    type="month"
                    value={calendarMonth}
                    onChange={(e) => setCalendarMonth(e.target.value)}
                    className="px-3 py-1.5 border border-[#C3C6D7] rounded-[8px] text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSelectWorkdays}
                  className="py-1.5 px-3 text-xs"
                >
                  Dias Úteis
                </Button>
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
              {[...Array(getDayOfWeekOffset(calendarMonth))].map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {[...Array(getDaysInMonth(calendarMonth))].map((_, index) => {
                const day = index + 1;
                const formatted = `${calendarMonth}-${String(day).padStart(2, '0')}`;
                const isScheduled = scheduledDates.includes(formatted);
                const isSelected = selectedDates.includes(formatted);
                const holidayName = getHolidayName(formatted);
                const isHoliday = holidayName !== null;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    title={holidayName || undefined}
                    className={`h-11 rounded-[8px] font-bold text-sm flex flex-col items-center justify-center relative border transition-all ${
                      isSelected
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : isScheduled
                        ? 'bg-blue-50 text-[#2563EB] border-[#2563EB]/40'
                        : isHoliday
                        ? 'bg-red-50 text-[#DC2626] border-red-200 hover:border-red-400'
                        : 'bg-white border-[#C3C6D7]/20 hover:border-[#131B2E]'
                    }`}
                  >
                    <span>{day}</span>
                    {isScheduled && !isSelected && (
                      <span className="absolute bottom-1 h-1.5 w-1.5 bg-[#2563EB] rounded-full" />
                    )}
                    {isHoliday && !isSelected && !isScheduled && (
                      <span className="absolute bottom-1 text-[8px] font-extrabold text-[#DC2626]">F</span>
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
              Selecionar Ônibus
            </h3>
            <select
              value={selectedBusId}
              onChange={(e) => handleBusChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#C3C6D7] rounded-[12px] text-sm text-[#131B2E] outline-none"
            >
              <option value="">Selecione um ônibus...</option>
              {availableBuses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.plate} (Capacidade: {b.capacity})
                </option>
              ))}
            </select>
            <p className="text-[10px] font-semibold text-[#434655]">
              Ônibus padrão escalado para esta rota.
            </p>
            <Button onClick={handleSaveBus} loading={busLoading} className="py-2">
              <Save className="h-4 w-4 mr-2" />
              Atribuir Ônibus
            </Button>
          </Card>

          <Card className="flex flex-col gap-5">
            <h3 className="text-base font-bold text-[#131B2E] flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-[#2563EB]" />
              Escalar Motorista
            </h3>
            <div className="flex flex-col gap-4">
              <select
                value={selectedDriverId}
                onChange={(e) => handleDriverChange(e.target.value)}
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
                Motorista padrão escalado para esta rota.
              </p>
              <Button onClick={handleSaveDriver} loading={driverLoading} className="py-2">
                <Save className="h-4 w-4 mr-2" />
                Escalar Motorista
              </Button>
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

      {showDropoffPointModal && (
        <DropoffPointModal
          routeId={id!}
          pointToEdit={dropoffPointToEdit}
          onClose={() => {
            setShowDropoffPointModal(false);
            setDropoffPointToEdit(null);
          }}
          onSaved={() => {
            setShowDropoffPointModal(false);
            setDropoffPointToEdit(null);
            loadData();
          }}
        />
      )}

      {confirmConfig && (
        <ConfirmDialog
          open={confirmConfig.open}
          title={confirmConfig.title}
          description={confirmConfig.description}
          variant={confirmConfig.variant}
          onConfirm={confirmConfig.onConfirm}
          onCancel={() => setConfirmConfig(null)}
        />
      )}
    </div>
  );
}

