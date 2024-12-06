import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {  WebWorkerMLCEngine } from "@mlc-ai/web-llm";



export function useMlcAIState() {
    const [engine, setEngine] = useState<WebWorkerMLCEngine|null>(null);
    const [modelDownloadProgress, setModelDownloadProgress] = useState(0);
    const [latestReply, setLatestReply] = useState(null);

    const promptModel = async (question: string) => {
        if (engine) {
            let reply = await engine.chat.completions.create({
                messages: [{ role: "user", content: `Explain and expand a shortcut solution to solve the problem: ${question} ` }],
            });

            const replyMsg = reply?.choices[0].message.content
            // setLatestReply(replyMsg)
            return replyMsg;
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