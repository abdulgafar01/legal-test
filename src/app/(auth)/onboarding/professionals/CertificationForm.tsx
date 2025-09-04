'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { usePractitionerFormStore } from '@/stores/usePractitionerFormStore';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, FileText, Calendar as CalendarIcon, Award } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCountries } from '@/hooks/useCountries';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Country } from '@/data/countries';

interface CertificationFormProps {
  onNext: () => void;
}

const certificationTypeOptions = [
  { value: "call_to_bar", label: "Call to Bar Certificate" },
  { value: "legal_practice", label: "Legal Practice Certificate" },
  { value: "continuing_education", label: "Continuing Legal Education" },
  { value: "specialization", label: "Specialization Certificate" },
  { value: "professional_development", label: "Professional Development Certificate" },
  { value: "court_admission", label: "Court Admission Certificate" },
  { value: "mediation", label: "Mediation Certificate" },
  { value: "arbitration", label: "Arbitration Certificate" },
  { value: "notary", label: "Notary Certificate" },
  { value: "other", label: "Other Certificate" },
];

interface Certification {
  certification_type: string;
  title: string;
  date_of_incorporation: string;
  country_of_incorporation: string;
  issuing_organization: string;
  certificate_number?: string;
  expiry_date?: string;
  description?: string;
  files: File[];
}

const CertificationForm: React.FC<CertificationFormProps> = ({ onNext }) => {
  const { formData, updateCertifications } = usePractitionerFormStore();
  const { data: countries = [] } = useCountries();
  
  const [certifications, setCertifications] = useState<Certification[]>(
    formData.certifications.length > 0 ? formData.certifications : [
      {
        certification_type: '',
        title: '',
        date_of_incorporation: '',
        country_of_incorporation: '',
        issuing_organization: '',
        certificate_number: '',
        expiry_date: '',
        description: '',
        files: []
      }
    ]
  );

  const addCertification = () => {
    setCertifications(prev => [...prev, {
      certification_type: '',
      title: '',
      date_of_incorporation: '',
      country_of_incorporation: '',
      issuing_organization: '',
      certificate_number: '',
      expiry_date: '',
      description: '',
      files: []
    }]);
  };

  const removeCertification = (index: number) => {
    if (certifications.length > 1) {
      setCertifications(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateCertification = (index: number, field: keyof Certification, value: string | File[]) => {
    setCertifications(prev => prev.map((cert, i) => 
      i === index ? { ...cert, [field]: value } : cert
    ));
  };

  const handleFileUpload = (index: number, files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      updateCertification(index, 'files', fileArray);
      toast.success(`${fileArray.length} file(s) uploaded for certification ${index + 1}`);
    }
  };

  const handleDateChange = (index: number, field: 'date_of_incorporation' | 'expiry_date', date: Date | undefined) => {
    if (date) {
      updateCertification(index, field, format(date, 'yyyy-MM-dd'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one certification with required fields
    const validCertifications = certifications.filter(cert => 
      cert.certification_type && 
      cert.title && 
      cert.date_of_incorporation && 
      cert.country_of_incorporation &&
      cert.issuing_organization
    );

    if (validCertifications.length === 0) {
      toast.error('Please add at least one valid certification with all required fields');
      return;
    }

    updateCertifications(validCertifications);
    toast.success(`${validCertifications.length} certification(s) added!`);
    onNext();
  };

  const isFormValid = certifications.some(cert => 
    cert.certification_type && 
    cert.title && 
    cert.date_of_incorporation && 
    cert.country_of_incorporation &&
    cert.issuing_organization
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Award size={20} />
          Professional Certifications
        </h3>
        <button
          type="button"
          onClick={addCertification}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus size={16} />
          Add Certification
        </button>
      </div>

      <div className="space-y-6">
        {certifications.map((certification, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Certification #{index + 1}
              </span>
              {certifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Certification Type and Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Type *
                </label>
                <Select
                  value={certification.certification_type}
                  onValueChange={(value) => updateCertification(index, 'certification_type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select certification type" />
                  </SelectTrigger>
                  <SelectContent>
                    {certificationTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call to Bar Certificate"
                  value={certification.title}
                  onChange={(e) => updateCertification(index, 'title', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                  required
                />
              </div>
            </div>

            {/* Date of Incorporation and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Incorporation *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full px-4 py-2 border border-gray-200 rounded-lg text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-all",
                        !certification.date_of_incorporation && "text-gray-400"
                      )}
                    >
                      <span>
                        {certification.date_of_incorporation ? format(new Date(certification.date_of_incorporation), "dd/MM/yyyy") : "DD/MM/YYYY"}
                      </span>
                      <CalendarIcon size={20} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={certification.date_of_incorporation ? new Date(certification.date_of_incorporation) : undefined}
                      onSelect={(date) => handleDateChange(index, 'date_of_incorporation', date)}
                      disabled={date => date > new Date()}
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country of Incorporation *
                </label>
                <Select
                  value={certification.country_of_incorporation}
                  onValueChange={(value) => updateCertification(index, 'country_of_incorporation', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-auto">
                    {countries.map((country: Country) => (
                      <SelectItem key={country.code} value={country.name}>
                        <div className="flex items-center gap-2">
                          <Icon
                            icon={`flag:${country.code.toLowerCase()}-4x3`}
                            className="h-4 w-4 rounded-sm"
                          />
                          <span>{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Issuing Organization and Certificate Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York State Bar"
                  value={certification.issuing_organization}
                  onChange={(e) => updateCertification(index, 'issuing_organization', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. NY-BAR-2020-5678"
                  value={certification.certificate_number}
                  onChange={(e) => updateCertification(index, 'certificate_number', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                />
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date (Optional)
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-4 py-2 border border-gray-200 rounded-lg text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-all",
                      !certification.expiry_date && "text-gray-400"
                    )}
                  >
                    <span>
                      {certification.expiry_date ? format(new Date(certification.expiry_date), "dd/MM/yyyy") : "DD/MM/YYYY (Optional)"}
                    </span>
                    <CalendarIcon size={20} className="text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={certification.expiry_date ? new Date(certification.expiry_date) : undefined}
                    onSelect={(date) => handleDateChange(index, 'expiry_date', date)}
                    disabled={date => date < new Date()}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                placeholder="Brief description of this certification..."
                value={certification.description}
                onChange={(e) => updateCertification(index, 'description', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                rows={2}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  id={`cert-files-${index}`}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(index, e.target.files)}
                  className="hidden"
                />
                <label
                  htmlFor={`cert-files-${index}`}
                  className="flex flex-col items-center cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm font-medium">Upload Certificate Documents</span>
                  <span className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB each)</span>
                </label>
                
                {certification.files.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {certification.files.map((file, fileIndex) => (
                      <div key={fileIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText size={16} />
                        <span>{file.name}</span>
                        <span className="text-gray-400">({Math.round(file.size / 1024)} KB)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className={cn(
          "w-full py-2 px-4 rounded-full font-semibold transition-colors text-sm",
          isFormValid
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        )}
      >
        Next
      </button>
    </form>
  );
};

export default CertificationForm;
