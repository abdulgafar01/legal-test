"use client";

import { Mic, Paperclip, Plus, Send } from "lucide-react";
import React, { useState } from "react";
import UploadFileModal from "./Documents/UploadFileModal";
import RecordVoiceModal from "./Documents/RecordVoiceModal";
// import { record } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Attachment = {
  id: string;
  type: "file" | "audio";
  name: string;
  url?: string;
  file?: File | Blob;
};

type Props = {
  onSubmit?: (text: string) => void;
  placeholder?: string;
};

const PromptBox = ({ onSubmit, placeholder = "Ask me..." }: Props) => {
  const [prompt, setPrompt] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  // Voice dictation logic
  React.useEffect(() => {
    if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = "en-US";
      setRecognition(recog);
    }
  }, []);

  const handleMicClick = () => {
    if (!recognition) return toast("Speech recognition not supported in this browser.");
    setIsRecording(true);
    recognition.start();
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setPrompt(transcript);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    recognition.onerror = () => {
      setIsRecording(false);
    };
  };

  const handleStopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

const sendMessage = () => {
  const text = prompt.trim();
  if (!text && attachments.length === 0) return;
  onSubmit?.(text);
  setPrompt("");
  setAttachments([]);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  sendMessage();
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};


  const handleAttach = (attachment: Attachment) => {
    setAttachments((prev) => {
      // dedupe by name+size when possible, then by url, then by id
      const exists = prev.some((a) => {
        // same name and same size (most reliable)
        if (a.name === attachment.name) {
          const aFile = a.file as unknown;
          const bFile = attachment.file as unknown;
          const aSize =
            aFile && typeof (aFile as Blob)?.size === "number"
              ? (aFile as Blob).size
              : undefined;
          const bSize =
            bFile && typeof (bFile as Blob)?.size === "number"
              ? (bFile as Blob).size
              : undefined;
          if (aSize !== undefined && bSize !== undefined)
            return aSize === bSize;
          // if sizes unknown, fallback to url/name match
          if (a.url && attachment.url && a.url === attachment.url) return true;
          // otherwise treat as same
          return true;
        }
        // same URL
        if (a.url && attachment.url && a.url === attachment.url) return true;
        // same id
        if (a.id && attachment.id && a.id === attachment.id) return true;
        return false;
      });
      if (exists) return prev;
      return [...prev, attachment];
    });
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"}`}
    >
      <div className=" bg-white shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.08)]  rounded-3xl px-3 py-2">
      <textarea
        className="outline-none w-full resize-none overflow-hidden break-words mt-2 transition-all"
        rows={2}
        placeholder={placeholder}
        required
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        value={prompt}
      />


      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          title="Upload files"
          className="cursor-pointer px-1 py-1.5 hover:opacity-80 rounded-full bg-[var(--primary)] text-white"
        >
          <Plus className="h-5" />
        </button>
  <div className="flex items-center justify-center w-20 h-8">
       {isRecording && (
         <div className="flex items-end gap-[2px]">
           {/* Five animated sound bars */}
           {[0.3, 0.6, 0.9, 0.6, 0.3].map((d, i) => (
             <motion.div
               key={i}
               initial={{ height: 6 }}
               animate={{
                 height: [6, 6 + 18 * d, 6,3],
               }}
               transition={{
                 duration: 0.6,
                 repeat: Infinity,
                 ease: "easeInOut",
                 delay: i * 0.1,
               }}
               className="w-[3px] bg-[var(--primary)] rounded-full"
             />
           ))}
         </div>
       )}
     </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isRecording ? handleStopRecording : handleMicClick}
            title={isRecording ? "Stop recording" : "Record voice"}
            className={`cursor-pointer p-1 hover:opacity-80 rounded-full bg-[var(--primary)] text-white relative`}
          >
            <Mic className={`w-6 ${isRecording ? "animate-pulse" : ""}`} />
            {isRecording && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            )}
          </button>
          
          <button
            type="button"
            onClick={sendMessage}
            disabled={!prompt.trim() && attachments.length === 0}
            className={`${
              prompt.trim() || attachments.length
                ? "bg-primary shadow-md cursor-pointer"
                : "bg-[#71717a] opacity-60 cursor-not-allowed"
            } rounded-full p-2 hover:shadow-lg transition-shadow -rotate-45`}
          >
            <Send className="text-white w-6" />
          </button>

        </div>
      </div>
      </div>

      {/* attachments list */}
      {attachments.length > 0 && (
        <div className="mt-3 max-h-32 overflow-auto p-4 flex gap-2 flex-wrap">
          {attachments.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2 bg-gray-400 text-black rounded-full px-3 py-1 text-xs"
            >
              <span>
                {a.type === "file" ? <Paperclip/> : <Mic/>}
              </span>
              <span className="max-w-[200px] truncate font-bold">{a.name}</span>
              <button
                onClick={() => handleRemoveAttachment(a.id)}
                className="ml-2 text-black cursor-pointer text-lg transition-all hover:scale-[1.1]"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <UploadFileModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onAttach={handleAttach}
      />
      <RecordVoiceModal
        open={recordOpen}
        onOpenChange={setRecordOpen}
        onAttach={handleAttach}
      />
      {/* Voice recording animation indicator (optional, already shown on button) */}
    </form>
  );
};

export default PromptBox;
