import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface QRCodeModalProps {
  onClose: () => void;
}

export default function QRCodeModal({ onClose }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [fullscreen, setFullscreen] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string>('');

  useEffect(() => {
    const currentUrl = window.location.href;
    setTargetUrl(currentUrl);
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        currentUrl,
        { width: 320, margin: 2, color: { dark: '#065f46', light: '#ffffff' } },
        (err) => {
          if (err) console.error(err);
        },
      );
    }
    QRCode.toDataURL(currentUrl, {
      width: 480,
      margin: 2,
      color: { dark: '#065f46', light: '#ffffff' },
    })
      .then(setDataUrl)
      .catch((e) => console.error(e));
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative flex flex-col items-center rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8 ${
          fullscreen ? 'w-full max-w-2xl' : 'w-full max-w-sm'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <button
          onClick={() => setFullscreen((v) => !v)}
          className="absolute left-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Ampliar"
        >
          {fullscreen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </button>

        <h2 className="mt-4 text-center text-xl font-bold text-slate-900">
          Acessar pelo celular
        </h2>
        <p className="mt-2 max-w-xs text-center text-sm text-slate-500">
          Escaneie o QR Code para abrir a calculadora diretamente no seu
          telefone.
        </p>

        <div
          className={`mt-6 flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 ${
            fullscreen ? 'scale-150 my-10' : ''
          }`}
        >
          <canvas ref={canvasRef} className="h-auto w-full max-w-full" />
        </div>

        <p className="mt-4 max-w-xs break-all text-center text-[11px] text-slate-400">
          {targetUrl}
        </p>

        {dataUrl && (
          <a
            href={dataUrl}
            download="qr-code-consumo.png"
            className="btn-secondary mt-4"
          >
            Baixar QR Code
          </a>
        )}
      </div>
    </div>
  );
}
