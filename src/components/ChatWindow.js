// "use client";
// import { useState, useRef, useEffect, useCallback } from "react";

// export default function ChatWindow({ onClose }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [windowSize, setWindowSize] = useState({ width: 384, height: 500 });
//   const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
//   const [isResizing, setIsResizing] = useState(false);
//   const [resizeDirection, setResizeDirection] = useState('');
//   const [selectedMode, setSelectedMode] = useState('chat');
//   const [searchDepth, setSearchDepth] = useState('normal');
//   const [dropdownOpen, setDropdownOpen] = useState(false);
  
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const windowRef = useRef(null);

//   // Groq API Configuration
//   const GROQ_CONFIG = {
//     url: "https://api.groq.com/openai/v1/chat/completions",
//     apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
//     visionModel: "meta-llama/llama-4-scout-17b-16e-instruct",
//     textModel: "llama-3.3-70b-versatile"
//   };

//   // Initialize window position
//   useEffect(() => {
//     const updatePosition = () => {
//       if (!isFullscreen) {
//         setWindowPosition({
//           x: window.innerWidth - windowSize.width - 24,
//           y: window.innerHeight - windowSize.height - 104
//         });
//       }
//     };

//     updatePosition();
//     window.addEventListener('resize', updatePosition);
//     return () => window.removeEventListener('resize', updatePosition);
//   }, [windowSize.width, windowSize.height, isFullscreen]);

//   // Load saved messages from localStorage
//   useEffect(() => {
//     const savedMessages = localStorage.getItem("auction_chat_history");
//     if (savedMessages) {
//       setMessages(JSON.parse(savedMessages));
//     } else {
//       setMessages([
//         { 
//           role: "bot", 
//           text: "👋 Hi! I'm your auction assistant with AI vision. You can attach images and I'll analyze them for auction insights! Use Search mode to explore auctions across the web." 
//         },
//       ]);
//     }
//   }, []);

//   // Save messages whenever updated
//   useEffect(() => {
//     if (messages.length > 0) {
//       localStorage.setItem("auction_chat_history", JSON.stringify(messages));
//     }
//   }, [messages]);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Convert image file to base64
//   const convertImageToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   // Handle image selection
//   const handleImageSelect = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       alert('Please select a valid image file');
//       return;
//     }

//     if (file.size > 20 * 1024 * 1024) {
//       alert('Image size should be less than 20MB');
//       return;
//     }

//     try {
//       const base64Image = await convertImageToBase64(file);
//       setSelectedImage(base64Image);
//       setImagePreview({
//         url: base64Image,
//         name: file.name,
//         size: file.size
//       });
//     } catch (error) {
//       console.error('Error converting image:', error);
//       alert('Error processing image');
//     }
//   };

//   // Remove selected image
//   const removeImage = () => {
//     setSelectedImage(null);
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   // Parse AI response and create structured data
//   const parseImageAnalysis = (response) => {
//     const lines = response.split('\n');
//     const analysisData = {};
    
//     const patterns = {
//       'Product Type': /(?:Product Type|Type|Item Type):\s*(.+)/i,
//       'Category': /(?:Category|Classification):\s*(.+)/i,
//       'Primary Use': /(?:Primary Use|Use|Purpose):\s*(.+)/i,
//       'Condition': /(?:Condition|State):\s*(.+)/i,
//       'Material': /(?:Material|Materials|Made of):\s*(.+)/i,
//       'Style/Era': /(?:Style|Era|Period|Time|Age):\s*(.+)/i,
//       'Key Features': /(?:Key Features|Features|Notable):\s*(.+)/i,
//       'Estimated Value': /(?:Estimated Value|Value|Price|Worth):\s*(.+)/i,
//       'Auction Potential': /(?:Auction Potential|Market Appeal|Sellability):\s*(.+)/i,
//       'Description': /(?:Description|Summary|Details):\s*(.+)/i
//     };

//     lines.forEach(line => {
//       Object.entries(patterns).forEach(([key, pattern]) => {
//         const match = line.match(pattern);
//         if (match) {
//           analysisData[key] = match[1].trim();
//         }
//       });
//     });

//     if (Object.keys(analysisData).length === 0) {
//       return {
//         'Analysis': response,
//         'AI Response': 'Structured analysis not available - showing raw response'
//       };
//     }

//     return analysisData;
//   };

//   // Groq Vision API Call
//   const callGroqVisionAPI = async (message, imageBase64) => {
//     const response = await fetch(GROQ_CONFIG.url, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${GROQ_CONFIG.apiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         messages: [
//           {
//             role: "system",
//             content: `You are an expert product analyst for an auction platform. When analyzing images, provide detailed information in a structured format with clear labels. Use this exact format:

