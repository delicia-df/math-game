import { GameArea } from '@/components/GameArea';
import { GameOver } from '@/components/GameOver';
import { useGameState } from '@/hooks/useGameState';

import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";

// let engine=null;
async function main() {
  // Callback function to update model loading progress
const initProgressCallback = async(initProgress: any) => {
  console.log("initProgress",initProgress);
  if(initProgress?.progress==1){
    const messages = [
      { role: "system", content: "You are a helpful Mathematics teacher AI assistant." },
      { role: "user", content: "Hello!" },
    ]
    
    let reply = await (window as any).engine.chat.completions.create({
      messages,
    });
    console.log(reply.choices[0].message);
    console.log(reply.usage);

    reply = await (window as any).engine.chat.completions.create({
      messages:[ { role: "user", content: "Explain how to solve 3*5=? in a efficient shortcut way" },],
    });
    console.log(reply.choices[0].message);
    console.log(reply.usage);
  }
}
  let selectedModel = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC-1k";

  // Use a WebWorkerMLCEngine instead of MLCEngine here
  (window as any).engine = await CreateWebWorkerMLCEngine(
    new Worker(
      new URL("./worker.ts", import.meta.url), 
      {
        type: "module",
      }
    ),
    selectedModel,
    { initProgressCallback }, // engineConfig
  );

  // everything else remains the same
}
main()

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