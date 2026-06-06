import React, { useEffect } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#0F172A]/50 z-[9990] flex items-center justify-center p-4">
      <div className="bg-white rounded-[18px] border border-[#C3C6D7]/30 shadow-2xl max-w-md w-full p-6 flex flex-col gap-6 animate-zoom-in">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-[#131B2E] tracking-tight font-outfit">{title}</h3>
          <p className="text-sm font-medium text-[#434655] leading-relaxed">{description}</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} className="py-2 px-4 text-sm">
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'primary'}
            onClick={onConfirm}
            className="py-2 px-4 text-sm"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
