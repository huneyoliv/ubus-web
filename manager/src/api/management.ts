import { api } from './client';

export interface Municipality {
  id: string;
  name: string;
  state: string;
}

export async function listMunicipalities(): Promise<Municipality[]> {
  const r = await api.get('/management/public');
  return r.data;
}

export async function getMunicipality(id: string): Promise<Municipality> {
  const r = await api.get(`/management/${id}`);
  return r.data;
}

export async function createManager(payload: any): Promise<any> {
  const r = await api.post('/management/managers', payload);
  return r.data;
}

export async function removeManager(id: string): Promise<void> {
  await api.delete(`/management/${id}/manager`);
}