// Product Type: [Main category/type]
// Category: [Specific subcategory]
// Primary Use: [Main purpose/function]
// Condition: [Estimated condition]
// Material: [Main materials used]
// Style/Era: [Style or time period]
// Key Features: [Notable characteristics]
// Estimated Value: [Price range if applicable]
// Auction Potential: [High/Medium/Low with brief reason]
// Description: [Brief detailed description]

// Be specific and accurate. If you cannot determine certain information, indicate "Not clearly visible" or "Cannot determine". Always use the exact label format shown above.`
//           },
//           {
//             role: "user",
//             content: [
//               {
//                 type: "text",
//                 text: message || "Please analyze this image and provide detailed product information using the structured format."
//               },
//               {
//                 type: "image_url",
//                 image_url: {
//                   url: imageBase64
//                 }
//               }
//             ]
//           }
//         ],
//         model: GROQ_CONFIG.visionModel,
//         max_tokens: 800,
//         temperature: 0.3,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.text();
//       throw new Error(`Groq Vision API error: ${response.status} - ${errorData}`);
//     }

//     const data = await response.json();
//     return data.choices[0].message.content;
//   };

//   // Regular Groq Text API Call
//   const callGroqTextAPI = async (message) => {
//     const response = await fetch(GROQ_CONFIG.url, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${GROQ_CONFIG.apiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         messages: [
//           {
//             role: "system",
//             content: "You are a helpful auction assistant. Provide concise, friendly responses about auctions, bidding, item valuations, and related topics. Keep responses under 150 words and be professional yet approachable."
//           },
//           {
//             role: "user",
//             content: message
//           }
//         ],
//         model: GROQ_CONFIG.textModel,
//         max_tokens: 200,
//         temperature: 0.7,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.text();
//       throw new Error(`Groq API error: ${response.status} - ${errorData}`);
//     }

//     const data = await response.json();
//     return data.choices[0].message.content;
//   };

//   // Call Search API with deep/normal search
//   const callSearchAPI = async (message, searchType = 'normal') => {
//     const response = await fetch('/api/search', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ 
//         query: message,
//         searchType: searchType
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.error || `Search error: ${response.status}`);
//     }

//     const data = await response.json();
    
//     if (!data.success) {
//       throw new Error(data.error || 'Search failed');
//     }

//     return {
//       response: data.response,
//       searchResults: data.searchResults,
//       sourceAttribution: data.sourceAttribution
//     };
//   };

//   // Handle sending a message
//   const sendMessage = async () => {
//     if (!input.trim() && !selectedImage) return;

//     const userMessage = { 
//       role: "user", 
//       text: input.trim() || "📷 Image attached for analysis",
//       image: imagePreview
//     };
//     setMessages((prev) => [...prev, userMessage]);
    
//     const currentInput = input.trim();
//     const currentImage = selectedImage;
//     const modeAtSend = selectedMode;
//     const depthAtSend = searchDepth;
    
//     setInput("");
//     setSelectedImage(null);
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//     setIsTyping(true);

//     try {
//       let aiResponse;
//       let analysisData = null;
//       let searchResults = null;
//       let sourceAttribution = null;

//       // SEARCH MODE with deep/normal search
//       if (modeAtSend === 'search' && !currentImage) {
//         const searchData = await callSearchAPI(currentInput, depthAtSend);
//         aiResponse = searchData.response;
//         searchResults = searchData.searchResults;
//         sourceAttribution = searchData.sourceAttribution;
//       } 
//       // VISION MODE - Image analysis
//       else if (currentImage) {
//         aiResponse = await callGroqVisionAPI(currentInput, currentImage);
//         analysisData = parseImageAnalysis(aiResponse);
//       } 
//       // CHAT MODE - Regular conversation
//       else {
//         aiResponse = await callGroqTextAPI(currentInput);
//       }
      
//       const botMessage = {
//         role: "bot",
//         text: aiResponse,
//         analysisData: analysisData,
//         searchResults: searchResults,
//         sourceAttribution: sourceAttribution,
//         isImageAnalysis: !!currentImage,
//         isSearchMode: modeAtSend === 'search' && !currentImage
//       };

//       setTimeout(() => {
//         setMessages((prev) => [...prev, botMessage]);
//         setIsTyping(false);
//       }, 500);
//     } catch (error) {
//       const errorMessage = {
//         role: "bot",
//         text: `❌ Sorry, I encountered an error: ${error.message}. Please try again.`,
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//       setIsTyping(false);
//       console.error('Error:', error);
//     }
//   };

//   // Handle Enter key
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Clear chat history
//   const clearChat = () => {
//     localStorage.removeItem("auction_chat_history");
//     setMessages([{ 
//       role: "bot", 
//       text: "🗑 Chat cleared. How can I assist you with auctions today?" 
//     }]);
//   };

