import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { login } from '../api/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export default function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      const { token, user } = response;

      if (user.role !== 'MANAGER' && user.role !== 'SUPER_ADMIN') {
        setError('Acesso negado. Apenas gestores podem acessar este painel.');
        logoutStore();
        return;
      }

      loginStore(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF] px-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Ubus Gestor" className="h-16 w-auto mb-2" />
          <p className="text-sm font-semibold text-[#434655] mt-2">
            Faça login para gerenciar o transporte escolar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] text-xs font-semibold text-[#BA1A1A]">
              {error}
            </div>
          )}

          <Input
            id="email"
            type="email"
            label="E-mail profissional"
            placeholder="nome@municipio.gov.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="password"
            type="password"
            label="Senha de acesso"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" loading={loading} className="w-full mt-2 py-3">
            Entrar no Painel
          </Button>

          <button
            type="button"
            className="text-xs font-bold text-[#2563EB] hover:underline self-center"
            onClick={() => alert('Entre em contato com o suporte ou envie um e-mail para administrador@ubus.me para redefinir sua senha.')}
          >
            Esqueceu sua senha?
          </button>
        </form>
      </Card>
    </div>
  );
}
