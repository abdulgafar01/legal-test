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

// Submit Personal Info for legal practitioners
export const submitPersonalInfo = async (data:unknown) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await axios.post(
    `${API_BASE_URL}/auth/practitioner_complete_profile/`, 
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// Submit License Info
export const submitLicense = async ( data: unknown) => {
  const accessToken = localStorage.getItem("accessToken");

const { files, ...licensePayload } = data as Record<string, any>;

  // create a license
 const licenseRes = await axios.post(
    `${API_BASE_URL}/licenses/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

 const licenseId =
    licenseRes.data?.data?.id || licenseRes.data?.id || null;

  if (!licenseId) {
    console.error("Unexpected license response:", licenseRes.data);
    throw new Error("License ID not returned from API");
  };

 // Step 2: Upload file
  const formData = new FormData();
  formData.append("files", files);
  formData.append("description", "License document")
  

  await axios.post(
    `${API_BASE_URL}/licenses/${licenseId}/files/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return licenseRes.data;

};




// Submit Certificate Info
export const submitCertificate = async (data:unknown) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await axios.post(
    `${API_BASE_URL}/certificates/`, 
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};


//  VERIFY EMAIL
//  Now returns { email, tokens: { access, refresh } } so client can proceed without separate login.
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