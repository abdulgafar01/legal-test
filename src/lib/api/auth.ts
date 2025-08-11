import { seekerSchemaType } from '@/schemas/seekerSchema';
import axios from 'axios';
// import instance from '../axios';

const API_BASE_URL = '/api/v1';


// Register User
// This function is used to register a new user
// It requires an email, password, and confirm_password, and returns the user's data if successful
export const registerUser = async (data: {
  email: string;
  password: string;
  confirm_password: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register/`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Login User
// This function is used to log in a user
// It requires an email and password, and returns the user's data if successful
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login/`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Complete Profile
// This function is used to complete the user's profile after registration
// It requires an access token stored in localStorage for authentication
export const completeProfile = async (data: seekerSchemaType) => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await axios.post(`${API_BASE_URL}/auth/complete_profile/`, data,{
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}


//  VERIFY EMAIL
export const verifyEmail = async (data: { email: string;   verification_code: string }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/verify_email/`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};


// RESEND VERIFICATION CODE
export const resendVerificationCode = async (email: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/resend_verification/`, { email });
  return response.data;
};

// GET USER PROFILE
// This function is used to fetch the current user's profile data
// It requires an access token stored in localStorage for authentication
export const getCurrentUser = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await axios.get(`${API_BASE_URL}/profile/me/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};