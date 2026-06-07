import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus as BusIcon, Plus, X, Shield, ShieldAlert, Sparkles } from 'lucide-react';
import { listBuses, createBus, Bus } from '../../api/fleet';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BusWizard } from '../../components/bus/BusWizard';

export default function FrotaPage() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [listError, setListError] = useState('');

  const [drawerStep, setDrawerStep] = useState<1 | 2 | 3>(1);
  const [plate, setPlate] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [capacity, setCapacity] = useState(40);
  const [layout, setLayout] = useState<'EXECUTIVO' | 'LEITO'>('EXECUTIVO');
  const [hasBathroom, setHasBathroom] = useState(false);
  const [hasAirConditioning, setHasAirConditioning] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadBuses = async () => {
    setLoading(true);
    setListError('');
    try {
      const data = await listBuses();
      setBuses(data);
    } catch (err: any) {
      setListError(err.response?.data?.message || err.message || 'Erro ao carregar a frota de ônibus.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const resetDrawer = () => {
    setPlate('');
    setIdentificationNumber('');
    setCapacity(40);
    setLayout('EXECUTIVO');
    setHasBathroom(false);
    setHasAirConditioning(false);
    setHasElevator(false);
    setError('');
    setDrawerStep(1);
    setShowDrawer(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) {
      setError('A placa do veículo é obrigatória.');
      return;
    }
    if (!identificationNumber.trim()) {
      setError('O prefixo / identificação do veículo é obrigatório.');
      return;
    }
    if (capacity <= 0) {
      setError('A capacidade do veículo deve ser maior que 0.');
      return;
    }

    setSubmitLoading(true);
    setError('');
    try {
      // Define assentos preferenciais como os 4 primeiros assentos
      const preferentialSeats = capacity >= 4 ? [1, 2, 3, 4] : Array.from({ length: capacity }, (_, i) => i + 1);
      await createBus({
        plate,
        identificationNumber,
        capacity,
        hasBathroom,
        hasAirConditioning,
        hasElevator,
        active: true,
        preferentialSeats,
      });
      resetDrawer();
      loadBuses();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao cadastrar o ônibus.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit">Frota de Ônibus</h1>
          <p className="text-sm font-semibold text-[#434655] mt-1">
            Gerencie os veículos de transporte escolar disponíveis no município.
          </p>
        </div>
        <Button onClick={() => setShowDrawer(true)} className="flex items-center gap-2 py-2.5">
          <Plus className="h-5 w-5" />
          <span>Cadastrar Veículo</span>
        </Button>
      </div>

      {listError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[18px] text-sm font-semibold text-[#BA1A1A]">
          {listError}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-[18px]" />
          ))}
        </div>
      ) : buses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2">
          <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
            <BusIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[#131B2E]">Nenhum veículo cadastrado</h3>
          <p className="text-xs font-semibold text-[#434655] mt-1.5 mb-6">
            Comece adicionando o primeiro ônibus escolar da frota do município.
          </p>
          <Button onClick={() => setShowDrawer(true)}>Cadastrar Veículo</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <div key={bus.id} onClick={() => navigate(`/frota/${bus.id}`)} className="group cursor-pointer">
              <Card className="h-full flex flex-col justify-between p-6 hover:shadow-lg hover:border-[#2563EB]/30 transition-all duration-200">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-xl font-black text-[#131B2E] tracking-wider font-outfit uppercase">
                          {bus.plate}
                        </h3>
                        {bus.identificationNumber && (
                          <span className="text-xs font-bold text-[#434655] font-outfit">
                            #{bus.identificationNumber}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[#434655]">Capacidade: {bus.capacity} alunos</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      bus.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {bus.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {bus.hasAirConditioning && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">
                        ❄️ Ar-condicionado
                      </span>
                    )}
                    {bus.hasBathroom && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                        🚻 Banheiro
                      </span>
                    )}
                    {bus.hasElevator && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-violet-50 text-violet-800 text-[10px] font-bold">
                        ♿ Elevador PCD
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#C3C6D7]/15 pt-4 mt-6 text-[10px] font-bold text-[#434655] flex items-center justify-between">
                  <span>Vínculo de rota</span>
                  <span className={bus.routeId ? 'text-[#2563EB]' : 'text-amber-600'}>
                    {bus.routeId ? 'Vinculado à Rota' : 'Sem Rota Vinculada'}
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {showDrawer && (
        <BusWizard
          onClose={() => setShowDrawer(false)}
          onSaved={() => {
            setShowDrawer(false);
            loadBuses();
          }}
        />
      )}
    </div>
  );
}
