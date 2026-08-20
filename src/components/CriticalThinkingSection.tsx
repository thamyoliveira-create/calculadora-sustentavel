import { useState } from "react";
import {
  Factory,
  Shirt,
  Smartphone,
  Droplets,
  Flame,
  AlertTriangle,
  Scale,
  Hourglass,
  MessageSquareQuote,
  TrendingUp,
  Sparkles,
  ChevronRight,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { CalculationResult } from "@/lib/calculations";
import { formatNumber } from "@/lib/format";

interface Props {
  result: CalculationResult;
}

type Tab = "duelo" | "greenwashing" | "recursos" | "debate";

interface IndustryDuelo {
  id: string;
  name: string;
  subtitle: string;
  icon: typeof Factory;
  tag: string;
  color: string;
  corpStat: string;
  corpStatLabel: string;
  comparisonText: string;
  realityCheck: string;
}

const DUELO_DATA: IndustryDuelo[] = [
  {
    id: "fast-fashion",
    name: "Fast Fashion & Indústria Têxtil",
    subtitle: "Roupas descartáveis e tendências semanais",
    icon: Shirt,
    tag: "Moda Descartável",
    color: "from-rose-500 to-orange-500",
    corpStat: "7.500 Litros",
    corpStatLabel: "de água para fazer uma única calça jeans",
    comparisonText:
      "A água necessária para produzir 1 calça jeans equivale a tudo o que um estudante bebe em 7 a 10 anos inteiros de vida.",
    realityCheck:
      "A indústria da moda descartável queima ou descarta em aterros o equivalente a 1 caminhão de lixo cheio de roupas a cada segundo para manter os preços e o consumo artificialmente altos.",
  },
  {
    id: "petroleo",
    name: "Indústria Fóssil & Petroleiras",
    subtitle: "Combustíveis, plásticos e energia não renovável",
    icon: Flame,
    tag: "71% das Emissões",
    color: "from-amber-600 to-red-600",
    corpStat: "100 Empresas",
    corpStatLabel: "geram mais de 71% de todos os gases estufa do planeta",
    comparisonText:
      "Mesmo se toda a sua escola passar a vida inteira andando a pé, as emissões de 100 multinacionais de combustíveis continuam ditando a crise climática global.",
    realityCheck:
      "Em 2004, a petroleira BP gastou mais de R$ 250 milhões em publicidade para popularizar o termo \"Pegada de Carbono Individual\", com o objetivo de desviar a atenção de suas próprias perfurações e transferir a culpa moral para o cidadão.",
  },
  {
    id: "big-tech",
    name: "Big Tech & Obsolescência Programada",
    subtitle: "Smartphones, baterias seladas e gadgets descartáveis",
    icon: Smartphone,
    tag: "Lixo Eletrônico",
    color: "from-indigo-500 to-purple-500",
    corpStat: "62 Milhões",
    corpStatLabel: "de toneladas de lixo eletrônico por ano no mundo",
    comparisonText:
      "Aparelhos são propositalmente desenhados para quebrar, ter peças coladas e ficarem lentos com atualizações após 2 ou 3 anos, forçando compras contínuas.",
    realityCheck:
      "Minérios raros como lítio e cobalto são extraídos em condições desumanas no Sul Global para alimentar o ciclo de lançamentos anuais de smartphones que mudam quase nada além da câmera.",
  },
  {
    id: "bebidas",
    name: "Mega Indústrias de Bebidas & Plásticos",
    subtitle: "Refrigerantes, garrafas PET e privatização da água",
    icon: Droplets,
    tag: "Privatização Hídrica",
    color: "from-cyan-500 to-blue-600",
    corpStat: "3 Milhões",
    corpStatLabel: "de litros de água extraídos por dia por uma única fábrica",
    comparisonText:
      "Enquanto moradores locais enfrentam racionamento de água, uma única fábrica de refrigerante drena lençóis freáticos públicos para engarrafar água e açúcar em plástico descartável.",
    realityCheck:
      "Menos de 9% de todo o plástico já produzido na história da humanidade foi realmente reciclado. O restante polui rios, oceanos e a nossa própria cadeia alimentar na forma de microplásticos.",
  },
];

const DEBATE_QUESTIONS = [
  {
    number: "01",
    theme: "Economia vs. Ecologia",
    question:
      "Se vivemos em um planeta com recursos naturais finitos, é racional que as empresas e o sistema financeiro exijam crescimento e aumento de lucro infinito todo ano?",
    context:
      "Para debate: Como o conceito de \"crescimento econômico constante\" colide com a física e os limites biológicos da Terra?",
  },
  {
    number: "02",
    theme: "Desigualdade & Sustentabilidade",
    question:
      "Por que produtos orgânicos, energia solar e carros elétricos são tratados como \"luxo\" acessível apenas para quem tem muito dinheiro?",
    context:
      "Para debate: Quem ganha salário mínimo tem liberdade de escolha para ser 100% sustentável ou o sistema empurra as pessoas mais pobres para o consumo mais poluente?",
  },
  {
    number: "03",
    theme: "Justiça Climática",
    question:
      "Quem mais lucra com a destruição ambiental (grandes acionistas e multinacionais) é quem mais sofre com a falta de água, poluição e enchentes?",
    context:
      "Para debate: Por que as periferias e populações vulneráveis são as primeiras a sofrer as consequências dos desastres climáticos enquanto os bilionários constroem bunkers?",
  },
  {
    number: "04",
    theme: "Ação Individual vs. Coletiva",
    question:
      "Se economizar água em casa é importante, por que as leis quase nunca punem severamente mineradoras e indústrias que destroem rios inteiros?",
    context:
      "Para debate: O que transforma mais a sociedade: mudar hábitos individuais de consumo ou organizar a juventude para exigir leis rígidas e fiscalização das corporações?",
  },
];

export default function CriticalThinkingSection({ result }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("duelo");
  const [selectedDuelo, setSelectedDuelo] = useState<string>("fast-fashion");

  const currentDuelo =
    DUELO_DATA.find((d) => d.id === selectedDuelo) ?? DUELO_DATA[0];
  const DueloIcon = currentDuelo.icon;

  return (
    <section id="section-sistema" className="card mt-6 scroll-mt-20 border-sky-100 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 border border-sky-500/30 px-3 py-1 text-xs font-bold text-sky-300 w-fit">
          <Sparkles className="h-3.5 w-3.5" />
          Módulo de Pensamento Crítico para o Ensino Médio
        </div>
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
          O SISTEMA & NOSSOS RECURSOS
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Entenda como a lógica de lucro corporativo molda nossos hábitos de consumo,
          por que os recursos naturais da Terra estão se esgotando e por que a culpa
          não é só sua.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("duelo")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "duelo"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
              : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Scale className="h-4 w-4" />
          Duelo: Você vs. O Sistema
        </button>

        <button
          onClick={() => setActiveTab("greenwashing")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "greenwashing"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
              : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          O Mito do Greenwashing
        </button>

        <button
          onClick={() => setActiveTab("recursos")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "recursos"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
              : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Hourglass className="h-4 w-4" />
          Planeta Finito & Esgotamento
        </button>

        <button
          onClick={() => setActiveTab("debate")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "debate"
              ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
              : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <MessageSquareQuote className="h-4 w-4" />
          Debate em Sala de Aula
        </button>
      </div>

      {/* TAB 1: DUELO */}
      {activeTab === "duelo" && (
        <div className="mt-6 space-y-6 animate-fade-in-up">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Passo 1: Selecione um setor industrial
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DUELO_DATA.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedDuelo === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDuelo(item.id)}
                    className={`flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition ${
                      isSelected
                        ? "border-sky-400 bg-sky-950/60 shadow-lg ring-2 ring-sky-500/30"
                        : "border-slate-800 bg-slate-900/50 hover:bg-slate-850 hover:border-slate-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-sky-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                      <span className="text-[10px] text-sky-300 font-semibold">{item.tag}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duelo Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <DueloIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{currentDuelo.name}</h3>
                <p className="text-xs text-slate-400">{currentDuelo.subtitle}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Sua Economia Pessoal Estimada
                  </span>
                  <span className="text-xs font-bold text-slate-400">1 ano</span>
                </div>
                <p className="mt-2 text-2xl font-black text-emerald-400">
                  ~{formatNumber(result.annualCo2Kg)} kg de CO₂
                </p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Mesmo economizando energia, água e evitando compras impulsivas o ano todo...
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/80 border border-rose-900/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                    Escala da Indústria
                  </span>
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                    Impacto Brutal
                  </span>
                </div>
                <p className="mt-2 text-2xl font-black text-rose-400">
                  {currentDuelo.corpStat}
                </p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {currentDuelo.corpStatLabel}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-200 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-amber-300">🔍 A Comparação Real: </span>
              {currentDuelo.comparisonText}
            </div>

            <div className="mt-3 rounded-2xl bg-slate-950/60 p-4 text-xs text-slate-300 leading-relaxed border border-slate-800/80">
              <span className="font-bold text-sky-300">⚠️ Por trás do Lucro: </span>
              {currentDuelo.realityCheck}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GREENWASHING */}
      {activeTab === "greenwashing" && (
        <div className="mt-6 space-y-4 animate-fade-in-up">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              O que é Greenwashing? (A Maquiagem Verde)
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              É a estratégia de marketing usada por empresas para parecerem ecologicamente corretas,
              enquanto suas práticas reais continuam devastando o meio ambiente e explorando trabalhadores.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 font-bold text-sm mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-white">A Farsa da Pegada Individual</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Você sabia que a expressão <span className="text-slate-200 font-semibold">\"sua pegada de carbono\"</span> foi criada por uma agência de publicidade contratada pela gigante petrolífera BP em 2004?
                O objetivo era criar uma ilusão de que a crise climática é responsabilidade de cada indivíduo ao dirigir ou tomar banho, tirando o foco das petrolíferas que faturam bilhões poluindo.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300 font-bold text-sm mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Obsolescência Programada</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Empresas de tecnologia e eletrônicos intencionalmente produzem produtos com peças difíceis de consertar e baterias seladas.
                Se um celular durasse 10 anos, os lucros trimestrais dos acionistas cairiam. O modelo capitalista exige que você descarte e compre outro para a roda do lucro continuar girando.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-sky-900/40 to-indigo-900/40 border border-sky-500/20 p-4 text-xs sm:text-sm text-sky-200">
            💡 <span className="font-bold">Conclusão Crítica:</span> Não deixe que as corporações façam você se sentir culpado sozinho. Nossas ações diárias são essenciais para criar consciência coletiva, mas a verdadeira transformação exige cobrar leis rígidas, taxação de lucros poluentes e o fim da impunidade corporativa.
          </div>
        </div>
      )}

      {/* TAB 3: RECURSOS FINITOS */}
      {activeTab === "recursos" && (
        <div className="mt-6 space-y-5 animate-fade-in-up">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Alerta Planetário
              </span>
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-300">
                Cheque Especial da Terra
              </span>
            </div>
            <h3 className="mt-2 text-xl font-black text-white">
              O Dia da Sobrecarga da Terra (Earth Overshoot Day)
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Todos os anos, a humanidade consome em apenas <span className="text-white font-bold">7 a 8 meses</span> tudo o que o planeta consegue regenerar em 365 dias (água limpa, solos férteis, madeira, absorção de carbono).
            </p>

            <div className="mt-4 rounded-xl bg-slate-950 p-4 border border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Janeiro (Início)</span>
                <span className="text-rose-400">Agosto (Recursos do ano esgotados)</span>
                <span>Dezembro</span>
              </div>
              <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-slate-800 flex">
                <div className="h-full bg-emerald-500 w-[60%]" title="Recursos renováveis do ano" />
                <div className="h-full bg-rose-500 w-[40%]" title="Déficit ecológico (esgotamento)" />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">● Recursos regeneráveis (60%)</span>
                <span className="text-rose-400 font-semibold">● Destruição do futuro (40%)</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-rose-400">1.75 Planetas</p>
              <p className="mt-1 text-xs text-slate-400">É o que a economia global consome por ano hoje. Mas só temos 1 planeta.</p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-amber-400">10% Mais Ricos</p>
              <p className="mt-1 text-xs text-slate-400">São responsáveis por quase 50% de todas as emissões de carbono do mundo.</p>
            </div>
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-black text-sky-400">Sul Global</p>
              <p className="mt-1 text-xs text-slate-400">Países em desenvolvimento sofrem mais com a seca e o calor causados pelos países ricos.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEBATE */}
      {activeTab === "debate" && (
        <div className="mt-6 space-y-4 animate-fade-in-up">
          <p className="text-xs text-slate-400">
            Utilize estas 4 perguntas para promover uma roda de conversa na sala de aula ou no grupo de estudos:
          </p>

          <div className="space-y-3">
            {DEBATE_QUESTIONS.map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 transition hover:border-sky-500/40"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 text-xs font-black">
                    {item.number}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    {item.theme}
                  </span>
                </div>
                <h4 className="mt-2 text-sm sm:text-base font-bold text-white leading-snug">
                  {item.question}
                </h4>
                <p className="mt-2 rounded-xl bg-slate-950/80 p-3 text-xs text-slate-400 leading-relaxed border border-slate-800/80">
                  <span className="font-semibold text-slate-300">Ponto de partida: </span>
                  {item.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
