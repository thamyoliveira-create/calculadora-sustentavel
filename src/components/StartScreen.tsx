import { useState } from 'react';
import { Leaf, BarChart3, QrCode, ArrowRight, Zap, Droplets, Carrot, ShoppingBag, Recycle, Bike, Clock, ShieldCheck, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8F8F7] text-forest-950 flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-950 text-white shadow-xs">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold tracking-[.15em] uppercase text-forest-950">
              CALCULADORA SUSTENTÁVEL
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-stone-600 border border-stone-200">
              Ação Educativa • Ensino Médio
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-12 text-center">
        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-forest-950/15 bg-white px-3.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[.18em] text-forest-900 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-gold-500" />
          Consciência Crítica, Gastos & Recursos
        </div>

        {/* Headline */}
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-forest-950 sm:text-5xl sm:leading-[1.15]">
          QUANTO CUSTA O NOSSO CONSUMO?
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-xl text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
          Descubra o impacto real dos seus hábitos diários, veja quanto você gasta e
          compreenda como a lógica de lucro das grandes empresas afeta o esgotamento dos recursos do planeta.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={onStart}
            className="btn-primary w-full sm:w-auto text-sm sm:text-base"
          >
            Começar o Questionário
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setQrOpen(true)}
            className="btn-secondary w-full sm:w-auto text-xs sm:text-sm"
          >
            <QrCode className="h-4 w-4 text-stone-600" />
            Abrir no Celular
          </button>
        </div>

        <button
          onClick={onOpenFairResults}
          className="btn-ghost mt-3 text-xs font-bold tracking-wide text-stone-500"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Ver Estatísticas Coletivas da Feira
        </button>

        {/* Categories Grid */}
        <div className="mt-12 w-full border-t border-stone-200/80 pt-8">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-stone-400">
            6 Dimensões em Análise
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
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-stone-200/80 bg-white p-3.5 text-stone-700 shadow-2xs transition hover:border-forest-950/30"
              >
                <Icon className="h-5 w-5 text-forest-950" />
                <span className="text-xs font-bold text-forest-950">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-stone-200/80 bg-white/60 py-4 px-6 text-center text-xs text-stone-500">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="h-3.5 w-3.5 text-stone-400" />
            Duração: ~3 minutos
          </span>
          <span className="flex items-center gap-1.5 font-medium">
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