//   // Toggle fullscreen
//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen);
//   };

//   // Resize functionality
//   const handleMouseDown = useCallback((e, direction) => {
//     if (isFullscreen) return;
    
//     e.preventDefault();
//     setIsResizing(true);
//     setResizeDirection(direction);

//     const startX = e.clientX;
//     const startY = e.clientY;
//     const startWidth = windowSize.width;
//     const startHeight = windowSize.height;
//     const startPosX = windowPosition.x;
//     const startPosY = windowPosition.y;

//     const handleMouseMove = (e) => {
//       const deltaX = e.clientX - startX;
//       const deltaY = e.clientY - startY;

//       let newWidth = startWidth;
//       let newHeight = startHeight;
//       let newX = startPosX;
//       let newY = startPosY;

//       if (direction.includes('right')) {
//         newWidth = Math.max(320, startWidth + deltaX);
//       }
//       if (direction.includes('left')) {
//         newWidth = Math.max(320, startWidth - deltaX);
//         newX = startPosX + deltaX;
//       }
//       if (direction.includes('bottom')) {
//         newHeight = Math.max(400, startHeight + deltaY);
//       }
//       if (direction.includes('top')) {
//         newHeight = Math.max(400, startHeight - deltaY);
//         newY = startPosY + deltaY;
//       }

//       newWidth = Math.min(newWidth, window.innerWidth - 40);
//       newHeight = Math.min(newHeight, window.innerHeight - 40);
//       newX = Math.max(20, Math.min(newX, window.innerWidth - newWidth - 20));
//       newY = Math.max(20, Math.min(newY, window.innerHeight - newHeight - 20));

//       setWindowSize({ width: newWidth, height: newHeight });
//       setWindowPosition({ x: newX, y: newY });
//     };

//     const handleMouseUp = () => {
//       setIsResizing(false);
//       setResizeDirection('');
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };

//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);
//   }, [isFullscreen, windowSize, windowPosition]);

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   // Component for rendering structured analysis data
//   const AnalysisCard = ({ data }) => {
//     return (
//       <div className="mt-3 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4">
//         <div className="flex items-center mb-3">
//           <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
//           <h4 className="text-orange-300 font-semibold text-sm">Product Analysis</h4>
//         </div>
//         <div className="grid grid-cols-1 gap-3">
//           {Object.entries(data).map(([key, value]) => (
//             <div key={key} className="flex flex-col sm:flex-row">
//               <div className="text-orange-200 font-medium text-xs uppercase tracking-wide mb-1 sm:mb-0 sm:w-24 sm:flex-shrink-0">
//                 {key}
//               </div>
//               <div className="text-white text-sm flex-1 bg-black/20 rounded px-2 py-1">
//                 {value || 'Not specified'}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Component for rendering search results
//   const SearchResultsCard = ({ results, sourceAttribution }) => {
//     if (!results || results.length === 0) return null;
    
//     return (
//       <div className="mt-3 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
//         <div className="flex items-center mb-3 justify-between flex-wrap gap-2">
//           <div className="flex items-center">
//             <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
//             <h4 className="text-green-300 font-semibold text-sm">Web Search Results</h4>
//           </div>
//           {sourceAttribution && (
//             <span className="text-green-400 text-xs">{sourceAttribution}</span>
//           )}
//         </div>
//         <div className="space-y-2">
//           {results.slice(0, 3).map((result, idx) => (
//             <a
//               key={idx}
//               href={result.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="block bg-black/20 rounded-lg p-2 hover:bg-green-500/20 transition-colors cursor-pointer"
//             >
//               <div className="text-green-200 font-medium text-xs mb-1 truncate">
//                 [{idx + 1}] {result.title}
//               </div>
//               <div className="text-gray-400 text-xs truncate">
//                 🔗 {result.url}
//               </div>
//             </a>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const windowStyle = isFullscreen ? {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100vw',
//     height: '100vh',
//     zIndex: 9999,
//   } : {
//     position: 'fixed',
//     left: `${windowPosition.x}px`,
//     top: `${windowPosition.y}px`,
//     width: `${windowSize.width}px`,
//     height: `${windowSize.height}px`,
//     zIndex: 50,
//   };

//   return (
//     <>
//       <div 
//         ref={windowRef}
//         className={`flex flex-col overflow-hidden border border-orange-500/30 shadow-2xl transition-all duration-200 ${
//           isFullscreen ? 'rounded-none' : 'rounded-2xl animate-slideUp'
//         }`}
//         style={{
//           ...windowStyle,
//           backgroundColor: '#232326'
//         }}
//       >
//         {/* Resize Handles */}
//         {!isFullscreen && (
//           <>
//             <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'top-left')} />
//             <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'top-right')} />
//             <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'bottom-left')} />
//             <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'bottom-right')} />
//             <div className="absolute top-0 left-3 right-3 h-1 cursor-n-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'top')} />
//             <div className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'bottom')} />
//             <div className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'left')} />
//             <div className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'right')} />
//           </>
//         )}

