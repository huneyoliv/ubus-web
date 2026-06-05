import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Route,
  Bus,
  Users,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  User as UserIcon,
  Menu
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getDashboardMetrics } from '../../api/metrics';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const metrics = await getDashboardMetrics();
        setPendingCount(metrics.pendingRegistrations);
      } catch (err) {
        // Ignora erro silenciando o log de debug
      }
    }
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Validações', path: '/validacoes', icon: ClipboardCheck, badge: pendingCount },
    { label: 'Rotas', path: '/rotas', icon: Route },
    { label: 'Frota', path: '/frota', icon: Bus },
    { label: 'Motoristas', path: '/motoristas', icon: Users },
    { label: 'Relatórios', path: '/relatorios', icon: BarChart3 },
    { label: 'Notificações', path: '/notificacoes', icon: Bell },
    { label: 'Configurações', path: '/configuracoes', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[#F0F4FF] overflow-hidden">
      <aside className="hidden md:flex flex-col w-[280px] bg-[#0F172A] text-white flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img src="/logo-v2.png" alt="Ubus Gestor" className="h-10 w-auto" />
          <span className="text-xl font-black tracking-wider text-white font-outfit uppercase">Gestor</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-[12px] font-semibold text-sm transition-all duration-200 ${active
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`inline-flex items-center justify-center h-5 px-2 rounded-full text-xs font-bold ${active ? 'bg-white text-[#2563EB]' : 'bg-[#BA1A1A] text-white'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-[12px] font-semibold text-sm text-slate-400 hover:text-white hover:bg-[#BA1A1A]/20 hover:text-[#BA1A1A] transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex md:hidden items-center justify-between px-6 py-4 bg-white border-b border-[#C3C6D7]/30 flex-shrink-0">
          <img src="/logo-v2.png" alt="Ubus Logo" className="h-8 w-auto" />
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#131B2E]">{user?.name?.split(' ')[0] || ''}</span>
            <div className="h-8 w-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.substring(0, 2)?.toUpperCase() || ''}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#C3C6D7]/40 justify-around items-center z-50 px-4">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center flex-1 py-1 ${isActive('/dashboard') ? 'text-[#2563EB]' : 'text-slate-400'
              }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px] font-bold mt-1">Painel</span>
          </Link>
          <Link
            to="/validacoes"
            className={`flex flex-col items-center justify-center flex-1 py-1 relative ${isActive('/validacoes') ? 'text-[#2563EB]' : 'text-slate-400'
              }`}
          >
            <ClipboardCheck className="h-5 w-5" />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-6 bg-[#BA1A1A] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
            <span className="text-[10px] font-bold mt-1">Validações</span>
          </Link>
          <Link
            to="/rotas"
            className={`flex flex-col items-center justify-center flex-1 py-1 ${isActive('/rotas') ? 'text-[#2563EB]' : 'text-slate-400'
              }`}
          >
            <Route className="h-5 w-5" />
            <span className="text-[10px] font-bold mt-1">Rotas</span>
          </Link>
          <button
            onClick={() => setShowMobileMenu(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-bold mt-1">Mais</span>
          </button>
          <Link
            to="/configuracoes"
            className={`flex flex-col items-center justify-center flex-1 py-1 ${isActive('/configuracoes') ? 'text-[#2563EB]' : 'text-slate-400'
              }`}
          >
            <UserIcon className="h-5 w-5" />
            <span className="text-[10px] font-bold mt-1">Perfil</span>
          </Link>
        </nav>
      </div>

      {showMobileMenu && (
        <div className="fixed inset-0 bg-[#0F172A]/60 z-50 md:hidden flex justify-end">
          <div className="absolute inset-0" onClick={() => setShowMobileMenu(false)} />
          <div className="relative w-[280px] bg-[#0F172A] text-white h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-right duration-250">
            <h2 className="text-xl font-black text-[#2563EB] font-outfit uppercase mb-8">MENU PRINCIPAL</h2>
            <div className="flex-1 space-y-2">
              <Link
                to="/frota"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-[12px] font-semibold hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Bus className="h-5 w-5" />
                <span>Frota de Ônibus</span>
              </Link>
              <Link
                to="/motoristas"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-[12px] font-semibold hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Users className="h-5 w-5" />
                <span>Motoristas</span>
              </Link>
              <Link
                to="/relatorios"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-[12px] font-semibold hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Métricas</span>
              </Link>
              <Link
                to="/notificacoes"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-[12px] font-semibold hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Bell className="h-5 w-5" />
                <span>Notificações</span>
              </Link>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full py-3 px-4 rounded-[12px] font-semibold text-[#BA1A1A] hover:bg-[#BA1A1A]/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Desconectar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
