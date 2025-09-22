// lib/api/user.ts
import instance from '../axios';
import { API_ENDPOINTS } from '@/config/api';

export const fetchCurrentUser = async () => {
  if (typeof window === 'undefined') return null;
  // Ensure the token is available in localStorage
  if (!localStorage.getItem('accessToken')) {
    throw new Error('No access token found');
  }

  const response = await instance.get(API_ENDPOINTS.profile.me);

  return response.data;
};

// update user profile
export const updateUserProfile = async (updatedData:unknown) => {
  const response = await instance.patch(
    API_ENDPOINTS.profile.updateProfile,
    updatedData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};
