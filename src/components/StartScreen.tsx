import { useState } from 'react';
import { Leaf, BarChart3, QrCode, ArrowRight, Zap, Droplets, Carrot, ShoppingBag, Recycle, Bike, Clock, ShieldCheck, BookOpen } from 'lucide-react';
import QRCodeModal from './QRCodeModal';

interface StartScreenProps {
  onStart: () => void;
  onOpenFairResults: () => void;
}

export default function StartScreen({
  onStart,
  onOpenFairResults,
}: StartScreenProps) {
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="border-b border-stone-200/80 bg-white/60 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332] text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-sm font-black tracking-tight text-[#1B4332]">
              CALCULADORA SUSTENTÁVEL
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-600 border border-stone-200">
              Ação Educativa • Ensino Médio
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-12 text-center">
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs font-bold text-stone-700 shadow-xs">
          <BookOpen className="h-3.5 w-3.5 text-[#1B4332]" />
          Guia Interativo de Consciência Crítica & Recursos
        </div>

        {/* Headline */}
        <h1 className="text-balance text-4xl font-black tracking-tight text-stone-900 sm:text-5xl sm:leading-[1.15]">
          QUANTO CUSTA O NOSSO CONSUMO?
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-xl text-base sm:text-lg text-stone-600 leading-relaxed">
          Descubra o impacto real dos seus hábitos diários, veja quanto você gasta e
          compreenda como a lógica de lucro das grandes empresas afeta o esgotamento dos recursos do planeta.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={onStart}
            className="btn-primary w-full text-base sm:w-auto"
          >
            Começar o Questionário
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setQrOpen(true)}
            className="btn-secondary w-full sm:w-auto"
          >
            <QrCode className="h-4 w-4 text-stone-600" />
            Abrir no Celular
          </button>
        </div>

        <button
          onClick={onOpenFairResults}
          className="btn-ghost mt-2 text-xs font-semibold text-stone-500"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Ver Estatísticas Coletivas da Feira
        </button>

        {/* Categories Grid */}
        <div className="mt-12 w-full border-t border-stone-200/80 pt-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-stone-400">
            6 Dimensões Analisadas
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {[
              { icon: Zap, label: 'Energia' },
              { icon: Droplets, label: 'Água' },
              { icon: Bike, label: 'Transporte' },
              { icon: Carrot, label: 'Alimentos' },
              { icon: ShoppingBag, label: 'Compras' },
              { icon: Recycle, label: 'Resíduos' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-stone-200 bg-white p-3 text-stone-700 shadow-2xs transition hover:border-stone-400"
              >
                <Icon className="h-5 w-5 text-[#1B4332]" />
                <span className="text-xs font-bold text-stone-800">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-stone-200/80 bg-white/40 py-4 px-6 text-center text-xs text-stone-500">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-stone-400" />
            Duração: ~3 minutos
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
            100% Anônimo
          </span>
          <span className="text-stone-400">
            Projeto interdisciplinar para reflexão e debate escolar
          </span>
        </div>
      </footer>

      {qrOpen && <QRCodeModal onClose={() => setQrOpen(false)} />}
    </div>
  );
}

