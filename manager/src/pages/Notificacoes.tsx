import React, { useEffect, useState } from 'react';
import { Bell, Users, Route as RouteIcon, Send } from 'lucide-react';
import { sendNotification } from '../api/notifications';
import { listRoutes, Route } from '../api/fleet';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Notificacoes() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'MUNICIPALITY' | 'ROUTE'>('MUNICIPALITY');
  const [targetId, setTargetId] = useState('');
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user?.municipalityId && target === 'MUNICIPALITY') {
      setTargetId(user.municipalityId);
    } else {
      setTargetId('');
    }
  }, [target, user]);

  useEffect(() => {
    async function loadRoutes() {
      if (target !== 'ROUTE') return;
      setLoadingRoutes(true);
      try {
        const data = await listRoutes();
        setRoutes(data);
      } catch (err) {
        // Silenciado
      } finally {
        setLoadingRoutes(false);
      }
    }
    loadRoutes();
  }, [target]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !targetId) {
      setErrorMsg('Preencha o título, a mensagem e selecione o destino da notificação.');
      return;
    }

    setSubmitLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await sendNotification({
        title,
        message,
        target,
        targetId,
      });
      setTitle('');
      setMessage('');
      setTarget('MUNICIPALITY');
      setSuccessMsg(`Notificação enviada para ${response.recipientCount} destinatário(s)!`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Erro ao enviar a notificação push.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit">Enviar Notificações</h1>
        <p className="text-sm font-semibold text-[#434655] mt-1">
          Envie alertas e comunicados urgentes via notificação push.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] text-xs font-semibold text-[#BA1A1A]">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] text-xs font-semibold text-[#10B981]">
                  {successMsg}
                </div>
              )}

              <Input
                id="title"
                label="Título da Mensagem"
                placeholder="Ex: Ônibus da rota Centro atrasado"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#434655]">Mensagem (Corpo do Push)</label>
                <textarea
                  placeholder="Escreva o comunicado detalhado aqui..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#C3C6D7] rounded-[12px] text-sm text-[#131B2E] outline-none focus:border-[#2563EB] h-24"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-[#434655]">Destinatários da Notificação</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setTarget('MUNICIPALITY')}
                    className={`flex items-center gap-4 p-4 border rounded-[12px] cursor-pointer transition-all duration-200 ${
                      target === 'MUNICIPALITY'
                        ? 'border-[#2563EB] bg-[#F0F4FF]'
                        : 'border-[#C3C6D7] hover:border-[#131B2E]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-[8px] ${target === 'MUNICIPALITY' ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#131B2E]">Todo o Município</h4>
                      <p className="text-[10px] font-semibold text-[#434655] mt-0.5">Alunos de todas as rotas</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setTarget('ROUTE')}
                    className={`flex items-center gap-4 p-4 border rounded-[12px] cursor-pointer transition-all duration-200 ${
                      target === 'ROUTE'
                        ? 'border-[#2563EB] bg-[#F0F4FF]'
                        : 'border-[#C3C6D7] hover:border-[#131B2E]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-[8px] ${target === 'ROUTE' ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <RouteIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#131B2E]">Rota Específica</h4>
                      <p className="text-[10px] font-semibold text-[#434655] mt-0.5">Apenas alunos de uma linha</p>
                    </div>
                  </div>
                </div>
              </div>

              {target === 'ROUTE' && (
                <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                  <label className="text-sm font-semibold text-[#434655]">Selecione a Rota Escolar</label>
                  {loadingRoutes ? (
                    <div className="h-10 bg-slate-100 rounded-[12px] animate-pulse" />
                  ) : (
                    <select
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#C3C6D7] rounded-[12px] text-sm text-[#131B2E] outline-none focus:border-[#2563EB]"
                    >
                      <option value="">Escolha a rota de destino...</option>
                      {routes.map((rt) => (
                        <option key={rt.id} value={rt.id}>
                          {rt.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <Button type="submit" loading={submitLoading} className="py-3 mt-2">
                <Send className="h-5 w-5 mr-2" />
                Enviar Notificação Push
              </Button>
            </form>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4 bg-slate-50 border-dashed">
            <h3 className="text-base font-bold text-[#131B2E] flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#2563EB]" />
              Como funciona?
            </h3>
            <p className="text-xs font-semibold text-[#434655] leading-relaxed">
              As notificações são enviadas instantaneamente em segundo plano para os celulares dos estudantes que possuem o aplicativo Ubus instalado e o token de push ativo.
            </p>
            <p className="text-xs font-semibold text-[#434655] leading-relaxed">
              Ao selecionar <strong>Todo o Município</strong>, os estudantes vinculados ao seu ID municipal serão notificados. Ao selecionar <strong>Rota Específica</strong>, apenas os estudantes com reservas confirmadas ou cadastrados naquela rota receberão.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
