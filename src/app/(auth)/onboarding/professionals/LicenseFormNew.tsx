'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { usePractitionerFormStore } from '@/stores/usePractitionerFormStore';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, FileText, Calendar as CalendarIcon } from 'lucide-react';
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

interface LicenseFormProps {
  onNext: () => void;
}

interface License {
  license_type: string;
  license_number: string;
  issuing_jurisdiction: string;
  date_granted: string;
  expiry_date?: string;
  status: string;
  description?: string;
  files: File[];
}

const LicenseForm: React.FC<LicenseFormProps> = ({ onNext }) => {
  const { formData, updateLicenses } = usePractitionerFormStore();
  const { data: countries = [] } = useCountries();
  
  const [licenses, setLicenses] = useState<License[]>(
    formData.licenses.length > 0 ? formData.licenses : [
      {
        license_type: '',
        license_number: '',
        issuing_jurisdiction: '',
        date_granted: '',
        expiry_date: '',
        status: 'active',
        description: '',
        files: []
      }
    ]
  );

  const addLicense = () => {
    setLicenses(prev => [...prev, {
      license_type: '',
      license_number: '',
      issuing_jurisdiction: '',
      date_granted: '',
      expiry_date: '',
      status: 'active',
      description: '',
      files: []
    }]);
  };

  const removeLicense = (index: number) => {
    if (licenses.length > 1) {
      setLicenses(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateLicense = (index: number, field: keyof License, value: string | File[]) => {
    setLicenses(prev => prev.map((license, i) => 
      i === index ? { ...license, [field]: value } : license
    ));
  };

  const handleFileUpload = (index: number, files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      updateLicense(index, 'files', fileArray);
      toast.success(`${fileArray.length} file(s) uploaded for license ${index + 1}`);
    }
  };

  const handleDateChange = (index: number, field: 'date_granted' | 'expiry_date', date: Date | undefined) => {
    if (date) {
      updateLicense(index, field, format(date, 'yyyy-MM-dd'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one license with required fields
    const validLicenses = licenses.filter(license => 
      license.license_type && 
      license.license_number && 
      license.issuing_jurisdiction && 
      license.date_granted
    );

    if (validLicenses.length === 0) {
      toast.error('Please add at least one valid license with all required fields');
      return;
    }

    updateLicenses(validLicenses);
    toast.success(`${validLicenses.length} license(s) added!`);
    onNext();
  };

  const isFormValid = licenses.some(license => 
    license.license_type && 
    license.license_number && 
    license.issuing_jurisdiction && 
    license.date_granted
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Professional Licenses</h3>
        <button
          type="button"
          onClick={addLicense}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus size={16} />
          Add License
        </button>
      </div>

      <div className="space-y-6">
        {licenses.map((license, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                License #{index + 1}
              </span>
              {licenses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLicense(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* License Type and Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Type *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bar License"
                  value={license.license_type}
                  onChange={(e) => updateLicense(index, 'license_type', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. NY-BAR-2020-1234"
                  value={license.license_number}
                  onChange={(e) => updateLicense(index, 'license_number', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                  required
                />
              </div>
            </div>

            {/* Issuing Jurisdiction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issuing Jurisdiction *
              </label>
              <Select
                value={license.issuing_jurisdiction}
                onValueChange={(value) => updateLicense(index, 'issuing_jurisdiction', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country/jurisdiction" />
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

            {/* Date Granted and Expiry Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Granted *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full px-4 py-2 border border-gray-200 rounded-lg text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-all",
                        !license.date_granted && "text-gray-400"
                      )}
                    >
                      <span>
                        {license.date_granted ? format(new Date(license.date_granted), "dd/MM/yyyy") : "DD/MM/YYYY"}
                      </span>
                      <CalendarIcon size={20} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={license.date_granted ? new Date(license.date_granted) : undefined}
                      onSelect={(date) => handleDateChange(index, 'date_granted', date)}
                      disabled={date => date > new Date()}
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>

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
                        !license.expiry_date && "text-gray-400"
                      )}
                    >
                      <span>
                        {license.expiry_date ? format(new Date(license.expiry_date), "dd/MM/yyyy") : "DD/MM/YYYY (Optional)"}
                      </span>
                      <CalendarIcon size={20} className="text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={license.expiry_date ? new Date(license.expiry_date) : undefined}
                      onSelect={(date) => handleDateChange(index, 'expiry_date', date)}
                      disabled={date => date < new Date()}
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Status and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={license.status}
                  onValueChange={(value) => updateLicense(index, 'status', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Brief description..."
                  value={license.description}
                  onChange={(e) => updateLicense(index, 'description', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  id={`license-files-${index}`}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(index, e.target.files)}
                  className="hidden"
                />
                <label
                  htmlFor={`license-files-${index}`}
                  className="flex flex-col items-center cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm font-medium">Upload License Documents</span>
                  <span className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB each)</span>
                </label>
                
                {license.files.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {license.files.map((file, fileIndex) => (
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

export default LicenseForm;
