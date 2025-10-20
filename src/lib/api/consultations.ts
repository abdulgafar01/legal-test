import axios from 'axios';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';

// Types for consultation booking
export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  date: string; // Flattened from availability.date
  duration_minutes?: number;
}

export interface ConsultationBookingData {
  practitioner_id: number;
  time_slot_id: number;
  consultation_notes?: string;
}

export interface Consultation {
  id: number;
  service_seeker_info: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: string;
  };
  practitioner_info: {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image?: string;
  specializations: string[];
  };
  time_slot_info: {
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  };
  status_info: {
    id: number;
    name: string;
    description?: string;
  };
  consultation_fee: number;
  platform_fee: number;
  practitioner_earnings: number;
  consultation_notes?: string;
  practitioner_notes?: string;
  meeting_link?: string;
  booked_at: string;
  confirmed_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  can_be_cancelled: boolean;
  can_be_started: boolean;
  is_upcoming: boolean;
  is_past: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Zoom types
export interface ZoomMeeting {
  id: number;
  consultation: number;
  meeting_id: string;
  topic: string;
  scheduled_at: string;
  duration_minutes: number;
  join_url: string;
  passcode?: string;
  status: 'scheduled' | 'started' | 'ended' | 'canceled';
  host_email?: string;
}

export interface ZoomSignaturePayload {
  signature: string;
  sdk_key: string;
  meeting_number: string;
  passcode?: string;
  user_name: string;
}

export type PaginatedResponse<T> =
  | {
      success: true;
      message?: string;
      data: T[];
      count?: number;
      next?: string;
      previous?: string;
    }
  | {
      count: number;
      next: string | null;
      previous: string | null;
      results: T[];
    };

/**
 * Create a new consultation booking
 */
export const createConsultationBooking = async (bookingData: ConsultationBookingData): Promise<{ success: boolean; data: any; message?: string }> => {
  try {
    // Check for accessToken first (from AuthContext), fallback to authToken (from signup)
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(
      buildApiUrl(API_ENDPOINTS.consultations.create),
      bookingData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Error creating consultation booking:', error);
    throw error;
  }
};

/**
 * Get user's consultations with optional filtering
 */
export const getMyConsultations = async (filters?: {
  status?: string;
  upcoming_only?: boolean;
}): Promise<PaginatedResponse<Consultation>> => {
  try {
    // Check for accessToken first (from AuthContext), fallback to authToken (from signup)
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const params = new URLSearchParams();
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.upcoming_only) {
      params.append('upcoming_only', 'true');
    }

    const url = buildApiUrl(API_ENDPOINTS.consultations.list);
    const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;

    const response = await axios.get(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching consultations:', error);
    throw error;
  }
};

/**
 * Get specific consultation details
 */
export const getConsultationById = async (consultationId: number): Promise<{ success: boolean; data: Consultation }> => {
  try {
    // Check for accessToken first (from AuthContext), fallback to authToken (from signup)
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(
      buildApiUrl(`${API_ENDPOINTS.consultations.detail}${consultationId}/`),
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching consultation details:', error);
    throw error;
  }
};

/**
 * Cancel a consultation
 */
export const cancelConsultation = async (
  consultationId: number,
  reason?: string
): Promise<ApiResponse<Consultation>> => {
  try {
    // Check for accessToken first (from AuthContext), fallback to authToken (from signup)
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(
      buildApiUrl(`${API_ENDPOINTS.consultations.cancel}${consultationId}/cancel/`),
      { reason },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Error cancelling consultation:', error);
    throw error;
  }
};

/**
 * Start a consultation (debug/controlled invocation)
 */
export const startConsultation = async (
  consultationId: number,
  options?: { force?: boolean }
): Promise<ApiResponse<Consultation>> => {
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(
      buildApiUrl(`${API_ENDPOINTS.consultations.detail}${consultationId}/start/`),
      { force: options?.force ?? false },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Error starting consultation:', error);
    throw error;
  }
};

/**
 * Complete a consultation manually (allowed for either participant while in progress)
 */
export const completeConsultation = async (
  consultationId: number
): Promise<ApiResponse<Consultation>> => {
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    const response = await axios.post(
      buildApiUrl(`${API_ENDPOINTS.consultations.detail}${consultationId}/complete/`),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error completing consultation:', error);
    throw error;
  }
};

/**
 * (DEBUG) Shift consultation time to now server-side
 */
export const debugSetConsultationNow = async (consultationId: number): Promise<ApiResponse<Consultation>> => {
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    const response = await axios.post(
      buildApiUrl(`${API_ENDPOINTS.consultations.detail}${consultationId}/debug_set_now/`),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error shifting consultation time (debug):', error);
    throw error;
  }
};

/**
 * Check if consultation time has arrived (frontend validation)
 */
export const isConsultationTimeReady = (consultation: Consultation): boolean => {
  const now = new Date();
  const consultationDateTime = new Date(`${consultation.time_slot_info.date}T${consultation.time_slot_info.start_time}`);
  
  // Allow access 15 minutes before consultation time
  const accessTime = new Date(consultationDateTime.getTime() - (15 * 60 * 1000));
  
  return now >= accessTime && consultation.status_info.name === 'confirmed';
};

/**
 * Get time remaining until consultation
 */
export const getTimeUntilConsultation = (consultation: Consultation): {
  days: number;
  hours: number;
  minutes: number;
  isReady: boolean;
} => {
  const now = new Date();
  const consultationDateTime = new Date(`${consultation.time_slot_info.date}T${consultation.time_slot_info.start_time}`);
  const accessTime = new Date(consultationDateTime.getTime() - (15 * 60 * 1000));
  
  const timeDiff = accessTime.getTime() - now.getTime();
  
  if (timeDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isReady: true };
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, isReady: false };
};

/**
 * Create or reuse Zoom meeting for a consultation
 */
export const createOrGetZoomMeeting = async (
  consultationId: number,
  payload?: { scheduled_at?: string; duration_minutes?: number; topic?: string }
): Promise<ApiResponse<ZoomMeeting>> => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token not found');
  const response = await axios.post(
    buildApiUrl(`${API_ENDPOINTS.consultations.detail}${consultationId}/zoom/meetings/`),
    payload || {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

/**
 * Fetch attendee signature to join Zoom Meeting SDK
 */
export const getZoomSignature = async (
  consultationId: number,
  meetingId: string,
  role: 'attendee' = 'attendee'
): Promise<ApiResponse<ZoomSignaturePayload>> => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token not found');
  const response = await axios.post(
    buildApiUrl(`${API_ENDPOINTS.consultations.detail}${consultationId}/zoom/meetings/${meetingId}/signature/`),
    { role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
