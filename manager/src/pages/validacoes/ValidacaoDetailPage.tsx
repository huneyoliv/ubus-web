import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Check, X, Accessibility } from 'lucide-react';
import { listUsers, updateStatus, reviewAccessibility } from '../../api/users';
import { User } from '../../stores/auth.store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function ValidacaoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [error, setError] = useState('');

  const originTab = (location.state as any)?.originTab || 'cadastros';

  useEffect(() => {
    async function loadStudent() {
      if (!id) return;
      try {
        let list: User[] = [];
        if (originTab === 'cadastros') {
          list = await listUsers({ role: 'STUDENT', status: 'PENDING' });
        } else if (originTab === 'renovacoes') {
          list = await listUsers({ role: 'STUDENT', status: 'RENEWAL_PENDING' });
        } else if (originTab === 'acessibilidade') {
          list = await listUsers({ role: 'STUDENT', accessibilityStatus: 'PENDING_REVIEW' });
        }

        let found = list.find((u) => u.id === id);

        if (!found) {
          const fallbackLists = await Promise.all([
            listUsers({ role: 'STUDENT', status: 'PENDING' }),
            listUsers({ role: 'STUDENT', status: 'RENEWAL_PENDING' }),
            listUsers({ role: 'STUDENT', accessibilityStatus: 'PENDING_REVIEW' }),
          ]);
          found = fallbackLists.flat().find((u) => u.id === id);
        }

        if (found) {
          setStudent(found);
        } else {
          setError('Estudante não encontrado ou já processado.');
        }
      } catch (err) {
        setError('Erro ao carregar os detalhes do estudante.');
      } finally {
        setLoading(false);
      }
    }
    loadStudent();
  }, [id, originTab]);

  const handleStatusAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (!student) return;
    setActionLoading(true);
    setError('');
    try {
      await updateStatus(student.id, status);
      navigate('/validacoes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao processar ação.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccessibilityAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (!student) return;
    if (status === 'REJECTED' && !reviewNote.trim()) {
      setError('Por favor, informe a justificativa da rejeição.');
      return;
    }
    setActionLoading(true);
    setError('');
    try {
      await reviewAccessibility(student.id, { status, reviewNote: reviewNote || undefined });
      navigate('/validacoes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao processar ação.');
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

  if (error || !student) {
    return (
      <div className="flex flex-col gap-6">
        <button onClick={() => navigate('/validacoes')} className="flex items-center gap-2 text-sm font-bold text-[#2563EB]">
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar para lista</span>
        </button>
        <Card className="p-8 text-center border-red-200 bg-red-50 text-[#BA1A1A]">
          <p className="font-bold">{error || 'Estudante não encontrado.'}</p>
        </Card>
      </div>
    );
  }

  const isCadastro = student.status === 'PENDING' && originTab === 'cadastros';
  const isRenovacao = student.status === 'RENEWAL_PENDING' || originTab === 'renovacoes';
  const isAcessibilidade = originTab === 'acessibilidade' || student.accessibilityStatus === 'PENDING_REVIEW';

  return (
    <div className="flex flex-col gap-8">
      <button onClick={() => navigate('/validacoes')} className="flex items-center gap-2 text-sm font-bold text-[#2563EB] self-start">
        <ArrowLeft className="h-5 w-5" />
        <span>Voltar para lista</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="flex flex-col gap-6">
            <div className="flex items-center gap-5 border-b border-[#C3C6D7]/30 pb-6">
              <div className="h-16 w-16 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-2xl">
                {student.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-[#131B2E]">{student.name}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#434655]">CPF: {student.cpf}</span>
                  <StatusBadge status={isAcessibilidade ? (student.accessibilityStatus as any) : student.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">E-mail</span>
                <p className="text-sm font-semibold text-[#131B2E] mt-1">{student.email}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Telefone</span>
                <p className="text-sm font-semibold text-[#131B2E] mt-1">{student.phone || 'Não informado'}</p>
              </div>
            </div>
          </Card>

          {isAcessibilidade && (
            <Card className="flex flex-col gap-6 border-l-4 border-l-violet-500">
              <h3 className="text-lg font-bold text-[#131B2E] flex items-center gap-2">
                Solicitação de Acessibilidade
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Condição Alegada</span>
                  <p className="text-sm font-bold text-[#2563EB] mt-1 uppercase">{student.accessibilityReason || 'PCD'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#434655] uppercase tracking-wider">Necessita de Elevador?</span>
                  <div className="flex items-center gap-2 mt-1">
                    {student.needsWheelchair ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-100 text-violet-800 text-xs font-bold rounded-full">
                        <Accessibility className="h-4 w-4" />
                        Sim (Cadeirante)
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-[#131B2E]">Não</span>
                    )}
                  </div>
                </div>
              </div>
              {student.accessibilityDocUrl ? (
                <a
                  href={student.accessibilityDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-50 border border-[#C3C6D7]/40 rounded-[12px] hover:border-[#2563EB] hover:bg-[#F0F4FF] transition-all"
                >
                  <FileText className="h-6 w-6 text-violet-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#131B2E]">Documento Probatório</span>
                    <span className="text-xs font-semibold text-[#434655]">Clique para visualizar o laudo</span>
                  </div>
                </a>
              ) : (
                <div className="p-4 bg-red-50 text-[#BA1A1A] border border-red-100 rounded-[12px] text-xs font-semibold">
                  Nenhum laudo médico foi anexado.
                </div>
              )}
            </Card>
          )}

          {!isAcessibilidade && (
            <Card className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-[#131B2E]">Documentos de Matrícula</h3>
              <div className="flex flex-col gap-4">
                {student.gradeFileUrl ? (
                  <a
                    href={student.gradeFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-50 border border-[#C3C6D7]/40 rounded-[12px] hover:border-[#2563EB] hover:bg-[#F0F4FF] transition-all"
                  >
                    <FileText className="h-6 w-6 text-[#2563EB]" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#131B2E]">Comprovante de Matrícula</span>
                      <span className="text-xs font-semibold text-[#434655]">Clique para visualizar o arquivo</span>
                    </div>
                  </a>
                ) : (
                  <div className="p-4 bg-red-50 text-[#BA1A1A] border border-red-100 rounded-[12px] text-xs font-semibold">
                    Comprovante de matrícula não enviado.
                  </div>
                )}

                {student.residenciaFileUrl ? (
                  <a
                    href={student.residenciaFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 bg-slate-50 border border-[#C3C6D7]/40 rounded-[12px] hover:border-[#2563EB] hover:bg-[#F0F4FF] transition-all"
                  >
                    <FileText className="h-6 w-6 text-[#2563EB]" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#131B2E]">Comprovante de Residência</span>
                      <span className="text-xs font-semibold text-[#434655]">Clique para visualizar o arquivo</span>
                    </div>
                  </a>
                ) : (
                  <div className="p-4 bg-red-50 text-[#BA1A1A] border border-red-100 rounded-[12px] text-xs font-semibold">
                    Comprovante de residência não enviado.
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-5 p-6 bg-slate-50 border-dashed">
            <h3 className="text-base font-bold text-[#131B2E]">Ações Administrativas</h3>
            <p className="text-xs font-semibold text-[#434655]">
              Avalie minuciosamente os documentos antes de aprovar. A aprovação dará acesso imediato ao aplicativo Ubus.
            </p>

            <div className="flex flex-col gap-3">
              {isAcessibilidade ? (
                <>
                  {!showRejectForm ? (
                    <>
                      <Button
                        onClick={() => handleAccessibilityAction('APPROVED')}
                        loading={actionLoading}
                        className="w-full flex items-center justify-center gap-2 py-3"
                      >
                        <Check className="h-5 w-5" />
                        Aprovar Acessibilidade
                      </Button>
                      <Button
                        onClick={() => setShowRejectForm(true)}
                        variant="destructive"
                        className="w-full flex items-center justify-center gap-2 py-3"
                      >
                        <X className="h-5 w-5" />
                        Recusar Solicitação
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <textarea
                        placeholder="Informe o motivo da rejeição (obrigatório para o aluno)..."
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        className="w-full p-3 border border-[#C3C6D7] rounded-[12px] text-sm outline-none focus:border-[#BA1A1A] focus:ring-4 focus:ring-[#BA1A1A]/10 h-24"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAccessibilityAction('REJECTED')}
                          variant="destructive"
                          loading={actionLoading}
                          className="flex-1 py-2.5"
                        >
                          Confirmar Recusa
                        </Button>
                        <Button
                          onClick={() => {
                            setShowRejectForm(false);
                            setError('');
                          }}
                          variant="outline"
                          className="flex-1 py-2.5"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleStatusAction('APPROVED')}
                    loading={actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-3"
                  >
                    <Check className="h-5 w-5" />
                    {isRenovacao ? 'Aprovar Renovação' : 'Aprovar Cadastro'}
                  </Button>
                  <Button
                    onClick={() => handleStatusAction('REJECTED')}
                    variant="destructive"
                    loading={actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-3"
                  >
                    <X className="h-5 w-5" />
                    {isRenovacao ? 'Rejeitar Renovação' : 'Rejeitar Cadastro'}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
