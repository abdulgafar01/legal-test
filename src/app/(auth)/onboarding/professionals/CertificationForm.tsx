'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle, Upload } from 'lucide-react';
// import { format, parse } from 'date-fns';
import { countries, Country } from '@/data/countries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CertificationFormProps {
  onNext: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    certificationType: '',
    incorporationDate: '',
  });

  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "",
    code: "",
    flag: ""
  });
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    },
    []
  );

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Certification Info:', {
        ...formData,
        country: selectedCountry,
        uploadedFile
      });
      onNext();
    },
    [formData, selectedCountry, uploadedFile, onNext]
  );

  const isFormValid = formData.certificationType.trim() &&
                      formData.incorporationDate.trim() &&
                      uploadedFile;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Certification Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type of Certification
        </label>
        <input
          type="text"
          name="certificationType"
          value={formData.certificationType}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg transition-all"
          required
        />
      </div>

      {/* Date of Incorporation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Incorporation
          </label>
          <div className="relative">
            <input
              type="text"
              name="incorporationDate"
              value={formData.incorporationDate}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
              className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg transition-all"
              required
            />
            <CalendarIcon size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

      

      {/* Country of Incorporation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country of Incorporation
        </label>
        <Select
          value={selectedCountry.name}
          onValueChange={(value) => {
            const country = countries.find(c => c.name === value);
            if (country) setSelectedCountry(country);
          }}
        >
          <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-auto">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search countries..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {filteredCountries.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Proof of Certification
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
          {uploadedFile ? (
            <div className="space-y-2">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <p className="text-sm text-blue-600">{uploadedFile}</p>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Upload
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <Upload size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Click to upload</p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG or GIF</p>
              <input
                id="cert-file-upload"
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.gif"
                className="hidden"
              />
              <label
                htmlFor="cert-file-upload"
                className="inline-block bg-black text-white px-6 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors"
              >
                Browse Files
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
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
        Submit
      </button>
    </form>
  );
};

export default CertificationForm;
