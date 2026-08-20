// Mathematical audit — run with: npx tsx scripts/audit.ts
import { Answers, calculate, simulate, recommendations } from '../src/lib/calculations';
import { MAX_POINTS_BY_CATEGORY, MAX_TOTAL_POINTS, QUESTIONS } from '../src/lib/questions';
import { formatBRL } from '../src/lib/format';

const scenarios: { name: string; answers: Answers }[] = [
  {
    name: 'Best-case (all sustainable)',
    answers: {
      1: 4,
      2: 'Até R$ 100',
      3: 'Sempre',
      4: 'Sim',
      5: 'Até 5 minutos',
      6: 'Sempre',
      7: 'Frequentemente',
      8: 'Caminhada',
      9: 2,
      10: 'Quase nunca',
      11: 'Sempre',
      12: 'Até R$ 500',
      13: 'Quase nunca',
      14: 'Sempre',
      15: 'Sempre',
      16: 'Sim',
      17: 'Sempre',
      18: 'Frequentemente',
    },
  },
  {
    name: 'Worst-case (all high-impact)',
    answers: {
      1: 6,
      2: 'Mais de R$ 500',
      3: 'Raramente',
      4: 'Não',
      5: 'Mais de 15 minutos',
      6: 'Nunca',
      7: 'Nunca',
      8: 'Carro sozinho',
      9: 80,
      10: 'Quase todos os dias',
      11: 'Nunca',
      12: 'Mais de R$ 2.500',
      13: 'Frequentemente',
      14: 'Nunca',
      15: 'Nunca',
      16: 'Não',
      17: 'Nunca',
      18: 'Nunca',
    },
  },
  {
    name: 'Mid case (transition)',
    answers: {
      1: 3,
      2: 'R$ 201 a R$ 300',
      3: 'Às vezes',
      4: 'Algumas',
      5: 'Entre 6 e 10 minutos',
      6: 'Às vezes',
      7: 'Às vezes',
      8: 'Transporte público',
      9: 15,
      10: '1 vez por semana',
      11: 'Às vezes',
      12: 'R$ 501 a R$ 1.000',
      13: 'Algumas vezes',
      14: 'Às vezes',
      15: 'Às vezes',
      16: 'Depende do preço',
      17: 'Às vezes',
      18: 'Às vezes',
    },
  },
  {
    name: 'Boundary: score exactly 30',
    // Crafted to land near 30: mix of zeros and tens
    answers: {
      1: 2,
      2: 'Até R$ 100',
      3: 'Sempre', // 10
      4: 'Sim', // 10
      5: 'Mais de 15 minutos', // 0
      6: 'Nunca', // 0
      7: 'Nunca', // 0
      8: 'Carro sozinho', // 2
      9: 10,
      10: 'Quase todos os dias', // 0
      11: 'Nunca', // 0
      12: 'Até R$ 500',
      13: 'Frequentemente', // 0
      14: 'Nunca', // 0
      15: 'Nunca', // 0
      16: 'Sim',
      17: 'Nunca', // 0
      18: 'Nunca', // 0
    },
  },
  {
    name: 'Boundary: score exactly 70',
    answers: {
      1: 2,
      2: 'Até R$ 100',
      3: 'Sempre', // 10
      4: 'Sim', // 10
      5: 'Até 5 minutos', // 10
      6: 'Sempre', // 10
      7: 'Frequentemente', // 10
      8: 'Carro compartilhado', // 6
      9: 5,
      10: 'Quase nunca', // 10
      11: 'Sempre', // 10
      12: 'Até R$ 500',
      13: 'Algumas vezes', // 5
      14: 'Às vezes', // 5
      15: 'Às vezes', // 5
      16: 'Sim',
      17: 'Às vezes', // 5
      18: 'Às vezes', // 5
    },
  },
  {
    name: 'Defaults / mostly unanswered',
    answers: {
      2: 'R$ 101 a R$ 200',
      8: 'Bicicleta',
      12: 'R$ 1.001 a R$ 1.500',
      9: 10,
      16: 'Depende do preço',
    },
  },
];

let failures = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    failures++;
    console.error('  FAIL:', msg);
  } else {
    console.log('  ok  :', msg);
  }
}

console.log('=== Mathematical audit ===');
console.log('Max points by category:', MAX_POINTS_BY_CATEGORY);
console.log('Total max points:', MAX_TOTAL_POINTS);

