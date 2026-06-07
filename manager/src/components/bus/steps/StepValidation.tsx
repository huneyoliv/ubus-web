import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/Button';

interface StepValidationProps {
  error: string;
  onRedirect: (step: number) => void;
}

export function StepValidation({ error, onRedirect }: StepValidationProps) {
  const isAccessibilityError = error.toLowerCase().includes('box') || error.toLowerCase().includes('acessibilidade');

  return (
    <div className="flex flex-col items-center text-center p-6 bg-red-50 border border-red-200 rounded-2xl gap-5">
      <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
      <div>
        <h2 className="text-lg font-bold text-red-800">Inconsistência Detectada</h2>
        <p className="text-sm text-red-700 mt-2 max-w-md">{error}</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
        {isAccessibilityError ? (
          <>
            <Button type="button" onClick={() => onRedirect(3)} className="w-full">
              Ajustar Fundo (P3)
            </Button>
            <Button type="button" onClick={() => onRedirect(5)} className="w-full">
              Ajustar Acessibilidade (P5)
            </Button>
          </>
        ) : (
          <>
            <Button type="button" onClick={() => onRedirect(2)} className="w-full">
              Ajustar Primeira Fileira (P2)
            </Button>
            <Button type="button" onClick={() => onRedirect(3)} className="w-full">
              Ajustar Fundo (P3)
            </Button>
            <Button type="button" onClick={() => onRedirect(4)} className="w-full">
              Ajustar Capacidade (P4)
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
