import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'
import ChatLabel from './ChatLabel'
import { MessageCircle, Scale, User } from 'lucide-react'
import SidebarLinks from './Sidebar-Links'
import Link from 'next/link'
import { Button } from './ui/button'

const Sidebar = ({expand, setExpand,  isMobile, showMobileMenu, toggleSidebar }:any) => {
  return (
  <div className={`
      flex flex-col justify-between bg-orange-50 pt-7 transition-all z-50 
      ${isMobile ? 
        `fixed p-4 inset-y-0 left-0 transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 w-64`
        : 
        `hidden md:flex ${expand ? 'p-4 w-64' : 'w-20'}`
      }
    `}>
    <div>
      <div className={`flex ${expand ? "flex-row gap-10" : "flex-col items-center gap-8"}`}>
         <Link href='/'>

          <div className={expand ? "w-36" : "w-10"}>
            {expand ? (
              <div className='flex gap-1.5'>
                <Scale className='text-yellow-500'/>
                <p className="text-black text-lg font-semibold">Legal AI</p>
              </div>
            ) : (
              <Scale className='text-yellow-500'/>
            )}
          </div>
         </Link>

          

           {isMobile  ? (
          <div  className='cursor-pointer p-2 rounded-md hover:bg-amber-100' onClick={toggleSidebar}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
  ):(<div 
            onClick={toggleSidebar}
            className="group relative flex items-center justify-center
            hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square
            rounded-lg cursor-pointer"
          >
            <Image 
              src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} 
              alt="Toggle sidebar" 
              className="w-7"
            />  

            <div className={`absolute w-max ${expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"}
              opacity-0 group-hover:opacity-100 transition bg-amber-200 
              text-white text-sm px-3 py-2 rounded-lg
              shadow-lg pointer-events-none`}
            >
              {expand ? "Close Sidebar" : "Open sideBar"}
              <div className={`w-3 h-3 absolute bg-amber-200 rotate-45 ${expand ?
                  "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"
              }`}></div>
            </div>

          </div>)}
        </div>



          <div  className={`mt-2 text-white/25 text-sm`}>
          <SidebarLinks expand={expand} isMobile={isMobile} toggleSidebar={toggleSidebar}/>
        </div>

        <button className={`mt-2 flex items-center cursor-pointer
            ${expand ?"hover:bg-amber-100 hover:opacity-90 rounded-lg gap-2 px-3 py-2 w-full" : 
                "group relative w-5 mx-auto  hover:bg-amber-100  rounded-lg"
            }`}>
            {/* <Image className="w-6 text-gray-900"
            src={assets.chat_icon_dull}
            alt="chat icon"
            /> */}
            <MessageCircle className='h-4'/>
            <div className="absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100
            transition bg-amber-100 text-gray-800 text-xs
            px-3 py-2 rounded-lg shadow-lg
            pointer-events-none">
                New Chat 
                <div className="w-3 h-3 absolute bg-amber-100 rotate-45
                left-4 -bottom-1.5"></div>
            </div>
            {expand && <p className="text-gray-700 text font-medium text-xs">New Chat</p>}
        </button>

      

        <div className={`mt-8 text-white/25 text-sm ${
            expand ? "block":"hidden"
        }`}>
            {/* <p className="h-4 text-black">Recents</p> */}
            <div className="overflow-y-auto max-h-[490px] md:h-[190px] pr-2"> 
            {/* chatLabel */}
            <ChatLabel />
          </div>
        </div>

      </div> 

      <div>

        <div
        className={`flex items-center ${expand ? "hover:bg-white/10 rounded-lg":
            "justify-center w-full"} gap-3 text-black text-sm p-2 mt-2 cursor-pointer`}> 
           {/* {
             user ? <UserButton/> :
            <Image src={assets.profile_icon } alt="" className="w-7"/>
           } */}
            {expand && <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-1 space-x-3">
              <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-orange-800">OR</span>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-900">Toluwanimi Adeyemo</div>
                <div className="text-[10px] text-gray-500">toluwanimi@legalAi.com</div>
              </div>
           <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/profile">
                <User className="w-4 h-4" />
              </Link>
            </Button>
        </div>
      </div>}




        </div>

      </div>

    </div>
  )
}

export default Sidebar