import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Settings, Lock, Edit2, LogOut, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { updateMe } from '../api/users';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export default function Configuracoes() {
  const navigate = useNavigate();
  const { user, logout, login, token } = useAuth();
  const { showToast } = useToast();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [changeType, setChangeType] = useState<'EMAIL' | 'PHONE' | 'PASSWORD' | null>(null);
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const resetForm = () => {
    setShowEditModal(false);
    setChangeType(null);
    setNewValue('');
    setError('');
  };

  const handleLogout = () => {
    setConfirmLogoutOpen(true);
  };

  const performLogout = () => {
    setConfirmLogoutOpen(false);
    logout();
    navigate('/login');
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
                {user?.name?.substring(0, 2)?.toUpperCase() || ''}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-[#131B2E]">{user?.name || ''}</h2>
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
                  onClick={() => {
                    setChangeType('PASSWORD');
                    setShowEditModal(true);
                  }}
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
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#131B2E]">Alteração Cadastral</h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-[#434655] hover:text-[#131B2E] transition"
              >
                ✕ Fechar
              </button>
            </div>

            {error && (
              <div className="p-3 mb-5 bg-red-50 border border-red-200 rounded-[12px] text-xs font-semibold text-[#BA1A1A]">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#434655] uppercase tracking-wider font-outfit">O que deseja alterar?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'EMAIL', label: 'E-mail' },
                    { id: 'PHONE', label: 'Telefone' },
                    { id: 'PASSWORD', label: 'Senha' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setChangeType(t.id as any);
                        setNewValue('');
                        setError('');
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-[8px] border transition ${
                        changeType === t.id
                          ? 'bg-[#2563EB] border-[#2563EB] text-white'
                          : 'border-[#C3C6D7]/40 text-[#434655] hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {changeType === 'EMAIL' && (
                <Input
                  id="new-email"
                  label="Novo E-mail"
                  type="email"
                  placeholder="novo@email.com"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              )}

              {changeType === 'PHONE' && (
                <Input
                  id="new-phone"
                  label="Novo Telefone"
                  placeholder="(00) 00000-0000"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              )}

              {changeType === 'PASSWORD' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-[12px] text-xs font-medium text-amber-800 leading-relaxed">
                  Por motivos de segurança e compliance, a alteração de senha de gestores municipais deve ser solicitada à equipe de administração de TI ou realizada pelo fluxo de recuperação de senha por e-mail.
                </div>
              )}

              <div className="flex gap-4 mt-6 border-t border-[#C3C6D7]/15 pt-6">
                <Button
                  loading={loading}
                  disabled={changeType === 'PASSWORD'}
                  onClick={async () => {
                    if (!changeType) {
                      setError('Selecione o tipo de alteração.');
                      return;
                    }
                    if (changeType === 'PASSWORD') {
                      setError('A alteração de senha deve ser realizada via suporte.');
                      return;
                    }
                    if (!newValue.trim()) {
                      setError('Preencha o novo valor.');
                      return;
                    }
                    if (changeType === 'EMAIL' && !newValue.includes('@')) {
                      setError('Digite um e-mail válido.');
                      return;
                    }
                    setLoading(true);
                    setError('');
                    try {
                      const payload = changeType === 'EMAIL' ? { email: newValue } : { phone: newValue };
                      const updated = await updateMe(payload);
                      if (user && token) {
                        login(token, updated);
                      }
                      showToast('Dados cadastrais atualizados com sucesso!', 'success');
                      resetForm();
                    } catch (err: any) {
                      setError(err.response?.data?.message || 'Erro ao atualizar dados cadastrais.');
                      showToast(err.response?.data?.message || 'Erro ao atualizar dados cadastrais.', 'error');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex-1 py-3"
                >
                  Salvar Alteração
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 py-3"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmLogoutOpen}
        title="Deseja realmente sair?"
        description="Ao sair do painel administrativo, você precisará informar suas credenciais novamente para acessar."
        confirmLabel="Sair"
        variant="danger"
        onConfirm={performLogout}
        onCancel={() => setConfirmLogoutOpen(false)}
      />
    </div>
  );
}
