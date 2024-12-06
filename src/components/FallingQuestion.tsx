import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

import SpinningBoxes from './SpinningBoxes'

interface FallingQuestionProps {
  question: string[];
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
  const [isMissed, setMissed] = useState(false);

  useEffect(() => {
    if (isMissed) {
      onRemove();
      onMiss();
    }
  }, [isMissed])

  useEffect(() => {
    setMissed(false)
  }, [question.join("")])

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
          setMissed(true)
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
        'fixed px-6 py-3 '
      )}
      style={{
        top: 0,
        left: '50%',
        transform: `translateX(-50%) translateY(${position}px)`,
      }}
    >
      <SpinningBoxes textArray={question} speed={speed} />
    </Card>
  );
}
