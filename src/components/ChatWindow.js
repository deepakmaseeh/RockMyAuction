"use client";
import { useState, useRef, useEffect, useCallback } from "react";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 384, height: 500 });
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const windowRef = useRef(null);

  // Updated Groq API Configuration
  const GROQ_CONFIG = {
    url: "https://api.groq.com/openai/v1/chat/completions",
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    visionModel: "meta-llama/llama-4-scout-17b-16e-instruct",
    textModel: "llama-3.3-70b-versatile"
  };

  // Initialize window position
  useEffect(() => {
    const updatePosition = () => {
      if (!isFullscreen) {
        setWindowPosition({
          x: window.innerWidth - windowSize.width - 24,
          y: window.innerHeight - windowSize.height - 104
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [windowSize.width, windowSize.height, isFullscreen]);

  // Load saved messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("auction_chat_history");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([
        { 
          role: "bot", 
          text: "👋 Hi! I'm your auction assistant with AI vision. You can attach images and I'll analyze them for auction insights!" 
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

  // Convert image file to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle image selection
  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('Image size should be less than 20MB');
      return;
    }

    try {
      const base64Image = await convertImageToBase64(file);
      setSelectedImage(base64Image);
      setImagePreview({
        url: base64Image,
        name: file.name,
        size: file.size
      });
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Error processing image');
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Parse AI response and create structured data
  const parseImageAnalysis = (response) => {
    // Try to extract structured information from AI response
    const lines = response.split('\n');
    const analysisData = {};
    
    // Common patterns to look for
    const patterns = {
      'Product Type': /(?:Product Type|Type|Item Type):\s*(.+)/i,
      'Category': /(?:Category|Classification):\s*(.+)/i,
      'Primary Use': /(?:Primary Use|Use|Purpose):\s*(.+)/i,
      'Condition': /(?:Condition|State):\s*(.+)/i,
      'Material': /(?:Material|Materials|Made of):\s*(.+)/i,
      'Style/Era': /(?:Style|Era|Period|Time|Age):\s*(.+)/i,
      'Key Features': /(?:Key Features|Features|Notable):\s*(.+)/i,
      'Estimated Value': /(?:Estimated Value|Value|Price|Worth):\s*(.+)/i,
      'Auction Potential': /(?:Auction Potential|Market Appeal|Sellability):\s*(.+)/i,
      'Description': /(?:Description|Summary|Details):\s*(.+)/i
    };

    // Extract data using patterns
    lines.forEach(line => {
      Object.entries(patterns).forEach(([key, pattern]) => {
        const match = line.match(pattern);
        if (match) {
          analysisData[key] = match[1].trim();
        }
      });
    });

    // If no structured data found, create a basic analysis
    if (Object.keys(analysisData).length === 0) {
      return {
        'Analysis': response,
        'AI Response': 'Structured analysis not available - showing raw response'
      };
    }

    return analysisData;
  };

  // Groq Vision API Call with Updated System Prompt
  const callGroqVisionAPI = async (message, imageBase64) => {
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
            content: `You are an expert product analyst for an auction platform. When analyzing images, provide detailed information in a structured format with clear labels. Use this exact format:

Product Type: [Main category/type]
Category: [Specific subcategory]
Primary Use: [Main purpose/function]
Condition: [Estimated condition]
Material: [Main materials used]
Style/Era: [Style or time period]
Key Features: [Notable characteristics]
Estimated Value: [Price range if applicable]
Auction Potential: [High/Medium/Low with brief reason]
Description: [Brief detailed description]

Be specific and accurate. If you cannot determine certain information, indicate "Not clearly visible" or "Cannot determine". Always use the exact label format shown above.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: message || "Please analyze this image and provide detailed product information using the structured format."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        model: GROQ_CONFIG.visionModel,
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Groq Vision API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  // Regular Groq Text API Call
  const callGroqTextAPI = async (message) => {
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
        model: GROQ_CONFIG.textModel,
        max_tokens: 200,
        temperature: 0.7,
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
    if (!input.trim() && !selectedImage) return;

    const userMessage = { 
      role: "user", 
      text: input.trim() || "📷 Image attached for analysis",
      image: imagePreview
    };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = input.trim();
    const currentImage = selectedImage;
    
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsTyping(true);

    try {
      let aiResponse;
      let analysisData = null;

      if (currentImage) {
        aiResponse = await callGroqVisionAPI(currentInput, currentImage);
        analysisData = parseImageAnalysis(aiResponse);
      } else {
        aiResponse = await callGroqTextAPI(currentInput);
      }
      
      const botMessage = {
        role: "bot",
        text: aiResponse,
        analysisData: analysisData,
        isImageAnalysis: !!currentImage
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

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Resize functionality
  const handleMouseDown = useCallback((e, direction) => {
    if (isFullscreen) return;
    
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowSize.width;
    const startHeight = windowSize.height;
    const startPosX = windowPosition.x;
    const startPosY = windowPosition.y;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes('right')) {
        newWidth = Math.max(320, startWidth + deltaX);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(320, startWidth - deltaX);
        newX = startPosX + deltaX;
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(400, startHeight + deltaY);
      }
      if (direction.includes('top')) {
        newHeight = Math.max(400, startHeight - deltaY);
        newY = startPosY + deltaY;
      }

      newWidth = Math.min(newWidth, window.innerWidth - 40);
      newHeight = Math.min(newHeight, window.innerHeight - 40);
      newX = Math.max(20, Math.min(newX, window.innerWidth - newWidth - 20));
      newY = Math.max(20, Math.min(newY, window.innerHeight - newHeight - 20));

      setWindowSize({ width: newWidth, height: newHeight });
      setWindowPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isFullscreen, windowSize, windowPosition]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Component for rendering structured analysis data
  const AnalysisCard = ({ data }) => {
    return (
      <div className="mt-3 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4">
        <div className="flex items-center mb-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
          <h4 className="text-orange-300 font-semibold text-sm">Product Analysis</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row">
              <div className="text-orange-200 font-medium text-xs uppercase tracking-wide mb-1 sm:mb-0 sm:w-24 sm:flex-shrink-0">
                {key}
              </div>
              <div className="text-white text-sm flex-1 bg-black/20 rounded px-2 py-1">
                {value || 'Not specified'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const windowStyle = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
  } : {
    position: 'fixed',
    left: `${windowPosition.x}px`,
    top: `${windowPosition.y}px`,
    width: `${windowSize.width}px`,
    height: `${windowSize.height}px`,
    zIndex: 50,
  };

  return (
    <>
      <div 
        ref={windowRef}
        className={`flex flex-col overflow-hidden border border-orange-500/30 shadow-2xl transition-all duration-200 ${
          isFullscreen ? 'rounded-none' : 'rounded-2xl animate-slideUp'
        }`}
        style={{
          ...windowStyle,
          backgroundColor: '#232326'
        }}
      >
        {/* Resize Handles */}
        {!isFullscreen && (
          <>
            <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'top-left')} />
            <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'top-right')} />
            <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'bottom-left')} />
            <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'bottom-right')} />
            <div className="absolute top-0 left-3 right-3 h-1 cursor-n-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'top')} />
            <div className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'bottom')} />
            <div className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'left')} />
            <div className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'right')} />
          </>
        )}

        {/* Header */}
        <div 
          className={`relative text-white p-4 flex justify-between items-center ${
            isFullscreen ? 'rounded-none' : 'rounded-t-2xl'
          }`}
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white">Auction Assistant</span>
              <span className="text-xs text-orange-300">AI Vision • Resizable</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="text-sm bg-orange-500/20 px-2 py-1 rounded-lg hover:bg-orange-500/30 transition-colors duration-200 border border-orange-500/30 text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? "⤓" : "⤢"}
            </button>
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
              className={`max-w-[85%] rounded-xl transition-colors duration-200 ${
                msg.role === "user"
                  ? "bg-orange-500 text-white ml-auto"
                  : "text-white"
              }`}
              style={{
                backgroundColor: msg.role === "user" ? undefined : '#3c3c3c',
              }}
            >
              {msg.image && (
                <div className="p-3 pb-0">
                  <div className="relative inline-block">
                    <img 
                      src={msg.image.url} 
                      alt={msg.image.name}
                      className="max-w-full max-h-64 rounded-lg border border-orange-300/30 object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {msg.image.name} • {formatFileSize(msg.image.size)}
                    </div>
                  </div>
                </div>
              )}
              <div className="p-3">
                {msg.isImageAnalysis && msg.analysisData ? (
                  <>
                    <div className="whitespace-pre-line mb-2">{msg.text}</div>
                    <AnalysisCard data={msg.analysisData} />
                  </>
                ) : (
                  <div className="whitespace-pre-line">{msg.text}</div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-2 text-orange-300 text-sm italic">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span>{selectedImage ? 'Analyzing image...' : 'AI is thinking...'}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview Chip */}
        {imagePreview && (
          <div className="px-4 pb-2">
            <div className="flex items-center bg-orange-500/20 border border-orange-500/30 rounded-xl p-2 max-w-fit">
              <img 
                src={imagePreview.url} 
                alt="Preview" 
                className="w-12 h-12 rounded-lg object-cover mr-3"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{imagePreview.name}</p>
                <p className="text-orange-300 text-xs">{formatFileSize(imagePreview.size)}</p>
              </div>
              <button
                onClick={removeImage}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
        )}

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
                placeholder={selectedImage ? "Ask about this image..." : "Type or attach an image..."}
                rows={1}
                className="w-full border border-orange-500/30 rounded-xl p-3 pr-10 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                }}
                disabled={isTyping}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-2 top-2 p-1 text-orange-400 hover:text-orange-300 transition-colors duration-200"
                disabled={isTyping}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={(!input.trim() && !selectedImage) || isTyping}
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
    </>
  );
}
