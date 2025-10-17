"use client";
import React, { useEffect, useState } from 'react'
import { Send, Loader, Menu, Bell, Plus, Mic, } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import IPhoneFramePro from './IPhoneFramePro';

const Iphone = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [userMessage, setUserMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showResponse, setShowResponse] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);

    type DemoStep =
        | { type: 'typing'; text: string }
        | { type: 'send' }
        | { type: 'loading' }
        | { type: 'response'; text: string };

    const demoFlow: DemoStep[] = [
        { type: 'typing', text: 'What is a civil case?' },
        { type: 'send' },
        { type: 'loading' },
        {
            type: 'response',
            text: 'A civil case is a legal dispute between individuals or organizations, usually over rights, contracts, or property.',
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentStep === 0) {
                // Start typing animation and show keyboard
                setIsTyping(true);
                setShowKeyboard(true);
                let index = 0;
                const typeInterval = setInterval(() => {
                    const first = demoFlow[0];
                    if (first.type === 'typing' && index < first.text.length) {
                        setUserMessage(first.text.slice(0, index + 1));
                        index++;
                    } else {
                        clearInterval(typeInterval);
                        setIsTyping(false);
                        setTimeout(() => setCurrentStep(1), 500);
                    }
                }, 50);
            } else if (currentStep === 1) {
                // Send message and hide keyboard
                setShowKeyboard(false);
                setTimeout(() => {
                    setCurrentStep(2);
                    setIsLoading(true);
                }, 800);
            } else if (currentStep === 2) {
                // Show loading for 2 seconds
                setTimeout(() => {
                    setIsLoading(false);
                    setShowResponse(true);
                    setCurrentStep(3);
                }, 2000);
            } else if (currentStep === 3) {
                // Reset after showing response
                setTimeout(() => {
                    setCurrentStep(0);
                    setUserMessage('');
                    setShowResponse(false);
                    setIsLoading(false);
                }, 4000);
            }
        }, currentStep === 0 ? 2000 : 0);

        return () => clearTimeout(timer);
    }, [currentStep]);

    return (
        <IPhoneFramePro>
            {/* Status Bar and Chat Header */}
            <div className="h-6 bg-gray-50 flex items-center justify-between px-6 text-xs font-medium text-gray-900">
                <span>9:41 am</span>
                <span>●●●</span>
            </div>


            {/* App Header */}
            <div className="flex items-center justify-between border-b bg-orange-50 border-neutral-100 px-4 py-3">
                <Menu className="h-5 w-5 text-neutral-900" />
                <div className="rounded-md bg-amber-400 px-3 py-1.5 text-xs font-medium text-neutral-900">
                    Get a professional
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Bell className="h-5 w-5 text-neutral-900" />
                        <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-400" />
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-900 p-4">
                        MH
                    </div>
                </div>
            </div>

            {/* Chat Messages with ScrollArea */}
            <div className={`flex-1 bg-white transition-all duration-500 ${showKeyboard ? 'h-[320px]' : 'h-[480px]'} overflow-hidden`}>
                <ScrollArea className="h-full w-full">
                    <div className="p-4 space-y-4">
                        {/* AI Welcome Message */}
                        <div className="flex items-start space-x-2">
                            <div className="bg-neutral-50 rounded-2xl  px-4 py-2 max-w-60 shadow-sm flex items-start justify-start">
                                <p className="text-sm text-gray-800">Hello! I'm Amani, your legal assistant. What would you like to know?</p>
                            </div>
                        </div>

                        {/* User Message */}
                        {(currentStep >= 1 || userMessage) && (
                            <div className={`flex items-end space-x-2 justify-end transition-all duration-500 ${currentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <div className="bg-[#BE9C05] text-white rounded-2xl px-4 py-2 max-w-52 shadow-sm">
                                    <p className="text-sm">{userMessage}</p>
                                </div>
                            </div>
                        )}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex items-start space-x-2 animate-fade-in">
                                <div className="bg-transparent px-4 py-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Response */}
                        {showResponse && (() => {
                            const step = demoFlow[3];
                            if (step.type !== 'response') return null;
                            return (
                                <div className="flex items-start space-x-2 animate-fade-in">
                                    <div className="bg-neutral-50 rounded-2xl  px-4 py-2 max-w-60 shadow-sm">
                                        <p className="text-sm text-gray-800 whitespace-pre-line">{step.text}</p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </ScrollArea>
            </div>

            {/* Input Area */}
            <div className={`absolute left-0 right-0 bg-white border-t border-gray-100 p-4 transition-all duration-500 ${showKeyboard ? 'bottom-[160px]' : 'bottom-0'
                }`}>
                <div className="flex items-center  space-x-3">
                    <div className="flex-1   bg-gray-100 rounded-2xl px-4 py-2 relative">
                        <textarea
                            // type="text"
                            placeholder="Type your message..."
                            value={userMessage}
                            readOnly
                            style={{ resize: 'none' }}
                            className="w-full bg-transparent h-fit text-sm outline-none placeholder-gray-500"
                        />
                        {isTyping && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-0.5 h-4 bg-gray-500 animate-pulse"></div>
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                            <div className="">
                                <Plus className="h-5 cursor-pointer" />
                            </div>

                            <div className="flex items-center gap-2">
                                <Mic className="w-6 cursor-pointer" />
                                <button
                                    className={`${currentStep === 1
                                            ? "bg-amber-500 shadow-md cursor-pointer"
                                            : "bg-[#71717a] shadow-sm disabled"
                                        } rounded-full p-2 hover:shadow-lg transition-shadow -rotate-45`}
                                >
                                    {isLoading ? (
                                        <Loader className="w-4 h-4 text-white animate-pulse" />
                                    ) : (
                                        <Send className="w-4 h-4 rotate-45 text-white" />
                                    )}

                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center text-[8px] text-neutral-400">
                    Legal AI can make mistakes, kindly check important information
                </p>
            </div>

            {/* Mobile Keyboard Overlay */}
            {showKeyboard && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-200 transition-all duration-500 animate-fade-in">
                    <div className="p-2 space-y-1">
                        {/* Top row */}
                        <div className="flex space-x-1 justify-center">
                            {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
                                <div key={key} className="bg-white rounded px-2 py-2 shadow-sm text-sm font-medium">
                                    {key}
                                </div>
                            ))}
                        </div>
                        {/* Middle row */}
                        <div className="flex space-x-1 justify-center">
                            {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
                                <div key={key} className="bg-white rounded px-2 py-2 shadow-sm text-sm font-medium">
                                    {key}
                                </div>
                            ))}
                        </div>
                        {/* Bottom row */}
                        <div className="flex space-x-1 justify-center">
                            <div className="bg-white rounded px-3 py-2 shadow-sm text-xs font-medium">⇧</div>
                            {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
                                <div key={key} className="bg-white rounded px-2 py-2 shadow-sm text-sm font-medium">
                                    {key}
                                </div>
                            ))}
                            <div className="bg-white rounded px-3 py-2 shadow-sm text-xs font-medium">⌫</div>
                        </div>
                        {/* Space bar row */}
                        <div className="flex space-x-1 justify-center">
                            <div className="bg-white rounded px-3 py-2 shadow-sm text-xs font-medium">123</div>
                            <div className="bg-white rounded px-16 py-2 shadow-sm text-xs font-medium"></div>
                            <div className="bg-white rounded px-3 py-2 shadow-sm text-xs font-medium">return</div>
                        </div>
                    </div>
                </div>
            )}
        </IPhoneFramePro>
    )
}

export default Iphone
