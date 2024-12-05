import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface FallingQuestionProps {
  question: string;
  speed: number;
  onMiss: () => void;
  onRemove: () => void;
}

export function FallingQuestion({
  question,
  speed,
  onMiss,
  onRemove,
}: FallingQuestionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        lastFrameTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - (lastFrameTimeRef.current || timestamp);
      lastFrameTimeRef.current = timestamp;

      setPosition((prev) => {
        const newPosition = prev + (deltaTime * speed) / 1000;

        if (newPosition > window.innerHeight) {
          onMiss();
          onRemove();
          return prev;
        }

        return newPosition;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, onMiss, onRemove]);

  return (
    <Card
      ref={ref}
      className={cn(
        ' px-6 py-3 text-lg font-bold z-10',
        'hover:scale-105 cursor-pointer shadow-lg',
        'bg-primary text-primary-foreground'
      )}
      style={{
        left: '200px',
        top: 0,
        transform: `translateY(${position}px)`,
      }}
    >
      {question}
    </Card>
  );
}
