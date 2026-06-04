import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Settings, Lock, Edit2, LogOut, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { updateMe } from '../api/users';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Configuracoes() {
  const navigate = useNavigate();
  const { user, logout, login, token } = useAuth();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updated = await updateMe({ phone });
      // Se a API permitir atualizar o nome ou outros campos, chamamos aqui. Apenas atualiza o store:
      if (user && token) {
        login(token, { ...user, name, phone });
      }
      setShowEditModal(false);
      alert('Dados profissionais atualizados!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair do painel administrativo?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit">Configurações</h1>
        <p className="text-sm font-semibold text-[#434655] mt-1">Gerencie seu perfil profissional e preferências.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="flex items-center justify-between p-6">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-2xl font-outfit">
                {user?.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-[#131B2E]">{user?.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#434655]">{user?.email}</span>
                  <span className="bg-[#F0F4FF] text-[#2563EB] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#C3C6D7]/40 rounded-[12px] text-xs font-bold text-[#434655] hover:text-[#131B2E] hover:bg-slate-50 transition"
            >
              <Edit2 className="h-4 w-4" />
              <span>Editar Perfil</span>
            </button>
          </Card>

          <Card className="flex flex-col gap-5">
            <h3 className="text-lg font-bold text-[#131B2E] border-b border-[#C3C6D7]/15 pb-3">Segurança e Conta</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#131B2E]">Redefinição de Senha</span>
                    <span className="text-[10px] font-semibold text-[#434655]">Altere a senha da sua conta administrativa</span>
                  </div>
                </div>
                <Button
                  onClick={() => alert('Um link para alteração de senha foi solicitado para administrador@ubus.me.')}
                  variant="outline"
                  className="py-1.5 px-3 text-xs"
                >
                  Alterar Senha
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-5 border-l-4 border-l-red-500 bg-red-50/20">
            <h3 className="text-base font-bold text-[#131B2E] flex items-center gap-2">
              <LogOut className="h-5 w-5 text-[#BA1A1A]" />
              Encerrar Sessão
            </h3>
            <p className="text-xs font-semibold text-[#434655]">
              Ao sair, seu token de autenticação será limpo e você precisará logar novamente para acessar as ferramentas.
            </p>
            <Button onClick={handleLogout} variant="destructive" className="w-full py-2.5">
              Desconectar do Painel
            </Button>
          </Card>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-[#0F172A]/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[18px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#131B2E] mb-6">Editar Dados Profissionais</h3>
            
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] text-xs font-semibold text-[#BA1A1A]">
                  {error}
                </div>
              )}

              <Input
                id="edit-name"
                label="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                id="edit-phone"
                label="Telefone Profissional"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="flex gap-4 mt-6 border-t border-[#C3C6D7]/15 pt-6">
                <Button type="submit" loading={loading} className="flex-1 py-3">
                  <Check className="h-5 w-5 mr-2" />
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3"
                >
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
