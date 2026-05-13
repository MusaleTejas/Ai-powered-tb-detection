import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { PredictionResult } from '../types';

interface ChatBotProps {
  predictionContext: PredictionResult;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ predictionContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Medical Assistant. I have analyzed your X-ray results. How can I help you today? You can ask me about your results, Tuberculosis (TB), precautions, or nearby diagnostic centers.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const env = (import.meta as any).env;
  const CHAT_API_BASE_URL = env?.VITE_CHAT_API_BASE
    || (env?.MODE === 'production' ? 'https://your-vercel-domain.vercel.app/api' : 'http://127.0.0.1:5001');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const faqs = [
    "What are the early symptoms of Tuberculosis?",
    "Where is the nearest hospital for a TB checkup?",
    "What precautions should I take if I have TB?",
    "How is Tuberculosis transmitted?"
  ];

  const handleSend = async (forcedInput?: string) => {
    const textToSend = typeof forcedInput === 'string' ? forcedInput : input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = textToSend.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];

    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      // Build context from prediction
      const context = {
        multiclass_label: predictionContext.multiclass || predictionContext.prediction,
        confidence: typeof predictionContext.confidence === 'number' ? predictionContext.confidence : 0,
        tumor_subtype: predictionContext.tumor_subtype || '',
      };

      const resp = await axios.post(`${CHAT_API_BASE_URL}/chat`, {
        messages: newMessages,
        context: context
      }, {
        timeout: 600000 // 10 minutes to allow time for the initial large model download
      });

      if (resp.data && resp.data.response) {
        setMessages([...newMessages, { role: 'assistant', content: resp.data.response }]);
      } else {
        throw new Error(resp.data.error || 'Failed to get response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      let errMsg = 'Failed to connect to the assistant.';
      if (err.response?.data?.error) {
        errMsg = err.response.data.error;
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
      // Remove the user's message if it failed, so they can try again if they want
      // Or keep it and just show the error. We will keep it but show an error banner.
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-white shadow-2xl p-6 border border-purple-200 mt-8 rounded-lg font-classic">
      <h3 className="text-2xl font-bold text-classic-text mb-4 text-center">
        TB & Health Assistant
      </h3>

      {/* Chat Messages Area */}
      <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-4 h-96 overflow-y-auto mb-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-purple-600 ml-3' : 'bg-blue-600 mr-3'}`}>
                {msg.role === 'user' ? <User className="text-white w-5 h-5" /> : <Bot className="text-white w-5 h-5" />}
              </div>

              <div
                className={`p-3 rounded-2xl ${msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                  : 'bg-white text-classic-text border border-purple-200 rounded-tl-none shadow-sm'
                  }`}
              >
                {/* Parse newlines properly */}
                {msg.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== msg.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="flex max-w-[80%] flex-row">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 mr-3 flex items-center justify-center">
                <Bot className="text-white w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-white text-classic-text border border-purple-200 rounded-tl-none shadow-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 flex items-center space-x-2 rounded"
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* FAQ Chips */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => handleSend(faq)}
              disabled={isTyping}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs py-2 px-3 rounded-full transition-colors border border-purple-200 text-left disabled:opacity-50"
            >
              {faq}
            </button>
          ))}
        </motion.div>
      )}

      {/* Input Area */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about TB, hospitals, or precautions..."
          className="flex-1 border border-purple-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-classic-text"
          disabled={isTyping}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isTyping}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white p-3 rounded-lg transition-colors shadow-md flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatBot;
