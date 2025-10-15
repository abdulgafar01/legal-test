"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Play, Trash2 } from "lucide-react";

interface Attachment {
  id: string;
  type: "file" | "audio";
  name: string;
  url?: string;
  file?: File | Blob;
}

interface RecordVoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAttach?: (attachment: Attachment) => void;
}

export function RecordVoiceModal({
  open,
  onOpenChange,
  onAttach,
}: RecordVoiceModalProps) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      clearState();
    }

    return () => {
      clearState();
    };
  }, [open]);

  const clearState = () => {
    setRecording(false);
    setAudioURL(null);
    setDuration(0);
    chunksRef.current = [];
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        // prefer the recorder mimeType if available
  const mrUnknown = mr as unknown;
  const mime = (mrUnknown && (mrUnknown as { mimeType?: string }).mimeType) || "audio/webm";
  const blob = new Blob(chunksRef.current, { type: String(mime) });
        recordedBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        // stop tracks
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000) as unknown as number;
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClose = () => {
    clearState();
    onOpenChange(false);
  };

  const handleDone = () => {
    if (recordedBlobRef.current) {
      const blob = recordedBlobRef.current;
      const url = URL.createObjectURL(blob);
      const attachment: Attachment = {
        id: `${Date.now()}-recording.webm`,
        type: "audio",
        name: `recording-${new Date().toISOString()}.webm`,
        url,
        file: blob,
      };
      onAttach?.(attachment);
    }
    handleClose();
  };

  // reload audio element when URL updates
  React.useEffect(() => {
    if (audioRef.current) {
      // small timeout to ensure src property is set before calling load
      setTimeout(() => {
        try {
          audioRef.current?.load();
        } catch {
          // ignore
        }
      }, 0);
    }
  }, [audioURL]);

  const handleClear = () => {
    setAudioURL(null);
    setDuration(0);
    chunksRef.current = [];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Record voice
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-2">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="w-7 h-7 text-primary" />
            </div>
            <div className="text-sm text-gray-700 font-medium">
              {recording
                ? "Recording..."
                : audioURL
                ? "Preview recording"
                : "Ready to record"}
            </div>
            <div className="text-xs text-gray-400">
              {Math.floor(duration / 60)}:
              {(duration % 60).toString().padStart(2, "0")}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            {!recording && (
              <Button
                className="bg-primary text-white"
                onClick={startRecording}
              >
                <Play className="mr-2 w-4 h-4" /> Start
              </Button>
            )}

            {recording && (
              <Button className="bg-red-600 text-white" onClick={stopRecording}>
                <StopCircle className="mr-2 w-4 h-4" /> Stop
              </Button>
            )}

            {audioURL && (
              <audio ref={audioRef} src={audioURL} controls className="mx-2" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-gray-600"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear
              </Button>
            </div>

            <div>
              <Button onClick={handleDone} className="bg-black text-white">
                Done
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RecordVoiceModal;