for (const s of scenarios) {
  console.log(`\n--- Scenario: ${s.name} ---`);
  const r = calculate(s.answers);
  console.log('Final score:', r.finalScore, '=>', r.classification);
  console.log('Category %:', Object.fromEntries(
    Object.entries(r.categoryScores).map(([k, v]) => [k, v.percent]),
  ));
  console.log('Annual energy:', formatBRL(r.annualEnergy));
  console.log('Energy savings (10%):', formatBRL(r.energySavings10));
  console.log('Annual supermarket:', formatBRL(r.annualSupermarket));
  console.log('Supermarket savings (5%):', formatBRL(r.supermarketSavings5));
  console.log('Annual savings:', formatBRL(r.annualSavingsDefault));
  console.log('5-year savings:', formatBRL(r.fiveYearSavingsDefault));
  console.log('Monthly km:', r.monthlyKm);

  // Checks
  assert(Number.isFinite(r.finalScore), 'finalScore is finite');
  assert(r.finalScore >= 0 && r.finalScore <= 100, 'finalScore in [0,100]');
  assert(Number.isFinite(r.annualEnergy) && r.annualEnergy >= 0, 'annualEnergy finite & non-negative');
  assert(
    Math.abs(r.energySavings10 - r.annualEnergy * 0.1) < 1e-6,
    'energySavings10 == annualEnergy * 0.10',
  );
  assert(
    Math.abs(r.supermarketSavings5 - r.annualSupermarket * 0.05) < 1e-6,
    'supermarketSavings5 == annualSupermarket * 0.05',
  );
  assert(
    Math.abs(r.annualSavingsDefault - (r.energySavings10 + r.supermarketSavings5)) < 1e-6,
    'annualSavingsDefault == energySavings10 + supermarketSavings5',
  );
  assert(
    Math.abs(r.fiveYearSavingsDefault - r.annualSavingsDefault * 5) < 1e-6,
    'fiveYearSavingsDefault == annualSavingsDefault * 5',
  );
  assert(Number.isFinite(r.monthlyKm) && r.monthlyKm >= 0, 'monthlyKm finite & non-negative');

  // Category percentages sum check: each obtained <= max, percent in [0,100]
  for (const [cat, cs] of Object.entries(r.categoryScores)) {
    assert(cs.obtained >= 0 && cs.obtained <= cs.max, `${cat} obtained in [0,max]`);
    assert(cs.percent >= 0 && cs.percent <= 100, `${cat} percent in [0,100]`);
    if (cs.max > 0) {
      assert(
        Math.abs(cs.percent - Math.round((cs.obtained / cs.max) * 100)) < 1e-9,
        `${cat} percent == round(obtained/max*100)`,
      );
    }
  }

  // Simulator
  const sim = simulate(s.answers, 15, 20);
  const expectedAnnual =
    r.annualEnergy * 0.15 + r.annualSupermarket * 0.2;
  assert(
    Math.abs(sim.annualSavings - expectedAnnual) < 1e-6,
    'sim(15,20) annualSavings == energy*0.15 + super*0.20',
  );
  assert(
    Math.abs(sim.fiveYearSavings - sim.annualSavings * 5) < 1e-6,
    'sim fiveYear == annual * 5',
  );
  assert(
    Math.abs(sim.monthlySavings - sim.annualSavings / 12) < 1e-6,
    'sim monthly == annual / 12',
  );
  assert(
    Math.abs(sim.annualEnergyReduced - (r.annualEnergy - r.annualEnergy * 0.15)) < 1e-6,
    'sim annualEnergyReduced == annualEnergy * (1 - 0.15)',
  );
  assert(sim.annualSavings >= 0, 'sim annualSavings non-negative');

  // Simulator boundary 0% / 30%
  const sim0 = simulate(s.answers, 0, 0);
  assert(sim0.annualSavings === 0, 'sim(0,0) annualSavings == 0');
  const sim30 = simulate(s.answers, 30, 30);
  assert(
    Math.abs(sim30.annualSavings - (r.annualEnergy * 0.3 + r.annualSupermarket * 0.3)) < 1e-6,
    'sim(30,30) correct',
  );

  // Recommendations
  const recs = recommendations(s.answers, 3);
  assert(recs.length <= 3, 'recommendations <= 3');
  console.log('Recommendations:', recs);
}

// Manual reference check for the "Mid case" scenario
console.log('\n=== Manual reference: Mid case ===');
const mid = scenarios[2].answers;
const midR = calculate(mid);
// Expected:
// Energy: 5+5=10 / 20 => 50%
// Water: 7+5+5=17 / 30 => 57% (round)
// Transport: 8 / 10 => 80%
// Food: 7+5=12 / 20 => 60%
// Shopping: 5+5+5=15 / 30 => 50%
// Residues: 5+5=10 / 20 => 50%
// Total: 10+17+8+12+15+10 = 72 / 130 => 55%
console.log('Expected total obtained: 72, max: 130, pct: 55');
console.log('Actual finalScore:', midR.finalScore);
assert(midR.finalScore === 55, 'Mid case finalScore == 55');
// Energy: monthly 250 => annual 3000 => savings 300
assert(midR.annualEnergy === 3000, 'Mid case annualEnergy == 3000');
assert(midR.energySavings10 === 300, 'Mid case energySavings10 == 300');
// Supermarket: 750 => annual 9000 => savings 450
assert(midR.annualSupermarket === 9000, 'Mid case annualSupermarket == 9000');
assert(midR.supermarketSavings5 === 450, 'Mid case supermarketSavings5 == 450');
assert(midR.annualSavingsDefault === 750, 'Mid case annualSavingsDefault == 750');
assert(midR.fiveYearSavingsDefault === 3750, 'Mid case fiveYear == 3750');
assert(midR.monthlyKm === 330, 'Mid case monthlyKm == 15*22 == 330');

// Boundary 70 scenario
console.log('\n=== Manual reference: Boundary 70 ===');
const b70 = calculate(scenarios[4].answers);
// Obtained: 20 (energia) + 30 (agua) + 6 (transporte) + 20 (alimentacao) + 15 (compras) + 10 (residuos) = 101
// Max: 130 ; 101/130*100 = 77.69 => round 78
console.log('Expected obtained 101, pct 78');
assert(b70.finalScore === 78, 'Boundary70 finalScore == 78');

console.log(`\n=== Audit complete. Failures: ${failures} ===`);
if (failures > 0) process.exit(1);
