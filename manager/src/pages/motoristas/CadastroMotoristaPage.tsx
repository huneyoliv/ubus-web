import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { register } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/[^\d]/g, '');
  if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10))) return false;

  return true;
}

export default function CadastroMotoristaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Muito curta', color: 'bg-red-500' };
    let score = 1;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 2) return { score: 2, label: 'Fraca', color: 'bg-orange-500' };
    if (score === 3) return { score: 3, label: 'Média', color: 'bg-amber-500' };
    return { score: 4, label: 'Forte', color: 'bg-emerald-500' };
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);
    
    // Aplica máscara (999.999.999-99)
    if (val.length > 9) {
      val = `${val.substring(0, 3)}.${val.substring(3, 6)}.${val.substring(6, 9)}-${val.substring(9)}`;
    } else if (val.length > 6) {
      val = `${val.substring(0, 3)}.${val.substring(3, 6)}.${val.substring(6)}`;
    } else if (val.length > 3) {
      val = `${val.substring(0, 3)}.${val.substring(3)}`;
    }
    setCpf(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cpf.trim() || !email.trim() || !password.trim()) {
      setError('Todos os campos obrigatórios (*) devem ser preenchidos.');
      return;
    }

    if (!validateCPF(cpf)) {
      setError('CPF inválido. Verifique o número digitado.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await register({
        name,
        cpf: cpf.replace(/[^\d]/g, ''),
        email,
        phone: phone || undefined,
        password,
        role: 'DRIVER',
        municipalityId: user?.municipalityId,
      });

      setSuccess('Motorista cadastrado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/motoristas');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const pwdStrength = getPasswordStrength(password);

  return (
    <div className="flex flex-col gap-8">
      <button onClick={() => navigate('/motoristas')} className="flex items-center gap-2 text-sm font-bold text-[#2563EB] self-start">
        <ArrowLeft className="h-5 w-5" />
        <span>Voltar para motoristas</span>
      </button>

      <div className="max-w-2xl">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="border-b border-slate-100 pb-4 mb-2">
              <h2 className="text-xl font-bold text-[#131B2E]">Cadastrar Novo Motorista</h2>
              <p className="text-xs font-semibold text-[#434655] mt-1">
                Cadastre as credenciais do motorista. Ele usará o e-mail e senha para logar no app mobile Ubus.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] text-xs font-semibold text-[#BA1A1A]">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] text-xs font-semibold text-[#10B981]">
                {success}
              </div>
            )}

            <Input
              id="name"
              label="Nome Completo *"
              placeholder="Ex: João da Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="cpf"
                label="CPF *"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
              />
              <Input
                id="phone"
                label="Telefone (Opcional)"
                placeholder="Ex: (11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Input
              id="email"
              type="email"
              label="E-mail de Acesso *"
              placeholder="motorista@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <Input
                id="password"
                type="password"
                label="Senha de Acesso (Mín. 6 caracteres) *"
                placeholder="Defina uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <div className="flex flex-col gap-1.5 px-1 mt-1">
                  <div className="flex justify-between text-[10px] font-bold text-[#434655]">
                    <span>Força da senha</span>
                    <span className="font-black uppercase">{pwdStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${pwdStrength.color} transition-all duration-300`}
                      style={{ width: `${(pwdStrength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" loading={loading} className="py-3 mt-4">
              <Save className="h-5 w-5 mr-2" />
              Finalizar Cadastro
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
