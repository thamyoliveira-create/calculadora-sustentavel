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
  Sparkles,
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
    corpStat: "7.500 Litros",
    corpStatLabel: "de água para produzir 1 única calça jeans",
    comparisonText:
      "A água gasta para produzir uma calça jeans equivale a tudo o que um estudante bebe em 7 a 10 anos inteiros de vida.",
    realityCheck:
      "A indústria da moda descarta ou queima o equivalente a 1 caminhão de lixo cheio de roupas a cada segundo para manter a escassez e o consumo contínuo.",
  },
  {
    id: "petroleo",
    name: "Indústria Fóssil & Petroleiras",
    subtitle: "Combustíveis, plásticos e energia fóssil",
    icon: Flame,
    tag: "71% das Emissões",
    corpStat: "100 Empresas",
    corpStatLabel: "são responsáveis por mais de 71% de todas as emissões globais",
    comparisonText:
      "Mesmo se toda a sua escola passar a vida inteira andando a pé, as decisões de 100 multinacionais continuam ditando o ritmo do colapso climático.",
    realityCheck:
      "Em 2004, a petroleira BP investiu R$ 250 milhões para popularizar o conceito de \"pegada de carbono pessoal\", desviando a responsabilidade de suas perfurações para o cidadão.",
  },
  {
    id: "big-tech",
    name: "Big Tech & Eletrônicos",
    subtitle: "Smartphones, baterias seladas e gadgets descartáveis",
    icon: Smartphone,
    tag: "Lixo Eletrônico",
    corpStat: "62 Milhões",
    corpStatLabel: "de toneladas de lixo eletrônico gerados por ano no mundo",
    comparisonText:
      "Aparelhos são propositalmente desenhados para quebrar e ficarem obsoletos em 2 ou 3 anos, forçando os consumidores a gastarem novamente.",
    realityCheck:
      "Minérios raros como lítio e cobalto são extraídos em condições degradantes no Sul Global para alimentar lançamentos anuais com pouca inovação real.",
  },
  {
    id: "bebidas",
    name: "Mega Indústrias de Bebidas & Plásticos",
    subtitle: "Refrigerantes, garrafas PET e privatização da água",
    icon: Droplets,
    tag: "Privatização Hídrica",
    corpStat: "3 Milhões",
    corpStatLabel: "de litros de água extraídos por dia por uma única fábrica",
    comparisonText:
      "Enquanto populações locais enfrentam racionamento, multinacionais drenam lençóis freáticos públicos para engarrafar água com açúcar em plástico descartável.",
    realityCheck:
      "Menos de 9% de todo o plástico já produzido na história foi realmente reciclado. O restante polui rios, oceanos e a cadeia alimentar como microplásticos.",
  },
];

const DEBATE_QUESTIONS = [
  {
    number: "01",
    theme: "Economia vs. Limites Físicos",
    question:
      "Se vivemos em um planeta com recursos naturais finitos, é racional que o sistema econômico exija crescimento e aumento de lucros todo ano?",
    context:
      "Para debate em sala: Como o conceito de \"crescimento econômico perpétuo\" entra em conflito direto com as leis da física e da biologia?",
  },
  {
    number: "02",
    theme: "Desigualdade & Sustentabilidade",
    question:
      "Por que produtos ecológicos e alimentação saudável são caros e inacessíveis para quem ganha salário mínimo?",
    context:
      "Para debate em sala: O consumo sustentável é uma escolha individual livre ou um privilégio econômico de quem tem mais renda?",
  },
  {
    number: "03",
    theme: "Justiça Climática",
    question:
      "Quem mais lucra com a destruição ambiental é quem mais sofre as consequências de enchentes, secas e ondas de calor?",
    context:
      "Para debate em sala: Por que as periferias e populações vulneráveis são as mais impactadas pelas tragédias climáticas?",
  },
  {
    number: "04",
    theme: "Ação Individual vs. Política Coletiva",
    question:
      "Se economizar água em casa é importante, por que as leis quase nunca punem severamente grandes crimes ambientais de corporações?",
    context:
      "Para debate em sala: O que transforma mais: mudanças de hábitos individuais ou organização social para cobrar leis e fiscalização?",
  },
];

