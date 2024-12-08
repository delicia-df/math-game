import { GameArea } from '@/components/GameArea';
import { GameOver } from '@/components/GameOver';
import { useGameState } from '@/hooks/useGameState';
import { useMlcAIState } from '@/hooks/useMlcAIState';

import { CreateWebWorkerMLCEngine, WebWorkerMLCEngine, ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
let mlInitiated = false;
function MLCmp({ setModelDownloadProgress, setEngine }:
  {
    setModelDownloadProgress: React.Dispatch<React.SetStateAction<number>>,
    setEngine: React.Dispatch<React.SetStateAction<WebWorkerMLCEngine | null>>
  }) {  
    const { toast } = useToast();


  useEffect(() => {

    async function initMl() {
      let engine: WebWorkerMLCEngine | null = null;
      const initProgressCallback = async (initProgress: any) => {
        console.log("initProgress", initProgress);
        setModelDownloadProgress(initProgress?.progress)
      }

      let selectedModel = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC";
      // Use a WebWorkerMLCEngine instead of MLCEngine here
      engine = await CreateWebWorkerMLCEngine(
        new Worker(
          new URL("./worker.ts", import.meta.url),
          {
            type: "module",
          }
        ),
        selectedModel,
        { initProgressCallback }, // engineConfig
      );

      setEngine(engine);
      const messages: ChatCompletionMessageParam[] = 
      [
        {
          "role": "system",
          "content": "You are a helpful Mathematics teacher AI assistant. You will guide students through basic arithmetic operations like addition, subtraction, multiplication, and division."
        },
        {
          "role": "user",
          "content": "Hello! I need help with math. What kind of math problems can you help me with?"
        },
        {
          "role": "assistant",
          "content": "I'd be happy to help you with basic arithmetic operations. Which operation do you need help with? You can ask me questions like 'What is 2+2?' or 'How do I multiply 4 by 5?'"
        },
        {
          "role": "user",
          "content": "Explain how to solve 3*5=? in a efficient shortcut way"
        },
        {
          "role": "assistant",
          "content": "Here's a quick shortcut to solve 3*5:\n## Multiplication Shortcut\nTo multiply 3 by 5, you can use the following trick:\n3 * 5 = ?\nThink of it as:\n(3 * 5) = (3 * (4 + 1))\nNow, use the distributive property:\n= (3 * 4) + (3 * 1)\nThis simplifies to:\n= 12 + 3\nSo, the answer is:\n3 * 5 = 15\nThis shortcut works by breaking down one of the numbers into smaller parts, making the multiplication easier."
        },
        {
          "role": "user",
          "content": "What about 4*9=?"
        },
        {
          "role": "assistant",
          "content": "Here's a quick shortcut to solve 4*9:\n## Multiplication Shortcut\nTo multiply 4 by 9, you can use the following trick:\n4 * 9 = ?\nThink of it as:\n(4 * 9) = (4 * (10 - 1))\nNow, use the distributive property:\n= (4 * 10) - (4 * 1)\nThis simplifies to:\n= 40 - 4\nSo, the answer is:\n4 * 9 = 36\nThis shortcut works by breaking down one of the numbers into smaller parts, making the multiplication easier."
        },
        {
          "role": "user",
          "content": "How about 6*7=?"
        },
        {
          "role": "assistant",
          "content": "Here's a quick shortcut to solve 6*7:\n## Multiplication Shortcut\nTo multiply 6 by 7, you can use the following trick:\n6 * 7 = ?\nThink of it as:\n(6 * 7) = (6 * (5 + 2))\nNow, use the distributive property:\n= (6 * 5) + (6 * 2)\nThis simplifies to:\n= 30 + 12\nSo, the answer is:\n6 * 7 = 42\nThis shortcut works by breaking down one of the numbers into smaller parts, making the multiplication easier."
        },
        {
          "role": "user",
          "content": "Can you help me with addition? I need to calculate 456 + 279."
        },
        {
          "role": "assistant",
          "content": "Here's how you can add 456 and 279:\n## Addition Steps\n1. Start by adding the hundreds place:\n400 + 200 = 600\n2. Next, add the tens place:\n50 + 70 = 120\n3. Finally, add the ones place:\n6 + 9 = 15\n## Combine the Results\nNow, combine the results from each step:\n600 + 120 + 15 = 735\nSo, the answer is:\n456 + 279 = 735"
        },
        {
          "role": "user",
          "content": "What about subtraction? Can you help me with 945 - 378?"
        },
        {
          "role": "assistant",
          "content": "Here's how you can subtract 378 from 945:\n## Subtraction Steps\n1. Start by subtracting the hundreds place:\n900 - 300 = 600\n2. Next, subtract the tens place:\n40 - 70 = -30\n3. Finally, subtract the ones place:\n5 - 8 = -3\n## Combine the Results\nNow, combine the results from each step:\n600 - 30 - 3 = 567\nSo, the answer is:\n945 - 378 = 567"
        },{
          "role": "user",
          "content": "how about 36*9=?"
        },
      ]
      console.log("Sending Initial messages")
      let reply = await engine?.chat.completions.create({
        messages,
      });
      console.log(reply?.choices[0].message);
      console.log(reply?.usage);
      toast({
        title: "AI Tip",
        description: reply?.choices[0].message,
        variant: "default",
        duration: 20000
      });
     



    }
    !mlInitiated && initMl();
    mlInitiated = true;

  }, [])

  return <></>
}



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
  const { setModelDownloadProgress, setEngine, promptModel } = useMlcAIState();


  const handleRemoveQuestion = (id: number) => {
    setQuestions(prev => prev.filter(question => question.id !== id));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <MLCmp setModelDownloadProgress={setModelDownloadProgress} setEngine={setEngine} />
      {gameOver ? (
        <GameOver score={score} onRestart={restartGame} />
      ) : (
        <GameArea
          questions={questions}
          level={level}
          score={score}
          lives={lives}
          baseSpeed={baseSpeed}
          onAnswer={(answer) => handleAnswer(answer, promptModel)}
          onMiss={handleMiss}
          onRemoveQuestion={handleRemoveQuestion}
        />

      )}
    </div>
  );
}