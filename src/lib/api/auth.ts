import { seekerSchemaType } from '@/schemas/seekerSchema';
import axios from 'axios';
import instance from '../axios';
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';


// Register User
// This function is used to register a new user
// It requires an email, password, and confirm_password, and returns the user's data if successful
export const registerUser = async (data: {
  email: string;
  password: string;
  confirm_password: string;
}) => {
  const response = await instance.post(API_ENDPOINTS.auth.register, data, {
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
  const response = await instance.post(API_ENDPOINTS.auth.login, data, {
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
  const response = await instance.post(API_ENDPOINTS.auth.completeProfile, data,{
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// Submit Personal Info for legal practitioners
export const submitPersonalInfo = async (data:unknown) => {
  const response = await instance.post(
    API_ENDPOINTS.auth.practitionerCompleteProfile, 
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Submit Complete Practitioner Application
export const submitPractitionerApplication = async (data: FormData) => {
  const response = await instance.post(
    API_ENDPOINTS.auth.practitionerCompleteProfile,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Submit License Info
export const submitLicense = async ( data: unknown) => {
const { files, ...licensePayload } = data as Record<string, any>;

  // create a license
 const licenseRes = await instance.post(
    API_ENDPOINTS.licenses,
    data,
    {
      headers: {
        "Content-Type": "application/json",
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
  

  await instance.post(
    `${API_ENDPOINTS.licenses}${licenseId}/files/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return licenseRes.data;

};




// Submit Certificate Info
export const submitCertificate = async (data:unknown) => {
  const response = await instance.post(
    API_ENDPOINTS.certificates, 
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};


//  VERIFY EMAIL
//  Now returns { email, tokens: { access, refresh } } so client can proceed without separate login.
export const verifyEmail = async (data: { email: string;   verification_code: string }) => {
  const response = await instance.post(API_ENDPOINTS.auth.verifyEmail, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};


// RESEND VERIFICATION CODE
export const resendVerificationCode = async (email: string) => {
  const response = await instance.post(API_ENDPOINTS.auth.resendVerification, { email });
  return response.data;
};

// GET USER PROFILE
// This function is used to fetch the current user's profile data
// It requires an access token stored in localStorage for authentication
export const getCurrentUser = async () => {
  const response = await instance.get(API_ENDPOINTS.profile.me, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const getUserProfileImage = async () => {
  const response = await instance.get(API_ENDPOINTS.profile_image, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
}

// REFRESH TOKEN
// This function is used to refresh the access token using the refresh token
export const refreshToken = async (refresh: string) => {
  const response = await axios.post(
    buildApiUrl(API_ENDPOINTS.auth.tokenRefresh),
    { refresh },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};