import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PractitionerFormData {
  // Personal Information
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  date_of_birth: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  qualification: string;
  experience_level: string;
  years_of_experience: string;
  hourly_rate: string;
  bio?: string;
  education?: string;

  // License Information
  licenses: Array<{
    license_type: string;
    date_of_incorporation: string;
    country_of_incorporation: string;
    license_number: string;
    issuing_authority: string;
    expiry_date?: string;
    notes?: string;
    files: File[];
  }>;

  // Certification Information
  certifications: Array<{
    certification_type: string;
    title: string;
    date_of_incorporation: string;
    country_of_incorporation: string;
    issuing_organization: string;
    certificate_number?: string;
    expiry_date?: string;
    description?: string;
    files: File[];
  }>;

  // Specializations
  specializations: string[];

  // Experience
  experiences: Array<{
    position_title: string;
    company_name: string;
    employment_type: string;
    start_date: string;
    end_date?: string;
    location: string;
    description: string;
    skills_used: string;
    is_current: boolean;
  }>;

  // Additional documents
  additional_documents?: File[];
  practitioner_notes?: string;
}

interface PractitionerFormStore {
  formData: PractitionerFormData;
  updatePersonalInfo: (data: Partial<PractitionerFormData>) => void;
  updateLicenses: (licenses: PractitionerFormData['licenses']) => void;
  updateCertifications: (certifications: PractitionerFormData['certifications']) => void;
  updateSpecializations: (specializations: string[]) => void;
  updateExperiences: (experiences: PractitionerFormData['experiences']) => void;
  updateAdditionalInfo: (data: { additional_documents?: File[]; practitioner_notes?: string }) => void;
  clearFormData: () => void;
  getFormData: () => PractitionerFormData;
}

const initialFormData: PractitionerFormData = {
  first_name: '',
  last_name: '',
  middle_name: '',
  email:'',
  date_of_birth: '',
  phone_number: '',
  country: '',
  state: '',
  city: '',
  qualification: '',
  experience_level: '',
  years_of_experience: '',
  hourly_rate: '',
  bio: '',
  education: '',
  licenses: [],
  certifications: [],
  specializations: [],
  experiences: [],
  additional_documents: [],
  practitioner_notes: '',
};

export const usePractitionerFormStore = create<PractitionerFormStore>()(
  persist(
    (set, get) => ({
      formData: initialFormData,

      updatePersonalInfo: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),

      updateLicenses: (licenses) =>
        set((state) => ({
          formData: { ...state.formData, licenses }
        })),

      updateCertifications: (certifications) =>
        set((state) => ({
          formData: { ...state.formData, certifications }
        })),

      updateSpecializations: (specializations) =>
        set((state) => ({
          formData: { ...state.formData, specializations }
        })),

      updateExperiences: (experiences) =>
        set((state) => ({
          formData: { ...state.formData, experiences }
        })),

      updateAdditionalInfo: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),

      clearFormData: () => set({ formData: initialFormData }),

      getFormData: () => get().formData,
    }),
    {
      name: 'practitioner-form-storage',
      // Only persist non-file data to avoid localStorage size issues
      partialize: (state) => ({
        formData: {
          ...state.formData,
          licenses: state.formData.licenses.map(license => ({ ...license, files: [] })),
          certifications: state.formData.certifications.map(cert => ({ ...cert, files: [] })),
          additional_documents: [],
        }
      }),
    }
  )
);
