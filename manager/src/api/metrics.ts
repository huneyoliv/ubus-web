import { api } from './client';

export interface DashboardMetrics {
  activeTrips: number;
  pendingRegistrations: number;
  todayReservations: number;
  totalStudents?: number;
  approvedStudents?: number;
  totalDrivers?: number;
  totalBuses?: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const r = await api.get('/metrics/dashboard');
  return r.data;
}
