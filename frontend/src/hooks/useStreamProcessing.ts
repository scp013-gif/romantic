import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function useStreamProcessing() {
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentContent, setCurrentContent] = useState("");
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    const processStream = useCallback(async (url: string, body: any) => {
        setIsStreaming(true);

        let fullContent = '';
        let finalImage = '';
        let buffer = '';

        try {
            const response = await fetch(`http://localhost:3000/api${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${useAuthStore.getState().accessToken}`
                },
                body: JSON.stringify(body)
            });

            if (!response.body) throw new Error('无法读取响应流');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const rawData = line.slice(6).trim();
                        if (rawData === '[DONE]') break;

                        try {
                            const { content, imageUrl } = JSON.parse(rawData);

                            if (imageUrl && imageUrl !== finalImage) {
                                finalImage = imageUrl;
                                setCurrentImageUrl(finalImage);
                            }

                            if (content && !content.trim().startsWith('http')) {
                                fullContent += content;
                                setCurrentContent(fullContent);
                            }
                        } catch (e) {
                            console.error('解析失败', e);
                        }
                    }
                }
            }
            return { blessing: fullContent, imageUrl: finalImage };
        } catch (error) {
            console.error('处理流式数据时出错', error);
        } finally {
            setIsStreaming(false);
        }
    }, []);

    return { isStreaming, currentContent, currentImageUrl, processStream };
}