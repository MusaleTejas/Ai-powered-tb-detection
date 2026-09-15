import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, AlertCircle, Sparkles, Stethoscope, Building2, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
      content: "Hello! I'm your AI health assistant. I've reviewed your chest X-ray screening results and I'm here to help you understand them. Feel free to ask me anything about your report, what symptoms to watch for, how free DOTS treatment works, or tips for protecting your family."
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
    "What do my X-ray results mean in simple terms?",
    "How does the free government DOTS treatment work?",
    "What tests should I ask my doctor for next?",
    "What simple precautions can keep my family safe?"
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
      const context = {
        multiclass_label: predictionContext.multiclass || predictionContext.prediction,
        confidence: typeof predictionContext.confidence === 'number' ? predictionContext.confidence : 0,
        tumor_subtype: predictionContext.tumor_subtype || '',
      };

      const resp = await axios.post(`${CHAT_API_BASE_URL}/chat`, {
        messages: newMessages,
        context: context
      }, {
        timeout: 60000
      });

      if (resp.data && resp.data.response) {
        setMessages([...newMessages, { role: 'assistant', content: resp.data.response }]);
      } else {
        throw new Error(resp.data.error || 'Failed to get response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      let errMsg = 'Failed to connect to the medical assistant service.';
      if (err.response?.data?.error) {
        errMsg = err.response.data.error;
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
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
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base">TB Care AI Assistant</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                LLaMA 3 Fast
              </span>
            </div>
            <p className="text-xs text-slate-400">Ask questions regarding your diagnosis, precautions & doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-emerald-300 font-medium">Online</span>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 overflow-x-auto">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> Suggested Medical Queries:
        </p>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => handleSend(faq)}
              disabled={isTyping}
              className="text-xs px-3 py-1.5 bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 rounded-xl text-slate-700 whitespace-nowrap transition-all shadow-2xs font-medium flex-shrink-0"
            >
              {faq}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="p-6 h-96 overflow-y-auto space-y-4 bg-slate-50/40">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
                isUser ? 'bg-slate-800' : 'bg-teal-600 shadow-xs'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                isUser 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none overflow-x-auto'
              }`}>
                {isUser ? (
                  <div className="whitespace-pre-line">{msg.content}</div>
                ) : (
                  <div className="prose prose-slate max-w-none prose-table:w-full prose-table:text-xs prose-th:bg-slate-100 prose-th:p-2 prose-td:p-2 prose-td:border-b prose-td:border-slate-150">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-2 rounded-xl border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200 text-xs bg-white" {...props} />
                          </div>
                        ),
                        th: ({ node, ...props }) => (
                          <th className="bg-slate-100 px-3 py-2 text-left font-bold text-[11px] text-teal-900 uppercase border-b border-slate-200" {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td className="px-3 py-2 text-xs text-slate-700 border-b border-slate-100 align-top" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="mb-2 last:mb-0" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="text-xs sm:text-sm" {...props} />
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none flex items-center space-x-1.5 shadow-xs">
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
        <input
          type="text"
          placeholder="Ask a question about Tuberculosis symptoms, DOTS centers, or precautions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-800 transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className={`p-3 rounded-2xl transition-all shadow-md ${
            !input.trim() || isTyping
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
