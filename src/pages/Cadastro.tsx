import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, Check, Camera, FileText, X, Home, Mail, User, Phone, Lock, AlertCircle, Accessibility } from 'lucide-react'
import { api, ApiError } from '@/lib/api'
import type { Prefeitura, RegisterPayload, LoginResponse } from '@/types'
import { useAuthStore } from '@/store/useAuthStore'

function validateCpf(raw: string): boolean {
    const digits = raw.replace(/\D/g, '')
    if (digits.length !== 11) return false
    if (/^(\d)\1{10}$/.test(digits)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i)
    let remainder = (sum * 10) % 11
    if (remainder === 10) remainder = 0
    if (remainder !== parseInt(digits[9])) return false

    sum = 0
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i)
    remainder = (sum * 10) % 11
    if (remainder === 10) remainder = 0
    if (remainder !== parseInt(digits[10])) return false

    return true
}

function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Cadastro() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((s) => s.setAuth)
    const [step, setStep] = useState(1)
    const [search, setSearch] = useState('')
    const [name, setName] = useState('')
    const [cpf, setCpf] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [photo, setPhoto] = useState<string | null>(null)
    const [gradeFile, setGradeFile] = useState<File | null>(null)
    const [residenciaFile, setResidenciaFile] = useState<File | null>(null)
    const [laudoFile, setLaudoFile] = useState<File | null>(null)
    const [agreed, setAgreed] = useState(false)
    const [isPcd, setIsPcd] = useState(false)
    const [needsElevator, setNeedsElevator] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [stepErrors, setStepErrors] = useState<string[]>([])
    const [prefeituras, setPrefeituras] = useState<Prefeitura[]>([])
    const [selectedPrefeitura, setSelectedPrefeitura] = useState('')
    const [loadingPrefeituras, setLoadingPrefeituras] = useState(false)

    const photoInputRef = useRef<HTMLInputElement>(null)
    const gradeInputRef = useRef<HTMLInputElement>(null)
    const residenciaInputRef = useRef<HTMLInputElement>(null)
    const laudoInputRef = useRef<HTMLInputElement>(null)
    const totalSteps = 4

    useEffect(() => {
        if (step === 2 && prefeituras.length === 0) {
            setLoadingPrefeituras(true)
            api.get<Prefeitura[]>('/management/public')
                .then((data) => {
                    const list = Array.isArray(data) ? data : []
                    setPrefeituras(list.filter(p => p.ativo !== false))
                })
                .catch(() => setPrefeituras([]))
                .finally(() => setLoadingPrefeituras(false))
        }
    }, [step, prefeituras.length])

    const filteredPrefeituras = prefeituras.filter((p) =>
        p.nome.toLowerCase().includes(search.toLowerCase())
    )

    const formatCpf = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11)
        return digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11)
        if (digits.length <= 2) return `(${digits}`
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }

    const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setPhoto(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleGradeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setGradeFile(file)
    }

    const handleResidenciaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setResidenciaFile(file)
    }

    const handleLaudoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setLaudoFile(file)
    }

    const validateStep = (currentStep: number): string[] => {
        const errors: string[] = []

        if (currentStep === 1) {
            if (!name.trim()) errors.push('Preencha o nome completo.')
            if (!email.trim()) errors.push('Preencha o email.')
            else if (!validateEmail(email)) errors.push('Email inválido.')
            const cpfDigits = cpf.replace(/\D/g, '')
            if (!cpfDigits) errors.push('Preencha o CPF.')
            else if (!validateCpf(cpfDigits)) errors.push('CPF inválido. Verifique os dígitos.')
        }

        if (currentStep === 2) {
            if (!selectedPrefeitura) errors.push('Selecione sua cidade.')
        }

        if (currentStep === 3) {
            if (!password) errors.push('Crie uma senha.')
            else if (password.length < 6) errors.push('A senha deve ter no mínimo 6 caracteres.')
            if (!confirmPassword) errors.push('Confirme sua senha.')
            else if (password !== confirmPassword) errors.push('As senhas não coincidem.')
        }

        if (currentStep === 4) {
            if (!agreed) errors.push('Aceite os termos para continuar.')
        }

        return errors
    }

    const handleNext = () => {
        const errors = validateStep(step)
        setStepErrors(errors)
        setError('')

        if (errors.length > 0) return

        if (step < totalSteps) {
            setStep(step + 1)
            setStepErrors([])
        } else {
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            const payload: RegisterPayload = {
                municipalityId: selectedPrefeitura,
                cpf: cpf.replace(/\D/g, ''),
                name,
                email,
                password,
                phone: phone.replace(/\D/g, '') || undefined,
            }
            const data = await api.post<LoginResponse>('/auth/register', payload)
            setAuth(data.accessToken, data.user)
            navigate('/ponto-embarque')
        } catch (err) {
            if (err instanceof ApiError) {
                const body = err.body as Record<string, unknown> | null
                if (err.status === 409) setError('Email ou CPF já cadastrado.')
                else if (body && typeof body.message === 'string') setError(body.message)
                else setError('Erro ao cadastrar. Tente novamente.')
            } else {
                setError('Erro de conexão. Tente novamente.')
            }
        } finally {
            setLoading(false)
        }
    }

    const stepTitles = ['Seus dados', 'Sua cidade', 'Crie uma senha', 'Documentação']
    const stepSubtitles = [
        'Precisamos de algumas informações básicas.',
        'Isso definirá a prefeitura vinculada à sua conta.',
        'Mínimo de 6 caracteres.',
        'Precisamos dos documentos para liberar seu passe.',
    ]

    return (
        <div className="w-full min-h-dvh flex flex-col" style={{ background: 'var(--color-bg)' }}>
            <div className="sticky top-0 z-20" style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between px-5 py-4 max-w-2xl mx-auto">
                    <button
                        onClick={() => (step > 1 ? (setStep(step - 1), setStepErrors([])) : navigate('/'))}
                        className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:bg-white active:scale-95"
                        style={{ border: '1.5px solid var(--color-border)' }}
                    >
                        <ArrowLeft size={18} style={{ color: 'var(--color-text)' }} />
                    </button>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold" style={{ color: 'var(--color-text-2)' }}>
                            Passo {step} de {totalSteps}
                        </span>
                        <div className="flex gap-1.5">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-1 rounded-full transition-all duration-500"
                                    style={{
                                        width: i < step ? '1.5rem' : '0.375rem',
                                        background: i < step ? 'var(--color-primary)' : 'var(--color-border)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="w-10" />
                </div>
            </div>

            <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                <div className="px-6 pt-8 pb-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                {stepTitles[step - 1]}
                            </h1>
                            <p style={{ color: 'var(--color-text-2)' }} className="text-sm">{stepSubtitles[step - 1]}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col"
                    >
                        {step === 1 && (
                            <div className="flex flex-col gap-4 px-6 pb-4">
                                <InputField label="Nome completo" icon={<User size={16} />} placeholder="Seu nome completo" value={name} onChange={setName} />
                                <InputField label="Email" icon={<Mail size={16} />} placeholder="seu@email.com" type="email" value={email} onChange={setEmail} />
                                <InputField label="CPF" placeholder="000.000.000-00" value={cpf} onChange={(v) => setCpf(formatCpf(v))} />
                                <InputField label="Telefone (WhatsApp)" icon={<Phone size={16} />} placeholder="(79) 99999-0000" value={phone} onChange={(v) => setPhone(formatPhone(v))} />
                                <label className="flex items-start gap-3 cursor-pointer group mt-1">
                                    <div className="relative mt-0.5 flex-shrink-0">
                                        <input type="checkbox" checked={isPcd} onChange={(e) => { setIsPcd(e.target.checked); if (!e.target.checked) { setNeedsElevator(false); setLaudoFile(null) } }} className="sr-only" />
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isPcd ? 'border-primary bg-primary' : 'border-slate-300 bg-white'}`}
                                            style={{ borderColor: isPcd ? 'var(--color-primary)' : undefined, background: isPcd ? 'var(--color-primary)' : 'white' }}>
                                            {isPcd && <Check size={12} className="text-white" strokeWidth={3} />}
                                        </div>
                                    </div>
                                    <span className="text-sm leading-relaxed" style={{ color: 'var(--color-text-2)' }}>
                                        Declaro que sou pessoa com deficiência (conforme a Lei nº 13.146/2015)
                                    </span>
                                </label>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col flex-1 px-6 pb-4 gap-3">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-3)' }} />
                                    <input
                                        className="w-full h-12 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
                                        style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
                                        placeholder="Pesquisar cidade..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                                    {loadingPrefeituras ? (
                                        [1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl skeleton" />)
                                    ) : filteredPrefeituras.length === 0 ? (
                                        <div className="text-center py-10" style={{ color: 'var(--color-text-2)' }}>
                                            <p className="text-sm">Nenhuma cidade encontrada.</p>
                                        </div>
                                    ) : (
                                        filteredPrefeituras.map((pref) => {
                                            const isSelected = selectedPrefeitura === pref.id
                                            return (
                                                <button
                                                    key={pref.id}
                                                    onClick={() => setSelectedPrefeitura(pref.id)}
                                                    className="flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                                                    style={{
                                                        background: isSelected ? 'rgba(37,99,235,0.06)' : 'var(--color-surface)',
                                                        border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                                                    }}
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{pref.nome}</p>
                                                        <p className="text-xs mt-0.5" style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-3)' }}>
                                                            {isSelected ? '✓ Selecionado' : 'Disponível'}
                                                        </p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-primary' : 'border-slate-300'}`}
                                                        style={{ borderColor: isSelected ? 'var(--color-primary)' : undefined, background: isSelected ? 'var(--color-primary)' : 'transparent' }}>
                                                        {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
                                                    </div>
                                                </button>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex flex-col gap-4 px-6 pb-4">
                                <InputField label="Senha" icon={<Lock size={16} />} placeholder="Mínimo 6 caracteres" type="password" value={password} onChange={setPassword} />
                                <InputField label="Confirmar senha" icon={<Lock size={16} />} placeholder="Repita a senha" type="password" value={confirmPassword} onChange={setConfirmPassword} />
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex flex-col gap-4 px-6 pb-4">
                                <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#92400E' }}>
                                    ⚠️ Os documentos serão analisados posteriormente. Preencha para agilizar a aprovação.
                                </div>

                                <input ref={photoInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handlePhotoCapture} />
                                {photo ? (
                                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1.5px solid rgba(16,185,129,0.2)' }}>
                                        <img src={photo} alt="Foto" className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Foto do rosto</p>
                                            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-success)' }}>✓ Capturada com sucesso</p>
                                        </div>
                                        <button onClick={() => setPhoto(null)} className="p-1.5 rounded-lg transition-colors hover:bg-red-50">
                                            <X size={16} className="text-slate-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => photoInputRef.current?.click()}
                                        className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all hover:border-primary/60 hover:bg-white"
                                        style={{ borderColor: 'var(--color-border)' }}>
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.08)' }}>
                                            <Camera size={22} style={{ color: 'var(--color-primary)' }} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Tirar foto do rosto</p>
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>Sem boné ou óculos</p>
                                        </div>
                                    </button>
                                )}

                                <input ref={gradeInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleGradeUpload} />
                                <DocUploadButton file={gradeFile} onClear={() => setGradeFile(null)} onOpen={() => gradeInputRef.current?.click()}
                                    icon={<FileText size={20} />} title="Grade de Horários" subtitle="PDF ou imagem da grade semestral" color="blue" />

                                <input ref={residenciaInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleResidenciaUpload} />
                                <DocUploadButton file={residenciaFile} onClear={() => setResidenciaFile(null)} onOpen={() => residenciaInputRef.current?.click()}
                                    icon={<Home size={20} />} title="Comprovante de Residência" subtitle="Conta de luz, água ou telefone recente" color="violet" />

                                {isPcd && (
                                    <>
                                        <div className="p-4 rounded-xl text-sm flex items-start gap-3"
                                            style={{ background: 'rgba(99,102,241,0.06)', border: '1.5px solid rgba(99,102,241,0.18)' }}>
                                            <Accessibility size={20} className="shrink-0 mt-0.5" style={{ color: '#6366F1' }} />
                                            <div>
                                                <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Pessoa com Deficiência</p>
                                                <p className="text-xs mt-1" style={{ color: 'var(--color-text-2)' }}>
                                                    Envie o relatório médico com CID para comprovar sua condição.
                                                </p>
                                            </div>
                                        </div>

                                        <input ref={laudoInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleLaudoUpload} />
                                        <DocUploadButton file={laudoFile} onClear={() => setLaudoFile(null)} onOpen={() => laudoInputRef.current?.click()}
                                            icon={<FileText size={20} />} title="Relatório Médico com CID" subtitle="Laudo médico com Classificação Internacional de Doenças" color="indigo" />

                                        <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
                                            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                                                Precisa de ônibus com elevador? (para cadeirantes)
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setNeedsElevator(true)}
                                                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                                                    style={{
                                                        background: needsElevator ? 'rgba(37,99,235,0.08)' : 'white',
                                                        border: needsElevator ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                                                        color: needsElevator ? 'var(--color-primary)' : 'var(--color-text-2)',
                                                    }}
                                                >
                                                    Sim, preciso
                                                </button>
                                                <button
                                                    onClick={() => setNeedsElevator(false)}
                                                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                                                    style={{
                                                        background: !needsElevator ? 'rgba(37,99,235,0.08)' : 'white',
                                                        border: !needsElevator ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                                                        color: !needsElevator ? 'var(--color-primary)' : 'var(--color-text-2)',
                                                    }}
                                                >
                                                    Não preciso
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <label className="flex items-start gap-3 cursor-pointer mt-1">
                                    <div className="relative mt-0.5 flex-shrink-0">
                                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="sr-only" />
                                        <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                                            style={{ borderColor: agreed ? 'var(--color-primary)' : 'var(--color-border)', background: agreed ? 'var(--color-primary)' : 'white' }}>
                                            {agreed && <Check size={12} className="text-white" strokeWidth={3} />}
                                        </div>
                                    </div>
                                    <span className="text-sm leading-relaxed" style={{ color: 'var(--color-text-2)' }}>
                                        Declaro que as informações são verdadeiras e estou ciente das regras de suspensão por faltas.
                                    </span>
                                </label>

                                {error && (
                                    <div className="p-3.5 rounded-xl text-sm font-medium text-center"
                                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}>
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}

                        <AnimatePresence>
                            {stepErrors.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="flex flex-col gap-2 px-6 pb-4"
                                >
                                    {stepErrors.map((err, i) => (
                                        <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium"
                                            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', color: '#DC2626' }}>
                                            <AlertCircle size={16} className="shrink-0" />
                                            {err}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="sticky bottom-0 px-6 py-4 max-w-2xl mx-auto w-full"
                style={{ background: 'rgba(240,244,255,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--color-border)' }}>
                <button
                    onClick={handleNext}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                        </span>
                    ) : step < totalSteps ? 'Continuar' : 'Enviar para análise'}
                </button>
            </div>
        </div>
    )
}

function InputField({ label, icon, placeholder, type = 'text', value, onChange }: {
    label: string; icon?: React.ReactNode; placeholder: string; type?: string; value: string; onChange: (v: string) => void
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{label}</label>
            <div className="flex items-center rounded-xl overflow-hidden"
                style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)' }}>
                {icon && (
                    <div className="flex items-center justify-center w-11 h-14 shrink-0" style={{ color: 'var(--color-text-3)' }}>
                        {icon}
                    </div>
                )}
                <input
                    className="flex-1 h-14 bg-transparent text-sm outline-none pr-4"
                    style={{ paddingLeft: icon ? 0 : '1rem', color: 'var(--color-text)' }}
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    )
}

function DocUploadButton({ file, onClear, onOpen, icon, title, subtitle, color }: {
    file: File | null; onClear: () => void; onOpen: () => void; icon: React.ReactNode; title: string; subtitle: string; color: string
}) {
    const colorMap: Record<string, { bg: string; text: string }> = {
        blue: { bg: 'rgba(59,130,246,0.08)', text: '#2563EB' },
        violet: { bg: 'rgba(124,58,237,0.08)', text: '#7C3AED' },
        indigo: { bg: 'rgba(99,102,241,0.08)', text: '#6366F1' },
    }
    const c = colorMap[color] ?? colorMap.blue

    if (file) {
        return (
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1.5px solid rgba(16,185,129,0.2)' }}>
                <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--color-success)' }}>
                    {icon}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{file.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-success)' }}>✓ Enviado • {(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <button onClick={onClear} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    <X size={16} className="text-slate-400" />
                </button>
            </div>
        )
    }

    return (
        <button onClick={onOpen} className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-all hover:border-opacity-60 hover:bg-white text-left"
            style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0" style={{ background: c.bg, color: c.text }}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>{subtitle}</p>
            </div>
        </button>
    )
}
