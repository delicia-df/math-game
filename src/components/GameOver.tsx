import { Button } from '@/components/ui/button';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export function GameOver({ score, onRestart }: GameOverProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
      <p className="text-2xl mb-8">Final Score: {score}</p>
      <Button
        onClick={onRestart}
        className="px-6 py-3 hover:opacity-90"
      >
        Play Again
      </Button>
    </div>
  );
}