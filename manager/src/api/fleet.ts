import { api } from './client';
import { useAuthStore } from '../stores/auth.store';

export interface Route {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  requiresElevator?: boolean;
  departureTimeOutbound?: string;
  departureTimeInbound?: string;
}

export interface Bus {
  id: string;
  plate: string;
  identificationNumber: string;
  capacity: number;
  hasBathroom: boolean;
  hasAirConditioning: boolean;
  hasElevator: boolean;
  active: boolean;
  routeId?: string | null;
  preferentialSeats?: number[];
}

export interface PickupPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routeId: string;
  order?: number;
  address?: string;
}

export interface Trip {
  id: string;
  tripDate: string;
  shift: string;
  direction: string;
  status: string;
  routeId: string;
  busId: string;
  driverId?: string | null;
}

export async function listRoutes(): Promise<Route[]> {
  const r = await api.get('/fleet/routes');
  return r.data;
}

export async function createRoute(payload: Omit<Route, 'id'>): Promise<Route> {
  const fullPayload = {
    ...payload,
    weekDays: [1, 2, 3, 4, 5],
    votingOpenTime: '06:00',
    votingCloseTime: '07:30'
  };
  const r = await api.post('/fleet/routes', fullPayload);
  return r.data;
}

export async function updateRoute(id: string, payload: Partial<Route>): Promise<Route> {
  const r = await api.patch(`/fleet/routes/${id}`, payload);
  return r.data;
}

export async function listBuses(): Promise<Bus[]> {
  const r = await api.get('/fleet/buses');
  return r.data.map((bus: any) => ({
    ...bus,
    capacity: bus.standardCapacity ?? bus.capacity,
  }));
}

export async function createBus(payload: Omit<Bus, 'id'>): Promise<Bus> {
  const { capacity, ...rest } = payload;
  const backendPayload = {
    ...rest,
    standardCapacity: capacity,
  };
  const r = await api.post('/fleet/buses', backendPayload);
  return {
    ...r.data,
    capacity: r.data.standardCapacity ?? r.data.capacity,
  };
}

export async function updateBus(id: string, payload: Partial<Bus>): Promise<Bus> {
  const { capacity, ...rest } = payload;
  const backendPayload = {
    ...rest,
    ...(capacity !== undefined ? { standardCapacity: capacity } : {}),
  };
  const r = await api.patch(`/fleet/buses/${id}`, backendPayload);
  return {
    ...r.data,
    capacity: r.data.standardCapacity ?? r.data.capacity,
  };
}

export async function listPickupPoints(routeId: string): Promise<PickupPoint[]> {
  const r = await api.get(`/fleet/routes/${routeId}/points`);
  return r.data;
}

export async function createPickupPoint(routeId: string, payload: { name: string; lat: number; lng: number }): Promise<PickupPoint> {
  const r = await api.post(`/fleet/routes/${routeId}/points`, payload);
  return r.data;
}

export async function updatePickupPoint(routeId: string, pointId: string, payload: { name?: string; lat?: number; lng?: number }): Promise<PickupPoint> {
  const r = await api.patch(`/fleet/points/${pointId}`, payload);
  return r.data;
}

export async function deletePickupPoint(routeId: string, pointId: string): Promise<void> {
  await api.delete(`/fleet/points/${pointId}`);
}

export async function getRouteCalendar(routeId: string, month: string): Promise<{ scheduledDates: string[] }> {
  const [year, monthStr] = month.split('-');
  const monthNum = parseInt(monthStr, 10).toString();
  const r = await api.get(`/trips/route/${routeId}/calendar`, { params: { year, month: monthNum } });
  const trips = Array.isArray(r.data) ? r.data : [];
  const scheduledDates = Array.from(new Set(trips.map((t: any) => t.tripDate)));
  return { scheduledDates };
}

export async function scheduleTrips(payload: {
  routeId: string;
  busId: string;
  driverId?: string;
  dates: string[];
  shifts: string[];
  directions: string[];
}): Promise<string> {
  const municipalityId = useAuthStore.getState().user?.municipalityId || '';
  let realCapacity = 40;
  try {
    const busRes = await api.get(`/fleet/buses/${payload.busId}`);
    realCapacity = busRes.data.standardCapacity ?? busRes.data.capacity ?? 40;
  } catch (err) {
    // Ignora erro de busca
  }

  const basePayload = {
    municipalityId,
    routeId: payload.routeId,
    busId: payload.busId,
    driverId: payload.driverId,
    dates: payload.dates,
    realCapacity,
  };

  const r1 = await api.post('/trips/schedule', {
    ...basePayload,
    shift: 'MORNING',
    direction: 'OUTBOUND',
  });

  await api.post('/trips/schedule', {
    ...basePayload,
    shift: 'MORNING',
    direction: 'INBOUND',
  });

  return r1.data;
}

export async function assignDriverToTrip(tripId: string, driverId: string): Promise<Trip> {
  const r = await api.patch(`/trips/${tripId}/driver`, { driverId });
  return r.data;
}
