import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarBlank, CheckCircle, XCircle, Clock, ArrowRight, ArrowLeft, Warning } from 'phosphor-react';
import { api } from '@/lib/api';
import type { Reservation, StatusReserva, BackendReservationResponse } from '@/types';
import { mapBackendReservation } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<StatusReserva, { label: string; icon: any; color: string; bg: string }> = {
  CONFIRMADA: { label: 'Confirmada', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  PRESENTE: { label: 'Presente', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  FALTOU: { label: 'Faltou', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  CANCELADA_SISTEMA: { label: 'Cancelada', icon: Clock, color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
  EXCESSO: { label: 'Excesso', icon: Warning, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

export default function Historico() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[DEBUG] Buscando histórico de viagens...');
    api.get<BackendReservationResponse[]>('/reservations/mine')
      .then((data) => {
        const mapped = Array.isArray(data) ? data.map(mapBackendReservation) : [];
        setReservations(mapped);
        console.log('[DEBUG] Histórico carregado:', mapped.length, 'registros');
      })
      .catch((err) => {
        console.error('[DEBUG] Erro ao carregar histórico:', err);
        setReservations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-500 pb-24">
      <header className="px-6 pt-10 pb-6 flex items-center gap-4 sticky top-0 bg-[var(--color-bg)]/80 backdrop-blur-xl z-20 border-b border-[var(--color-border)]">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105"
        >
          <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">Histórico</h1>
          <p className="text-[var(--color-text-2)] font-medium mt-1 uppercase tracking-widest text-[10px]">Relatório de Viagens</p>
        </div>
      </header>

      <div className="px-6 mt-8 flex-1 animate-spring-up overflow-hidden">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 rounded-[32px] glass animate-pulse" />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-24 h-24 rounded-[40px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-600">
              <CalendarBlank size={48} weight="duotone" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[var(--color-text)] font-display">Sem viagens registradas</h3>
              <p className="text-xs font-bold text-[var(--color-text-3)] uppercase tracking-widest">Suas futuras reservas aparecerão aqui</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => {
              const config = statusConfig[res.status] || statusConfig.CONFIRMADA;
              const isIda = res.viagem?.direcao === 'IDA';

              return (
                <motion.div
                  key={res.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/bilhete', { state: { reservationId: res.id, reservation: res } })}
                  className="group relative overflow-hidden rounded-[32px] glass border-2 border-[var(--color-border)] p-5 transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        isIda ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        <CalendarBlank size={28} weight="duotone" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-[var(--color-text)] font-display tracking-tight leading-tight uppercase text-xs">
                          {res.viagem?.direcao} — {res.viagem?.turno}
                        </h4>
                        <p className="text-sm font-black text-[var(--color-text-2)] mt-0.5 truncate max-w-[150px] sm:max-w-none">
                          {res.viagem?.linha?.nome || 'Viagem Avulsa'}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                            {res.viagem?.dataViagem}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                            Assento {res.numeroAssento || 'Excesso'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest",
                        config.color,
                        config.bg,
                        "border-current/10"
                      )}>
                        <config.icon size={12} weight="bold" />
                        {config.label}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={14} weight="bold" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center opacity-20">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[var(--color-text-3)]">Fim do Histórico</p>
        </div>
      </div>
    </div>
  );
}
