import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateQuestion } from '@/lib/math';


interface Question {
  id: number;
  question: string[];
  answer: number;
}

export function useGameState() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const { toast } = useToast();

  const baseSpeed = 40;
  const questionInterval = Math.max(3000 - level * 150, 1000);

  const addQuestion = useCallback(() => {
    // Only add a new question if there are no questions
    if (questions.length === 0) {
      const { question, answer } = generateQuestion(level);
      const newQuestion = {
        id: Date.now(),
        question,
        answer
      };
      setQuestions([newQuestion]);
    }
  }, [level, questions.length]);

  useEffect(() => {
    if (gameOver) return;

    // Add initial question
    if (questions.length === 0) {
      addQuestion();
    }

    const interval = setInterval(addQuestion, questionInterval);
    return () => clearInterval(interval);
  }, [addQuestion, gameOver, questionInterval]);

  useEffect(() => {
    if (score > 0 && score % 100 === 0) {
      setLevel(prev => prev + 1);
      toast({
        title: "Level Up!",
        description: `You've reached level ${level + 1}!`,
      });
    }
  }, [score]);

  const handleAnswer = (answer: number, promptModel: any) => {
    const question = questions[0];
    if (!question) return;

    if (question.answer === answer) {
      setScore(prev => prev + 10);
      setQuestions([]); // Clear the current question
      toast({
        title: "Correct!",
        description: "+10 points",
        variant: "default",
      });
    } else {
      setLives(prev => prev - 1);
      toast({
        title: "Wrong!",
        description: `The correct answer was ${question.answer}`,
        variant: "destructive",
      });

      promptModel(`${question.question.join(" ")} = ?`)
        .then((text: any) => {
          if (text) {
            toast({
              title: "AI Tip",
              description: text,
              variant: "default",
            });
          }
        })


      if (lives <= 1) {
        setGameOver(true);
      } else {
        setQuestions([]); // Clear the current question even on wrong answer
      }
    }
  };

  const handleMiss = () => {
    setLives(prev => prev - 1);
    setQuestions([]); // Clear the missed question

    if (lives <= 1) {
      setGameOver(true);
      toast({
        title: "Game Over!",
        description: `Final Score: ${score}`,
        variant: "destructive",
      });
    }
  };

  const restartGame = () => {
    setQuestions([]);
    setLevel(1);
    setScore(0);
    setLives(3);
    setGameOver(false);
  };

  return {
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
  };
}