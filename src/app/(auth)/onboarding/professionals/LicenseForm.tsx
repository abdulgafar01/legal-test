"use client"
import React, { useState } from 'react';
import { Calendar, CheckCircle, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { countries, Country } from '@/data/countries';
import { cn } from "@/lib/utils";
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

interface LicenseFormProps {
  onNext: () => void;
}

const licenseTypes = [
  'Barrister & Solicitor License',
  'Patent Attorney License',
  'Notary Public License',
  'Advocate of the Supreme Court',
  'State or Provincial Bar License',
  'Foreign Legal Consultant (FLC)',
  'Provisional or Temporary License',
  'Legal Practitioner'
];

const LicenseForm: React.FC<LicenseFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    licenseType: 'Barrister & Solicitor License',
  });
  
  const [dateOfIncorporation, setDateOfIncorporation] = useState<Date | undefined>(new Date(1999, 9, 18)); // Oct 18, 1999
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('License Info:', { 
      ...formData, 
      dateOfIncorporation: dateOfIncorporation ? format(dateOfIncorporation, 'dd/MM/yyyy') : '',
      country: selectedCountry,
      uploadedFile 
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of incorporation
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left flex items-center justify-between bg-white hover:bg-gray-50",
                !dateOfIncorporation && "text-gray-400"
              )}
            >
              <span>
                {dateOfIncorporation ? format(dateOfIncorporation, "dd/MM/yyyy") : "DD/MM/YYYY"}
              </span>
              <Calendar size={20} className="text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dateOfIncorporation}
              onSelect={setDateOfIncorporation}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type of Licence
        </label>
        <Select value={formData.licenseType} onValueChange={(value) => setFormData(prev => ({ ...prev, licenseType: value }))}>
          <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {licenseTypes.map((type) => (
              <SelectItem key={type} value={type} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          Upload proof of licence
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
                id="license-file-upload"
              />
              <label
                htmlFor="license-file-upload"
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
        Continue
      </button>
    </form>
  );
};

export default LicenseForm;
