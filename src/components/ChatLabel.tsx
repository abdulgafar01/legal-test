import { Search } from 'lucide-react';
import React from 'react';

const ChatLabel = () => {
  const chatHistory = [
    "What is the most criminal act that c...",
    "What is the most criminal act that c...",
    "What is criminal law?",
    "What is civil law?",
    "What is the benefit of singing?"
  ];

  const frequentlySearched = Array(4).fill("Frequently searched");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-2">
        <h3 className="text-sm font-medium text-gray-900">Chat History</h3>
        <Search className="w-4 h-4 text-gray-400" />
      </div>

      {/* Scrollable Content */}
      <div className="mt-2 px-4 pb-4 flex-1 overflow-y-auto space-y-4">
        {/* Today’s Chats */}
        <div>
          <div className="text-sm font-medium text-gray-900 mb-1">Today</div>
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className="text-sm text-gray-600 py-1 hover:text-gray-900 cursor-pointer truncate"
            >
              {chat}
            </div>
          ))}
        </div>

        {/* Previous Chats */}
        <div>
          <div className="text-sm font-medium text-gray-900 mb-1">Previous Chat</div>
          {chatHistory.slice(2).map((chat, index) => (
            <div
              key={index}
              className="text-sm text-gray-600 py-1 hover:text-gray-900 cursor-pointer truncate"
            >
              {chat}
            </div>
          ))}
        </div>

        {/* Frequently Searched */}
        <div>
          <div className="text-sm font-medium text-gray-900 mb-1">Frequently Searched</div>
          {frequentlySearched.map((item, index) => (
            <div
              key={index}
              className="text-sm text-gray-600 py-1 hover:text-gray-900 cursor-pointer truncate"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatLabel;