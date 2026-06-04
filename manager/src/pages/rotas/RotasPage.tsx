import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route as RouteIcon, Plus, X, Calendar } from 'lucide-react';
import { listRoutes, createRoute, Route } from '../../api/fleet';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const WEEK_DAYS = [
  { value: 'SEG', label: 'Seg' },
  { value: 'TER', label: 'Ter' },
  { value: 'QUA', label: 'Qua' },
  { value: 'QUI', label: 'Qui' },
  { value: 'SEX', label: 'Sex' },
  { value: 'SAB', label: 'Sáb' },
  { value: 'DOM', label: 'Dom' },
];

export default function RotasPage() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weekDays, setWeekDays] = useState<string[]>(['SEG', 'TER', 'QUA', 'QUI', 'SEX']);
  const [votingOpen, setVotingOpen] = useState('06:00');
  const [votingClose, setVotingClose] = useState('22:00');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const data = await listRoutes();
      setRoutes(data);
    } catch (err) {
      // Silenciado
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleDayToggle = (day: string) => {
    setWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome da rota é obrigatório.');
      return;
    }
    if (weekDays.length === 0) {
      setError('Selecione pelo menos um dia de operação.');
      return;
    }

    setSubmitLoading(true);
    setError('');
    try {
      await createRoute({
        name,
        description,
        weekDays,
        votingOpen,
        votingClose,
        active: true,
      });
      setName('');
      setDescription('');
      setWeekDays(['SEG', 'TER', 'QUA', 'QUI', 'SEX']);
      setShowDrawer(false);
      loadRoutes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar a rota.');
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
                    <h3 className="text-lg font-bold text-[#131B2E] group-hover:text-[#2563EB] transition-all">
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
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#434655]">
                    <Calendar className="h-4 w-4 text-[#2563EB]" />
                    <span className="truncate">
                      {route.weekDays.join(', ')}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#434655] bg-slate-100 px-2 py-0.5 rounded-[6px]">
                    Votação: {route.votingOpen} - {route.votingClose}
                  </span>
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

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#434655]">Dias de Operação</label>
                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map((day) => {
                    const selected = weekDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleDayToggle(day.value)}
                        className={`px-3.5 py-2 text-xs font-bold rounded-[8px] border transition-all duration-200 ${
                          selected
                            ? 'bg-[#2563EB] border-[#2563EB] text-white'
                            : 'border-[#C3C6D7] hover:border-[#131B2E] text-[#434655]'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="votingOpen"
                  type="time"
                  label="Abertura da Votação"
                  value={votingOpen}
                  onChange={(e) => setVotingOpen(e.target.value)}
                />
                <Input
                  id="votingClose"
                  type="time"
                  label="Fechamento da Votação"
                  value={votingClose}
                  onChange={(e) => setVotingClose(e.target.value)}
                />
              </div>

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
