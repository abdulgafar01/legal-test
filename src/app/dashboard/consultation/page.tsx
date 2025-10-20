"use client";
import ChatInterface from '@/components/ChatInterface';
import ConsultationDashboard from '@/components/ConsultationDashboard';
import React, { useState } from 'react';

const Page = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  return (
      <div className="flex h-[calc(100vh-60px)] overflow-hidden">
        {/* Consultation List - Always visible on desktop, conditional on mobile */}
        <div className={`${selectedChat ? 'hidden lg:block' : 'block'} w-full lg:w-96 border-r border-yellow-200 overflow-y-auto`}>
          <ConsultationDashboard onSelectChat={handleSelectChat} />
        </div>
        
        {/* Chat Interface - Conditional visibility */}
        {selectedChat && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatInterface 
              selectedChat={selectedChat}
              onBack={handleBackToList}                                                                          
            />
          </div>
        )}
        
        {/* Empty state when no chat selected on desktop */}
        {!selectedChat && (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50 overflow-y-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a conversation</h2>
              <p className="text-gray-600">Choose a consultation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    // <div className="flex flex-col h-[calc(100vh-60px)]">
    //   {/* Main Content Area */}
    // </div>
  );
};

export default Page;