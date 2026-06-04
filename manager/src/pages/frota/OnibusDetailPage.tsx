import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Accessibility, Shield, Check } from 'lucide-react';
import { listBuses, updateBus, Bus } from '../../api/fleet';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function OnibusDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [layoutLoading, setLayoutLoading] = useState(false);
  const [error, setError] = useState('');

  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState(40);
  const [hasBathroom, setHasBathroom] = useState(false);
  const [hasAirConditioning, setHasAirConditioning] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  const [active, setActive] = useState(true);

  const [preferentialSeats, setPreferentialSeats] = useState<number[]>([]);

  useEffect(() => {
    async function loadBus() {
      if (!id) return;
      try {
        const list = await listBuses();
        const found = list.find((b) => b.id === id);
        if (found) {
          setBus(found);
          setPlate(found.plate);
          setCapacity(found.capacity);
          setHasBathroom(found.hasBathroom);
          setHasAirConditioning(found.hasAirConditioning);
          setHasElevator(found.hasElevator);
          setActive(found.active);
          setPreferentialSeats(found.preferentialSeats || [1, 2, 3, 4]); // Fallback inicial de assentos preferenciais
        } else {
          setError('Veículo não encontrado.');
        }
      } catch (err) {
        setError('Erro ao carregar o veículo.');
      } finally {
        setLoading(false);
      }
    }
    loadBus();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !bus) return;
    setSaveLoading(true);
    setError('');
    try {
      const updated = await updateBus(id, {
        plate,
        capacity,
        hasBathroom,
        hasAirConditioning,
        hasElevator,
        active,
      });
      setBus(updated);
      alert('Veículo atualizado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar veículo.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSeatToggle = (seatNumber: number) => {
    setPreferentialSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleSaveLayout = async () => {
    if (!id) return;
    setLayoutLoading(true);
    try {
      // Simula ou chama o PATCH /fleet/buses/{id} salvando o array no metadado preferentialSeats
      await updateBus(id, { preferentialSeats });
      alert('Layout de assentos preferenciais salvo com sucesso!');
    } catch (err) {
      alert('Erro ao salvar layout de assentos.');
    } finally {
      setLayoutLoading(false);
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

  if (error || !bus) {
    return (
      <div className="flex flex-col gap-6">
        <button onClick={() => navigate('/frota')} className="flex items-center gap-2 text-sm font-bold text-[#2563EB]">
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar para frota</span>
        </button>
        <Card className="p-8 text-center text-[#BA1A1A]">{error || 'Veículo não encontrado.'}</Card>
      </div>
    );
  }

  // Gera o grid de assentos (4 assentos por fileira, com corredor central)
  const totalRows = Math.ceil(capacity / 4);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/frota')} className="p-2 bg-white border border-[#C3C6D7]/40 rounded-[12px] text-[#434655] hover:text-[#131B2E]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit uppercase">{bus.plate}</h1>
          <p className="text-sm font-semibold text-[#434655] mt-1">Configurações mecânicas e layout do veículo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-lg font-bold text-[#131B2E]">Dados Gerais</h2>
              {error && <div className="text-xs font-bold text-[#BA1A1A]">{error}</div>}

              <Input id="plate" label="Placa" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} />
              <Input id="capacity" type="number" label="Capacidade" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value) || 0)} />

              <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                <label className="text-sm font-semibold text-[#434655]">Recursos</label>

                <label className="flex items-center gap-2 text-sm font-semibold text-[#131B2E] cursor-pointer">
                  <input type="checkbox" checked={hasAirConditioning} onChange={(e) => setHasAirConditioning(e.target.checked)} className="rounded" />
                  Ar-Condicionado ❄️
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-[#131B2E] cursor-pointer">
                  <input type="checkbox" checked={hasBathroom} onChange={(e) => setHasBathroom(e.target.checked)} className="rounded" />
                  Banheiro 🚻
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-[#131B2E] cursor-pointer">
                  <input type="checkbox" checked={hasElevator} onChange={(e) => setHasElevator(e.target.checked)} className="rounded" />
                  Elevador de Acessibilidade ♿
                </label>

                <label className="flex items-center gap-2 text-sm font-semibold text-[#131B2E] cursor-pointer mt-2 pt-2 border-t border-slate-100">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="rounded" />
                  Veículo Ativo na Frota
                </label>
              </div>

              <Button type="submit" loading={saveLoading} className="py-2.5 mt-2">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#C3C6D7]/20 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#131B2E]">Layout de Assentos</h2>
                <p className="text-xs font-semibold text-[#434655] mt-1">
                  Clique nos assentos para torná-los preferenciais (Lei nº 10.048/2000).
                </p>
              </div>
              <Button onClick={handleSaveLayout} loading={layoutLoading} className="py-2.5">
                Salvar Layout
              </Button>
            </div>

            <div className="flex justify-center bg-slate-50 p-8 rounded-[18px] border border-[#C3C6D7]/20 overflow-x-auto">
              <div className="flex flex-col gap-3 min-w-[280px]">
                {/* Cabine do Motorista */}
                <div className="flex justify-between items-center bg-slate-200 p-3 rounded-[12px] mb-4 text-xs font-bold text-[#434655]">
                  <span>Frente do Ônibus</span>
                  <div className="h-6 w-6 bg-slate-400 rounded-full flex items-center justify-center text-white">M</div>
                </div>

                {/* Grid de assentos */}
                {[...Array(totalRows)].map((_, rowIndex) => {
                  return (
                    <div key={rowIndex} className="flex items-center justify-between gap-8">
                      {/* Lado Esquerdo */}
                      <div className="flex gap-2">
                        {[1, 2].map((colIndex) => {
                          const seatNumber = rowIndex * 4 + colIndex;
                          if (seatNumber > capacity) return <div key={colIndex} className="w-10 h-10" />;
                          const isPref = preferentialSeats.includes(seatNumber);
                          return (
                            <button
                              key={colIndex}
                              onClick={() => handleSeatToggle(seatNumber)}
                              className={`w-10 h-10 rounded-[8px] font-bold text-xs flex items-center justify-center border transition-all ${
                                isPref
                                  ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/20'
                                  : 'bg-white border-[#C3C6D7] text-[#131B2E] hover:border-[#2563EB]'
                              }`}
                            >
                              {isPref ? <Accessibility className="h-4 w-4" /> : seatNumber}
                            </button>
                          );
                        })}
                      </div>

                      {/* Corredor Central */}
                      <div className="w-6 text-[10px] text-slate-400 font-bold flex items-center justify-center">
                        C
                      </div>

                      {/* Lado Direito */}
                      <div className="flex gap-2">
                        {[3, 4].map((colIndex) => {
                          const seatNumber = rowIndex * 4 + colIndex;
                          if (seatNumber > capacity) return <div key={colIndex} className="w-10 h-10" />;
                          const isPref = preferentialSeats.includes(seatNumber);
                          return (
                            <button
                              key={colIndex}
                              onClick={() => handleSeatToggle(seatNumber)}
                              className={`w-10 h-10 rounded-[8px] font-bold text-xs flex items-center justify-center border transition-all ${
                                isPref
                                  ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/20'
                                  : 'bg-white border-[#C3C6D7] text-[#131B2E] hover:border-[#2563EB]'
                              }`}
                            >
                              {isPref ? <Accessibility className="h-4 w-4" /> : seatNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
