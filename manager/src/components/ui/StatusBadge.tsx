import React from 'react';

type StatusType =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'RENEWAL_PENDING'
  | 'SUSPENDED'
  | 'PENDING_REVIEW'
  | 'INACTIVE'
  | 'EXPIRED'
  | 'REVOKED';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<StatusType, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pendente' },
    APPROVED: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Aprovado' },
    REJECTED: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Rejeitado' },
    RENEWAL_PENDING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Renovação' },
    SUSPENDED: { bg: 'bg-slate-100', text: 'text-slate-800', label: 'Suspenso' },
    PENDING_REVIEW: { bg: 'bg-violet-100', text: 'text-violet-800', label: 'Acessibilidade' },
    INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inativo' },
    EXPIRED: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Expirado' },
    REVOKED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Revogado' },
  };

  const current = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none ${current.bg} ${current.text}`}>
      {current.label}
    </span>
  );
}
