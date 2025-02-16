'use client';

import { useConversation } from '@11labs/react';
import { use, useCallback, useEffect, useState } from 'react';
import { getFirstQuestion } from '../api/open-ai/genFirstQuestion/route';

export function Conversation() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [fullMsg, setFullMsg] = useState<string>(''); 
  const [displayedMsg, setDisplayedMsg] = useState<string>(''); 
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [topic, setTopic] = useState<string>('');
  const [generatedSubject, setGeneratedSubject] = useState<string>('');
  const [isPromptOpen, setIsPromptOpen] = useState(false);
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
          subject: topic,
          question: currQuestion,
          userAnswer: currAnswer,
        }),
      });
      const data = await response.json();

      if (response.ok) {
          setCurrScore(currScore + data.score);
      } else {
          setError(data.error || 'Failed to calculate score');
      }
  } catch (err) {
      setError('An error occurred while calculating the score.');
  }
};

useEffect(() => {
  if (currAnswer !== '') {
    calculateScore();
  }
}, [currAnswer]); 


  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (data: any) => {
      console.log('Data:', data);
      // log question and answer
      console.log("Data source: ", data.source)
      if (data.source == 'ai' ){
        setCurrQuestion(data.message);
      } else if (data.source == 'user') {
        setCurrAnswer(data.message);
      }
      setFullMsg(data.message);
      setWords(data.message.split(' '));
      setDisplayedMsg('');
      setWordIndex(0);
    },
    onError: (error: any) => console.error('Error:', error),
  });

  useEffect(() => {
    if (wordIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedMsg((prev) => (prev ? prev + ' ' + words[wordIndex] : words[wordIndex]));
        setWordIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [wordIndex, words]);

  const startConversationWithTopic = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic!');
      return;
    }

    setIsPromptOpen(false); // Close the input prompt

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const generatedSubject = await getFirstQuestion(topic);
      if (generatedSubject == null){
        console.error("Failed to generate subject");
        return
      }
      setGeneratedSubject(generatedSubject);
      console.log("Generated subject:", generatedSubject);

      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID,
        dynamicVariables: {
          subject_description: generatedSubject,
        },
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setFullMsg('');
    setDisplayedMsg('');
    setWords([]);
    setWordIndex(0);
  }, [conversation]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("User Input:", userInput); // You can use this elsewhere
    setIsOverlayVisible(false);
  };

  return (
    
    <div className="flex flex-col items-center gap-4">
      <div>
      {/* Overlay */}
      
      {isOverlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Enter Input</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type something..."
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      <h1>Main Page Content</h1>
      {userInput && <p>Saved Input: {userInput}</p>}
    </div>
    Mastery of Subject:
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
       className="bg-[#5e8c61] h-4 rounded-full"
       style={{ width: `${(currScore / 1000) * 100}%` }}
          ></div>
    </div>
      <h1 className="text-4xl font-bold text-center mb-4">Topic: {topic}</h1>
      <div className="flex gap-2">
        <button
          onClick={() => setIsPromptOpen(true)}
          disabled={conversation.status === 'connected'}
          className="px-4 py-2 bg-[#72bda3] text-white rounded disabled:bg-gray-300"
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
      <div>{displayedMsg}</div>
      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
        <p>Score is {currScore}</p>
      </div>
      <button
        onClick={() => {
          setCurrScore(0);
          setCurrQuestion('');
          setCurrAnswer('');
          setFullMsg('');
          setDisplayedMsg('');
          setWords([]);
          setWordIndex(0);
          setTopic('');
          stopConversation();
        }}
        className="px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Restart
      </button>

      {/* Topic Input Prompt */}
      {isPromptOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-2">Enter a Topic</h2>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quantum Physics"
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <div className="flex justify-center gap-4 mt-4">
              <button 
                onClick={startConversationWithTopic} 
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Start
              </button>
              <button 
                onClick={() => setIsPromptOpen(false)} 
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
