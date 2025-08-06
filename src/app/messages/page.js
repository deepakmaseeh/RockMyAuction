'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserRole } from '@/contexts/RoleContext'

// Mock conversations data
const mockConversations = [
  {
    id: 1,
    recipient: {
      name: 'Sarah Johnson',
      avatar: 'SJ',
      status: 'online'
    },
    item: {
      title: 'Vintage Rolex Datejust',
      image: '/auctions/watch1.jpg'
    },
    lastMessage: 'Thanks for the quick response! When can we arrange pickup?',
    lastActive: '2 minutes ago',
    unreadCount: 2,
    messages: [
      { 
        id: 1, 
        sender: 'Sarah Johnson', 
        content: 'Hi! I\'m interested in your Rolex listing. Is it still available?', 
        time: '2 hours ago',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      { 
        id: 2, 
        sender: 'You', 
        content: 'Yes, it\'s still available! The condition is excellent and comes with original box and papers.', 
        time: '1 hour ago',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      { 
        id: 3, 
        sender: 'Sarah Johnson', 
        content: 'Perfect! I\'d like to schedule a viewing. Are you available this weekend?', 
        time: '45 minutes ago',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      { 
        id: 4, 
        sender: 'You', 
        content: 'Sure! I\'m free Saturday afternoon. We can meet at a public location if you prefer.', 
        time: '30 minutes ago',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      { 
        id: 5, 
        sender: 'Sarah Johnson', 
        content: 'Thanks for the quick response! When can we arrange pickup?', 
        time: '2 minutes ago',
        timestamp: new Date(Date.now() - 2 * 60 * 1000)
      }
    ]
  },
  {
    id: 2,
    recipient: {
      name: 'Mike Chen',
      avatar: 'MC',
      status: 'offline'
    },
    item: {
      title: 'KAWS Companion Figure',
      image: '/auctions/kaws.jpg'
    },
    lastMessage: 'Can you provide authenticity certificate?',
    lastActive: '1 hour ago',
    unreadCount: 0,
    messages: [
      { 
        id: 1, 
        sender: 'Mike Chen', 
        content: 'Hello! I noticed your KAWS figure. Can you provide more details about its authenticity?', 
        time: '3 hours ago',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      { 
        id: 2, 
        sender: 'You', 
        content: 'Hi Mike! Yes, it comes with original receipt and authenticity card from the gallery.', 
        time: '2 hours ago',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      { 
        id: 3, 
        sender: 'Mike Chen', 
        content: 'Can you provide authenticity certificate?', 
        time: '1 hour ago',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 3,
    recipient: {
      name: 'Emma Wilson',
      avatar: 'EW',
      status: 'online'
    },
    item: {
      title: 'Air Jordan 1 Chicago',
      image: '/auctions/jordan.jpg'
    },
    lastMessage: 'What size are these?',
    lastActive: '5 minutes ago',
    unreadCount: 1,
    messages: [
      { 
        id: 1, 
        sender: 'Emma Wilson', 
        content: 'Hi! Love these Jordans. What size are these?', 
        time: '5 minutes ago',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      }
    ]
  }
]

// Mobile-optimized Conversation Item Component
function ConversationItem({ conversation, isSelected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-3 sm:p-4 border-b border-[#232326] cursor-pointer hover:bg-[#232326] active:bg-[#2a2a2e] transition touch-manipulation ${
        isSelected ? 'bg-[#232326] border-l-4 border-l-orange-500' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
            {conversation.recipient.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-[#18181B] ${
            conversation.recipient.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-white truncate text-sm sm:text-base">{conversation.recipient.name}</h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400">{conversation.lastActive}</span>
              {conversation.unreadCount > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 truncate mb-2">{conversation.lastMessage}</p>
          <div className="flex items-center gap-2">
            <img 
              src={conversation.item.image} 
              alt={conversation.item.title}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded object-cover flex-shrink-0"
              loading="lazy"
            />
            <span className="text-xs text-gray-500 truncate">{conversation.item.title}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile-optimized Message Bubble Component
function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex mb-3 sm:mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-[70%] p-2.5 sm:p-3 rounded-lg ${
        isOwn 
          ? 'bg-orange-500 text-white rounded-br-none' 
          : 'bg-[#232326] text-gray-100 rounded-bl-none'
      }`}>
        <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
        <span className={`text-xs mt-1 block ${
          isOwn ? 'text-orange-100' : 'text-gray-400'
        }`}>
          {message.time}
        </span>
      </div>
    </div>
  )
}

// Main Messages Page Component
export default function MessagesPage() {
  const router = useRouter()
  const { user } = useUserRole()
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setShowSidebar(!selectedConversation)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [selectedConversation])

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  // Select conversation
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    )
    
    // Hide sidebar on mobile when conversation is selected
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  // Back to conversations (mobile)
  const handleBackToConversations = () => {
    setSelectedConversation(null)
    setShowSidebar(true)
  }

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message = {
      id: Date.now(),
      sender: 'You',
      content: newMessage.trim(),
      time: 'Just now',
      timestamp: new Date()
    }

    // Update conversations
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: message.content,
            lastActive: 'Just now'
          }
        }
        return conv
      })
    )

    // Update selected conversation
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: message.content,
      lastActive: 'Just now'
    }))

    setNewMessage('')
  }

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Simulate typing indicator
  useEffect(() => {
    if (newMessage) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [newMessage])

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Mobile-optimized Header */}
      <div className="bg-[#18181B] border-b border-[#232326]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-lg sm:text-2xl font-bold text-orange-500 flex items-center gap-2">
              <span>🏺</span>
              <span className="hidden sm:inline">Rock the Auction</span>
              <span className="sm:hidden">RMA</span>
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition text-sm sm:text-base">
              <span className="hidden sm:inline">← Back to Dashboard</span>
              <span className="sm:hidden">← Back</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] flex">
        {/* Mobile-responsive Conversations Sidebar */}
        <div className={`${
          isMobile 
            ? `fixed inset-0 z-40 bg-[#18181B] transform transition-transform duration-300 ${
                showSidebar ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'w-1/3 bg-[#18181B] border-r border-[#232326]'
        } flex flex-col`}>
          
          {/* Mobile header for conversations */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b border-[#232326]">
              <h2 className="text-lg font-semibold">Messages</h2>
              <span className="text-sm text-gray-400">
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} unread
              </span>
            </div>
          )}

          {/* Search */}
          <div className="p-3 sm:p-4 border-b border-[#232326]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-2.5 sm:py-3 pl-10 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-400">
                <div className="text-3xl sm:text-4xl mb-4">💬</div>
                <p className="text-sm sm:text-base">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation?.id === conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${isMobile && showSidebar ? 'hidden' : 'flex'}`}>
          {selectedConversation ? (
            <>
              {/* Mobile-optimized Chat Header */}
              <div className="p-3 sm:p-4 border-b border-[#232326] bg-[#18181B]">
                <div className="flex items-center gap-3">
                  {/* Mobile back button */}
                  {isMobile && (
                    <button
                      onClick={handleBackToConversations}
                      className="text-orange-400 hover:text-orange-300 transition-colors touch-manipulation p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {selectedConversation.recipient.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#18181B] ${
                      selectedConversation.recipient.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white text-sm sm:text-base truncate">{selectedConversation.recipient.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${
                        selectedConversation.recipient.status === 'online' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {selectedConversation.recipient.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                      <span className="text-gray-400 hidden sm:inline">•</span>
                      <span className="text-xs text-gray-400 truncate hidden sm:inline">{selectedConversation.item.title}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/auctions/${selectedConversation.id}`}
                    className="text-orange-400 hover:text-orange-300 text-xs sm:text-sm flex-shrink-0 touch-manipulation py-1"
                  >
                    <span className="hidden sm:inline">View Item →</span>
                    <span className="sm:hidden">View →</span>
                  </Link>
                </div>
                
                {/* Mobile item info */}
                {isMobile && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#232326]/50">
                    <img 
                      src={selectedConversation.item.image} 
                      alt={selectedConversation.item.title}
                      className="w-6 h-6 rounded object-cover"
                      loading="lazy"
                    />
                    <span className="text-xs text-gray-400 truncate">{selectedConversation.item.title}</span>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#09090B]">
                {selectedConversation.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.sender === 'You'}
                  />
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-3 sm:mb-4">
                    <div className="bg-[#232326] text-gray-400 p-2.5 sm:p-3 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Mobile-optimized Message Input */}
              <div className="p-3 sm:p-4 border-t border-[#232326] bg-[#18181B]">
                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#232326] border border-[#333] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm sm:text-base"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition touch-manipulation text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Send</span>
                    <span className="sm:hidden">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center bg-[#09090B] p-6">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-4">💬</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Select a Conversation</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  {isMobile ? 'Tap a conversation to start messaging' : 'Choose a conversation from the sidebar to start messaging'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
