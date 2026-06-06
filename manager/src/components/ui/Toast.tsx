import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-[#DEF7EC] border-[#BCF0DA] text-[#03543F]',
            error: 'bg-[#FDE8E8] border-[#FBD5D5] text-[#9B1C1C]',
            warning: 'bg-[#FDF6B2] border-[#FCE8B2] text-[#723B10]',
          };

          const Icon = {
            success: CheckCircle,
            error: XCircle,
            warning: AlertTriangle,
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 p-4 rounded-[12px] border shadow-lg transition-all duration-300 pointer-events-auto animate-slide-in ${typeStyles[toast.type]}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/5 rounded-[6px] transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado com um ToastProvider');
  }
  return context;
}
