import { seekerSchemaType } from '@/schemas/seekerSchema';
import axios from 'axios';
// import instance from '../axios';

const API_BASE_URL = 'http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com/api/v1';

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


export const completeProfile = async (data: seekerSchemaType) => {
  const response = await axios.post(`${API_BASE_URL}/auth/complete_profile/`, data,{
    headers: {
      'Content-Type': 'application/json',
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
  const response = await axios.post(`${API_BASE_URL}/auth/verify_reset_code/`, { email });
  return response.data;
};