'use client';

import { useConversation } from '@11labs/react';
import { use, useCallback, useEffect, useState } from 'react';
import { getFirstQuestion } from '../api/open-ai/genFirstQuestion/route'

export function Conversation() {
  const [fullMsg, setFullMsg] = useState<string>(''); 
  const [displayedMsg, setDisplayedMsg] = useState<string>(''); 
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [msg, setMsg] = useState<string>('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currQuestion, setCurrQuestion] = useState<string>('');
  const [currAnswer, setCurrAnswer] = useState<string>('');
  const [currScore, setCurrScore] = useState<number>(0);


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
        const response = await fetch('/api/open-ai/generateElements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: 'a bear, a cat, a dog',
          }),
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

const calculateScore = async () => {
  try {
      const response = await fetch('/api/open-ai/calcScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currQuestion,
          userAnswer: currAnswer,
          previousScore: currScore,
        }),
      });
      const data = await response.json();

      if (response.ok) {
          setCurrScore(data.score);
      } else {
          setError(data.error || 'Failed to calculate score');
      }
  } catch (err) {
      setError('An error occurred while calculating the score.');
  }
};

useEffect(() => {
  setCurrScore(-1000);
  if (currAnswer !== '') {
    calculateScore();
  }
}, [currAnswer]); 


  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (data : any) => {
      console.log('Data:', data);
      // log question and answer

      console.log("Data source: ", data.source)
      if (data.source == 'ai' ){
        console.log("HERE IN AI")
        setCurrQuestion(data.message);
      } else if (data.source == 'user') {
        console.log("HERE IN USER")
        setCurrAnswer(data.message);
        // if (currAnswer !== '') {
        //   calculateScore();
        // }
      }
      setFullMsg(data.message); // Store the full message
      setWords(data.message.split(' ')); // Split message into words
      setDisplayedMsg(''); // Reset displayed message
      setWordIndex(0); // Reset word index
      console.log('Question:', currQuestion);
      console.log('Answer:', currAnswer);
    },
    onError: (error : any) => console.error('Error:', error),
  });

  useEffect(() => {
    if (wordIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedMsg((prev) => (prev ? prev + ' ' + words[wordIndex] : words[wordIndex]));
        setWordIndex((prev) => prev + 1);
      }, 80); // Adjust speed for word appearance

      return () => clearTimeout(timeout); 
    }
  }, [wordIndex, words]);

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
  
      const generatedSubject = await getFirstQuestion('space, science, and technology');
      console.log("generated subject: ", generatedSubject)
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID,
        dynamicVariables: {
          subject_description: generatedSubject,
        },
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);
  
  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setFullMsg('');
    setDisplayedMsg('');
    setWords([]);
    setWordIndex(0);
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
      <div>{displayedMsg}</div> {/* Display typed-out text */}
      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
        <p>Score is {currScore}</p>
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