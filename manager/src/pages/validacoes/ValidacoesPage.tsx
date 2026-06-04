import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ClipboardCheck, ArrowRight } from 'lucide-react';
import { listUsers } from '../../api/users';
import { User } from '../../stores/auth.store';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function ValidacoesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cadastros');
  const [cadastros, setCadastros] = useState<User[]>([]);
  const [renovacoes, setRenovacoes] = useState<User[]>([]);
  const [acessibilidade, setAcessibilidade] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cadList, renList, accList] = await Promise.all([
        listUsers({ role: 'STUDENT', status: 'PENDING' }),
        listUsers({ role: 'STUDENT', status: 'RENEWAL_PENDING' }),
        listUsers({ role: 'STUDENT', accessibilityStatus: 'PENDING_REVIEW' }),
      ]);
      setCadastros(cadList);
      setRenovacoes(renList);
      setAcessibilidade(accList);
    } catch (err) {
      // Silenciado
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const renderList = (items: User[], type: 'status' | 'accessibility') => {
    if (loading) {
      return (
        <div className="flex flex-col gap-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-[18px]" />
          ))}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
          <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
            <ClipboardCheck className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[#131B2E]">Tudo em dia!</h3>
          <p className="text-xs font-semibold text-[#434655] mt-1.5">
            Nenhuma solicitação pendente nesta categoria.
          </p>
        </Card>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/validacoes/${item.id}`, { state: { originTab: activeTab } })}
            className="group cursor-pointer"
          >
            <Card className="flex items-center justify-between p-5 hover:shadow-lg hover:border-[#2563EB]/30 transition-all duration-200">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-[#131B2E] group-hover:text-[#2563EB] transition-colors">
                    {item.name}
                  </h4>
                  <StatusBadge status={type === 'accessibility' ? (item.accessibilityStatus as any) : item.status} />
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-[#434655]">
                  <span>CPF: {item.cpf}</span>
                  <span>•</span>
                  <span>Email: {item.email}</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
            </Card>
          </div>
        ))}
      </div>
    );
  };

  const tabsConfig = [
    {
      id: 'cadastros',
      label: 'Cadastros Novos',
      count: cadastros.length,
      content: renderList(cadastros, 'status'),
    },
    {
      id: 'renovacoes',
      label: 'Renovações de Matrícula',
      count: renovacoes.length,
      content: renderList(renovacoes, 'status'),
    },
    {
      id: 'acessibilidade',
      label: 'Solicitações PCD / TEA',
      count: acessibilidade.length,
      content: renderList(acessibilidade, 'accessibility'),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#131B2E] tracking-tight font-outfit">Validações</h1>
          <p className="text-sm font-semibold text-[#434655] mt-1">
            Analise e responda às solicitações de alunos do município.
          </p>
        </div>
        <button
          onClick={loadAll}
          disabled={loading}
          className="p-2.5 bg-white border border-[#C3C6D7]/40 rounded-[12px] text-[#434655] hover:text-[#131B2E] hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <Tabs tabs={tabsConfig} defaultValue={activeTab} onValueChange={setActiveTab} />
    </div>
  );
}
