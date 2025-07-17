"use client"
import { assets } from '@/assets/assets';
import CategoryScroller from '@/components/CategoryScroller';
import { Star } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const page = () => {
  const questions = [
    {
      question: "What is criminal law?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "What is criminal law?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "What is criminal law?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "What is criminal law?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "What is criminal law?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "What is criminal law?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "What is criminal law?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "What is criminal law?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ];

  return (
    <div className="flex flex-1 mx-auto h-screen">
      <div className=" overflow-y-auto w-full h-full p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Explore</h1>
        
        <div className="mb-8">
          <CategoryScroller />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Frequently searched</h2>
        </div>
        
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {questions.map((q, index) => (
          <div key={index} className="bg-neutral-100 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-3">
              {/* <Star className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" /> */}
              <Image src={assets.solar_star} alt='' height={20} width={20} className='mt-1'/>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{q.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{q.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );

}

export default page
