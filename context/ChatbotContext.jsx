"use client";

import { createContext, useCallback, useContext, useState } from "react";

const ChatbotContext = createContext(null);

export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openChatbot = useCallback((serviceId = "") => {
    if (serviceId) setSelectedService(serviceId);
    setIsOpen(true);
  }, []);

  const closeChatbot = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <ChatbotContext.Provider value={{ isOpen, selectedService, setSelectedService, openChatbot, closeChatbot, toggleChatbot }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("useChatbot must be used within ChatbotProvider");
  return ctx;
}
