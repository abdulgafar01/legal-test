"use client";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Progress } from "./Progress";
import { DocumentUploadInterface, uploadDocument } from "@/hooks/useFile";
import { useMutation } from "@tanstack/react-query";

interface UploadFileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UploadState = "idle" | "uploading" | "success";

export function UploadPhotoModal({ open, onOpenChange }: UploadFileModalProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string>("");
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setUploadState("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("success");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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

  const { handleSubmit, setError } = useForm<DocumentUploadInterface>({
    mode: "onChange",
    defaultValues: {
      file: "",
      description: "",
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: DocumentUploadInterface) => {
      const payload = {
        file: formData.file,
        description: formData.description,
      };
      return uploadDocument(payload);
    },
    onSuccess: () => {
      onOpenChange(false);
    },

    onError: (err: unknown) => {
      if (!axios.isAxiosError(err)) {
        toast.error("Unexpected error occurred. Please try again.");
        return;
      }
      if (axios.isAxiosError(err)) {
        // Handle network errors first
        if (err.message === "Network Error") {
          toast.error("Network error - please check your internet connection");
          return;
        }

        const responseData = err.response?.data as {
          error?: {
            details?: Record<string, string | string[]>;
          };
        };

        const apiError = responseData?.error;
        const details = apiError?.details || {};
        const detail = details?.detail;

        if (detail) {
          toast.error(detail);
        }

        if (details?.email) {
          const msg = Array.isArray(details.email)
            ? details.email.join(" ")
            : details.email;

          setError("file", {
            type: "server",
            message: msg,
          });

          toast.error(msg);
        }

        if (details?.password) {
          const msg = Array.isArray(details.password)
            ? details.password.join(" ")
            : details.password;

          setError("description", {
            type: "server",
            message: msg,
          });

          toast.error(msg);
        }

        // Optional: catch-all if no specific message is shown
        if (
          !detail &&
          !details?.email &&
          !details?.password &&
          !details?.confirm_password
        ) {
          toast.error("Server did not return a specific error message.");
        }
      }
    },
  });

  const onSubmit = (data: DocumentUploadInterface) => {
    uploadMutation.mutate(data, {
      onSuccess: (res) => {
        onOpenChange(false);
        toast.success(res.message || "File upload successful");
      },
      onError: (error: unknown) => {
        if (error instanceof AxiosError) {
          toast.error("File upload failed");
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Upload photo
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {uploadState === "idle" && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
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
                PDF, JPG, JPEG, PNG (max. 5MB)
              </p>
              <p className="text-xs text-gray-400 mb-4">OR</p>
              <Button
                className="bg-black hover:bg-gray-800 text-white cursor-pointer"
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
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          )}

          {uploadState === "uploading" && (
            <div className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-lg p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-lg flex items-center justify-center">
                <div className="text-orange-600 font-semibold text-xs">PDF</div>
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
                className="text-gray-500 hover:text-gray-700 cursor-pointer bg-[#ddd] hover:bg-[#ccc]"
                type="button"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Upload
              </Button>
            </div>
          )}

          {uploadState === "success" && (
            <div className="flex justify-end">
              <Button
                className={`bg-black hover:bg-gray-800 text-white ${
                  uploadState === "success" || uploadMutation.isPending
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={uploadState === "success" || uploadMutation.isPending}
                type="submit"
              >
                {uploadMutation.isPending ? "Uploading..." : "+ Upload File"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
