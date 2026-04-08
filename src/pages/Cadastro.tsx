import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MagnifyingGlass, Check, Camera, FileText, HouseLine, Envelope, User, Phone, Lock, Warning } from 'phosphor-react';
import { api, ApiError } from '@/lib/api';
import type { Prefeitura, RegisterPayload } from '@/types';

function validateCpf(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;

  return true;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Cadastro() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [gradeFile, setGradeFile] = useState<File | null>(null);
  const [residenciaFile, setResidenciaFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [prefeituras, setPrefeituras] = useState<Prefeitura[]>([]);
  const [selectedPrefeitura, setSelectedPrefeitura] = useState('');
  const [loadingPrefeituras, setLoadingPrefeituras] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const gradeInputRef = useRef<HTMLInputElement>(null);
  const residenciaInputRef = useRef<HTMLInputElement>(null);
  const totalSteps = 4;

  useEffect(() => {
    if (step === 2 && prefeituras.length === 0) {
      setLoadingPrefeituras(true);
      console.log('[DEBUG] Buscando prefeituras públicas...');
      api.get<Prefeitura[]>('/management/public')
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          setPrefeituras(list.filter(p => p.active !== false));
        })
        .catch((err) => {
          console.error('[DEBUG] Erro ao buscar prefeituras:', err);
          setPrefeituras([]);
        })
        .finally(() => setLoadingPrefeituras(false));
    }
  }, [step, prefeituras.length]);

  const filteredPrefeituras = prefeituras.filter((p) =>
    (p.name || '').toLowerCase().includes((search || '').toLowerCase())
  );

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('[DEBUG] Foto capturada');
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (currentStep: number): string[] => {
    const errors: string[] = [];
    console.log(`[DEBUG] Validando passo ${currentStep}`);

    if (currentStep === 1) {
      if (!agreed) errors.push('Você precisa aceitar os termos de uso.');
      if (!name.trim()) errors.push('Preencha o nome completo.');
      if (!email.trim()) errors.push('Preencha o email.');
      else if (!validateEmail(email)) errors.push('Email institucional inválido.');
      const cpfDigits = cpf.replace(/\D/g, '');
      if (!cpfDigits) errors.push('Preencha o CPF.');
      else if (!validateCpf(cpfDigits)) errors.push('CPF inválido.');
    }

    if (currentStep === 2) {
      if (!selectedPrefeitura) errors.push('Selecione sua prefeitura.');
    }

    if (currentStep === 4) {
      if (!password) errors.push('Crie uma senha.');
      else if (password.length < 6) errors.push('Mínimo de 6 caracteres.');
      if (password !== confirmPassword) errors.push('As senhas não coincidem.');
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(step);
    setStepErrors(errors);
    if (errors.length > 0) return;

    if (step < totalSteps) {
      setStep(step + 1);
      setStepErrors([]);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    console.log('[DEBUG] Iniciando submissão de cadastro...');
    try {
      const payload: RegisterPayload = {
        municipalityId: selectedPrefeitura,
        cpf: cpf.replace(/\D/g, ''),
        name,
        email,
        password,
        phone: phone.replace(/\D/g, '') || undefined,
      };
      await api.post('/auth/register', payload);
      console.log('[DEBUG] Registro concluído com sucesso');
      navigate('/login');
    } catch (err) {
      console.error('[DEBUG] Erro no registro:', err);
      if (err instanceof ApiError) {
        if (err.status === 409) setError('Email ou CPF já cadastrado.');
        else setError('Falha no cadastro. Verifique os dados.');
      } else {
        setError('Erro de conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Identificação', 'Sua Cidade', 'Documentos', 'Segurança'];
  const stepSubtitles = [
    'Dados básicos para sua conta Ubus.',
    'Selecione a prefeitura do seu município.',
    'Anexe os comprovantes necessários.',
    'Defina uma senha de acesso robusta.',
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors duration-500">
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/login'))}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
          </button>
          
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-3)]">
              Etapa {step} de {totalSteps}
            </span>
            <div className="flex gap-1.5 h-1.5 w-32">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative"
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400"
                    initial={{ x: '-100%' }}
                    animate={{ x: i < step ? '0%' : '-100%' }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <main className="flex-1 flex flex-col max-w-xl mx-auto w-full px-6 py-10">
        <header className="mb-10 text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <h1 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight mb-2">
                {stepTitles[step - 1]}
              </h1>
              <p className="text-[var(--color-text-2)] text-lg font-medium">{stepSubtitles[step - 1]}</p>
            </motion.div>
          </AnimatePresence>
        </header>

        <section className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-5">
                  <InputField label="Nome Completo" icon={<User size={22} weight="duotone" />} placeholder="Ex: João Silva Santos" value={name} onChange={setName} />
                  <InputField label="Email Institucional" icon={<Envelope size={22} weight="duotone" />} placeholder="seu@email.edu.br" type="email" value={email} onChange={setEmail} />
                  <InputField label="CPF" placeholder="000.000.000-00" value={cpf} onChange={(v) => setCpf(formatCpf(v))} />
                  <InputField label="WhatsApp" icon={<Phone size={22} weight="duotone" />} placeholder="(00) 00000-0000" value={phone} onChange={(v) => setPhone(formatPhone(v))} />
                  
                  <label className="flex items-start gap-4 p-4 rounded-2xl glass border-[var(--color-border)] cursor-pointer group hover:bg-white/50 transition-colors">
                    <div className="pt-0.5">
                      <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="sr-only" />
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreed ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border)] group-hover:border-[var(--color-primary)]'}`}>
                        {agreed && <Check size={14} weight="bold" className="text-white" />}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-text-2)] leading-relaxed">
                      Concordo com o processamento dos meus dados conforme os <span className="text-[var(--color-primary)]">Termos de Uso</span> do ecossistema Ubus.
                    </span>
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 flex flex-col h-[50vh]">
                  <div className="relative group">
                    <MagnifyingGlass size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                    <input
                      className="input-field pl-12"
                      placeholder="Busque por seu município..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                    {loadingPrefeituras ? (
                      [1, 2, 3, 4].map((i) => <div key={i} className="h-20 rounded-2xl skeleton" />)
                    ) : (
                      filteredPrefeituras.map((pref) => (
                        <button
                          key={pref.id}
                          onClick={() => setSelectedPrefeitura(pref.id)}
                          className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border-2 ${selectedPrefeitura === pref.id ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]' : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50'}`}
                        >
                          <div className="text-left">
                            <p className="font-bold text-[var(--color-text)] tracking-tight">{pref.name}</p>
                            <p className="text-xs font-bold text-[var(--color-text-3)] uppercase tracking-widest mt-1">Município Parceiro</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPrefeitura === pref.id ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border)]'}`}>
                            {selectedPrefeitura === pref.id && <Check size={14} weight="bold" className="text-white" />}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <button 
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full group relative overflow-hidden rounded-3xl border-2 border-dashed border-[var(--color-border)] transition-all hover:border-[var(--color-primary)]/50 p-10 flex flex-col items-center gap-4 bg-[var(--color-surface)]"
                  >
                    <input ref={photoInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handlePhotoCapture} />
                    {photo ? (
                      <div className="relative w-32 h-32">
                        <img src={photo} alt="Rosto" className="w-full h-full object-cover rounded-2xl shadow-xl" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
                          <Check size={16} weight="bold" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                        <Camera size={32} weight="duotone" />
                      </div>
                    )}
                    <div className="text-center">
                      <p className="font-bold text-[var(--color-text)]">Selfie para Identificação</p>
                      <p className="text-sm font-medium text-[var(--color-text-3)] mt-1">Sua foto será usada na carteirinha digital</p>
                    </div>
                  </button>

                  <DocCard icon={<FileText size={28} weight="duotone" />} title="Grade de Horários" isUploaded={!!gradeFile} onClick={() => gradeInputRef.current?.click()} />
                  <input ref={gradeInputRef} type="file" className="hidden" onChange={(e) => setGradeFile(e.target.files?.[0] || null)} />

                  <DocCard icon={<HouseLine size={28} weight="duotone" />} title="Comprovante de Residência" isUploaded={!!residenciaFile} onClick={() => residenciaInputRef.current?.click()} />
                  <input ref={residenciaInputRef} type="file" className="hidden" onChange={(e) => setResidenciaFile(e.target.files?.[0] || null)} />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <InputField label="Senha mestra" icon={<Lock size={22} weight="duotone" />} type="password" placeholder="Mínimo 6 dígitos" value={password} onChange={setPassword} />
                  <InputField label="Confirmar senha" type="password" placeholder="Repita sua senha" value={confirmPassword} onChange={setConfirmPassword} />
                </div>
              )}

              <AnimatePresence>
                {(stepErrors.length > 0 || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 space-y-2"
                  >
                    {[...stepErrors, error].filter(Boolean).map((msg, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-red-500 text-sm font-bold">
                        <Warning size={18} weight="bold" />
                        {msg}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <footer className="sticky bottom-0 p-6 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)] to-transparent">
        <div className="max-w-xl mx-auto w-full">
          <button
            onClick={handleNext}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                {step === totalSteps ? 'Finalizar cadastro' : 'Próxima etapa'} 
                {step < totalSteps && <ArrowLeft size={20} weight="bold" className="rotate-180" />}
              </span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

function InputField({ label, icon, placeholder, type = 'text', value, onChange }: { label: string; icon?: React.ReactNode; placeholder: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-[var(--color-text)] ml-1 uppercase tracking-widest">{label}</label>
      <div className="group relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] transition-colors group-focus-within:text-[var(--color-primary)]">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input-field ${icon ? 'pl-12' : 'pl-5'}`}
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );
}

function DocCard({ icon, title, isUploaded, onClick }: { icon: React.ReactNode; title: string; isUploaded: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl glass border-2 transition-all ${isUploaded ? 'bg-green-500/5 border-green-500/30' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUploaded ? 'bg-green-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-[var(--color-text-3)]'}`}>
        {isUploaded ? <Check size={24} weight="bold" /> : icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`font-bold ${isUploaded ? 'text-green-600' : 'text-[var(--color-text)]'}`}>{title}</p>
        <p className="text-xs font-bold text-[var(--color-text-3)] uppercase tracking-widest mt-0.5">{isUploaded ? 'Documento carregado' : 'Clique para selecionar'}</p>
      </div>
    </button>
  );
}
