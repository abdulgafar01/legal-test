export interface ContactFormData {
  name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  data: ContactSubmission;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  user?: {
    id: number;
    name: string;
    email: string;
    user_type: string;
  };
  created_at: string;
  updated_at: string;
}
