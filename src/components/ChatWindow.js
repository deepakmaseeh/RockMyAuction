"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Updated Groq API Configuration - NO HARDCODED API KEY
  const GROQ_CONFIG = {
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, // ← Use environment variable
    model: "llama-3.3-70b-versatile"
  };

  // Load saved messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("auction_chat_history");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        { 
          role: "bot", 
          text: "👋 Hi! I'm your auction assistant powered by Groq AI (Llama 3.3). How can I help you today?" 
        },
      ]);
    }
  }, []);

  // Save messages whenever updated
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("auction_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Groq API Call Function
  const callGroqAPI = async (message) => {
    // Check if API key is available
    if (!GROQ_CONFIG.apiKey) {
      throw new Error("Groq API key not found. Please check your environment variables.");
    }

    const response = await fetch(GROQ_CONFIG.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a helpful auction assistant. Provide concise, friendly responses about auctions, bidding, item valuations, and related topics. Keep responses under 150 words and be professional yet approachable."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: GROQ_CONFIG.model,
        max_tokens: 200,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  // Handle sending a message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await callGroqAPI(currentInput);
      
      const botMessage = {
        role: "bot",
        text: aiResponse,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      const errorMessage = {
        role: "bot",
        text: `❌ Sorry, I encountered an error: ${error.message}. Please try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      console.error('Groq AI API Error:', error);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat history
  const clearChat = () => {
    localStorage.removeItem("auction_chat_history");
    setMessages([{ 
      role: "bot", 
      text: "🗑 Chat cleared. How can I assist you with auctions today?" 
    }]);
  };

  return (
    <div 
      className="fixed bottom-20 right-4 w-80 sm:w-96 h-[500px] rounded-2xl shadow-lg flex flex-col overflow-hidden border border-orange-500/30 animate-slideUp"
      style={{ backgroundColor: '#232326' }}
    >
      {/* Header */}
      <div 
        className="relative text-white p-4 flex justify-between items-center rounded-t-2xl"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white">Auction Assistant</span>
            <span className="text-xs text-orange-300">Powered by Groq AI (Llama 3.3)</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearChat}
            className="text-sm bg-orange-500/20 px-2 py-1 rounded-lg hover:bg-orange-500/30 transition-colors duration-200 border border-orange-500/30 text-white"
          >
            🗑️
          </button>
          <button 
            onClick={onClose} 
            className="text-lg hover:text-orange-400 transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-orange-500/20 text-white"
          >
            ✖
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-orange-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[85%] p-3 rounded-xl transition-colors duration-200 ${
              msg.role === "user"
                ? "bg-orange-500 text-white ml-auto"
                : "text-white"
            }`}
            style={{
              backgroundColor: msg.role === "user" ? undefined : '#3c3c3c',
            }}
          >
            {msg.text}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-orange-300 text-sm italic">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span>Groq AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div 
        className="relative p-4 border-t border-orange-500/30"
        style={{ backgroundColor: '#232326' }}
      >
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about auctions..."
              rows={1}
              className="w-full border border-orange-500/30 rounded-xl p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              style={{
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
              }}
              disabled={isTyping}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="text-white p-3 rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #facc15 50%, #ef4444 100%)',
            }}
          >
            <svg className="w-5 h-5 transform rotate-45" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
