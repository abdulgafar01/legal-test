import PromptBox from '@/components/PromptBox'
// import React, { useState } from 'react'

const page = () => {
  const messages = ""
  return (
    <div className='flex-1 flex flex-col items-center justify-center
    px-4 pb-8 text-black  h-[80vh] overflow-hidden'>
     {messages.length === 0 ? (
        <>
        <div className="flex items-center gap-3">
          <p className="text-2xl font-medium">How can i be of help today?</p>
        </div>
        </>
      ):
      (
        <div>
          {/* <Message role='user' content='what is my name'/> */}
        </div>
      )

      }

      {/* prompt box */}
      <PromptBox/>

      <p className="text-xs absolute bottom-1 text-gray-500">Legal Ai can make mistakes, kindly check important information</p>


    </div>
  )
}

export default page
