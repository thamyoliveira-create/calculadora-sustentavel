import { useState } from 'react';
import { Leaf, BarChart3, QrCode, ArrowRight, Zap, Droplets, Carrot, ShoppingBag, Recycle, Bike, Clock, ShieldCheck, GraduationCap, ChevronDown } from 'lucide-react';
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

  function scrollToCalculadora() {
    document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex flex-col text-white">
      {/* CAPA — a colagem "o capitalismo consome nosso planeta" em tela cheia, nítida e
          com um leve zoom lento (efeito ken burns), quase sem texto por cima para não
          competir com a arte. O título da calculadora fica só na seção seguinte. */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        <div
          className="animate-kenburns absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-capitalismo.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(26,15,28,.15) 0%, rgba(26,15,28,.1) 55%, rgba(26,15,28,.92) 100%)',
          }}
        />

        <header className="relative z-10 px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-2.5 rounded-xl bg-black/40 px-3 py-1.5 backdrop-blur-sm">
              <Leaf className="h-4 w-4 text-gold-300" />
              <span className="text-xs font-extrabold uppercase tracking-[.15em] sm:text-sm">
                <span className="text-berry-signature">tamiris</span>
                <span className="ml-1.5 font-medium normal-case tracking-normal text-gold-300">
                  · calculadora sustentável
                </span>
              </span>
            </div>
            <span className="hidden rounded-xl border-2 border-white/30 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] backdrop-blur-sm sm:inline-flex">
              feira de sustentabilidade
            </span>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-5 pb-10 text-center sm:pb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[.12em] text-white/85 backdrop-blur-sm">
            <GraduationCap className="h-3.5 w-3.5 text-gold-300" />
            Criado por Prof.ª Tamiris
          </div>
          <button
            onClick={scrollToCalculadora}
            className="flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-[.18em] text-white/85 transition hover:text-white"
          >
            Role para começar
            <ChevronDown className="animate-bounce-down h-5 w-5" />
          </button>
        </div>
      </section>

      {/* SEÇÃO DA CALCULADORA — fundo sólido, sem disputa com a imagem */}
      <section id="calculadora" className="bg-kraft relative text-forest-950">
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-forest-950 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-gold-300 sm:text-[11px]">
            3 minutos, sem cadastro
          </div>

          <h1 className="text-balance text-[13vw] font-extrabold uppercase leading-[.9] tracking-[-.03em] text-forest-950 sm:text-7xl lg:text-8xl">
            quanto custa
            <br />
            o nosso
            <br />
            <span className="heading-gradient mt-2 inline-block">
              consumo?
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-relaxed text-forest-950/70 sm:text-base">
            Responda o questionário e descubra o impacto real dos seus hábitos, quanto isso
            pesa no seu bolso — e por que, mesmo importando, ele é pequeno perto do consumo das
            grandes empresas.
          </p>

          <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={onStart}
              className="btn-primary w-full rounded-full sm:w-auto sm:text-base"
            >
              Bora calcular
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setQrOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-forest-950/20 px-7 py-4 text-sm font-semibold text-forest-950 transition hover:border-forest-950/40 active:scale-[.98] sm:w-auto"
            >
              <QrCode className="h-4 w-4" />
              Abrir no celular
            </button>
          </div>

          <button
            onClick={onOpenFairResults}
            className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-forest-950/70 underline decoration-dotted underline-offset-4 transition hover:text-gold-500"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Ver os resultados da turma
          </button>

          {/* dimensões */}
          <div className="mt-12 w-full">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-forest-950/60">
              6 dimensões analisadas
            </p>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {DIMENSIONS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-forest-950/10 bg-white p-3.5 shadow-sm"
                >
                  <Icon className="h-5 w-5 text-forest-700" />
                  <span className="text-xs font-bold text-forest-950">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-forest-950/70">
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
        <footer className="relative z-10 flex items-center gap-5 overflow-hidden bg-forest-950 py-3.5 px-5 text-white sm:gap-8 sm:py-4">
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="flex shrink-0 items-center gap-5 text-sm font-extrabold uppercase tracking-[.12em] sm:gap-8 sm:text-lg"
            >
              {word}
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-300" />
            </span>
          ))}
        </footer>
      </section>

      {qrOpen && <QRCodeModal onClose={() => setQrOpen(false)} />}
    </div>
  );
}
