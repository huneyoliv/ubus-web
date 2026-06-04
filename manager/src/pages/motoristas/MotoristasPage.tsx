import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, RefreshCw, ArrowRight } from 'lucide-react';
import { listUsers } from '../../api/users';
import { User } from '../../stores/auth.store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function MotoristasPage() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const data = await listUsers({ role: 'DRIVER' });
      setDrivers(data);
    } catch (err) {
      // Silenciado
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  return (
    <div className="flex flex-col gap-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit">Motoristas</h1>
          <p className="text-sm font-semibold text-[#434655] mt-1">
            Gerencie os motoristas escolares do município.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadDrivers}
            disabled={loading}
            className="p-2.5 bg-white border border-[#C3C6D7]/40 rounded-[12px] text-[#434655] hover:text-[#131B2E] hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Button onClick={() => navigate('/motoristas/cadastro')} className="flex items-center gap-2 py-2.5">
            <Plus className="h-5 w-5" />
            <span>Cadastrar Motorista</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-[18px]" />
          ))}
        </div>
      ) : drivers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2">
          <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[#131B2E]">Nenhum motorista cadastrado</h3>
          <p className="text-xs font-semibold text-[#434655] mt-1.5 mb-6">
            Adicione motoristas autorizados a realizar viagens de transporte escolar.
          </p>
          <Button onClick={() => navigate('/motoristas/cadastro')}>Cadastrar Motorista</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {drivers.map((drv) => (
            <div key={drv.id} onClick={() => navigate(`/motoristas/${drv.id}`)} className="group cursor-pointer">
              <Card className="flex items-center justify-between p-5 hover:shadow-lg hover:border-[#2563EB]/30 transition-all duration-200">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-[#131B2E] group-hover:text-[#2563EB] transition-colors">
                      {drv.name}
                    </h4>
                    <StatusBadge status={drv.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#434655]">
                    <span>CPF: {drv.cpf}</span>
                    <span>•</span>
                    <span>Email: {drv.email}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
