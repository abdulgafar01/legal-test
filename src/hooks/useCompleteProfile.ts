// hooks/useCompleteProfile.ts
import { useMutation } from "@tanstack/react-query"
import { seekerSchemaType } from "@/schemas/seekerSchema"
import { completeProfile } from "@/lib/api/auth"

export const useCompleteProfile = () => {
  return useMutation({
    mutationFn: (data: seekerSchemaType) => completeProfile(data),
  })
}
