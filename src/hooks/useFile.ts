import instance from "@/lib/axios";

export interface DocumentUploadInterface {
  file: string;
  description: string;
}

// export const useUploadDocument = (certificationPk: string = "2") => {
//   return useMutation({
//     mutationFn: async (payload: DocumentUploadInterface) => {
//       const response = await instance.post(
//         `/certifications/${certificationPk}/files`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     },
//   });
// };

export const uploadDocument = async (data: DocumentUploadInterface) => {
  const response = await instance.post("/upload", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
