import { Mic, Plus, Send } from 'lucide-react'
import React, { useState } from 'react'

const PromptBox = () => {

    const [prompt, setPrompt] = useState('')


  return (
    <form className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} 
    bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)] drop-shadow-xl p-4 rounded-3xl mt-4 transition-all`}>
        
    <textarea
        className='outline-none w-full resize-none overflow-hidden
        break-words bg-transparent'
        rows={2}
        placeholder='Ask me...' 
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
    />

    <div className='flex items-center justify-between text-sm'>
        <div className=''>
            <Plus className='h-5 cursor-pointer'/>
        </div>

        <div className='flex items-center gap-2'>
            <Mic className='w-6 cursor-pointer'/>
            <button className={`${prompt ? "bg-primary shadow-md cursor-pointer" : "bg-[#71717a] shadow-sm disabled"}
            rounded-full p-2 hover:shadow-lg transition-shadow -rotate-45`}>
                <Send className='text-white w-6'/>
            </button>
        </div>
    </div>
</form>
  )
}

export default PromptBox
