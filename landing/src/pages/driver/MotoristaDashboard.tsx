import { BellRing, QrCode } from 'lucide-react'

export default function MotoristaDashboard() {
    return (
        <div className="flex flex-col h-full w-full">
            <header className="pt-6 pb-2 px-6 flex flex-col gap-1 w-full z-10 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 opacity-80">
                        <span className="text-sm font-semibold tracking-wider uppercase text-slate-400">Transporte Municipal</span>
                    </div>
                    <div className="bg-[#f2cc0d]/20 border border-[#f2cc0d]/30 rounded-full px-3 py-1 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#f2cc0d] animate-pulse" />
                        <span className="text-[#f2cc0d] text-xs font-bold tracking-wider">--:--:--</span>
                    </div>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white leading-none mt-2">
                    — <span className="text-[#f2cc0d] block text-2xl mt-1 font-bold opacity-90">Aguardando dados</span>
                </h1>
            </header>

            <main className="flex-1 flex flex-col items-center py-4 px-6 w-full gap-5 overflow-y-auto no-scrollbar">
                <div className="w-full bg-[#2a2718] border border-[#3d3822] rounded-2xl p-5 flex flex-col items-start shadow-xl relative overflow-hidden shrink-0">
                    <div className="flex items-center gap-3 w-full mb-4 pb-3 border-b border-[#3d3822]">
                        <BellRing className="text-slate-400 w-6 h-6" />
                        <h3 className="text-slate-300 font-bold text-sm tracking-wider uppercase">Status de Presença</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col gap-1 border-r border-[#3d3822]">
                            <span className="text-[#16a34a] text-3xl font-black tabular-nums">—</span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Confirmados</span>
                        </div>
                        <div className="flex flex-col gap-1 pl-2">
                            <span className="text-[#eab308] text-3xl font-black tabular-nums">—</span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Pendentes</span>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-[#2a2718] border border-[#3d3822] rounded-2xl p-5 flex flex-col gap-4 shrink-0">
                    <div className="flex justify-between items-center border-b border-[#3d3822] pb-3">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Próximas Paradas</span>
                    </div>
                    <div className="flex items-center justify-center py-8">
                        <p className="text-slate-500 text-sm">Nenhuma parada carregada</p>
                    </div>
                </div>

                <button className="w-full bg-[#16a34a] hover:bg-green-500 text-white py-4 rounded-xl font-black text-xl uppercase tracking-widest shadow-lg shadow-green-900/20 transition-colors flex items-center justify-center gap-3 shrink-0 mt-2 mb-2 border border-green-400">
                    <QrCode className="w-8 h-8" />
                    <span>Abrir Validador</span>
                </button>
            </main>
        </div>
    )
}
