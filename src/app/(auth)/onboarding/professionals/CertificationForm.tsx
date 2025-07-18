"use client"

import React, { useState } from 'react';
import { Calendar, CheckCircle, Upload } from 'lucide-react';
import { countries, Country } from '@/data/countries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CertificationFormProps {
  onBack: () => void;
  onNext: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    certificationType: 'Call to Bar Certificate',
    dateOfIncorporation: '10/10/2021',
  });
  
  const [selectedCountry, setSelectedCountry] = useState<Country>({ 
    name: "Nigeria", 
    code: "NG", 
    flag: "🇳🇬" 
  });
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Certification Info:', { 
      ...formData, 
      country: selectedCountry,
      uploadedFile 
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type of Certification
        </label>
        <input
          type="text"
          name="certificationType"
          value={formData.certificationType}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of incorporation
        </label>
        <div className="relative">
          <input
            type="text"
            name="dateOfIncorporation"
            value={formData.dateOfIncorporation}
            onChange={handleInputChange}
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="DD/MM/YYYY"
            required
          />
          <Calendar size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country of incoporation
        </label>
        <Select value={selectedCountry.name} onValueChange={(value) => {
          const country = countries.find(c => c.name === value);
          if (country) setSelectedCountry(country);
        }}>
          <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <div className="flex items-center">
              <span className="text-xl mr-3">{selectedCountry.flag}</span>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60">
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
              <SelectItem key={country.code} value={country.name} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <span className="text-xl mr-3">{country.flag}</span>
                  <span>{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload proof of certification
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
          {uploadedFile ? (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">PDF (max. 200MB)</p>
                <p className="text-xs text-blue-600 mt-1">{uploadedFile}</p>
              </div>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 mx-auto"
              >
                Clear Upload
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <Upload size={24} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG or GIF (max. 800×400px)</p>
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.gif"
                className="hidden"
                id="cert-file-upload"
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

      <button
        type="submit"
        className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors text-lg"
      >
        Submit
      </button>
    </form>
  );
};

export default CertificationForm;
