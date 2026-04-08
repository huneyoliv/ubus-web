import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bus, Clock, Warning, CheckCircle, Ticket, CalendarBlank, MapPin, IdentificationCard } from 'phosphor-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import type { Reservation, BackendReservationResponse } from '@/types';
import { mapBackendReservation } from '@/types';

export default function Bilhete() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const [time, setTime] = useState(new Date());

  const stateData = location.state as { reservationId?: string; reservation?: Reservation; tripId?: string; seatNumber?: number; trip?: unknown } | undefined;
  const [reservation, setReservation] = useState<Reservation | null>(stateData?.reservation ?? null);
  const [loading, setLoading] = useState(!stateData?.reservation);

  const isRelocated = reservation?.status === 'EXCESSO';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reservation) return;
    console.log('[DEBUG] Buscando detalhes do bilhete...');
    if (stateData?.reservationId) {
      api.get<Reservation>(`/reservations/${stateData.reservationId}`)
        .then(setReservation)
        .catch((err) => console.error('[DEBUG] Erro ao buscar reserva:', err))
        .finally(() => setLoading(false));
    } else {
      api.get<BackendReservationResponse[]>('/reservations/mine')
        .then((list) => { 
          if (list.length > 0) {
            setReservation(mapBackendReservation(list[0]));
          }
        })
        .catch((err) => console.error('[DEBUG] Erro ao buscar lista de reservas:', err))
        .finally(() => setLoading(false));
    }
  }, [stateData?.reservationId, reservation]);

  const formatTime = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const viagem = reservation?.viagem;
  const seatDisplay = reservation?.numeroAssento ?? stateData?.seatNumber ?? 'Livre';
  const dirDisplay = viagem?.direcao ?? 'Viagem';
  const isIda = dirDisplay === 'IDA';

  const themeConfig = isRelocated
    ? { 
        gradient: 'from-amber-900 via-zinc-950 to-zinc-950', 
        accent: 'text-amber-500', 
        bgAccent: 'bg-amber-500/10',
        label: 'Em Transbordo'
      }
    : isIda
      ? { 
          gradient: 'from-blue-900 via-zinc-950 to-zinc-950', 
          accent: 'text-blue-500', 
          bgAccent: 'bg-blue-500/10',
          label: 'Indo (IDA)'
        }
      : { 
          gradient: 'from-emerald-900 via-zinc-950 to-zinc-950', 
          accent: 'text-emerald-500', 
          bgAccent: 'bg-emerald-500/10',
          label: 'Voltando (VOLTA)'
        };

  return (
    <div className={`w-full min-h-screen flex flex-col bg-gradient-to-b ${themeConfig.gradient} transition-all duration-1000`}>
      <header className="px-6 pt-12 pb-4 flex items-center justify-between z-20">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-12 h-12 flex items-center justify-center rounded-2xl glass border-2 border-white/10 text-white"
        >
          <ArrowLeft size={24} weight="bold" />
        </button>
        <h1 className="text-sm font-black text-white uppercase tracking-[0.4em] font-display opacity-60">Boarding Pass</h1>
        <div className="w-12" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center -mt-8 px-6 space-y-12 z-10 animate-spring-up overflow-hidden">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white font-black tabular-nums tracking-tighter font-display flex items-baseline gap-2"
            style={{ fontSize: 'clamp(4rem, 15vw, 6rem)', lineHeight: 0.8 }}
          >
            {formatTime(time).split(':').map((chunk, i, arr) => (
              <span key={i} className="flex items-baseline">
                {chunk}
                {i < arr.length - 1 && <span className="opacity-20 mx-1 mb-1" style={{ fontSize: '0.6em' }}>:</span>}
              </span>
            ))}
          </motion.div>
          <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">
            {formatDate(time).toUpperCase()}
          </p>
        </div>

        <div className="w-full max-w-[420px] relative group">
          <div className={`absolute inset-0 blur-[100px] opacity-20 rounded-full transition-colors ${isIda ? 'bg-blue-500' : 'bg-emerald-500'}`} />
          
          <div className="relative rounded-[48px] overflow-hidden glass border-2 border-white/20 shadow-[0_32px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className={`h-2 w-full ${isIda ? 'bg-blue-500' : 'bg-emerald-500'} opacity-80`} />
            
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${themeConfig.bgAccent}`}>
                    <Bus size={32} weight="duotone" className={themeConfig.accent} />
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-black font-display tracking-tight leading-tight">
                      {viagem?.linha?.nome || 'Viagem Local'}
                    </h2>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">
                      {viagem?.turno} • {themeConfig.label}
                    </p>
                  </div>
                </div>
                <div className="h-10 w-[2px] bg-white/10" />
                <div className="text-right">
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-none">Assento</p>
                  <p className="text-white text-3xl font-black font-display tracking-tighter mt-1">{seatDisplay}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <TicketInfo icon={<CalendarBlank size={18} weight="duotone" />} label="Data" value={viagem?.dataViagem || '—'} />
                <TicketInfo icon={<Clock size={18} weight="duotone" />} label="Turno" value={viagem?.turno || '—'} />
                <TicketInfo icon={<IdentificationCard size={18} weight="duotone" />} label="Reserva" value={reservation?.id?.slice(0, 8).toUpperCase() || '—'} />
                <TicketInfo icon={<MapPin size={18} weight="duotone" />} label="Status" value={viagem?.status || 'Confirmada'} />
              </div>

              <div className="flex flex-col items-center pt-2 space-y-4">
                 <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                 <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Passageiro</p>
                      <p className="text-white font-bold text-sm uppercase">{user?.name?.split(' ')[0]}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/20">
                        <CheckCircle size={10} weight="bold" className="text-emerald-400" />
                        <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Validado</span>
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-800 p-6 flex items-center justify-between border-t border-white/5">
              <div className="flex items-center gap-3">
                <Ticket size={24} weight="duotone" className="text-zinc-400" />
                <span className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em]">Generated via Ubus Protocol v1.4</span>
              </div>
              <div className="px-3 py-1 rounded-md bg-zinc-200 dark:bg-zinc-900 text-[9px] font-black text-zinc-500 uppercase">
                Secure Token 0x{reservation?.id?.slice(-4).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 -left-4 w-8 h-8 rounded-full bg-zinc-950 border-r-2 border-white/20 -translate-y-1/2" />
          <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-zinc-950 border-l-2 border-white/20 -translate-y-1/2" />
        </div>

        {isRelocated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[420px] p-6 rounded-[32px] glass border-2 border-amber-500/30 bg-amber-500/5 flex items-start gap-4"
          >
            <Warning size={32} weight="duotone" className="text-amber-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-amber-500 font-black uppercase tracking-widest text-xs">Transbordo Ativo</p>
              <p className="text-zinc-400 text-xs font-medium leading-relaxed uppercase tracking-wider">
                Atenção: Você foi realocado para um veículo de apoio. Procure o fiscal da sua rota para embarque.
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function TicketInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-white/30 uppercase tracking-[0.2em] text-[10px] font-black">
        {icon} {label}
      </div>
      <p className="text-white font-bold text-sm tracking-tight truncate leading-none uppercase">{value}</p>
    </div>
  );
}
