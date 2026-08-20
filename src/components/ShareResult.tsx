import { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { CalculationResult } from '@/lib/calculations';

interface ShareResultProps {
  result: CalculationResult;
}

function classificationShare(c: string): string {
  switch (c) {
    case 'alto-impacto':
      return 'Consumo de alto impacto';
    case 'transicao':
      return 'Consumo em transição';
    case 'consciente':
      return 'Consumo consciente';
    case 'sustentavel':
      return 'Consumo sustentável';
    case 'muito-sustentavel':
      return 'Consumo muito sustentável';
    default:
      return 'Consumo consciente';
  }
}

export default function ShareResult({ result }: ShareResultProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `Minha pontuação no "Quanto custa o seu consumo?" foi ${result.finalScore}/100 — ${classificationShare(result.classification)}! Descubra a sua na feira de sustentabilidade.`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullShareText = `${shareText} ${shareUrl}`;

  function copyLink() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${shareUrl}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  function shareNative() {
    if (typeof navigator !== 'undefined' && (navigator as Navigator).share) {
      (navigator as Navigator).share({
        title: 'Quanto custa o seu consumo?',
        text: shareText,
        url: shareUrl,
      });
    }
  }

  const hasNativeShare =
    typeof navigator !== 'undefined' && typeof (navigator as Navigator).share === 'function';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary"
      >
        <Share2 className="h-4 w-4" />
        Compartilhar meu resultado
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-slate-900">
              <Share2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold">Compartilhar resultado</h3>
            </div>

            {/* Preview card */}
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-5 text-center text-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
                Minha pontuação
              </p>
              <p className="mt-1 text-4xl font-extrabold">{result.finalScore}/100</p>
              <p className="mt-1 text-sm text-emerald-100">
                {classificationShare(result.classification)}
              </p>
            </div>

            {/* Share text */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-sm leading-relaxed text-slate-600">{shareText}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
              {hasNativeShare && (
                <button
                  onClick={shareNative}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar agora
                </button>
              )}

              <div className="grid grid-cols-3 gap-2">
                <SocialButton
                  icon={<Facebook className="h-5 w-5" />}
                  label="Facebook"
                  color="bg-[#1877F2]"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
                      '_blank',
                    )
                  }
                />
                <SocialButton
                  icon={<Twitter className="h-5 w-5" />}
                  label="Twitter"
                  color="bg-slate-900"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareText)}`,
                      '_blank',
                    )
                  }
                />
                <SocialButton
                  icon={<LinkIcon className="h-5 w-5" />}
                  label="WhatsApp"
                  color="bg-[#25D366]"
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(fullShareText)}`,
                      '_blank',
                    )
                  }
                />
              </div>

              <button
                onClick={copyLink}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    Link copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar link
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SocialButton({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl ${color} py-3 text-white transition hover:opacity-90`}
    >
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}
