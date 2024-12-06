import { FallingQuestion } from '@/components/FallingQuestion';
import { GameUI } from '@/components/GameUI'; 

interface GameAreaProps {
  questions: Array<{ id: number; question: string[]; answer: number }>;
  level: number;
  score: number;
  lives: number;
  baseSpeed: number;
  onAnswer: (answer: number) => void;
  onMiss: () => void;
  onRemoveQuestion: (id: number) => void;
}

export function GameArea({
  questions,
  level,
  score,
  lives,
  baseSpeed,
  onAnswer,
  onMiss,
  onRemoveQuestion,
}: GameAreaProps) {
  return (
    <div className="relative w-full h-screen bg-background/80">
      {questions.map((q) => (
        <FallingQuestion
          key={q.id}
          question={q.question}
          speed={baseSpeed + level * 8}
          onMiss={onMiss}
          onRemove={() => onRemoveQuestion(q.id)}
        />
      ))}
      <GameUI level={level} score={score} lives={lives} onAnswer={onAnswer} />
    </div>
  );
}
