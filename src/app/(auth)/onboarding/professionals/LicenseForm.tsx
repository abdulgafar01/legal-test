'use client';

import React, { useCallback, useState } from "react";
import { Calendar as CalendarIcon, CheckCircle, Upload } from "lucide-react";
import { format } from "date-fns";
// import { countries, Country } from "@/data/countries1";
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
import { useMutation } from "@tanstack/react-query";
// import { submitLicense } from "@/lib/api/auth";
import { useCountries } from '@/hooks/useCountries';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Country } from '@/data/countries';
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/lib/types";
import { submitLicense } from "@/lib/api/auth";

interface LicenseFormProps {
  onNext: () => void;
}

const license_types = [
  "barrister_solicitor",
  // "barrister_solicitor",
  // "barrister_solicitor",
  // "barrister_solicitor",
  // "barrister_solicitor",
  // "barrister_solicitor",
  // "barrister_solicitor",
  // "barrister_solicitor",
];

const LicenseForm: React.FC<LicenseFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    license_type: "",
  });

  const [date_of_incorporation, setDateOfIncorporation] = useState<Date>();
  // const [selectedCountry, setSelectedCountry] = useState<Country>({ name: "Nigeria", code: "NG", flag: "🇳🇬" });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // const [countrySearch, setCountrySearch] = useState("");

  // const filteredCountries = useMemo(() => {
  //   return countries.filter((country) =>
  //     country.name.toLowerCase().includes(countrySearch.toLowerCase())
  //   );
  // }, [countrySearch]);

    const { data: countries = [] } = useCountries();
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  }, []);

    const mutation = useMutation({
      mutationFn: submitLicense,
      onSuccess: () => {
        toast.success("License saved successfully!");
        onNext();
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        console.error("Error submitting practitioner license:", error);

        // Safely extract message from API error shape
        const message =
          // error?.response?.data?.error?.message ||
          error?.response?.data?.error?.details?.file||        
          error?.message ||                   
          "Failed to save practioner license";

        toast.error(message);
      },
    });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
       if (!uploadedFile || !date_of_incorporation) return;

      const payload = {
            
              ...formData,
              license_type: formData.license_type,
              date_of_incorporation: format(date_of_incorporation, "yyyy-MM-dd"),
              country_of_incorporation: selectedCountry ? selectedCountry.name : "",
             files: uploadedFile,
            
          };
  
            mutation.mutate(payload);
            console.log("Submitted Data:", payload);
    },
    [formData, date_of_incorporation, selectedCountry, uploadedFile, onNext]
  );

  const isFormValid = formData.license_type && date_of_incorporation && uploadedFile;

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
                !date_of_incorporation && "text-gray-400"
              )}
            >
              <span>
                {date_of_incorporation
                  ? format(date_of_incorporation, "yyyy-MM-dd")
                  : "DD/MM/YYYY"}
              </span>
              <CalendarIcon size={20} className="text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date_of_incorporation}
              onSelect={setDateOfIncorporation}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              className="p-3"
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
          value={formData.license_type}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, license_type: value }))
          }
        >
          <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all">
            <SelectValue placeholder="Select a license type" />
          </SelectTrigger>
          <SelectContent>
            {license_types.map((type) => (
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
               value={selectedCountry?.name}
               onValueChange={(value) => {
                 const country = countries.find((c: Country) => c.name === value);
                 if (country) setSelectedCountry(country);
               }}
             >
               <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all">
                 <SelectValue placeholder="Select country" />
               </SelectTrigger>
               <SelectContent className="max-h-60 overflow-auto">
                 {countries.map((country: Country ) => (
                   <SelectItem key={country.code} value={country.name}>
                     <div className="flex items-center gap-2">
                       <Icon
                         icon={`flag:${country.code.toLowerCase()}-4x3`}
                         className="h-5 w-5 rounded-sm"
                       />
                       <span>{country.name}</span>
                     </div>
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
              <p className="text-sm text-blue-600">{uploadedFile.name}</p>
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
        {mutation.isPending
                  ? 'Loading...'
                  : 'Continue'}
      </button>
    </form>
  );
};

export default LicenseForm;
