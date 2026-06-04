import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth.store';
import { AppShell } from './components/layout/AppShell';

const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ValidacoesPage = React.lazy(() => import('./pages/validacoes/ValidacoesPage'));
const ValidacaoDetailPage = React.lazy(() => import('./pages/validacoes/ValidacaoDetailPage'));
const RotasPage = React.lazy(() => import('./pages/rotas/RotasPage'));
const RotaDetailPage = React.lazy(() => import('./pages/rotas/RotaDetailPage'));
const FrotaPage = React.lazy(() => import('./pages/frota/FrotaPage'));
const OnibusDetailPage = React.lazy(() => import('./pages/frota/OnibusDetailPage'));
const MotoristasPage = React.lazy(() => import('./pages/motoristas/MotoristasPage'));
const MotoristaDetailPage = React.lazy(() => import('./pages/motoristas/MotoristaDetailPage'));
const CadastroMotoristaPage = React.lazy(() => import('./pages/motoristas/CadastroMotoristaPage'));
const Relatorios = React.lazy(() => import('./pages/Relatorios'));
const Notificacoes = React.lazy(() => import('./pages/Notificacoes'));
const Configuracoes = React.lazy(() => import('./pages/Configuracoes'));

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <BrowserRouter>
      <React.Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF]">
            <svg className="animate-spin h-8 w-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/validacoes" element={<AuthGuard><ValidacoesPage /></AuthGuard>} />
          <Route path="/validacoes/:id" element={<AuthGuard><ValidacaoDetailPage /></AuthGuard>} />
          <Route path="/rotas" element={<AuthGuard><RotasPage /></AuthGuard>} />
          <Route path="/rotas/:id" element={<AuthGuard><RotaDetailPage /></AuthGuard>} />
          <Route path="/frota" element={<AuthGuard><FrotaPage /></AuthGuard>} />
          <Route path="/frota/:id" element={<AuthGuard><OnibusDetailPage /></AuthGuard>} />
          <Route path="/motoristas" element={<AuthGuard><MotoristasPage /></AuthGuard>} />
          <Route path="/motoristas/:id" element={<AuthGuard><MotoristaDetailPage /></AuthGuard>} />
          <Route path="/motoristas/cadastro" element={<AuthGuard><CadastroMotoristaPage /></AuthGuard>} />
          <Route path="/relatorios" element={<AuthGuard><Relatorios /></AuthGuard>} />
          <Route path="/notificacoes" element={<AuthGuard><Notificacoes /></AuthGuard>} />
          <Route path="/configuracoes" element={<AuthGuard><Configuracoes /></AuthGuard>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
