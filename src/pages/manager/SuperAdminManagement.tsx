import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Buildings, UserPlus, ShieldCheck, WarningCircle, PaperPlaneTilt, IdentificationBadge, EnvelopeSimple, Key, Plus, Check } from 'phosphor-react';
import { api } from '@/lib/api';
import type { Prefeitura } from '@/types';

export default function SuperAdminManagement() {
  const [municipalities, setMunicipalities] = useState<Prefeitura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [muniName, setMuniName] = useState('');
  
  const [managerData, setManagerData] = useState({
    municipalityId: '',
    cpf: '',
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  useEffect(() => {
    fetchMunicipalities();
  }, []);

  async function fetchMunicipalities() {
    console.log('[DEBUG] Recuperando mapeamento de unidades federativas...');
    try {
      const data = await api.get<Prefeitura[]>('/management');
      console.log('[DEBUG] Unidades indexadas:', data.length);
      setMunicipalities(data);
    } catch (err) {
      console.error('[DEBUG] Falha na indexação de prefeituras:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMunicipality(e: React.FormEvent) {
    e.preventDefault();
    console.log('[DEBUG] Provisionando nova unidade:', muniName);
    setError(null);
    setSuccess(null);
    try {
      await api.post('/management', { name: muniName });
      console.log('[DEBUG] Unidade provisionada com sucesso');
      setSuccess('Infraestrutura provisionada com sucesso!');
      setMuniName('');
      fetchMunicipalities();
    } catch (err: any) {
      console.error('[DEBUG] Erro no provisionamento:', err);
      setError(err.body?.message || 'Falha crítica no provisionamento de rede.');
    }
  }

  async function handleCreateManager(e: React.FormEvent) {
    e.preventDefault();
    console.log('[DEBUG] Aprovisionando novo gestor de nível 2:', managerData.name);
    setError(null);
    setSuccess(null);
    try {
      await api.post('/management/managers', managerData);
      console.log('[DEBUG] Credenciais geradas e vinculadas');
      setSuccess('Privilégios de gestão concedidos com sucesso!');
      setManagerData({
        municipalityId: '',
        cpf: '',
        name: '',
        email: '',
        password: '',
        phone: ''
      });
    } catch (err: any) {
      console.error('[DEBUG] Erro no aprovisionamento de privilégios:', err);
      setError(err.body?.message || 'Falha na delegação de privilégios administrativos.');
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Mapeando Matriz de Autoridade</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto w-full space-y-12 animate-spring-up overflow-hidden pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} weight="bold" className="text-blue-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-blue-500">Security Architecture</span>
        </div>
        <h1 className="text-5xl font-black font-display tracking-tighter text-white">Central de <span className="text-zinc-500">Provisionamento</span></h1>
        <p className="text-xs font-medium text-zinc-400 max-w-xl">Gerenciamento de infraestrutura municipal e alocação de privilégios de gestão operacional.</p>
      </header>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-[32px] bg-rose-500/10 border-2 border-rose-500/20 flex items-center gap-4 text-rose-500"
          >
             <WarningCircle size={32} weight="duotone" />
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Erro Operacional</p>
                <p className="text-xs font-bold">{error}</p>
             </div>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-[32px] bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center gap-4 text-emerald-500"
          >
             <Check size={32} weight="bold" />
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Protocolo Concluído</p>
                <p className="text-xs font-bold">{success}</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-10">
        <section className="col-span-12 lg:col-span-5 space-y-6">
           <div className="flex items-center gap-3 ml-4">
              <Buildings size={20} weight="bold" className="text-blue-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Configurar Filial</h3>
           </div>
           
           <div className="glass border-2 border-[var(--color-border)] rounded-[48px] p-10 space-y-8 shadow-2xl shadow-black/20 overflow-hidden relative group">
              <div className="space-y-2">
                 <h2 className="text-2xl font-black font-display text-white tracking-tight leading-none italic">Provisionar Unidade</h2>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nova Entidade Federativa</p>
              </div>

              <form onSubmit={handleCreateMunicipality} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Nome Oficial</label>
                    <input
                      type="text"
                      value={muniName}
                      onChange={(e) => setMuniName(e.target.value)}
                      className="w-full h-16 px-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all placeholder:text-white/10"
                      placeholder="PREFEITURA DE..."
                      required
                    />
                 </div>
                 <button type="submit" className="w-full h-16 rounded-[24px] bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3">
                    Estabelecer Conexão <Plus size={18} weight="bold" />
                 </button>
              </form>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
           </div>
        </section>

        <section className="col-span-12 lg:col-span-7 space-y-6">
           <div className="flex items-center gap-3 ml-4">
              <UserPlus size={20} weight="bold" className="text-blue-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Delegar Autoridade</h3>
           </div>

           <div className="glass border-2 border-[var(--color-border)] rounded-[48px] p-10 md:p-14 space-y-10 shadow-2xl shadow-black/20">
              <div className="space-y-2">
                 <h2 className="text-2xl font-black font-display text-white tracking-tight leading-none italic">Aprovisionar Gestor</h2>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nível de Acesso Operacional</p>
              </div>

              <form onSubmit={handleCreateManager} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Unidade de Lotação</label>
                       <select
                          value={managerData.municipalityId}
                          onChange={(e) => setManagerData({ ...managerData, municipalityId: e.target.value })}
                          className="w-full h-16 px-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 appearance-none transition-all"
                          required
                       >
                          <option value="" className="bg-zinc-900 italic">SELECIONAR FILIAL</option>
                          {municipalities.filter(m => m.id !== '00000000-0000-0000-0000-000000000001').map((m) => (
                             <option key={m.id} value={m.id} className="bg-zinc-900">{m.name}</option>
                          ))}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Nome Completo</label>
                       <input
                          type="text"
                          value={managerData.name}
                          onChange={(e) => setManagerData({ ...managerData, name: e.target.value })}
                          className="w-full h-16 px-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all"
                          required
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Identidade Biológica (CPF)</label>
                       <div className="relative">
                          <IdentificationBadge size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                          <input
                             type="text"
                             value={managerData.cpf}
                             onChange={(e) => setManagerData({ ...managerData, cpf: e.target.value })}
                             className="w-full h-16 pl-14 pr-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all font-mono"
                             placeholder="000.000.000-00"
                             required
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Chave de Acesso</label>
                       <div className="relative">
                          <Key size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                          <input
                             type="password"
                             value={managerData.password}
                             onChange={(e) => setManagerData({ ...managerData, password: e.target.value })}
                             className="w-full h-16 pl-14 pr-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all"
                             placeholder="••••••••"
                             required
                          />
                       </div>
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">E-mail Operacional</label>
                       <div className="relative">
                          <EnvelopeSimple size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                          <input
                             type="email"
                             value={managerData.email}
                             onChange={(e) => setManagerData({ ...managerData, email: e.target.value })}
                             className="w-full h-16 pl-14 pr-8 rounded-[24px] glass border-2 border-white/5 text-white text-sm font-bold outline-none focus:border-blue-500 transition-all"
                             placeholder="exemplo@ubus.com.br"
                             required
                          />
                       </div>
                    </div>
                 </div>

                 <button type="submit" className="w-full h-20 rounded-[32px] bg-zinc-500 text-white font-black font-display text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-blue-600 transition-all active:scale-[0.98] border border-white/5 flex items-center justify-center gap-4">
                    Confirmar Homologação Central <PaperPlaneTilt size={24} weight="bold" />
                 </button>
              </form>
           </div>
        </section>
      </div>
    </div>
  );
}
