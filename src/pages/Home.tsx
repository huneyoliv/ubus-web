import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ArrowRight, CheckCircle, Clock, MapPin, CalendarCheck, Bus, Lightning, CaretRight, Info } from 'phosphor-react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import type { Trip, Reservation, BackendReservationResponse } from '@/types';
import { mapBackendReservation } from '@/types';

export default function Home() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [openTrips, setOpenTrips] = useState<Trip[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('[DEBUG] Carregando dados do dashboard do estudante...');
      try {
        const [trips, backendReservations] = await Promise.all([
          api.get<Trip[]>('/trips/open').catch(() => [] as Trip[]),
          api.get<BackendReservationResponse[]>('/reservations/mine').catch(() => [] as BackendReservationResponse[]),
        ]);
        console.log(`[DEBUG] Viagens abertas encontradas: ${trips.length}`);
        console.log(`[DEBUG] Reservas ativas encontradas: ${backendReservations.length}`);
        setOpenTrips(trips);
        setMyReservations(backendReservations.map(mapBackendReservation));
      } catch (err) {
        console.error('[DEBUG] Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const firstName = user?.name?.split(' ')[0] ?? 'Viajante';
  const hasReservation = myReservations.length > 0;
  const hasOpenTrips = openTrips.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-500">
      <div className="px-6 pt-10 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-14 h-14 rounded-2xl glass border-2 border-white/20 flex items-center justify-center font-black text-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-display shadow-xl">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--color-bg)] bg-green-500 shadow-lg" />
          </motion.div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-3)] mb-0.5">Painel Geral</p>
            <h2 className="text-2xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">Olá, {firstName}</h2>
          </div>
        </div>
        <button className="relative w-12 h-12 flex items-center justify-center rounded-2xl glass border-[var(--color-border)] hover:bg-white/50 transition-all">
          <Bell size={24} weight="bold" className="text-[var(--color-text-2)]" />
          {hasReservation && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--color-bg)]" />
          )}
        </button>
      </div>

      <div className="px-6 pb-24 space-y-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-3xl skeleton" />)}
          </div>
        ) : (
          <div className="animate-spring-up space-y-8">
            {hasReservation && (
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-text-3)] flex items-center gap-2">
                    <CheckCircle size={18} weight="duotone" className="text-green-500" /> Reservas Ativas
                  </h3>
                  <span className="text-[10px] font-black bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full uppercase truncate">Confirmado</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {myReservations.map((res) => (
                    <motion.div
                      key={res.id}
                      whileHover={{ scale: 1.01 }}
                      className="group relative overflow-hidden rounded-3xl glass border-2 border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all duration-300 shadow-sm"
                    >
                      <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${res.viagem?.direcao === 'IDA' ? 'from-blue-500 to-indigo-600' : 'from-green-500 to-emerald-600'}`} />
                      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${res.viagem?.direcao === 'IDA' ? 'bg-blue-500' : 'bg-green-600'}`}>
                              {res.viagem?.direcao === 'IDA' ? 'Indo' : 'Voltando'}
                            </span>
                            <span className="text-sm font-black text-[var(--color-text-2)] uppercase">{res.viagem?.turno}</span>
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-[var(--color-text)] font-display tracking-tight leading-tight">
                              {res.viagem?.linha?.nome ?? 'Linha Especial'}
                            </h4>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-3)]">
                                <CalendarCheck size={16} weight="duotone" className="text-blue-500" /> {res.viagem?.dataViagem}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-3)]">
                                <Bus size={16} weight="duotone" className="text-indigo-500" /> Assento {res.numeroAssento ?? 'Livre'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/bilhete', { state: { reservationId: res.id, reservation: res } })}
                          className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-sm text-white shadow-xl transition-transform active:scale-95 ${res.viagem?.direcao === 'IDA' ? 'bg-blue-600' : 'bg-green-600'}`}
                        >
                          Acessar Bilhete <CaretRight size={18} weight="bold" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-text-3)] flex items-center gap-2">
                  <Lightning size={18} weight="duotone" className="text-amber-500" /> {hasOpenTrips ? 'Reservar Próxima Viagem' : 'Status do Sistema'}
                </h3>
              </div>

              {!hasOpenTrips ? (
                <div className="p-8 rounded-3xl glass border-2 border-dashed border-[var(--color-border)] flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[var(--color-text-3)]">
                    <Clock size={32} weight="duotone" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-text)]">Aguardando novas janelas</p>
                    <p className="text-sm text-[var(--color-text-3)] mt-1">Fique atento às notificações para novas viagens abertas.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {openTrips.map((trip) => (
                    <motion.button
                      key={trip.idViagem}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate('/reservar', { state: { tripId: trip.idViagem, trip } })}
                      className="group p-6 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all shadow-sm flex flex-col justify-between min-h-[160px]"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trip.direcao === 'IDA' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                            <Bus size={22} weight="duotone" />
                          </div>
                          <div className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-3)]">
                            {trip.direcao}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-black text-[var(--color-text-3)] uppercase tracking-wider mb-1">{trip.turno}</p>
                          <h5 className="font-black text-[var(--color-text)] font-display tracking-tight line-clamp-1">{trip.linha?.nome ?? 'Linha Especial'}</h5>
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-[var(--color-text-3)]">
                            <MapPin size={12} weight="bold" /> {trip.direcao === 'IDA' ? 'Centro' : 'Bairro'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[var(--color-primary)]">
                        <span className="text-xs font-black uppercase tracking-widest">Reservar Vaga</span>
                        <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickAction 
                icon={<Info size={28} weight="duotone" />} 
                title="Regras do Uso" 
                desc="Consulte direitos e deveres do estudante." 
                onClick={() => navigate('/regras')} 
              />
              <QuickAction 
                icon={<MapPin size={28} weight="duotone" />} 
                title="Pontos de Embarque" 
                desc="Localização de todas as paradas." 
                onClick={() => navigate('/ponto-embarque')} 
                color="indigo" 
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAction({ icon, title, desc, onClick, color = 'blue' }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void; color?: string }) {
  const themes: Record<string, string> = {
    blue: 'bg-blue-500/5 text-blue-600 hover:bg-blue-500/10',
    indigo: 'bg-indigo-500/5 text-indigo-600 hover:bg-indigo-500/10',
  };
  
  return (
    <button onClick={onClick} className={`p-6 rounded-3xl border-2 border-transparent transition-all text-left flex items-start gap-4 ${themes[color] || themes.blue}`}>
      <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shrink-0 border-white/20">
        {icon}
      </div>
      <div>
        <h6 className="font-black text-[var(--color-text)] font-display tracking-tight leading-tight">{title}</h6>
        <p className="text-xs font-semibold text-zinc-500 mt-1">{desc}</p>
      </div>
    </button>
  );
}
