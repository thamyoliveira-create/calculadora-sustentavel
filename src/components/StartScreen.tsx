import { useState } from 'react';
import { Leaf, BarChart3, QrCode, Users, Zap, Droplets, Carrot, ShoppingBag, Recycle, Bike } from 'lucide-react';
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30">
          <Leaf className="h-10 w-10" strokeWidth={2} />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
          Feira de Sustentabilidade
        </p>

        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.1]">
          QUANTO CUSTA O SEU CONSUMO?
        </h1>

        <p className="mt-5 max-w-xl text-lg text-slate-600">
          Descubra como seus hábitos cotidianos podem influenciar seus gastos e o
          uso de recursos.
        </p>

        <p className="mt-4 max-w-xl text-base text-slate-500">
          Responda algumas perguntas e veja uma estimativa do seu perfil de
          consumo, dos seus gastos anuais e de quanto algumas mudanças poderiam
          representar em economia.
        </p>

        <button onClick={onStart} className="btn-primary mt-10 text-lg">
          COMEÇAR
        </button>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setQrOpen(true)}
            className="btn-secondary"
          >
            <QrCode className="h-4 w-4" />
            Acessar pelo celular
          </button>
          <button onClick={onOpenFairResults} className="btn-ghost">
            <BarChart3 className="h-4 w-4" />
            Resultados da feira
          </button>
        </div>

        {/* Category pictograms */}
        <div className="mt-14 grid w-full grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { icon: Zap, label: 'Energia' },
            { icon: Droplets, label: 'Água' },
            { icon: Bike, label: 'Transporte' },
            { icon: Carrot, label: 'Alimentação' },
            { icon: ShoppingBag, label: 'Compras' },
            { icon: Recycle, label: 'Resíduos' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white/70 px-2 py-3 text-emerald-700 backdrop-blur-sm"
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-medium text-slate-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {qrOpen && <QRCodeModal onClose={() => setQrOpen(false)} />}
    </div>
  );
}
