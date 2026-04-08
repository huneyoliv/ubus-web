import { motion } from 'framer-motion';
import { IdentificationCard, ShieldCheckered, CheckCircle, Clock, ArrowsClockwise, UserCircle } from 'phosphor-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Carteirinha() {
  const user = useAuthStore((s) => s.user);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const roleLabel: Record<string, string> = {
    STUDENT: 'Estudante',
    LEADER: 'Líder',
    RIDE_SHARE: 'Caronista',
    DRIVER: 'Motorista',
    MANAGER: 'Gestor',
    SUPER_ADMIN: 'Diretor',
  };

  console.log('[DEBUG] Gerando carteirinha digital para:', user?.name);

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors duration-500 pb-24">
      <header className="px-6 pt-10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">Digital ID</h1>
          <p className="text-[var(--color-text-2)] font-medium mt-1 uppercase tracking-widest text-[10px]">Identificação Oficial</p>
        </div>
        <div className="w-12 h-12 rounded-2xl glass border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-3)]">
          <ArrowsClockwise size={24} weight="bold" className="animate-spin-slow" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 animate-spring-up">
        <motion.div
          whileHover={{ rotateY: 5, rotateX: -5 }}
          className="w-full max-w-[360px] relative group"
        >
          <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-colors" />
          
          <div className="relative overflow-hidden rounded-[40px] border-2 border-white/20 shadow-2xl transition-transform duration-500 perspective-1000">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 to-transparent" />
            
            <div className="p-8 space-y-8" style={{ background: 'linear-gradient(145deg, #09090b 0%, #18181b 100%)' }}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-500">
                    <IdentificationCard size={28} weight="duotone" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ubus Network</span>
                  </div>
                  <h2 className="text-white text-3xl font-black font-display tracking-tight leading-tight mt-2">
                    {user?.name?.split(' ')[0]} <br/>
                    <span className="text-white/40">{user?.name?.split(' ').slice(1).join(' ')}</span>
                  </h2>
                </div>
                <div className="w-20 h-20 rounded-[28px] glass border-2 border-white/20 flex items-center justify-center text-white font-black text-3xl font-display bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl">
                  {initials}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <InfoItem label="Cargo" value={roleLabel[user?.role ?? ''] || 'Visitante'} />
                <InfoItem label="Matrícula" value={user?.id?.slice(0, 8).toUpperCase() || '—'} />
                <InfoItem label="CPF" value={user?.cpf || '—'} />
                <InfoItem label="Emissão" value={new Date().toLocaleDateString('pt-BR')} />
              </div>

              <div className="flex flex-col items-center pt-4">
                <div className="p-4 rounded-[32px] bg-white flex items-center justify-center shadow-inner relative group/qr">
                  <svg viewBox="0 0 100 100" className="w-40 h-40">
                    <rect width="100" height="100" fill="white" />
                    {Array.from({ length: 15 }).map((_, r) =>
                      Array.from({ length: 15 }).map((_, c) => (
                        <rect
                          key={`${r}-${c}`}
                          x={c * 6.6} y={r * 6.6} width="5" height="5"
                          fill={(r + c) % 3 === 0 || (r * c) % 4 === 1 ? '#09090b' : 'transparent'}
                          rx="1"
                        />
                      ))
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/qr:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm rounded-[32px]">
                    <span className="text-[10px] font-black text-zinc-900 bg-white px-3 py-1 rounded-full shadow-lg">Validar Agora</span>
                  </div>
                </div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4 flex items-center gap-2">
                   <Clock size={12} weight="bold" /> Expira em 24h
                </p>
              </div>
            </div>

            <div className="bg-blue-600 px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} weight="bold" className="text-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Verificado pelo Sistema</span>
              </div>
              <ShieldCheckered size={24} weight="duotone" className="text-white/40" />
            </div>
          </div>
        </motion.div>

        <div className="mt-12 max-w-sm w-full p-6 rounded-[32px] glass border-2 border-[var(--color-border)] flex items-start gap-4">
          <UserCircle size={32} weight="duotone" className="text-blue-500 shrink-0" />
          <p className="text-xs font-bold text-[var(--color-text-2)] leading-relaxed uppercase tracking-wider">
            Mantenha seu brilho no brilho máximo ao apresentar este documento ao motorista ou fiscal.
          </p>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-bold text-white uppercase tracking-tight truncate">{value}</p>
    </div>
  );
}
