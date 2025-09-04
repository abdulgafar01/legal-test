import { getCurrentUser } from '@/lib/api/auth';
import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    staleTime: 1 * 60 * 1000, // 1 minute (reduced from 5 minutes for better debugging)
    gcTime: 5 * 60 * 1000, // 5 minutes (reduced from 10 minutes)
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch on mount
  });
};
