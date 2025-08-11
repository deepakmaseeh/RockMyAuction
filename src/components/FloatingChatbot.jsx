"use client";
import { useState } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatWindow from "./ChatWindow";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatbotButton onClick={toggleChat} isOpen={isOpen} />
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}
