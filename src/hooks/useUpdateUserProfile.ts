import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/lib/api/user';
import { toast } from 'sonner'; 

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      // Invalidate cache to refetch user
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.details?.detail ||
        'Failed to update profile.';
      toast.error(message);
    },
  });
};
