import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'DRIVER' | 'LEADER' | 'STUDENT' | 'RIDE_SHARE';
  municipalityId: string;
  phone?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RENEWAL_PENDING' | 'SUSPENDED' | 'INACTIVE';
  priorityLevel?: number;
  defaultRouteId?: string;
  defaultPointId?: string;
  needsWheelchair?: boolean;
  photoUrl?: string;
  gradeFileUrl?: string;
  residenciaFileUrl?: string;
  accessibilityReason?: 'PCD' | 'TEA' | 'IDOSO' | 'GESTANTE' | 'LACTANTE' | 'MOBILIDADE_REDUZIDA' | null;
  accessibilityDocUrl?: string | null;
  accessibilityStatus?: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REVOKED' | null;
  accessibilityApprovedAt?: string | null;
  accessibilityReviewNote?: string | null;
  accessibilityConsecutivePeriods?: number;
  createdAt: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'ubus-manager-auth' }
  )
);
