import React, { useState } from 'react';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { createBus, saveBusLayout } from '../../api/fleet';
import {
  BusLayoutEngine,
  BusWizardAnswers,
  FrontRowLayout,
  RearLayout,
  AccessibilityFeature,
  NumerationSide,
  NumberingPattern,
} from './BusLayoutEngine';
import { BusLayout, NumberingMode } from '../../api/fleet';

import { StepIdentificacao } from './steps/StepIdentificacao';
import { StepMultiChoice } from './steps/StepMultiChoice';
import { StepP4 } from './steps/StepP4';
import { StepP7 } from './steps/StepP7';
import { StepValidation } from './steps/StepValidation';
import { StepPreview } from './steps/StepPreview';
import { Button } from '../ui/Button';

interface BusWizardProps {
  onClose: () => void;
  onSaved: () => void;
}

export function BusWizard({ onClose, onSaved }: BusWizardProps) {
  const [step, setStep] = useState(0);
  const [plate, setPlate] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [p1, setP1] = useState<NumberingMode | null>(null);
  const [p2, setP2] = useState<FrontRowLayout | null>(null);
  const [p3, setP3] = useState<RearLayout | null>(null);
  const [p4capacity, setP4capacity] = useState<number | null>(null);
  const [p5, setP5] = useState<AccessibilityFeature | null>(null);
  const [p6, setP6] = useState<NumerationSide | null>(null);
  const [p6b, setP6b] = useState<NumberingPattern | null>(null);
  const [virtualCapacity, setVirtualCapacity] = useState('');
  const [p7numbers, setP7numbers] = useState<Record<number, number>>({});

  const [validationError, setValidationError] = useState<string | null>(null);
  const [layout, setLayout] = useState<BusLayout | null>(null);
  const [dpmWarning, setDpmWarning] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = useAuthStore((state) => state.user);

  const buildAnswers = (): BusWizardAnswers => ({
    plate: plate.toUpperCase(),
    identificationNumber: identificationNumber.trim(),
    p1: p1 || 'PHYSICAL',
    p2: p2 || 'FOUR',
    p3: p3 || 'NORMAL',
    p4capacity: p1 === 'VIRTUAL' ? (parseInt(virtualCapacity, 10) || 44) : (p4capacity || 44),
    p5: p5 || 'NONE',
    p6: p6 || 'LEFT',
    p6b: p6b || 'SEQUENTIAL',
    p7physicalNumbers: p7numbers,
  });

  const computeDpmWarningMessage = (answers: BusWizardAnswers, builtLayout: BusLayout): string | null => {
    if (answers.p5 !== 'DPM') return null;
    if (builtLayout.rows.length === 0) return null;
    const firstRow = builtLayout.rows[0];

    if (answers.p6 === 'LEFT') {
      if (firstRow.cells[3].type !== 'SEAT') {
        return `Atenção: O assento acessível (DPM) foi posicionado na janela da primeira fileira (poltrona ${firstRow.cells[4].virtualNumber}) porque a posição de corredor está vazia.`;
      }
    } else {
      if (firstRow.cells[1].type !== 'SEAT') {
        return `Atenção: O assento acessível (DPM) foi posicionado na janela da primeira fileira (poltrona ${firstRow.cells[0].virtualNumber}) porque a posição de corredor está vazia.`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    const answers = buildAnswers();
    setLoading(true);
    setError('');

    try {
      let finalLayout = layout;
      let dpmNum: number | null = null;
      if (answers.p1 !== 'VIRTUAL' && layout) {
        finalLayout = BusLayoutEngine.applyPhysicalNumbers(layout, p7numbers);
        dpmNum = BusLayoutEngine.computeDpmVirtualNumber(answers, finalLayout);
      }

      const bus = await createBus({
        plate: plate.toUpperCase(),
        identificationNumber: identificationNumber.trim(),
        capacity: answers.p4capacity,
        hasBathroom: answers.p1 !== 'VIRTUAL' && answers.p3 === 'BATHROOM',
        hasAirConditioning: false,
        hasElevator: answers.p5 === 'BOX' || (answers.p1 !== 'VIRTUAL' && answers.p3 === 'BOX'),
        active: true,
        routeId: null,
        preferentialSeats: dpmNum !== null ? [dpmNum] : [],
      });

      if (answers.p1 !== 'VIRTUAL' && finalLayout) {
        try {
          await saveBusLayout(bus.id, {
            numberingMode: answers.p1,
            numerationSide: answers.p6,
            rows: finalLayout.rows,
            dpmSeatVirtualNumber: dpmNum,
            preferentialSeats: dpmNum !== null ? [dpmNum] : [],
          });
        } catch (layoutErr) {
          // Falha silenciosa se o endpoint não existir
        }
      }

      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao cadastrar o veículo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvance = () => {
    setError('');
    const isVirtual = p1 === 'VIRTUAL';

    if (step === 0) {
      if (!plate.trim() || !identificationNumber.trim()) {
        setError('Preencha a placa e o número do veículo.');
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (!p1) return;
      setStep(isVirtual ? 11 : 2);
    } else if (step === 11) {
      const cap = parseInt(virtualCapacity, 10);
      if (isNaN(cap) || cap < 1) {
        setError('Informe uma capacidade válida.');
        return;
      }
      setStep(5);
    } else if (step === 2) {
      if (!p2) return;
      setStep(3);
    } else if (step === 3) {
      if (!p3) return;
      setStep(4);
    } else if (step === 4) {
      if (!p4capacity) return;
      setStep(5);
    } else if (step === 5) {
      if (!p5) return;
      setStep(isVirtual ? 9 : 6);
    } else if (step === 6) {
      if (!p6) return;
      setStep(10);
    } else if (step === 10) {
      if (!p6b) return;
      const answers = buildAnswers();
      const err = BusLayoutEngine.validate(answers);
      if (err) {
        setValidationError(err);
        setStep(7);
      } else {
        const built = BusLayoutEngine.buildLayout(answers);
        setLayout(built);
        setDpmWarning(computeDpmWarningMessage(answers, built));
        if (answers.p1 === 'MIXED') {
          setStep(8);
        } else {
          setStep(9);
        }
      }
    } else if (step === 8) {
      setStep(9);
    } else if (step === 9) {
      handleSave();
    }
  };

  const handleBack = () => {
    setError('');
    const isVirtual = p1 === 'VIRTUAL';

    if (step === 0) {
      onClose();
    } else if (step === 1) {
      setStep(0);
    } else if (step === 11) {
      setStep(1);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    } else if (step === 5) {
      setStep(isVirtual ? 11 : 4);
    } else if (step === 6) {
      setStep(5);
    } else if (step === 10) {
      setStep(6);
    } else if (step === 7 || step === 8) {
      setStep(10);
    } else if (step === 9) {
      if (isVirtual) {
        setStep(5);
      } else {
        setStep(p1 === 'MIXED' ? 8 : 10);
      }
    } else {
      setStep(step - 1);
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 0:
        return !plate.trim() || !identificationNumber.trim();
      case 1:
        return !p1;
      case 11:
        return !virtualCapacity.trim() || isNaN(parseInt(virtualCapacity, 10)) || parseInt(virtualCapacity, 10) < 1;
      case 2:
        return !p2;
      case 3:
        return !p3;
      case 4:
        return !p4capacity;
      case 5:
        return !p5;
      case 6:
        return !p6;
      case 10:
        return !p6b;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Novo Ônibus</h1>
              {step >= 1 && step <= 6 && (
                <span className="text-xs text-slate-400">Etapa {step} de 6</span>
              )}
              {step === 10 && (
                <span className="text-xs text-slate-400">Padrão de Numeração</span>
              )}
              {step === 11 && (
                <span className="text-xs text-slate-400">Capacidade</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {step === 0 && (
            <StepIdentificacao
              plate={plate}
              setPlate={setPlate}
              identificationNumber={identificationNumber}
              setIdentificationNumber={setIdentificationNumber}
            />
          )}

          {step === 1 && (
            <StepMultiChoice
              question="As poltronas têm número físico?"
              options={[
                { value: 'PHYSICAL', title: 'Sim, todas têm (numeração contínua)', subtitle: 'Ex: As poltronas físicas seguem a sequência normal de 1 até o final.' },
                { value: 'VIRTUAL', title: 'Não, o ônibus só informa a lotação total', subtitle: 'Ex: O ônibus não possui números gravados nos assentos, os alunos escolhem livremente por número virtual.' },
                { value: 'MIXED', title: 'Mista / Personalizada', subtitle: 'Ex: Algumas poltronas têm números pulados, fora de ordem, ou o banheiro muda a numeração física.' },
              ]}
              selectedValue={p1}
              onSelect={setP1}
            />
          )}

          {step === 11 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[#131B2E]">Qual a capacidade total de passageiros?</h2>
              <input
                type="number"
                value={virtualCapacity}
                onChange={(e) => setVirtualCapacity(e.target.value)}
                placeholder="Ex: 44"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002776] focus:border-transparent text-sm"
              />
            </div>
          )}

          {step === 2 && (
            <StepMultiChoice
              question="Quantos assentos existem na primeira fileira?"
              options={[
                { value: 'FOUR', title: '4 assentos', subtitle: 'Layout completo com 2 assentos na esquerda e 2 na direita.' },
                { value: 'THREE', title: '3 assentos', subtitle: 'Geralmente falta o assento do corredor direito por conta da escada da porta.' },
                { value: 'TWO', title: '2 assentos', subtitle: 'Apenas os assentos da janela, deixando o corredor e espaço de escada mais amplos.' },
              ]}
              selectedValue={p2}
              onSelect={setP2}
            />
          )}

          {step === 3 && (
            <StepMultiChoice
              question="Como é a parte de trás do ônibus?"
              options={[
                { value: 'BATHROOM', title: 'Tem banheiro no fundo', subtitle: 'O banheiro ocupa o lado direito do fundo. Sobram 2 assentos no lado esquerdo.' },
                { value: 'NORMAL', title: 'Fileira normal com 4 assentos', subtitle: 'Layout padrão de 2 assentos na esquerda e 2 na direita, com corredor central.' },
                { value: 'FIVE', title: 'Fileira inteira com 5 assentos', subtitle: 'Última fileira inteiriça sem corredor, contendo 5 lugares.' },
                { value: 'BOX', title: 'Espaço de cadeirante / Box no fundo', subtitle: 'O fundo do ônibus é reservado para fixação de cadeira de rodas.' },
              ]}
              selectedValue={p3}
              onSelect={setP3}
            />
          )}

          {step === 4 && (
            <StepP4
              p2={p2}
              p3={p3}
              selectedValue={p4capacity}
              onSelect={setP4capacity}
            />
          )}

          {step === 5 && (
            <StepMultiChoice
              question="Qual o recurso de acessibilidade?"
              options={[
                { value: 'DPM', title: 'DPM (Dispositivo de Poltrona Móvel)', subtitle: 'Poltrona da primeira fileira que se projeta para fora do ônibus.' },
                { value: 'BOX', title: 'Box para Cadeira de Rodas no fundo', subtitle: 'Espaço reservado no fundo para fixação de cadeira de rodas.' },
                { value: 'NONE', title: 'Nenhum', subtitle: 'O ônibus não possui recursos especiais de acessibilidade instalados.' },
              ]}
              selectedValue={p5}
              onSelect={setP5}
            />
          )}

          {step === 6 && (
            <StepMultiChoice
              question="De qual lado começa a numeração?"
              options={[
                { value: 'LEFT', title: 'Lado Esquerdo', subtitle: 'A contagem das poltronas inicia no lado do motorista.' },
                { value: 'RIGHT', title: 'Lado Direito', subtitle: 'A contagem das poltronas inicia no lado da porta de embarque.' },
              ]}
              selectedValue={p6}
              onSelect={setP6}
            />
          )}

          {step === 10 && (
            <StepMultiChoice
              question="Como as poltronas são numeradas?"
              options={[
                { value: 'SEQUENTIAL', title: 'Sequencial', subtitle: '1, 2, 3, 4... — cada coluna da frente para o fundo recebe o próximo número.' },
                { value: 'ODD_WINDOW', title: 'Ímpares na janela', subtitle: 'Janela: 1, 3, 5… / Corredor: 2, 4, 6…' },
                { value: 'EVEN_WINDOW', title: 'Pares na janela', subtitle: 'Janela: 2, 4, 6… / Corredor: 1, 3, 5…' },
              ]}
              selectedValue={p6b}
              onSelect={setP6b}
            />
          )}

          {step === 7 && (
            <StepValidation
              error={validationError || 'Layout inválido'}
              onRedirect={(targetStep) => setStep(targetStep)}
            />
          )}

          {step === 8 && layout && (
            <StepP7
              layout={layout}
              p7numbers={p7numbers}
              onChangeNumber={(v, p) => {
                if (p === null) {
                  const copy = { ...p7numbers };
                  delete copy[v];
                  setP7numbers(copy);
                } else {
                  setP7numbers({ ...p7numbers, [v]: p });
                }
              }}
            />
          )}

          {step === 9 && layout && p1 !== 'VIRTUAL' && (
            <StepPreview
              title="Mapa Final do Veículo"
              subtitle="Este é o mapa final gerado para o ônibus cadastrado."
              layout={layout}
              p7numbers={p7numbers}
              dpmWarning={dpmWarning}
            />
          )}

          {step === 9 && p1 === 'VIRTUAL' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-[#131B2E]">Confirmação de Cadastro</h2>
                <p className="text-sm text-slate-500 mt-1">Revise as informações antes de cadastrar o veículo.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
                <div className="flex justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-sm font-medium text-slate-500">Placa</span>
                  <span className="text-sm font-bold text-slate-800">{plate.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-sm font-medium text-slate-500">Prefixo</span>
                  <span className="text-sm font-bold text-slate-800">{identificationNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-sm font-medium text-slate-500">Tipo de Numeração</span>
                  <span className="text-sm font-bold text-slate-800">Virtual (Sem marcação)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-3">
                  <span className="text-sm font-medium text-slate-500">Capacidade</span>
                  <span className="text-sm font-bold text-slate-800">{virtualCapacity} passageiros</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-500">Acessibilidade</span>
                  <span className="text-sm font-bold text-[#002776]">
                    {p5 === 'BOX' ? 'Espaço de cadeirante / Box' : p5 === 'DPM' ? 'DPM (Dispositivo de Poltrona Móvel)' : 'Nenhum'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 7 && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-end shrink-0">
            <Button
              type="button"
              disabled={isNextDisabled() || loading}
              onClick={handleAdvance}
              className="px-8 py-3 bg-[#002776] text-white font-bold rounded-xl hover:bg-[#001D5C] transition flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {step === 9 ? 'Concluir e Salvar' : 'Avançar'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
