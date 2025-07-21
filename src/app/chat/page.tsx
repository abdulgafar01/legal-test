'use client';

import PromptBox from '@/components/PromptBox';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Page = () => {
  const messages = ""; // Placeholder; replace with actual message logic if needed

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      
      {/* Header */}
        <header className="sticky  top-0 z-20 w-full bg-orange-50 border-b border-gray-200 px-6 py-3">
       <Link href='signup'>
        <div className="flex justify-end">
          <Button className='rounded-2xl'>sign up</Button>
        </div>
       </Link>
      </header>



      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8 relative overflow-hidden">
        
        {/* Message Section */}
        {messages.length === 0 ? (
          <div className="flex items-center gap-3">
            <p className="text-2xl font-medium">How can I be of help today?</p>
          </div>
        ) : (
          <div>
            {/* Render messages here, e.g.: <Message role='user' content='what is my name' /> */}
          </div>
        )}

        {/* Prompt Input Box */}
        <PromptBox />

        {/* Disclaimer */}
        <p className="text-xs absolute bottom-1 text-gray-500">
          Legal AI can make mistakes, kindly check important information.
        </p>
      </main>
    </div>
  );
};

export default Page;
