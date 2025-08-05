import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/lib/api/user';
import { toast } from 'sonner'; 
import { AxiosError } from 'axios';

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      // Invalidate cache to refetch user
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
   onError: (error: unknown) => {
  let message = "Failed to update profile.";

  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<{
      error?: {
        details?: {
          detail?: string;
        };
      };
    }>;

    message =
      axiosError.response?.data?.error?.details?.detail || message;
  }

  toast.error(message);
},
  });
};
