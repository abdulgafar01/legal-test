// lib/api/user.ts
import axios from 'axios';

const API_BASE_URL = 'http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com/api/v1';

export const fetchCurrentUser = async () => {
  if (typeof window === 'undefined') return null;
  // Ensure the token is available in localStorage
  if (!localStorage.getItem('accessToken')) {
    throw new Error('No access token found');
  }
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No access token found');

  const response = await axios.get(`${API_BASE_URL}/profile/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};



// update user profile
export const updateUserProfile = async (updatedData:unknown) => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No access token found');

  const response = await axios.patch(
    `${API_BASE_URL}/profile/update_profile/`,
    updatedData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
