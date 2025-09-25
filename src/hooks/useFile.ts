import instance from "@/lib/axios";

export interface DocumentUploadInterface {
  file: string;
  description: string;
}

export const uploadDocument = async (data: DocumentUploadInterface) => {
  const response = await instance.post("/upload", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