export default function CriticalThinkingSection({ result }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("duelo");
  const [selectedDuelo, setSelectedDuelo] = useState<string>("fast-fashion");

  const currentDuelo =
    DUELO_DATA.find((d) => d.id === selectedDuelo) ?? DUELO_DATA[0];
  const DueloIcon = currentDuelo.icon;

  return (
    <section id="section-sistema" className="card mt-6 scroll-mt-20 border border-forest-800/40 bg-forest-950 text-stone-100 p-6 sm:p-8 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 border border-forest-800 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-gold-300 w-fit">
          <Sparkles className="h-3 w-3 text-gold-400" />
          Dossiê Crítico • Para o Ensino Médio
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
          O SISTEMA & NOSSOS RECURSOS
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed font-normal">
          Compreenda como a lógica de lucro corporativo molda os hábitos de consumo,
          por que os recursos naturais da Terra estão no limite e por que a culpa
          da crise ecológica não é apenas do cidadão comum.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-forest-900 pb-3">
        <button
          onClick={() => setActiveTab("duelo")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "duelo"
              ? "bg-white text-forest-950 shadow-sm"
              : "bg-forest-900/60 text-stone-300 hover:bg-forest-900 hover:text-white"
          }`}
        >
          <Scale className="h-3.5 w-3.5" />
          Duelo: Você vs. Indústria
        </button>

        <button
          onClick={() => setActiveTab("greenwashing")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "greenwashing"
              ? "bg-white text-forest-950 shadow-sm"
              : "bg-forest-900/60 text-stone-300 hover:bg-forest-900 hover:text-white"
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          O Mito do Greenwashing
        </button>

        <button
          onClick={() => setActiveTab("recursos")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "recursos"
              ? "bg-white text-forest-950 shadow-sm"
              : "bg-forest-900/60 text-stone-300 hover:bg-forest-900 hover:text-white"
          }`}
        >
          <Hourglass className="h-3.5 w-3.5" />
          Recursos Finitos
        </button>

        <button
          onClick={() => setActiveTab("debate")}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "debate"
              ? "bg-white text-forest-950 shadow-sm"
              : "bg-forest-900/60 text-stone-300 hover:bg-forest-900 hover:text-white"
          }`}
        >
          <MessageSquareQuote className="h-3.5 w-3.5" />
          Perguntas para Debate
        </button>
      </div>

      {/* TAB 1: DUELO */}
      {activeTab === "duelo" && (
        <div className="mt-5 space-y-5 animate-fade-in-up">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold-300">
              Escolha um setor para comparar a escala:
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DUELO_DATA.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedDuelo === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDuelo(item.id)}
                    className={`flex flex-col items-start gap-1.5 rounded-xl border p-2.5 text-left transition ${
                      isSelected
                        ? "border-gold-400 bg-[#063329] ring-1 ring-gold-400 text-white"
                        : "border-forest-900 bg-[#021f18]/60 text-stone-300 hover:border-forest-800 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isSelected ? "text-gold-400" : "text-stone-400"}`} />
                    <div>
                      <p className="text-xs font-bold line-clamp-1">{item.name}</p>
                      <span className="text-[10px] text-stone-400 font-medium">{item.tag}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duelo Card */}
          <div className="rounded-xl border border-forest-900 bg-[#021f18] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900 text-gold-300 border border-forest-800">
                <DueloIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{currentDuelo.name}</h3>
                <p className="text-xs text-stone-400">{currentDuelo.subtitle}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#063329] border border-forest-800 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-[.15em] text-emerald-400">
                  Sua Economia Individual (1 Ano)
                </span>
                <p className="mt-1 text-xl font-black text-emerald-400">
                  ~{formatNumber(result.annualCo2Kg)} kg de CO₂
                </p>
                <p className="mt-1 text-[11px] text-stone-400 leading-relaxed">
                  Mesmo economizando energia, água e compras o ano inteiro...
                </p>
              </div>

              <div className="rounded-xl bg-[#063329] border border-rose-900/60 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-[.15em] text-rose-400">
                  Escala da Indústria
                </span>
                <p className="mt-1 text-xl font-black text-rose-400">
                  {currentDuelo.corpStat}
                </p>
                <p className="mt-1 text-[11px] text-stone-400 leading-relaxed">
                  {currentDuelo.corpStatLabel}
                </p>
              </div>
            </div>

            <div className="mt-3.5 rounded-xl bg-gold-500/10 border border-gold-500/20 p-3.5 text-xs text-gold-200 leading-relaxed">
              <span className="font-bold text-gold-300">🔍 O Contraste Real: </span>
              {currentDuelo.comparisonText}
            </div>

            <div className="mt-2.5 rounded-xl bg-[#063329]/80 p-3 text-xs text-stone-300 leading-relaxed border border-forest-800">
              <span className="font-bold text-stone-200">⚠️ Por trás do Lucro: </span>
              {currentDuelo.realityCheck}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GREENWASHING */}
      {activeTab === "greenwashing" && (
        <div className="mt-5 space-y-3.5 animate-fade-in-up">
          <div className="rounded-xl border border-forest-900 bg-[#021f18] p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gold-400" />
              O que é Greenwashing? (A Maquiagem Verde)
            </h3>
            <p className="mt-1.5 text-xs text-stone-300 leading-relaxed">
              É a prática de marketing em que corporações gastam milhões promovendo uma imagem sustentável,
              enquanto mantêm modelos de negócios predatórios e poluentes.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-forest-900 bg-[#021f18] p-4">
              <span className="rounded-full bg-gold-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.15em] text-gold-300">
                Fato Histórico 1
              </span>
              <h4 className="mt-2 text-xs sm:text-sm font-bold text-white">A Invenção da \"Pegada Individual\"</h4>
              <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">
                Em 2004, a petroleira BP contratou uma das maiores agências de publicidade do mundo para criar a primeira \"calculadora de pegada de carbono\".
                A intenção declarada era transferir a responsabilidade moral da queima de combustíveis fósseis para a rotina de cada cidadão.
              </p>
            </div>

            <div className="rounded-xl border border-forest-900 bg-[#021f18] p-4">
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.15em] text-rose-300">
                Fato Histórico 2
              </span>
              <h4 className="mt-2 text-xs sm:text-sm font-bold text-white">Obsolescência Programada</h4>
              <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">
                Desde o histórico \"Cartel Phoebus\" (que reduziu a vida útil das lâmpadas de 2.500 para 1.000 horas em 1924), indústrias projetam eletrônicos e roupas para estragarem rápido e garantirem vendas constantes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECURSOS FINITOS */}
      {activeTab === "recursos" && (
        <div className="mt-5 space-y-4 animate-fade-in-up">
          <div className="rounded-xl border border-forest-900 bg-[#021f18] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[.18em] text-rose-400">
                Alerta Ecológico
              </span>
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.15em] text-rose-300">
                Sobrecarga da Terra
              </span>
            </div>
            <h3 className="mt-1 text-base sm:text-lg font-extrabold text-white">
              O Dia da Sobrecarga da Terra (Earth Overshoot Day)
            </h3>
            <p className="mt-1 text-xs text-stone-300 leading-relaxed">
              Todos os anos, a humanidade consome em apenas <span className="text-white font-bold">7 a 8 meses</span> tudo o que o planeta consegue regenerar em 365 dias.
            </p>

            <div className="mt-3.5 rounded-lg bg-[#063329] p-3 border border-forest-800">
              <div className="flex justify-between text-[11px] font-bold text-stone-300">
                <span>Janeiro</span>
                <span className="text-rose-400">Agosto (Recursos esgotados)</span>
                <span>Dezembro</span>
              </div>
              <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-forest-950 flex">
                <div className="h-full bg-emerald-600 w-[60%]" title="Recursos regeneráveis" />
                <div className="h-full bg-rose-600 w-[40%]" title="Cheque especial ecológico" />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-stone-400">
                <span className="text-emerald-400 font-medium">● 60% Recursos regeneráveis</span>
                <span className="text-rose-400 font-medium">● 40% Déficit ecológico</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#021f18] border border-forest-900 p-3.5 text-center">
              <p className="text-lg font-black text-rose-400">1.75 Planetas</p>
              <p className="mt-0.5 text-[11px] text-stone-400">Consumo da economia global hoje. Mas só temos 1 planeta.</p>
            </div>
            <div className="rounded-xl bg-[#021f18] border border-forest-900 p-3.5 text-center">
              <p className="text-lg font-black text-gold-300">10% Mais Ricos</p>
              <p className="mt-0.5 text-[11px] text-stone-400">Geram quase 50% de todas as emissões globais de carbono.</p>
            </div>
            <div className="rounded-xl bg-[#021f18] border border-forest-900 p-3.5 text-center">
              <p className="text-lg font-black text-sky-400">Sul Global</p>
              <p className="mt-0.5 text-[11px] text-stone-400">Populações pobres sofrem mais com a seca e o calor extremos.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEBATE */}
      {activeTab === "debate" && (
        <div className="mt-5 space-y-3 animate-fade-in-up">
          <p className="text-xs text-stone-400">
            Perguntas para promover uma reflexão crítica na sala de aula:
          </p>

          <div className="space-y-2.5">
            {DEBATE_QUESTIONS.map((item) => (
              <div
                key={item.number}
                className="rounded-xl border border-forest-900 bg-[#021f18] p-3.5"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-forest-900 text-gold-300 text-[10px] font-black border border-forest-800">
                    {item.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[.15em] text-gold-300">
                    {item.theme}
                  </span>
                </div>
                <h4 className="mt-1.5 text-xs sm:text-sm font-bold text-white leading-snug">
                  {item.question}
                </h4>
                <p className="mt-1.5 rounded-lg bg-[#063329] p-2.5 text-[11px] text-stone-300 leading-relaxed border border-forest-800">
                  <span className="font-semibold text-gold-200">Ponto de partida: </span>
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
