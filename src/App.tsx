import { useState } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import FairResults from './components/FairResults';
import { Answers, calculate } from './lib/calculations';
import { submitParticipant } from './lib/fairData';

type Screen = 'start' | 'quiz' | 'results' | 'fair';

function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [answers, setAnswers] = useState<Answers>({});

  function handleAnswer(questionId: number, value: number | string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleQuizComplete() {
    const result = calculate(answers);
    // Submit anonymous data — fire-and-forget, but log failures to console.
    try {
      await submitParticipant(answers, result);
    } catch (e) {
      console.error('Falha ao registrar resultado anônimo:', e);
    }
    setScreen('results');
  }

  function handleRestart() {
    // Erase only this participant's answers; collective fair data persists in Supabase.
    setAnswers({});
    setScreen('start');
  }

  if (screen === 'start') {
    return (
      <StartScreen
        onStart={() => setScreen('quiz')}
        onOpenFairResults={() => setScreen('fair')}
      />
    );
  }

  if (screen === 'quiz') {
    return (
      <QuizScreen
        answers={answers}
        onAnswer={handleAnswer}
        onComplete={handleQuizComplete}
        onBackToStart={() => setScreen('start')}
      />
    );
  }

  if (screen === 'results') {
    const result = calculate(answers);
    return (
      <ResultsScreen
        answers={answers}
        result={result}
        onRestart={handleRestart}
      />
    );
  }

  if (screen === 'fair') {
    return <FairResults onBack={() => setScreen('start')} />;
  }

  return null;
}

export default App;
