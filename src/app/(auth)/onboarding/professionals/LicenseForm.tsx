'use client';

import React, { useCallback, useMemo, useState } from "react";
import { Calendar as CalendarIcon, CheckCircle, Upload } from "lucide-react";
import { format } from "date-fns";
import { countries, Country } from "@/data/countries";
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
  "Barrister & Solicitor License",
  "Patent Attorney License",
  "Notary Public License",
  "Advocate of the Supreme Court",
  "State or Provincial Bar License",
  "Foreign Legal Consultant (FLC)",
  "Provisional or Temporary License",
  "Legal Practitioner",
];

const LicenseForm: React.FC<LicenseFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    licenseType: "",
  });

  const [dateOfIncorporation, setDateOfIncorporation] = useState<Date>();
  const [selectedCountry, setSelectedCountry] = useState<Country>({ name: "Nigeria", code: "NG", flag: "🇳🇬" });
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountries = useMemo(() => {
    return countries.filter((country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("License Info:", {
        ...formData,
        dateOfIncorporation: dateOfIncorporation ? format(dateOfIncorporation, "dd/MM/yyyy") : "",
        country: selectedCountry,
        uploadedFile,
      });
      onNext();
    },
    [formData, dateOfIncorporation, selectedCountry, uploadedFile, onNext]
  );

  const isFormValid = formData.licenseType && dateOfIncorporation && uploadedFile;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date of Incorporation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Incorporation
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full px-4 py-2 border border-gray-200 rounded-lg text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-all",
                !dateOfIncorporation && "text-gray-400"
              )}
            >
              <span>
                {dateOfIncorporation
                  ? format(dateOfIncorporation, "dd/MM/yyyy")
                  : "DD/MM/YYYY"}
              </span>
              <CalendarIcon size={20} className="text-gray-400" />
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
              className="p-3"
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* License Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type of Licence
        </label>
        <Select
          value={formData.licenseType}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, licenseType: value }))
          }
        >
          <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all">
            <SelectValue placeholder="Select a license type" />
          </SelectTrigger>
          <SelectContent>
            {licenseTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Country of Incorporation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country of Incorporation
        </label>
        <Select
          value={selectedCountry.name}
          onValueChange={(value) => {
            const country = countries.find((c) => c.name === value);
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded"
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
          Upload Proof of Licence
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
          {uploadedFile ? (
            <div className="space-y-2">
              <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center">
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
              <div className="w-14 h-14 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <Upload size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Click to upload</p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG, GIF</p>
              <input
                id="license-file-upload"
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.gif"
                className="hidden"
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
        Continue
      </button>
    </form>
  );
};

export default LicenseForm;
