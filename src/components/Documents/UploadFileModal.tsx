"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/Progress";
import { Upload, CheckCircle, Trash2 } from "lucide-react";

interface Attachment {
  id: string;
  type: "file" | "audio";
  name: string;
  url?: string;
  file?: File;
}

interface UploadFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAttach?: (attachment: Attachment) => void;
}

type UploadState = "idle" | "uploading" | "success";

export function UploadFileModal({
  open,
  onOpenChange,
  onAttach,
}: UploadFileModalProps) {
  const attachedNamesRef = React.useRef<Set<string>>(new Set());
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      setUploadState("uploading");
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadState("success");
            // create a temporary object URL and notify parent (guard duplicates per modal)
            if (!attachedNamesRef.current.has(file.name)) {
              attachedNamesRef.current.add(file.name);
              const url = URL.createObjectURL(file);
              const attachment: Attachment = {
                id: `${Date.now()}-${file.name}`,
                type: "file",
                name: file.name,
                url,
                file,
              };
              onAttach?.(attachment);
            }
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    },
    [onAttach]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setUploadState("idle");
    setUploadProgress(0);
    setFileName("");
    onOpenChange(false);
  };

  const handleClearUpload = () => {
    setUploadState("idle");
    setUploadProgress(0);
    setFileName("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Upload file
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {uploadState === "idle" && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/10" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-400 mb-4">
                PDF, JPG, JPEG, PNG, WEBP, DOCX (max. 5MB)
              </p>
              <p className="text-xs text-gray-400 mb-4">OR</p>
              <Button
                className="bg-primary text-white cursor-pointer"
                onClick={() => document.getElementById("file-input")?.click()}
                type="button"
              >
                Browse Files
              </Button>
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.jpg,.jpeg,.png,.webp,.docx"
              />
            </div>
          )}

          {uploadState === "uploading" && (
            <div className="border-2 border-dashed border-primary/40 bg-primary/5 rounded-lg p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-lg flex items-center justify-center">
                <div className="text-primary font-semibold text-xs">FILE</div>
              </div>
              <div className="mb-4">
                <div className="text-lg font-medium text-gray-700">
                  {uploadProgress}%
                </div>
                <Progress value={uploadProgress} className="w-full mt-2" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Uploading Document...
              </p>
              <p className="text-xs text-gray-400">({fileName})</p>
            </div>
          )}

          {uploadState === "success" && (
            <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Document Attached
              </p>
              <p className="text-xs text-gray-400 mb-4">({fileName})</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearUpload}
                className="text-gray-500 hover:text-gray-700 bg-[#ddd] hover:bg-[#ccc]"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Upload
              </Button>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleClose} className="bg-black text-white">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadFileModal;
