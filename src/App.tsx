import { GameArea } from '@/components/GameArea';
import { GameOver } from '@/components/GameOver';
import { useGameState } from '@/hooks/useGameState';

export default function App() {
  const {
    questions,
    level,
    score,
    lives,
    gameOver,
    baseSpeed,
    handleAnswer,
    handleMiss,
    restartGame,
    setQuestions
  } = useGameState();

  const handleRemoveQuestion = (id: number) => {
    setQuestions(prev => prev.filter(question => question.id !== id));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      {gameOver ? (
        <GameOver score={score} onRestart={restartGame} />
      ) : (
        <GameArea
          questions={questions}
          level={level}
          score={score}
          lives={lives}
          baseSpeed={baseSpeed}
          onAnswer={handleAnswer}
          onMiss={handleMiss}
          onRemoveQuestion={handleRemoveQuestion}
        />
      )}
    </div>
  );
}