//         {/* Header */}
//         <div 
//           className={`relative text-white p-4 flex justify-between items-center ${
//             isFullscreen ? 'rounded-none' : 'rounded-t-2xl'
//           }`}
//           style={{ backgroundColor: '#1a1a1a' }}
//         >
//           <div className="flex items-center space-x-2">
//             <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
//             <div className="flex flex-col">
//               <span className="font-bold text-sm text-white">Auction Assistant</span>
//               <span className="text-xs text-orange-300">AI Vision • Search • Resizable</span>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={toggleFullscreen}
//               className="text-sm bg-orange-500/20 px-2 py-1 rounded-lg hover:bg-orange-500/30 transition-colors duration-200 border border-orange-500/30 text-white"
//               title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
//             >
//               {isFullscreen ? "⤓" : "⤢"}
//             </button>
//             <button
//               onClick={clearChat}
//               className="text-sm bg-orange-500/20 px-2 py-1 rounded-lg hover:bg-orange-500/30 transition-colors duration-200 border border-orange-500/30 text-white"
//             >
//               🗑️
//             </button>
//             <button 
//               onClick={onClose} 
//               className="text-lg hover:text-orange-400 transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-orange-500/20 text-white"
//             >
//               ✖
//             </button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-orange-scrollbar">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`max-w-[85%] rounded-xl transition-colors duration-200 ${
//                 msg.role === "user"
//                   ? "bg-orange-500 text-white ml-auto"
//                   : "text-white"
//               }`}
//               style={{
//                 backgroundColor: msg.role === "user" ? undefined : '#3c3c3c',
//               }}
//             >
//               {msg.image && (
//                 <div className="p-3 pb-0">
//                   <div className="relative inline-block">
//                     <img 
//                       src={msg.image.url} 
//                       alt={msg.image.name}
//                       className="max-w-full max-h-64 rounded-lg border border-orange-300/30 object-cover"
//                     />
//                     <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       {msg.image.name} • {formatFileSize(msg.image.size)}
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div className="p-3">
//                 {msg.isImageAnalysis && msg.analysisData ? (
//                   <AnalysisCard data={msg.analysisData} />
//                 ) : msg.isSearchMode && msg.searchResults ? (
//                   <>
//                     <div className="whitespace-pre-line mb-2">{msg.text}</div>
//                     <SearchResultsCard results={msg.searchResults} sourceAttribution={msg.sourceAttribution} />
//                   </>
//                 ) : (
//                   <div className="whitespace-pre-line">{msg.text}</div>
//                 )}
//               </div>
//             </div>
//           ))}
          
//           {isTyping && (
//             <div className="flex items-center space-x-2 text-orange-300 text-sm italic">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
//                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//               </div>
//               <span>{selectedMode === 'search' ? 'Searching...' : selectedImage ? 'Analyzing image...' : 'AI is thinking...'}</span>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Image Preview Chip */}
//         {imagePreview && (
//           <div className="px-4 pb-2">
//             <div className="flex items-center bg-orange-500/20 border border-orange-500/30 rounded-xl p-2 max-w-fit">
//               <img 
//                 src={imagePreview.url} 
//                 alt="Preview" 
//                 className="w-12 h-12 rounded-lg object-cover mr-3"
//               />
//               <div className="flex-1 min-w-0">
//                 <p className="text-white text-sm font-medium truncate">{imagePreview.name}</p>
//                 <p className="text-orange-300 text-xs">{formatFileSize(imagePreview.size)}</p>
//               </div>
//               <button
//                 onClick={removeImage}
//                 className="ml-2 bg-red-500 hover:bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Deep Search Toggle (only in search mode) */}
//         {selectedMode === 'search' && (
//           <div className="px-4 py-2 bg-orange-500/10 border-t border-orange-500/20">
//             <label className="flex items-center text-xs text-orange-200 cursor-pointer hover:text-orange-100 transition-colors">
//               <input
//                 type="checkbox"
//                 checked={searchDepth === 'deep'}
//                 onChange={(e) => setSearchDepth(e.target.checked ? 'deep' : 'normal')}
//                 className="w-4 h-4 mr-2 accent-orange-500"
//               />
//               <span>🔍 Deep Search (slower, more engines, more results)</span>
//             </label>
//           </div>
//         )}

