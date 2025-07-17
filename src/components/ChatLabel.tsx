import { Search } from 'lucide-react';
import React from 'react'

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
     <div className="flex-1 px-4 py-1 overflow-y-auto">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Chat History</h3>
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="space-y-px">
            <div className="text-sm font-medium text-gray-900 mb-2">Today</div>
            {chatHistory.map((chat, index) => (
              <div key={index} className="text-sm text-gray-600 py-1 hover:text-gray-900 cursor-pointer truncate">
                {chat}
              </div>
            ))}
          </div>

          <div className="mt-0.5">
            <div className="text-sm font-medium text-gray-900">Previous Chat</div>
            {chatHistory.slice(2).map((chat, index) => (
              <div key={index} className="text-sm text-gray-600 py-1 hover:text-gray-900 cursor-pointer truncate">
                {chat}
              </div>
            ))}
          </div>

          <div className="mt-0.5">
            {frequentlySearched.map((item, index) => (
              <div key={index} className="text-sm text-gray-600 py-1 hover:text-gray-900 cursor-pointer">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

    // <div className='text-black overflow-y-auto'>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
    //   <div>
    //     chat
    //   </div>
      
    // </div>

  )
}

export default ChatLabel
