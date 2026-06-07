import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createDropoffPoint, updateDropoffPoint, DropoffPoint } from '../../api/fleet';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PickupPointMap } from '../../components/map/PickupPointMap';

interface DropoffPointModalProps {
  routeId: string;
  pointToEdit?: DropoffPoint | null;
  onClose: () => void;
  onSaved: () => void;
}

export function DropoffPointModal({ routeId, pointToEdit, onClose, onSaved }: DropoffPointModalProps) {
  const [name, setName] = useState('');
  const [lat, setLat] = useState(-10.9472);
  const [lng, setLng] = useState(-37.0731);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pointToEdit) {
      setName(pointToEdit.name);
      setLat(pointToEdit.lat);
      setLng(pointToEdit.lng);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {}
      );
    }
  }, [pointToEdit]);

  const handleMapChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  const handleNameSuggestion = (suggestedName: string) => {
    if (!name.trim()) {
      setName(suggestedName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do ponto de desembarque é obrigatório.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (pointToEdit) {
        await updateDropoffPoint(routeId, pointToEdit.id, { name, lat, lng });
      } else {
        await createDropoffPoint(routeId, { name, lat, lng });
      }
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar o ponto de desembarque.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[18px] w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#C3C6D7]/20 flex-shrink-0">
          <h3 className="text-lg font-bold text-[#131B2E]">
            {pointToEdit ? 'Editar Ponto de Desembarque' : 'Adicionar Ponto de Desembarque'}
          </h3>
          <button onClick={onClose} className="p-1 text-[#434655] hover:text-[#131B2E] transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] text-xs font-semibold text-[#BA1A1A]">
              {error}
            </div>
          )}

          <Input
            id="point-name"
            label="Nome do Ponto de Desembarque"
            placeholder="Ex: Parada do Campus Universitário"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#434655]">Selecione a Localização</label>
            <PickupPointMap lat={lat} lng={lng} onChange={handleMapChange} onNameSuggestion={handleNameSuggestion} />
          </div>

          <div className="flex gap-4 mt-6 border-t border-[#C3C6D7]/20 pt-6 flex-shrink-0">
            <Button type="submit" loading={loading} className="flex-1 py-3">
              Salvar Ponto
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 py-3">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
