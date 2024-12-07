import { GameArea } from '@/components/GameArea';
import { GameOver } from '@/components/GameOver';
import { useGameState } from '@/hooks/useGameState';
import { useMlcAIState } from '@/hooks/useMlcAIState';

import { CreateWebWorkerMLCEngine, WebWorkerMLCEngine, ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { useEffect } from 'react';

let mlInitiated = false;
function MLCmp({ setModelDownloadProgress, setEngine }:
  {
    setModelDownloadProgress: React.Dispatch<React.SetStateAction<number>>,
    setEngine: React.Dispatch<React.SetStateAction<WebWorkerMLCEngine | null>>
  }) {
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
      const messages: ChatCompletionMessageParam[] = [
        { role: "system", content: "You are a helpful Mathematics teacher AI assistant." },
        { role: "user", content: "Hello!" },
      ]

      let reply = await engine?.chat.completions.create({
        messages,
      });
      console.log(reply?.choices[0].message);
      console.log(reply?.usage);

      reply = await engine?.chat.completions.create({
        messages: [{ role: "user", content: "Explain how to solve 3*5=? in a efficient shortcut way" },],
      });
      console.log(reply?.choices[0].message);
      console.log(reply?.usage);



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