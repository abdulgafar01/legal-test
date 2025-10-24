"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { ChatBubble } from "./chat-bubble"
import Image from "next/image"

const accordionItems = [
  {
    id: "conversational",
    title: "Conversational Legal Search",
    description:
      "Interact with the Protégé AI assistant within Lexis+ AI like you would a trusted colleague who intelligently and conversationally responds to your requests.",
    image: "/placeholderImage.png",
    userMessage: "Under New York Law, how do you calculate time periods in litigation?",
    aiResponse:
      "Under CPLR 213, time periods are calculated by excluding the first day and including the last day of the period.",
  },
  {
    id: "draft",
    title: "Draft in Moments",
    description:
      "Generate high-quality legal documents in seconds with AI-powered drafting that understands context and legal requirements.",
    image: "/legal-document-drafting-ai-interface.jpg",
    userMessage: "Draft a non-disclosure agreement for tech startups",
    aiResponse:
      "I'll create a comprehensive NDA template tailored for tech startups with standard confidentiality clauses.",
  },
  {
    id: "summarization",
    title: "Accurate Summarization",
    description: "Get concise, accurate summaries of complex legal documents and case law to save time on research.",
    image: "/document-summarization-legal-research.jpg",
    userMessage: "Summarize the key holdings in this contract",
    aiResponse:
      "The contract establishes mutual obligations, liability limitations, and dispute resolution procedures.",
  },
  {
    id: "upload",
    title: "Upload Your Documents",
    description: "Upload any legal document and let AI analyze, summarize, or extract key information instantly.",
    image: "/document-upload-interface-legal.jpg",
    userMessage: "Analyze this document for compliance issues",
    aiResponse: "Analysis complete: Document meets current regulatory requirements with minor recommendations.",
  },
]

export function LexisAISection() {
  const [activeItem, setActiveItem] = useState("conversational")
  const [showUserMessage, setShowUserMessage] = useState(true)
  const [showAiResponse, setShowAiResponse] = useState(true)
  const [userMessageLoading, setUserMessageLoading] = useState(false)
  const [aiMessageLoading, setAiMessageLoading] = useState(false)

  const currentItem = accordionItems.find((item) => item.id === activeItem)

  useEffect(() => {
    setUserMessageLoading(true)
    setShowUserMessage(false)
    setAiMessageLoading(false)
    setShowAiResponse(false)

    // Show user message after 1 second
    const userTimer = setTimeout(() => {
      setUserMessageLoading(false)
      setShowUserMessage(true)
    }, 1000)

    // Show AI loading after user message appears
    const aiLoadingTimer = setTimeout(() => {
      setAiMessageLoading(true)
    }, 2000)

    // Show AI response after 2 seconds of loading
    const aiTimer = setTimeout(() => {
      setAiMessageLoading(false)
      setShowAiResponse(true)
    }, 4000)

    return () => {
      clearTimeout(userTimer)
      clearTimeout(aiLoadingTimer)
      clearTimeout(aiTimer)
    }
  }, [activeItem])

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#efe9fb] via-[#f6f2fb] to-[#faf8fc] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Accordion */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Lexis+ AI streamlines and enhances legal work—now with Protégé
              </h2>
            </div>

            <Accordion type="single" value={activeItem} onValueChange={setActiveItem} className="w-full">
              {accordionItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-b border-border/40">
                  <AccordionTrigger className="py-4 text-left text-base font-semibold text-foreground hover:text-primary">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm text-muted-foreground">{item.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column - Image Card with Chat */}
          <div className="relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentItem && (
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative w-full max-w-md"
                >
                  <div className="relative overflow-visible">
                    <div
                      className="relative overflow-hidden bg-white shadow-2xl"
                      style={{
                        borderRadius: "24px 24px 24px 0",
                      }}
                    >
                      <div
                        className="absolute bottom-0 left-0 h-16 w-16 bg-gradient-to-br from-[#efe9fb] via-[#f6f2fb] to-[#faf8fc]"
                        style={{
                          borderRadius: "10px 0 0 0",
                          zIndex: 10,
                        }}
                      />

                      {/* Image */}
                      <Image
                        width={100}
                        height={384}
                        src={currentItem.image || "/placeholderimage.png"}
                        alt={currentItem.title}
                        className="h-96 w-full object-cover"
                      />

                      {/* Chat Container */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="absolute right-4 top-8 flex max-w-xs flex-col gap-3"
                      >
                        {/* User Message with Loading */}
                        {userMessageLoading ? (
                          <ChatBubble message="" isUser={true} isLoading={true} />
                        ) : (
                          showUserMessage && <ChatBubble message={currentItem.userMessage} isUser={true} />
                        )}

                        {/* AI Response with Loading */}
                        {aiMessageLoading ? (
                          <ChatBubble message="" isUser={false} isLoading={true} />
                        ) : (
                          showAiResponse && <ChatBubble message={currentItem.aiResponse} isUser={false} />
                        )}
                      </motion.div>

                      {/* Purple Icon Button */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        className="absolute bottom-2 left-2 z-20"
                      >
                        <Button size="icon" className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700">
                          <MessageCircle className="h-6 w-6" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
