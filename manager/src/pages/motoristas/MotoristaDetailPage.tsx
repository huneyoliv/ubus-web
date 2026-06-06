import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ShieldAlert } from 'lucide-react';
import { listUsers, updateStatus } from '../../api/users';
import { User } from '../../stores/auth.store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useToast } from '../../hooks/useToast';

export default function MotoristaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [driver, setDriver] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDriver() {
      if (!id) return;
      try {
        const list = await listUsers({ role: 'DRIVER' });
        const found = list.find((d) => d.id === id);
        if (found) {
          setDriver(found);
        } else {
          setError('Motorista não encontrado.');
        }
      } catch (err) {
        setError('Erro ao carregar os dados do motorista.');
      } finally {
        setLoading(false);
      }
    }
    loadDriver();
  }, [id]);

  const handleStatusChange = async (status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
    if (!driver) return;
    setActionLoading(true);
    setError('');
    try {
      await updateStatus(driver.id, status as any);
      showToast('Status do motorista atualizado com sucesso!', 'success');
      navigate('/motoristas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao processar ação.');
      showToast(err.response?.data?.message || 'Erro ao processar ação.', 'error');
    } finally {
      setActionLoading(false);
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

  if (error || !driver) {
    return (
      <div className="flex flex-col gap-6">
        <button onClick={() => navigate('/motoristas')} className="flex items-center gap-2 text-sm font-bold text-[#2563EB]">
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar para motoristas</span>
        </button>
        <Card className="p-8 text-center text-[#BA1A1A]">{error || 'Motorista não encontrado.'}</Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <button onClick={() => navigate('/motoristas')} className="flex items-center gap-2 text-sm font-bold text-[#2563EB] self-start">
        <ArrowLeft className="h-5 w-5" />
        <span>Voltar para motoristas</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="flex flex-col gap-6">
            <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
              <div className="h-16 w-16 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-2xl font-outfit">
                {driver.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-[#131B2E]">{driver.name}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#434655]">CPF: {driver.cpf}</span>
                  <StatusBadge status={driver.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">E-mail de Acesso</span>
                <p className="text-sm font-semibold text-[#131B2E] mt-1">{driver.email}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Telefone de Contato</span>
                <p className="text-sm font-semibold text-[#131B2E] mt-1">{driver.phone || 'Não cadastrado'}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-5 p-6 bg-slate-50 border-dashed">
            <h3 className="text-base font-bold text-[#131B2E]">Gerenciamento de Conta</h3>
            <p className="text-xs font-semibold text-[#434655]">
              Defina se o motorista está autorizado a operar no transporte escolar do município.
            </p>

            <div className="flex flex-col gap-3">
              {driver.status === 'PENDING' && (
                <>
                  <Button
                    onClick={() => handleStatusChange('APPROVED')}
                    loading={actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-3"
                  >
                    <Check className="h-5 w-5" />
                    Aprovar Motorista
                  </Button>
                  <Button
                    onClick={() => handleStatusChange('REJECTED')}
                    variant="destructive"
                    loading={actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-3"
                  >
                    <X className="h-5 w-5" />
                    Rejeitar Cadastro
                  </Button>
                </>
              )}

              {driver.status === 'APPROVED' && (
                <Button
                  onClick={() => handleStatusChange('SUSPENDED')}
                  variant="destructive"
                  loading={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  <ShieldAlert className="h-5 w-5" />
                  Suspender Motorista
                </Button>
              )}

              {driver.status === 'SUSPENDED' && (
                <Button
                  onClick={() => handleStatusChange('APPROVED')}
                  loading={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  <Check className="h-5 w-5" />
                  Reativar Motorista
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
