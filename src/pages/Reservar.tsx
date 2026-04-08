import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bus, Ticket, Users, Warning, IdentificationCard, Info } from 'phosphor-react';
import { cn } from '@/lib/utils';
import { api, ApiError } from '@/lib/api';
import type { Trip, CreateReservationPayload } from '@/types';

type SeatStatus = 'available' | 'occupied' | 'selected';

interface SeatData {
  id: number;
  status: SeatStatus;
}

export default function Reservar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tripId, trip } = (location.state as { tripId?: string; trip?: Trip }) ?? {};
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const capacity = trip?.capacidadeReal ?? 40;

  useEffect(() => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    const fetchSeats = async () => {
      console.log('[DEBUG] Buscando assentos ocupados para a viagem:', tripId);
      try {
        const occupied = await api.get<number[]>(`/reservations/trip/${tripId}/occupied-seats`);
        const occupiedSet = new Set(Array.isArray(occupied) ? occupied : []);
        const seatList: SeatData[] = Array.from({ length: capacity }, (_, i) => ({
          id: i + 1,
          status: occupiedSet.has(i + 1) ? 'occupied' as const : 'available' as const,
        }));
        setSeats(seatList);
        console.log('[DEBUG] Mapa de assentos carregado com sucesso.');
      } catch (err) {
        console.error('[DEBUG] Erro ao carregar assentos:', err);
        setSeats(Array.from({ length: capacity }, (_, i) => ({ id: i + 1, status: 'available' as const })));
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [tripId, capacity]);

  const toggleSeat = (id: number) => {
    const seat = seats.find((s) => s.id === id);
    if (!seat || seat.status === 'occupied') return;

    if (selectedSeat === id) {
      setSelectedSeat(null);
      setSeats(seats.map((s) => (s.id === id ? { ...s, status: 'available' as const } : s)));
    } else {
      setSeats(seats.map((s) => {
        if (s.id === id) return { ...s, status: 'selected' as const };
        if (s.id === selectedSeat) return { ...s, status: 'available' as const };
        return s;
      }));
      setSelectedSeat(id);
    }
  };

  const handleReserve = async () => {
    if (!tripId || selectedSeat === null) return;
    setSubmitting(true);
    setError('');
    console.log('[DEBUG] Iniciando reserva do assento:', selectedSeat);
    try {
      const payload: CreateReservationPayload = { tripId, seatNumber: selectedSeat };
      await api.post('/reservations', payload);
      console.log('[DEBUG] Reserva confirmada com sucesso.');
      navigate('/bilhete', { state: { tripId, seatNumber: selectedSeat, trip } });
    } catch (err) {
      console.error('[DEBUG] Falha na reserva:', err);
      if (err instanceof ApiError) {
        const body = err.body as Record<string, unknown> | null;
        setError(typeof body?.message === 'string' ? body.message : 'Erro ao reservar. Tente novamente.');
      } else {
        setError('Erro de conexão. Verifique sua rede.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const rows = Math.ceil(seats.length / 4);
  const leftSeats = Array.from({ length: rows }, (_, row) => [seats[row * 4], seats[row * 4 + 1]].filter(Boolean));
  const rightSeats = Array.from({ length: rows }, (_, row) => [seats[row * 4 + 2], seats[row * 4 + 3]].filter(Boolean));

  const occupiedCount = seats.filter(s => s.status === 'occupied').length;
  const availableCount = seats.filter(s => s.status === 'available').length;

  if (!tripId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[var(--color-bg)] transition-colors">
        <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[var(--color-text-3)] mb-6">
          <Warning size={40} weight="duotone" />
        </div>
        <p className="text-xl font-black text-[var(--color-text)] font-display tracking-tight">Roteiro não encontrado</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-6 px-8 py-3 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs transition-transform active:scale-95"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors duration-500 pb-32">
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 flex items-center justify-center rounded-xl glass border-[var(--color-border)] transition-transform hover:scale-105"
          >
            <ArrowLeft size={20} weight="bold" className="text-[var(--color-text)]" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[var(--color-text)] font-display tracking-tight leading-none uppercase tracking-widest">Reserva</h1>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Bus {trip?.linha?.nome || '—'}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-6 animate-spring-up overflow-hidden">
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard icon={<Users size={16} weight="duotone" />} label="Livres" value={availableCount} color="text-emerald-500" />
          <StatCard icon={<Bus size={16} weight="duotone" />} label="Ocupados" value={occupiedCount} color="text-zinc-400" />
          <StatCard icon={<Ticket size={16} weight="duotone" />} label="Sua Poltrona" value={selectedSeat ?? '--'} color="text-blue-500" highlight={!!selectedSeat} />
        </div>

        <section className="space-y-4">
          <h4 className="px-1 text-xs font-black uppercase tracking-widest text-[var(--color-text-3)] flex items-center gap-2">
             <IdentificationCard size={16} weight="bold" /> Mapa de Assentos
          </h4>

          <div className="rounded-[40px] glass border-2 border-[var(--color-border)] p-8 shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-3)]">Sincronizando...</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="grid grid-cols-[auto_24px_auto] gap-x-4 gap-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {leftSeats.map((row) => row.map((seat) => (
                      <SeatItem key={seat.id} seat={seat} onToggle={toggleSeat} />
                    )))}
                  </div>
                  <div className="flex flex-col items-center gap-3 pt-1">
                    {Array.from({ length: rows }).map((_, i) => (
                      <div key={i} className="h-12 w-px bg-[var(--color-border)]" />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {rightSeats.map((row) => row.map((seat) => (
                      <SeatItem key={seat.id} seat={seat} onToggle={toggleSeat} />
                    )))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-wrap justify-center gap-6">
              <LegendItem color="bg-zinc-100 dark:bg-zinc-800 border-transparent shadow-inner" label="Ocupado" />
              <LegendItem color="bg-white dark:bg-zinc-900 border-[var(--color-border)]" label="Livre" />
              <LegendItem color="bg-blue-600 border-blue-500 text-white" label="Seleção" />
            </div>
          </div>
        </section>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-5 rounded-3xl bg-red-500/5 border-2 border-red-500/20 flex gap-4"
            >
              <Warning size={24} weight="duotone" className="text-red-500 shrink-0" />
              <p className="text-xs font-black text-red-600 leading-relaxed uppercase tracking-wider">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 p-5 rounded-3xl bg-blue-500/5 border-2 border-zinc-500/10 flex gap-4 opacity-50">
          <Info size={24} weight="duotone" className="text-[var(--color-text-3)] shrink-0" />
          <p className="text-[10px] font-black text-[var(--color-text-3)] leading-relaxed uppercase tracking-[0.2em]">
            Cada reserva é nominal e intransferível. O uso indevido pode acarretar em bloqueio temporário.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-2xl border-t border-[var(--color-border)] p-6">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleReserve}
            disabled={selectedSeat === null || submitting}
            className={cn(
              "w-full h-16 rounded-[24px] flex items-center justify-center gap-3 font-black font-display tracking-widest uppercase text-sm transition-all shadow-xl active:scale-95 disabled:grayscale disabled:opacity-50",
              selectedSeat ? "bg-blue-600 text-white shadow-blue-500/40" : "bg-zinc-200 dark:bg-zinc-800 text-[var(--color-text-3)]"
            )}
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Ticket size={24} weight="bold" />
                {selectedSeat ? `Confirmar Poltrona ${selectedSeat}` : 'Selecione um assento'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, highlight }: { icon: React.ReactNode; label: string; value: string | number; color: string; highlight?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-[24px] glass border-2 transition-all flex flex-col items-center gap-1",
      highlight ? "border-blue-500/40 bg-blue-500/5 scale-105 shadow-lg shadow-blue-500/10" : "border-[var(--color-border)]"
    )}>
      <div className={cn("mb-1", color)}>{icon}</div>
      <p className="text-lg font-black font-display text-[var(--color-text)] leading-none">{value}</p>
      <p className="text-[8px] font-black uppercase tracking-widest text-[var(--color-text-3)]">{label}</p>
    </div>
  );
}

function SeatItem({ seat, onToggle }: { seat: SeatData; onToggle: (id: number) => void }) {
  const isOccupied = seat.status === 'occupied';
  const isSelected = seat.status === 'selected';

  return (
    <motion.button
      whileTap={{ scale: isOccupied ? 1 : 0.85 }}
      onClick={() => onToggle(seat.id)}
      disabled={isOccupied}
      className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all font-display border-2 shadow-sm",
        isOccupied && "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 border-transparent cursor-not-allowed grayscale",
        !isOccupied && !isSelected && "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-[var(--color-border)] hover:border-blue-500/40",
        isSelected && "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30 scale-110"
      )}
    >
      {String(seat.id).padStart(2, '0')}
    </motion.button>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-4 h-4 rounded-md border", color)} />
      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-3)]">{label}</span>
    </div>
  );
}
