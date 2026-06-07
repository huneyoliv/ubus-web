import React from 'react';
import { Input } from '../../ui/Input';

interface StepIdentificacaoProps {
  plate: string;
  setPlate: (val: string) => void;
  identificationNumber: string;
  setIdentificationNumber: (val: string) => void;
}

export function StepIdentificacao({
  plate,
  setPlate,
  identificationNumber,
  setIdentificationNumber,
}: StepIdentificacaoProps) {
  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/-/g, '').toUpperCase().slice(0, 7);
    const formatted = raw.length > 3 ? `${raw.slice(0, 3)}-${raw.slice(3)}` : raw;
    setPlate(formatted);
  };

  return (
    <div className="flex flex-col gap-5">
      <Input
        id="plate"
        label="Placa do Veículo"
        placeholder="ABC-1234"
        value={plate}
        onChange={handlePlateChange}
      />
      <Input
        id="identificationNumber"
        label="Prefixo / Número de Identificação"
        placeholder="Ex: 1050"
        value={identificationNumber}
        onChange={(e) => setIdentificationNumber(e.target.value)}
      />
    </div>
  );
}