//         {/* Input */}
//         <div 
//           className="relative p-4 border-t border-orange-500/30"
//           style={{ backgroundColor: '#232326' }}
//         >
//           <div className="flex items-end space-x-3">
//             <div className="flex-1 relative">
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-orange-400 hover:text-orange-300 transition-colors duration-200 z-10"
//                 title="Select Mode"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-lg z-20 border border-orange-500/30">
//                   <button
//                     onClick={() => { setSelectedMode('chat'); setDropdownOpen(false); }}
//                     className={`block w-full text-left px-4 py-2 text-sm rounded-t-lg transition-colors ${
//                       selectedMode === 'chat' ? 'bg-orange-600 text-white' : 'text-gray-200 hover:bg-gray-700'
//                     }`}
//                   >
//                     💬 Chat
//                   </button>
//                   <button
//                     onClick={() => { setSelectedMode('search'); setDropdownOpen(false); }}
//                     className={`block w-full text-left px-4 py-2 text-sm rounded-b-lg transition-colors ${
//                       selectedMode === 'search' ? 'bg-orange-600 text-white' : 'text-gray-200 hover:bg-gray-700'
//                     }`}
//                   >
//                     🔍 Search
//                   </button>
//                 </div>
//               )}

//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 placeholder={selectedMode === 'search' ? "Search auctions..." : (selectedImage ? "Ask about this image..." : "Type or attach an image...")}
//                 rows={1}
//                 className="w-full border border-orange-500/30 rounded-xl p-3 pl-12 pr-10 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
//                 style={{
//                   backgroundColor: 'rgba(255, 152, 0, 0.1)',
//                 }}
//                 disabled={isTyping}
//               />
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="absolute right-2 top-2 p-1 text-orange-400 hover:text-orange-300 transition-colors duration-200"
//                 disabled={isTyping || selectedMode === 'search'}
//                 title={selectedMode === 'search' ? "Images not supported in Search mode" : "Attach image"}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
//                 </svg>
//               </button>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageSelect}
//                 className="hidden"
//               />
//             </div>
//             <button
//               onClick={sendMessage}
//               disabled={(!input.trim() && !selectedImage) || isTyping}
//               className="text-white p-3 rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 background: 'linear-gradient(135deg, #f97316 0%, #facc15 50%, #ef4444 100%)',
//               }}
//             >
//               <svg className="w-5 h-5 transform rotate-45" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import chatStorage from "@/lib/chatStorage";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 450, height: 600 });
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [selectedMode, setSelectedMode] = useState('chat');
  const [deepSearch, setDeepSearch] = useState(false);
  
  // Session management
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const windowRef = useRef(null);
  const dragCounter = useRef(0);

  const API_CONFIG = { url: "/api/chat" };

  // Initialize: Load or create session
  useEffect(() => {
    initializeChatStorage();
  }, []);

  const initializeChatStorage = async () => {
    try {
      await chatStorage.init();
      const allSessions = await chatStorage.getAllSessions();
      
      if (allSessions.length > 0) {
        // Load most recent session
        const latestSession = allSessions[0];
        setCurrentSessionId(latestSession.id);
        setMessages(latestSession.messages);
        setSessions(allSessions);
      } else {
        // Create first session
        const newSession = await chatStorage.createSession("New Chat");
        setCurrentSessionId(newSession.id);
        setMessages([{ 
          role: "bot", 
          text: "👋 Hi! I'm your RockMyAuction assistant. Upload images for auction analysis or search for market info!" 
        }]);
        setSessions([newSession]);
      }
      
      setIsLoadingSessions(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error('IndexedDB init error:', error);
      setIsLoadingSessions(false);
      setMessages([{ role: "bot", text: "⚠️ Storage unavailable. Chat won't be saved." }]);
    }
  };

  // Auto-save messages when they change
  useEffect(() => {
    if (currentSessionId && messages.length > 0 && !isLoadingSessions) {
      saveCurrentSession();
    }
  }, [messages]);

  const saveCurrentSession = async () => {
    try {
      if (messages.length === 0) return;
      
      await chatStorage.updateSession(currentSessionId, { messages });
      
      // Refresh sessions list
      const allSessions = await chatStorage.getAllSessions();
      setSessions(allSessions);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // Create new chat
  const createNewChat = async () => {
    try {
      const newSession = await chatStorage.createSession("New Chat");
      setCurrentSessionId(newSession.id);
      setMessages([{ role: "bot", text: "👋 New chat started! How can I help?" }]);
      
      const allSessions = await chatStorage.getAllSessions();
      setSessions(allSessions);
      setShowSessionDropdown(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error('Create session error:', error);
    }
  };

  // Switch to different chat
  const switchToSession = async (sessionId) => {
    try {
      const session = await chatStorage.getSession(sessionId);
      if (session) {
        setCurrentSessionId(session.id);
        setMessages(session.messages);
        setShowSessionDropdown(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } catch (error) {
      console.error('Switch session error:', error);
    }
  };

  // Delete chat
  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    try {
      await chatStorage.deleteSession(sessionId);
      const allSessions = await chatStorage.getAllSessions();
      setSessions(allSessions);
      
      // If deleted current session, switch to another or create new
      if (sessionId === currentSessionId) {
        if (allSessions.length > 0) {
          switchToSession(allSessions[0].id);
        } else {
          createNewChat();
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mobile-responsive window positioning
  useEffect(() => {
    const updatePosition = () => {
      if (!isFullscreen) {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          // Mobile: centered with padding
          setWindowSize({ 
            width: Math.min(window.innerWidth - 20, 450), 
            height: window.innerHeight - 40 
          });
          setWindowPosition({ 
            x: (window.innerWidth - Math.min(window.innerWidth - 20, 450)) / 2, 
            y: 20 
          });
        } else {
          // Desktop: bottom-right
          setWindowPosition({
            x: Math.max(20, window.innerWidth - windowSize.width - 40),
            y: Math.max(20, window.innerHeight - windowSize.height - 120)
          });
        }
      }
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [windowSize, isFullscreen]);

  const compressImageFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDimension = 2048;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob.size > 10 * 1024 * 1024) {
                reject(new Error('Image too large'));
                return;
              }
              const compressedReader = new FileReader();
              compressedReader.onload = () => resolve(compressedReader.result);
              compressedReader.onerror = reject;
              compressedReader.readAsDataURL(blob);
            },
            'image/jpeg',
            0.85
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image');
      return;
    }
    try {
      const base64Image = await compressImageFile(file);
      setSelectedImage(base64Image);
      setImagePreview({ url: base64Image, name: file.name, size: file.size });
      setShowImageOptions(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      alert(error.message || 'Error processing image');
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) await handleImageFile(file);
  };
  
  // Handle paste events for clipboard images
  const handlePaste = async (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        await handleImageFile(blob);
        event.preventDefault();
        return;
      }
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) await handleImageFile(files[0]);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
        setShowImageOptions(false);
      }
    } catch (error) {
      alert('Camera access denied');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'camera.jpg', { type: 'image/jpeg' });
        await handleImageFile(file);
        stopCamera();
      }, 'image/jpeg', 0.85);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = { role: "user", text: input.trim() || "📷 Image", image: imagePreview };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input.trim();
    const currentImage = selectedImage;
    const currentMode = selectedMode;
    const useDeep = deepSearch;
    
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsTyping(true);
    setTimeout(() => inputRef.current?.focus(), 50);

    try {
      // Get last 10 messages for context
      const conversationHistory = messages.slice(-10).map(msg => ({ 
        role: msg.role, 
        text: msg.text 
      }));

      const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          image: currentImage,
          mode: useDeep ? 'deep_search' : currentMode,
          history: conversationHistory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      
      const botMsg = {
        role: "bot",
        text: data.response,
        citations: data.citations || [],
        hasGrounding: data.hasGrounding
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 300);
      
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: "bot", text: `❌ ${error.message}` }]);
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearCurrentChat = async () => {
    if (currentSessionId) {
      await deleteSession(currentSessionId, { stopPropagation: () => {} });
    }
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleMouseDown = useCallback((e, direction) => {
    if (isFullscreen || window.innerWidth < 768) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowSize.width;
    const startHeight = windowSize.height;
    const startPosX = windowPosition.x;
    const startPosY = windowPosition.y;

    const handleMouseMove = (e) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes('right')) newWidth = Math.max(320, startWidth + (e.clientX - startX));
      if (direction.includes('left')) { newWidth = Math.max(320, startWidth - (e.clientX - startX)); newX = startPosX + (e.clientX - startX); }
      if (direction.includes('bottom')) newHeight = Math.max(400, startHeight + (e.clientY - startY));
      if (direction.includes('top')) { newHeight = Math.max(400, startHeight - (e.clientY - startY)); newY = startPosY + (e.clientY - startY); }

      newWidth = Math.min(newWidth, window.innerWidth - 40);
      newHeight = Math.min(newHeight, window.innerHeight - 40);
      newX = Math.max(20, Math.min(newX, window.innerWidth - newWidth - 20));
      newY = Math.max(20, Math.min(newY, window.innerHeight - newHeight - 20));

      setWindowSize({ width: newWidth, height: newHeight });
      setWindowPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isFullscreen, windowSize, windowPosition]);

  const CitationLinks = ({ citations }) => {
    if (!citations || citations.length === 0) return null;
    return (
      <div className="mt-3 pt-3 border-t border-gray-700">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">📚 Sources:</h4>
        <div className="space-y-1.5">
          {citations.slice(0, 5).map((citation, idx) => (
            <a key={idx} href={citation.url} target="_blank" rel="noopener noreferrer" className="block p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition text-xs">
              <div className="text-cyan-300 font-medium mb-0.5 line-clamp-1 text-xs">{idx + 1}. {citation.title}</div>
              {citation.snippet && <div className="text-gray-400 line-clamp-2 text-xs">{citation.snippet}</div>}
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    lines.forEach((line, i) => {
      if (line.trim().match(/^##\s*[\u{1F300}-\u{1F9FF}]/u)) {
        elements.push(<h3 key={`h-${i}`} className="font-bold text-emerald-300 text-sm sm:text-base mt-3 mb-2">{line.replace(/^##\s*/, '')}</h3>);
      } else if (line.trim().startsWith('•')) {
        elements.push(<div key={`b-${i}`} className="text-gray-100 text-xs sm:text-sm ml-2 mb-1.5 leading-relaxed">{line}</div>);
      } else if (line.trim() === '---') {
        elements.push(<hr key={`hr-${i}`} className="my-2 border-gray-600" />);
      } else if (line.trim()) {
        elements.push(<p key={`p-${i}`} className="text-gray-100 text-xs sm:text-sm mb-2 leading-relaxed">{line}</p>);
      }
    });
    return elements;
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const windowStyle = isFullscreen ? {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999
  } : {
    position: 'fixed', 
    left: `${windowPosition.x}px`, 
    top: `${windowPosition.y}px`,
    width: `${windowSize.width}px`, 
    height: `${windowSize.height}px`, 
    zIndex: 50
  };

  return (
    <div ref={windowRef} className={`flex flex-col overflow-hidden border border-orange-500/30 shadow-2xl transition-all ${isFullscreen ? 'rounded-none' : 'rounded-xl sm:rounded-2xl'}`} style={{ ...windowStyle, backgroundColor: '#1a1a1d' }} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
      {isDragging && (
        <div className="absolute inset-0 bg-orange-500/20 border-4 border-dashed border-orange-500 rounded-xl z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="text-white text-center">
            <div className="text-3xl sm:text-4xl mb-2">📁</div>
            <div className="text-lg sm:text-xl font-bold">Drop image here</div>
          </div>
        </div>
      )}

      {!isFullscreen && !isMobile && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'top-left')} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'top-right')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'bottom-left')} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-10" onMouseDown={(e) => handleMouseDown(e, 'bottom-right')} />
        </>
      )}

      <div className={`relative bg-gradient-to-r from-orange-600 to-orange-700 text-white p-2 sm:p-3 flex justify-between items-center ${isFullscreen ? '' : 'rounded-t-xl sm:rounded-t-2xl'}`}>
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-xs sm:text-sm truncate">RockMyAuction</div>
            <div className="text-[10px] sm:text-xs text-orange-100 truncate">AI Auction Assistant</div>
          </div>
        </div>
        
        <div className="flex gap-1 items-center relative">
          <button onClick={() => setShowSessionDropdown(!showSessionDropdown)} className="px-1.5 sm:px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition flex items-center gap-1" title="Chat Sessions">
            <span className="hidden sm:inline">💬</span>
            <span className="text-[10px] sm:text-xs">{sessions.length}</span>
          </button>
          <button onClick={toggleFullscreen} className="px-1.5 sm:px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition hidden sm:block">{isFullscreen ? "⤓" : "⤢"}</button>
          <button onClick={clearCurrentChat} className="px-1.5 sm:px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition">🗑️</button>
          <button onClick={onClose} className="px-1.5 sm:px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition">✕</button>
          
          {showSessionDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-2 min-w-[200px] max-w-[280px] max-h-[400px] overflow-y-auto z-50">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700">
                <h4 className="text-xs font-semibold text-white">Chat Sessions</h4>
                <button onClick={createNewChat} className="px-2 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs text-white transition">+ New</button>
              </div>
              {sessions.map(session => (
                <div key={session.id} onClick={() => switchToSession(session.id)} className={`p-2 rounded-lg mb-1 cursor-pointer transition group ${session.id === currentSessionId ? 'bg-orange-600/20 border border-orange-500/30' : 'hover:bg-gray-700'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white font-medium truncate">{session.title || 'Untitled Chat'}</div>
                      <div className="text-[10px] text-gray-400">{formatDate(session.lastUpdated)}</div>
                    </div>
                    <button onClick={(e) => deleteSession(session.id, e)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs transition">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 bg-gray-900">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[92%] sm:max-w-[90%] rounded-xl sm:rounded-2xl overflow-hidden ${msg.role === 'user' ? 'bg-orange-500 text-white ml-auto' : 'bg-gray-800 text-white border border-gray-700'}`}>
            {msg.image && (
              <div className="p-2 sm:p-3 pb-0">
                <img src={msg.image.url} alt={msg.image.name} className="max-w-full max-h-40 sm:max-h-56 rounded-lg border border-gray-600" />
              </div>
            )}
            <div className="p-2 sm:p-4 space-y-1 sm:space-y-2">
              <div className="text-xs sm:text-sm">{renderFormattedText(msg.text)}</div>
              {msg.citations && msg.citations.length > 0 && <CitationLinks citations={msg.citations} />}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-orange-400 text-xs sm:text-sm">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
            </div>
            <span>Analyzing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showCamera && (
        <div className="absolute inset-0 bg-black z-40 flex flex-col">
          <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-900">
            <div className="text-white font-bold text-sm sm:text-base">Camera</div>
            <button onClick={stopCamera} className="px-2 sm:px-3 py-1 bg-red-500 rounded text-white text-xs sm:text-sm hover:bg-red-600 transition">Cancel</button>
          </div>
          <div className="flex-1 relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <button onClick={capturePhoto} className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full border-4 border-orange-500 hover:bg-orange-100 transition shadow-lg"></button>
          </div>
          <canvas ref={canvasRef} style={{display:'none'}} />
        </div>
      )}

      {imagePreview && (
        <div className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center bg-orange-500/20 border border-orange-500/30 rounded-lg sm:rounded-xl p-1.5 sm:p-2">
            <img src={imagePreview.url} alt="Preview" className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover mr-2 border border-orange-400/50" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-[10px] sm:text-xs font-medium truncate">{imagePreview.name}</p>
              <p className="text-orange-300 text-[10px] sm:text-xs">{formatFileSize(imagePreview.size)}</p>
            </div>
            <button onClick={removeImage} className="ml-2 bg-red-500 hover:bg-red-600 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white text-xs transition">✕</button>
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-800 border-t border-gray-700">
          <label className="flex items-center text-[10px] sm:text-xs text-orange-200 cursor-pointer hover:text-orange-100 transition">
            <input type="checkbox" checked={deepSearch} onChange={(e) => setDeepSearch(e.target.checked)} className="w-3 h-3 sm:w-4 sm:h-4 mr-2 accent-orange-500" />
            <span className="font-medium">🔍 Deep Web Search</span>
          </label>
        </div>
      )}

      {!imagePreview && (
        <div className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-800 border-t border-gray-700 flex gap-1.5 sm:gap-2">
          <button onClick={() => setSelectedMode('chat')} className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition ${selectedMode === 'chat' ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>💬 Chat</button>
          <button onClick={() => setSelectedMode('search')} className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition ${selectedMode === 'search' ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>🔍 Search</button>
        </div>
      )}

      <div className="p-2 sm:p-4 bg-gray-900 border-t border-gray-700">
        <div className="flex items-end gap-1.5 sm:gap-2">
          <div className="relative">
            <button onClick={() => setShowImageOptions(!showImageOptions)} className="p-2 sm:p-2.5 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition shadow-md" disabled={isTyping}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            {showImageOptions && (
              <div className="absolute bottom-full left-0 mb-2 bg-gray-800 border border-gray-600 rounded-lg sm:rounded-xl shadow-2xl p-1.5 sm:p-2 min-w-[140px] sm:min-w-[160px]">
                <button onClick={() => { fileInputRef.current?.click(); setShowImageOptions(false); }} className="w-full text-left px-2 sm:px-3 py-2 text-xs sm:text-sm text-white hover:bg-gray-700 rounded-lg flex items-center gap-2 sm:gap-3 transition">
                  <span className="text-base sm:text-lg">📁</span>
                  <span className="font-medium">Browse</span>
                </button>
                <button onClick={startCamera} className="w-full text-left px-2 sm:px-3 py-2 text-xs sm:text-sm text-white hover:bg-gray-700 rounded-lg flex items-center gap-2 sm:gap-3 transition">
                  <span className="text-base sm:text-lg">📷</span>
                  <span className="font-medium">Camera</span>
                </button>
              </div>
            )}
          </div>
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} onPaste={handlePaste} placeholder={imagePreview ? "Describe or ask..." : selectedMode === 'search' ? "Search auctions..." : "Ask me anything..."} rows={1} className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 text-white text-xs sm:text-sm placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" disabled={isTyping} />
          <button onClick={sendMessage} disabled={(!input.trim() && !selectedImage) || isTyping} className="p-2 sm:p-2.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transform rotate-45" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  );
}
