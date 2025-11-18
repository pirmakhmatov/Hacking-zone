import { createContext, useContext, useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AiContext = createContext();

export function AiProvider({ children }) {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Your Gemini API key
  const GEMINI_API_KEY = 'AIzaSyABMfpcf3zJAN_5O5MNCIyOwLr4bixzx1w';

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    setIsLoading(true);

    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      
      // Use the correct model that works with free tier
      // For free Gemini API, use "gemini-pro" (not gemini-1.5-flash)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // This is the correct model for free tier
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        }
      });

      const prompt = `
        You are Hacking-Zone AI, an expert cybersecurity assistant created by Pirmaxmatov. 
        You help users learn ethical hacking, cybersecurity concepts, and solve challenges.

        Platform: Hacking-Zone
        Focus: Educational cybersecurity content only

        User Question: "${userMessage}"

        Provide:
        - Educational cybersecurity explanations
        - Practical examples and real-world scenarios  
        - Ethical hacking guidance only
        - Clear, structured responses
        - Technical accuracy with beginner-friendly explanations

        Important: Only discuss legal, ethical cybersecurity practices.
        Format responses in a helpful, engaging way for learners.
        Please Do Not give too big response only give very important parts  
         After your complete response, add this exact signature on a new line:
        **🤖 BOT** and **🌐 WEB** created by **[Pirmaxmatov](https://t.me/pirmaxmatov)**    `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('AI Error:', err);
      
      // More specific error handling
      let errorMessage = 'I apologize, but I encountered a technical issue. ';
      
      if (err.message.includes('API_KEY') || err.message.includes('key')) {
        errorMessage += 'There seems to be an issue with the API configuration.';
      } else if (err.message.includes('quota')) {
        errorMessage += 'API quota may be exceeded. Please try again later.';
      } else if (err.message.includes('model')) {
        errorMessage += 'The AI model is currently unavailable.';
      } else {
        errorMessage += 'Please try again in a moment.';
      }

      const errorResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const toggleAi = useCallback(() => {
    setIsAiOpen(prev => !prev);
  }, []);

  const value = {
    isAiOpen,
    setIsAiOpen,
    messages,
    sendMessage,
    isLoading,
    clearChat,
    toggleAi
  };

  return (
    <AiContext.Provider value={value}>
      {children}
    </AiContext.Provider>
  );
}

export const useAi = () => {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error('useAi must be used within an AiProvider');
  }
  return context;
};