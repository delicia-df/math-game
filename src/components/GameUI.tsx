import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Heart } from 'lucide-react';

interface GameUIProps {
  level: number;
  score: number;
  lives: number;
  onAnswer: (answer: number) => void;
}

export function GameUI({ level, score, lives, onAnswer }: GameUIProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(input);
    if (!isNaN(answer)) {
      onAnswer(answer);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4 z-20">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">Level {level}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Score: {score}</span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: lives }).map((_, i) => (
              <Heart key={i} className="w-5 h-5 text-red-500 fill-red-500" />
            ))}
          </div>
        </div>
        <Progress value={(score % 100) / 100 * 100} className="mb-4" />
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="number"
            step=".0001"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter answer..."
            className="text-lg"
            autoFocus
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}