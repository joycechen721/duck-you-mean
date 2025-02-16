
'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState } from 'react';

export function Conversation() {
  const [msg, setMsg] = useState<string>('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
      setLoading(true);
      setError(null);
      
      try {
          const response = await fetch('/api/get-luma', {
              method: 'POST',
          });
          const data = await response.json();

          if (response.ok) {
              setImageUrl(data.imageUrl);
          } else {
              setError(data.error || 'Failed to generate image');
          }
      } catch (err) {
          setError('An error occurred while generating the image.');
      } finally {
          setLoading(false);
      }
  };

  const handleOpenAIGenerateImage = async () => {
    setLoading(true);
    setError(null);
    
    try {
        const response = await fetch('/api/open-ai/generateImg', {
            method: 'POST',
        });
        const data = await response.json();

        if (response.ok) {
            setImageUrl(data.imageUrl);
        } else {
            setError(data.error || 'Failed to generate image');
        }
    } catch (err) {
        setError('An error occurred while generating the image.');
    } finally {
        setLoading(false);
    }
};

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (data : any) => {
      console.log('Data:', data);
      setMsg(data.message);
    },
    onError: (error : any) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Start the conversation with your agent
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID, 
        dynamicVariables: {
          subject_description: 'space, science, and technology',
      },
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setMsg('');
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === 'connected'}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== 'connected'}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>
      <div>{msg}</div>
      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
      </div>
      <div>
            <button onClick={handleOpenAIGenerateImage} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Image'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {imageUrl && (
                <div>
                    <p>Image generated:</p>
                    <img src={imageUrl} alt="Generated" />
                </div>
            )}
        </div>
    </div>
  );
  }