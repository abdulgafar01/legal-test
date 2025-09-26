import instance from "@/lib/axios";

export interface DocumentUploadInterface {
  profile_image: File;
}

export const uploadDocument = async (data: DocumentUploadInterface) => {
  const formData = new FormData();
  formData.append("profile_image", data.profile_image);

  const response = await instance.post("/api/v1/profile/upload_profile_image/", formData, {
    headers: {
      // "Content-Type": "application/json",
    },
  });
  return response.data;
};
