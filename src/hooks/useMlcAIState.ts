import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';


export function useGameState() {
    const [engine, setEngine] = useState(null);
    const [modelDownloadProgress, setModelDownloadProgress] = useState(0);
    const [latestReply, setLatestReply] = useState(null);
    
    const promptModel = async (question: string) =>{
        if(engine){
            let reply = await (window as any).engine.chat.completions.create({
                messages:[`Explain a shortcut  solution to solve problem: ${question} `],
              });
        }
    }

    return {
        engine,
        modelDownloadProgress,
        latestReply,
        setEngine,
        setModelDownloadProgress,
        setLatestReply,
        promptModel

      };
}