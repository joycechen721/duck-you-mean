'use client';

import { useConversation } from '@11labs/react';
import { use, useCallback, useEffect, useState } from 'react';
import { getFirstQuestion } from '../api/open-ai/genFirstQuestion/route';
import TvScreen from './projector';

export function Conversation() {
  const learningDuck = '/learningduck.png';  
  const normalDuck = '/normalduck.png';
  const talkingDuck = '/talkingduck.gif';
  const finishConvo = '/finishlesson.png';
  const heartDuck = 'heartduck.png';
  const newlesson = 'newlesson.png';

  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [fullMsg, setFullMsg] = useState<string>(''); 
  const [displayedMsg, setDisplayedMsg] = useState<string>(''); 
  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [topic, setTopic] = useState<string>('');
  const [generatedSubject, setGeneratedSubject] = useState<string>('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currQuestion, setCurrQuestion] = useState<string>('');
  const [currAnswer, setCurrAnswer] = useState<string>('');
  const [currScore, setCurrScore] = useState<number>(0);
  const [duckImg, setDuckImg] = useState<string>(normalDuck);
  const [data, setData] = useState<any>(null);
  const [conversationEnded, setConversationEnded] = useState(false);

  const generateImg = async (topic: string, userAnswer: string) => {
    const prompt = `A colorful and realistic sketch illustrating ${topic}. The image should reflect the user's idea: "${userAnswer}", making it engaging and visually appealing.`;

    const imageRes = await fetch('/api/get-luma', {
      method: 'POST',
      headers: {
    'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    const imageData = await imageRes.json();
    console.log(imageData);
    if (imageRes.ok) {
        setImageUrl(imageData.imageUrl);
    } else {
        setError(imageData.error || 'Failed to generate image');
    }
}

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
    generateImg(topic, currAnswer);
  }
}, [currAnswer]); 

useEffect(() => {
  if (!data) return;

  if (data.source === 'ai') {
    // setDuckImg(talkingDuck);
    setCurrQuestion(data.message);
  } else if (data.source === 'user') {
    setCurrAnswer(data.message);
  }
}, [data]);


  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    // onStatusChange: () => console.log('Status changed'),
    onMessage: (data: any) => {
      setData(data);
      console.log('Data:', data);
      // log question and answer
      // console.log("Data source: ", data.source)
      // if (data.source == 'ai' ){
      //   // setDuckImg(talkingDuck);
      //   setCurrQuestion(data.message);
      // } else if (data.source == 'user') {
      //   // setDuckImg(normalDuck);
      //   setCurrAnswer(data.message);
      // }
      setFullMsg(data.message);
      setWords(data.message.split(' '));
      setDisplayedMsg('');
      setWordIndex(0);
    },
    onError: (error: any) => console.error('Error:', error),
  });

  useEffect(() => {
    if (wordIndex < words.length) {
      setDuckImg(talkingDuck);
      const timeout = setTimeout(() => {
        setDisplayedMsg((prev) => (prev ? prev + ' ' + words[wordIndex] : words[wordIndex]));
        setWordIndex((prev) => prev + 1);
      }, 260);
      return () => clearTimeout(timeout);
    } else {
      setDuckImg(normalDuck);
    }
    console.log(currScore)
  }, [wordIndex, words]);

  const startConversationWithTopic = async (userInput : string) => {
    try {
      generateImg(userInput);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const generatedSubject = await getFirstQuestion(userInput);
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
    setConversationEnded(true);
    setCurrQuestion('');
    setCurrAnswer('');
    setFullMsg('');
    setDisplayedMsg('');
    setWords([]);
    setWordIndex(0);
    setTopic('');
    setIsConversationStarted(false);
    setUserInput('');
    setDuckImg(normalDuck);
  }, [conversation]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("User Input:", userInput); // You can use this elsewhere
    setIsConversationStarted(true);
    setTopic(userInput);
    await startConversationWithTopic(userInput);
  };

  if (conversationEnded) {
    return (
      <div className={`flex bg-[url('/background.png')] bg-cover bg-center w-screen`}>
          <div className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-col items-center gap-4 w-full">
                <h1 className='mt-10 font-bold text-2xl'>What a great conversation!</h1>
                <h2 className='mt-4 font-bold text-2xl'>This is my score for you: {currScore/5}%</h2>
                <img className="w-1/3 object-cover mx-auto mt-4 cursor-pointer" style={{width: '200px'}} onClick={() => {window.location.href = '/learn'; setCurrScore(0);}} src={newlesson} alt="new lesson" />
                <img style={{width: '730px'}} src={heartDuck} alt="heart duck" />
                <div className="flex gap-2">
                  <img
                    className="w-1/3 h-50 object-cover m-0 mx-auto cursor-pointer"
                    style={{margin: 'auto', marginTop: '-160px', justifyContent: 'center', cursor: 'pointer'}}
                  >
                  </img>
              </div>
            </div>
          </div>
        </div>
    )
  }
  else {
    return (
      <div className={`flex ${isConversationStarted ? "bg-[url('/pond.PNG')] bg-cover bg-center" : ""} w-screen`}>
        <div className="flex flex-col items-center justify-center w-full">
          {isConversationStarted ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <h1 className="text-4xl font-bold text-center mt-5 mb-4">Topic: {topic}</h1>
              <div className="flex items-center w-3/5" style={{ justifyContent: 'space-between' }}>
                <span>Mastery:</span>
                <div className="relative w-3/4 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#5e8c61] h-4 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max((currScore / 500) * 100, 0)}%` }}
                  ></div>
                </div>
                <span className="text-sm">{`${currScore / 5}%`}</span>
              </div>
              <div className='max-w-2xl text-center'>{displayedMsg}</div>
              {/* <div className="flex items-center space-x-4"> */}
                <img style={{ width: '700px' }} src={duckImg} alt="talking duck gif" />
                <div style={{top: '230px', right: '80px'}} className="absolute">
                  <TvScreen imageUrl={imageUrl} />
                </div>
              {/* </div> */}
              <div className="flex gap-2">
                <img
                  onClick={stopConversation}
                  src={finishConvo}
                  className="w-1/3 h-50 object-cover m-0 mx-auto cursor-pointer"
                  style={{margin: 'auto', marginTop: '-160px', justifyContent: 'center', cursor: 'pointer'}}
                >
                </img>
              </div>
              {/* <div className="flex flex-col items-center">
                <p>Status: {conversation.status}</p>
                <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
              </div> */}
            </div>
          ) : (
            <div className="">
              <div className="overlay-content text-center w-full mt-10">
              <img style={{width: '700px'}} src={learningDuck} alt="Logo" />
                {/* <h2 className="text-2xl font-semibold mb-4">Enter what you want to teach!</h2> */}
                  <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                  <div className="flex items-center border border-gray-300 rounded w-3/4 p-2">
                    <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="e.g. quantum physics..."
                    required
                    className="flex-grow p-2 outline-none"
                    />
                    <button type="submit" className="px-4 py-2 bg-[#4f8d5e] text-white rounded ml-2">Send</button>
                  </div>
                  </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}