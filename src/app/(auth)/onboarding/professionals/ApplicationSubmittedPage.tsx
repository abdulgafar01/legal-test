'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { usePractitionerFormStore } from '@/stores/usePractitionerFormStore';
import { submitPractitionerApplication } from '@/lib/api/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { FileText, User, Award, Briefcase, CheckCircle } from 'lucide-react';

interface ApplicationSubmittedPageProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ApplicationSubmittedPage: React.FC<ApplicationSubmittedPageProps> = ({ onSubmit, isSubmitting }) => {
  const { formData } = usePractitionerFormStore();

  const mutation = useMutation({
    mutationFn: submitPractitionerApplication,
    onSuccess: (data) => {
      toast.success('Application submitted successfully!');
      onSubmit();
    },
    onError: (error: AxiosError) => {
      console.error("Submission error:", error);
      const message = (error?.response?.data as any)?.error?.message || 
                     error?.message || 
                     "Failed to submit application";
      toast.error(message);
    },
  });

  const handleFinalSubmit = async () => {
    try {
      // Validate required data before submission
      if (formData.licenses.length === 0 || !formData.licenses[0].license_number) {
        toast.error('Please add at least one license with a license number.');
        return;
      }
      
      const hasLicenseDocument = formData.licenses.some(license => license.files.length > 0);
      if (!hasLicenseDocument) {
        toast.error('Please upload at least one license document.');
        return;
      }
      
      // Prepare the complete form data for submission
      const submissionData = new FormData();
      
      // Add personal information
      submissionData.append('email', localStorage.getItem('userEmail') || '');
      submissionData.append('first_name', formData.first_name);
      submissionData.append('last_name', formData.last_name);
      if (formData.middle_name) submissionData.append('middle_name', formData.middle_name);
      submissionData.append('date_of_birth', formData.date_of_birth);
      submissionData.append('phone_number', formData.phone_number);
      submissionData.append('country', formData.country);
      submissionData.append('state', formData.state);
      submissionData.append('city', formData.city);
      submissionData.append('qualification', formData.qualification);
      submissionData.append('experience_level', formData.experience_level);
      submissionData.append('years_of_experience', formData.years_of_experience);
      submissionData.append('hourly_rate', formData.hourly_rate);
      
      // Add license number (required field) - take from first license
      if (formData.licenses.length > 0) {
        submissionData.append('license_number', formData.licenses[0].license_number);
      }
      
      if (formData.bio) submissionData.append('bio', formData.bio);
      if (formData.education) submissionData.append('education', formData.education);

      // Add specializations
      submissionData.append('specializations', JSON.stringify(formData.specializations));

      // Add license documents (combine all license files into one for now)
      const allLicenseFiles = formData.licenses.flatMap(license => license.files);
      if (allLicenseFiles.length > 0) {
        submissionData.append('license_document', allLicenseFiles[0]);
      }

      // Add certification documents
      const allCertFiles = formData.certifications.flatMap(cert => cert.files);
      if (allCertFiles.length > 0) {
        submissionData.append('degree_certificate', allCertFiles[0]);
      }

      // Add additional documents
      if (formData.additional_documents && formData.additional_documents.length > 0) {
        submissionData.append('additional_documents', formData.additional_documents[0]);
      }

      // Add practitioner notes
      if (formData.practitioner_notes) {
        submissionData.append('practitioner_notes', formData.practitioner_notes);
      }

      await mutation.mutateAsync(submissionData);
    } catch (error) {
      console.error('Final submission error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ready to Submit Your Application
        </h3>
        <p className="text-gray-600 text-sm">
          Please review your information before submitting for admin review.
        </p>
      </div>

      {/* Summary Sections */}
      <div className="space-y-4">
        {/* Personal Information Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <User size={18} className="text-gray-600" />
            <h4 className="font-medium text-gray-900">Personal Information</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium">{formData.first_name} {formData.last_name}</p>
            </div>
            <div>
              <span className="text-gray-600">Country:</span>
              <p className="font-medium">{formData.country}</p>
            </div>
            <div>
              <span className="text-gray-600">Qualification:</span>
              <p className="font-medium">{formData.qualification}</p>
            </div>
            <div>
              <span className="text-gray-600">Experience:</span>
              <p className="font-medium">{formData.experience_level} ({formData.years_of_experience} years)</p>
            </div>
          </div>
        </div>

        {/* Licenses Summary */}
        {formData.licenses.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-gray-600" />
              <h4 className="font-medium text-gray-900">Licenses ({formData.licenses.length})</h4>
            </div>
            <div className="space-y-2">
              {formData.licenses.map((license, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium">{license.license_type}</p>
                  <p className="text-gray-600">{license.issuing_authority} - {license.license_number}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Summary */}
        {formData.certifications.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-gray-600" />
              <h4 className="font-medium text-gray-900">Certifications ({formData.certifications.length})</h4>
            </div>
            <div className="space-y-2">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium">{cert.title}</p>
                  <p className="text-gray-600">{cert.issuing_organization}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specializations Summary */}
        {formData.specializations.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={18} className="text-gray-600" />
              <h4 className="font-medium text-gray-900">Specializations ({formData.specializations.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specializations.map((spec, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Summary */}
        {formData.experiences.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={18} className="text-gray-600" />
              <h4 className="font-medium text-gray-900">Experience ({formData.experiences.length})</h4>
            </div>
            <div className="space-y-2">
              {formData.experiences.slice(0, 2).map((exp, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium">{exp.position_title}</p>
                  <p className="text-gray-600">{exp.company_name} ({exp.employment_type})</p>
                </div>
              ))}
              {formData.experiences.length > 2 && (
                <p className="text-xs text-gray-500">
                  ...and {formData.experiences.length - 2} more
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your application will be reviewed by our admin team</li>
          <li>• You'll receive an email notification once reviewed</li>
          <li>• Approved practitioners can access the full dashboard</li>
          <li>• Review typically takes 2-3 business days</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={handleFinalSubmit}
        disabled={mutation.isPending || isSubmitting}
        className={cn(
          "w-full py-3 px-4 rounded-full font-semibold transition-colors text-sm",
          "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        )}
      >
        {mutation.isPending || isSubmitting ? 'Submitting Application...' : 'Submit Application for Review'}
      </button>
    </div>
  );
};

export default ApplicationSubmittedPage;
