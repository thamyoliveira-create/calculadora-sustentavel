import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import FairResults from './components/FairResults';
import { Answers, calculate } from './lib/calculations';
import { submitParticipant } from './lib/fairData';

type Screen = 'start' | 'quiz' | 'results' | 'fair';

function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    try {
      const saved = localStorage.getItem('eco_quiz_screen');
      if (saved && ['start', 'quiz', 'results', 'fair'].includes(saved)) {
        return saved as Screen;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'start';
  });

  const [answers, setAnswers] = useState<Answers>(() => {
    try {
      const saved = localStorage.getItem('eco_quiz_answers');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('eco_quiz_answers', JSON.stringify(answers));
      localStorage.setItem('eco_quiz_screen', screen);
    } catch {
      // Ignore localStorage errors
    }
  }, [answers, screen]);

  function handleAnswer(questionId: number, value: number | string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleQuizComplete() {
    const result = calculate(answers);
    // Submit anonymous data — fire-and-forget, but log failures to console.
    try {
      await submitParticipant(answers, result);
    } catch (e) {
      console.warn('Falha ao registrar resultado anônimo:', e);
    }
    setScreen('results');
  }

  function handleRestart() {
    // Erase only this participant's answers; collective fair data persists in Supabase.
    try {
      localStorage.removeItem('eco_quiz_answers');
      localStorage.removeItem('eco_quiz_screen');
    } catch {
      // Ignore localStorage errors
    }
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

