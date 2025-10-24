"use client"

import { motion } from "framer-motion"

interface ChatBubbleProps {
  message: string
  isUser: boolean
  isLoading?: boolean
}

export function ChatBubble({ message, isUser, isLoading }: ChatBubbleProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div className="flex items-center gap-2 rounded-2xl bg-gray-200 px-4 py-3">
          <motion.div
            className="h-2 w-2 rounded-full bg-gray-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="h-2 w-2 rounded-full bg-gray-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
          />
          <motion.div
            className="h-2 w-2 rounded-full bg-gray-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
          />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs rounded-2xl px-4 py-3 text-sm font-medium ${
          isUser ? "rounded-tr-none bg-purple-600 text-white" : "rounded-tl-none bg-gray-100 text-gray-900"
        }`}
      >
        {message}
      </div>
    </motion.div>
  )
}
