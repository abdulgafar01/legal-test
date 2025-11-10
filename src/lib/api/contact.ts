import instance from '../axios';
import { ContactFormData, ContactSubmissionResponse } from '@/types/contact';

const API_BASE = '/api/v1/contact-submissions';

export const submitContactForm = async (data: ContactFormData): Promise<ContactSubmissionResponse> => {
  const response = await instance.post(`${API_BASE}/`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
