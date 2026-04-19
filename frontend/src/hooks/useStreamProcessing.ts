import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function useStreamProcessing() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentContent, setCurrentContent] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const processStream = useCallback(async (url: string, body: any) => {
    // 防止重复请求
    if (isStreaming) {
      alert('正在处理中，请稍候...');
      return;
    }

    setIsStreaming(true);
    setConnectionStatus('connecting');

    let fullContent = '';
    let finalImage = '';
    let buffer = '';
    let retryCount = 0;

    const MAX_RETRIES = 3;

    const startStream = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().accessToken}`
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error(`请求失败: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('无法读取响应流');
        }

        setConnectionStatus('connected');
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
              if (rawData === '[DONE]') {
                setConnectionStatus('idle');
                return { blessing: fullContent, imageUrl: finalImage };
              }

              try {
                const { content, imageUrl } = JSON.parse(rawData);
                if (imageUrl && imageUrl !== finalImage) {
                  finalImage = imageUrl;
                  setCurrentImageUrl(finalImage);
                }
                if (content && !content.startsWith('http')) {
                  fullContent += content;
                  console.log(content);
                  setCurrentContent(fullContent);
                }
              } catch (e) {
                // JSON 解析失败，数据不完整，保留到下次
                console.log('数据不完整，等待更多数据...');
              }
            }
          }
        }
      } catch (error) {
        console.error('流处理出错:', error);
        
        
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setConnectionStatus('connecting');
          console.log(`第 ${retryCount} 次重试...`);
          await new Promise(r => setTimeout(r, 1000)); 
          return startStream(); 
        }
        
        setConnectionStatus('error');
        alert('网络不稳定，生成失败');
      } finally {
        setIsStreaming(false);
      }
    };

    return await startStream();
  }, [isStreaming]);

  return { 
    isStreaming, 
    currentContent, 
    currentImageUrl, 
    connectionStatus,
    processStream 
  };
}