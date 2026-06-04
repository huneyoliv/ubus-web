import { api } from './client';

export interface Route {
  id: string;
  name: string;
  description?: string;
  weekDays: string[];
  votingOpen: string;
  votingClose: string;
  active: boolean;
  requiresElevator?: boolean;
}

export interface Bus {
  id: string;
  plate: string;
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
  const r = await api.post('/fleet/routes', payload);
  return r.data;
}

export async function updateRoute(id: string, payload: Partial<Route>): Promise<Route> {
  const r = await api.patch(`/fleet/routes/${id}`, payload);
  return r.data;
}

export async function listBuses(): Promise<Bus[]> {
  const r = await api.get('/fleet/buses');
  return r.data;
}

export async function createBus(payload: Omit<Bus, 'id'>): Promise<Bus> {
  const r = await api.post('/fleet/buses', payload);
  return r.data;
}

export async function updateBus(id: string, payload: Partial<Bus>): Promise<Bus> {
  const r = await api.patch(`/fleet/buses/${id}`, payload);
  return r.data;
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
  const r = await api.patch(`/fleet/routes/${routeId}/points/${pointId}`, payload);
  return r.data;
}

export async function deletePickupPoint(routeId: string, pointId: string): Promise<void> {
  await api.delete(`/fleet/routes/${routeId}/points/${pointId}`);
}

export async function getRouteCalendar(routeId: string, month: string): Promise<{ scheduledDates: string[] }> {
  const r = await api.get(`/trips/route/${routeId}/calendar`, { params: { month } });
  return r.data;
}

export async function scheduleTrips(payload: {
  routeId: string;
  busId: string;
  driverId?: string;
  dates: string[];
  shifts: string[];
  directions: string[];
}): Promise<string> {
  const r = await api.post('/trips/schedule', payload);
  return r.data;
}

export async function assignDriverToTrip(tripId: string, driverId: string): Promise<Trip> {
  const r = await api.patch(`/trips/${tripId}/driver`, { driverId });
  return r.data;
}
