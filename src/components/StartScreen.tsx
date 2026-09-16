import { useState } from 'react';
import { Leaf, BarChart3, QrCode, ArrowRight, Zap, Droplets, Carrot, ShoppingBag, Recycle, Bike, Clock, ShieldCheck } from 'lucide-react';
import QRCodeModal from './QRCodeModal';

interface StartScreenProps {
  onStart: () => void;
  onOpenFairResults: () => void;
}

const DIMENSIONS = [
  { icon: Zap, label: 'Energia' },
  { icon: Droplets, label: 'Água' },
  { icon: Bike, label: 'Transporte' },
  { icon: Carrot, label: 'Alimentos' },
  { icon: ShoppingBag, label: 'Compras' },
  { icon: Recycle, label: 'Resíduos' },
];

const MARQUEE = ['reduza', 'reutilize', 'recicle', 'repense', 'recuse'];

export default function StartScreen({ onStart, onOpenFairResults }: StartScreenProps) {
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060D0A] text-[#F2FFF7] flex flex-col">
      {/* glow layers */}
      <div className="pointer-events-none absolute -left-40 -top-56 h-[520px] w-[520px] rounded-full bg-[#1E7A52] opacity-70 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 -top-40 h-[420px] w-[420px] rounded-full bg-[#C6F24E] opacity-20 blur-[110px]" />
      <div className="pointer-events-none absolute left-1/3 -bottom-64 h-[460px] w-[460px] rounded-full bg-[#0F9B6C] opacity-40 blur-[110px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(198,242,78,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(198,242,78,.22) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(85% 60% at 50% 35%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(85% 60% at 50% 35%, #000 30%, transparent 100%)',
        }}
      />

      {/* header */}
      <header className="relative z-10 px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C6F24E] text-[#06130C]">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-[.15em] sm:text-sm">
              calculadora sustentável
            </span>
          </div>
          <span className="hidden rounded-full border border-[#C6F24E]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#C6F24E] sm:inline-flex">
            feira de sustentabilidade
          </span>
        </div>
      </header>

      {/* main */}
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-10 text-center sm:py-14">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C6F24E]/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-[#C6F24E] sm:text-[11px]">
          3 minutos, sem cadastro
        </div>

        <h1 className="text-balance text-[13vw] font-extrabold uppercase leading-[.88] tracking-[-.045em] sm:text-7xl lg:text-8xl">
          quanto custa
          <br />
          <span className="text-transparent [-webkit-text-stroke:2px_#C6F24E]">o nosso</span>
          <br />
          <span className="mt-2 inline-block -rotate-1 rounded-2xl bg-[#C6F24E] px-4 pb-1 text-[#06130C]">
            consumo?
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-sm leading-relaxed text-[#A9BEB2] sm:text-base">
          Responde o questionário e descobre o impacto real dos teus hábitos, quanto isso
          pesa no teu bolso e como a lógica de lucro das grandes empresas esgota os recursos do planeta.
        </p>

        <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <button
            onClick={onStart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C6F24E] px-8 py-4 text-sm font-bold text-[#06130C] shadow-[0_14px_34px_rgba(198,242,78,.25)] transition active:scale-[.98] sm:w-auto sm:text-base"
          >
            Bora calcular
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setQrOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-semibold text-[#F2FFF7] transition hover:border-white/40 active:scale-[.98] sm:w-auto"
          >
            <QrCode className="h-4 w-4" />
            Abrir no celular
          </button>
        </div>

        <button
          onClick={onOpenFairResults}
          className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-[#8FA79A] transition hover:text-[#C6F24E]"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Ver os resultados da turma
        </button>

        {/* dimensões */}
        <div className="mt-12 w-full">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#6F8479]">
            6 dimensões analisadas
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {DIMENSIONS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition hover:border-[#C6F24E]/50"
              >
                <Icon className="h-5 w-5 text-[#C6F24E]" />
                <span className="text-xs font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#8FA79A]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> ~3 minutos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> 100% anônimo
          </span>
          <span>projeto interdisciplinar para debate escolar</span>
        </div>
      </main>

      {/* faixa dos R */}
      <footer className="relative z-10 flex items-center gap-5 overflow-hidden bg-[#C6F24E] py-3.5 px-5 text-[#06130C] sm:gap-8 sm:py-4">
        {[...MARQUEE, ...MARQUEE].map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex shrink-0 items-center gap-5 text-sm font-extrabold uppercase tracking-[.12em] sm:gap-8 sm:text-lg"
          >
            {word}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#06130C]" />
          </span>
        ))}
      </footer>

      {qrOpen && <QRCodeModal onClose={() => setQrOpen(false)} />}
    </div>
  );
}
