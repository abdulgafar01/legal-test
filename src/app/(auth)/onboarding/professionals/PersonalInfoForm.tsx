'use client';

import React, { useCallback, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
// import { countries, Country } from '@/data/countries1';
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
import { useCountries } from '@/hooks/useCountries';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Country } from '@/data/countries';
import { submitPersonalInfo } from '@/lib/api/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/lib/types';

interface PersonalInfoFormProps {
  onNext: () => void;
}

const qualificationOptions = [
  { value: "llb", label: "Bachelor of Laws (LLB)" },
  { value: "jd", label: "Juris Doctor (JD)" },
  { value: "llm", label: "Master of Laws (LLM)" },
  { value: "phd_law", label: "Doctor of Philosophy in Law (PhD)" },
  { value: "sjd", label: "Doctor of Juridical Science (SJD)" },
  { value: "diploma_law", label: "Diploma in Law" },
  { value: "certificate_law", label: "Certificate in Law" },
  { value: "bar_admission", label: "Bar Admission Certificate" },
  { value: "solicitor", label: "Solicitor Qualification" },
  { value: "barrister", label: "Barrister Qualification" },
  { value: "other", label: "Other Legal Qualification" },
];

const experience_level = [
  'junior',
  'senior',
];

const InputField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-200 rounded-lg transition-all"
      required={required}
    />
  </div>
);

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    qualification: '',
    state: '',
    city: '',
    license_number: '',
    phone_number: '',
    experience_level: '',
    years_of_experience: '',
    hourly_rate: '',
  });

  const [date_of_birth, setDateOfBirth] = useState<Date>();
  // const [selectedCountry, setSelectedCountry] = useState<Country>({
  //   name: "Nigeria",
  //   code: "NG",
  //   flag: "🇳🇬"
  // });
  // const [countrySearch, setCountrySearch] = useState('');

  const { data: countries = [] } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

  // const filteredCountries = useMemo(() => {
  //   return countries.filter(country =>
  //     country.name.toLowerCase().includes(countrySearch.toLowerCase())
  //   );
  // }, [countrySearch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  
    const mutation = useMutation({
      mutationFn: submitPersonalInfo,
      onSuccess: () => {
        toast.success("Personal info saved successfully!");
        onNext();
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        console.error("Error submitting personal info:", error);

        // Safely extract message from API error shape
        const message =
          error?.response?.data?.error?.message ||        
          error?.message ||                   
          "Failed to save personal info";

        toast.error(message);
      },
    });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // console.log('Personal Info:', {
      //   ...formData,
      //   dateOfBirth: dateOfBirth ? format(dateOfBirth, 'yyyy/MM/dd') : '',
      //  country: selectedCountry ? selectedCountry.name : "",
      // });
      const storedEmail = localStorage.getItem('userEmail');
      

       const payload = {
      ...formData,
      date_of_birth: date_of_birth ? format(date_of_birth, "yyyy-MM-dd") : "",
      country: selectedCountry ? selectedCountry.name : "",
      email: storedEmail,

    };
      mutation.mutate(payload);
      console.log("Submitted Data:", payload);
      
    },
    [formData, date_of_birth, selectedCountry, onNext]
  );
  
const isFormValid = formData.first_name.trim() &&
                    formData.last_name.trim() &&
                    formData.qualification.trim() &&
                    date_of_birth;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="First Name"
        name="first_name"
        placeholder="e.g. John"
        value={formData.first_name}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Last Name"
        name="last_name"
        placeholder="e.g. Doe"
        value={formData.last_name}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Middle Name (optional)"
        name="middle_name"
        placeholder="e.g. Sam"
        value={formData.middle_name}
        onChange={handleInputChange}
      />

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full px-4 py-2 border border-gray-200 rounded-lg text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-all",
                !date_of_birth && "text-gray-400"
              )}
            >
              <span>
                {date_of_birth ? format(date_of_birth, "dd/MM/yyyy") : "DD/MM/YYYY"}
              </span>
              <CalendarIcon size={20} className="text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date_of_birth}
              onSelect={setDateOfBirth}
              disabled={date =>
                date > new Date() || date < new Date("1900-01-01")
              }
              className="p-3"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Qualification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Qualification
        </label>
        <Select
          value={formData.qualification}
          onValueChange={(value) => setFormData(prev => ({ ...prev, qualification: value }))}
        >
          <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg transition-all">
            <SelectValue placeholder="Select qualification" />
          </SelectTrigger>
          <SelectContent>
            {qualificationOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Level
        </label>
        <Select
          value={formData.experience_level}
          onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
        >
          <SelectTrigger className="w-full px-5 py-3 border border-gray-200 rounded-lg transition-all">
            <SelectValue placeholder="Select qualification" />
          </SelectTrigger>
          <SelectContent>
            {experience_level.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Country */}
      {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country of Residence
          </label>
          <Select
            value={selectedCountry.flag}
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
          {filteredCountries.map(country => (
            <SelectItem key={country.code} value={country.name}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div> */}

    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Country of Residence
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
          {/* state and city */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
              label="state"
              name="state"
              placeholder="e.g. Lagos"
              value={formData.state}
              onChange={handleInputChange}
            />

              <InputField
              label="city"
              name="city"
              placeholder="e.g. Laos"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>

          {/* phone_number and license_number */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
              label="phone number"
              name="phone_number"
              placeholder="e.g. +2348012345678"
              value={formData.phone_number}
              onChange={handleInputChange}
            />

              <InputField
              label="license number"
              name="license_number"
              placeholder="e.g. ABC123456"
              value={formData.license_number}
              onChange={handleInputChange}
            />
          </div>

          {/* hourly rate and years of experience */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
              label="hourly rate"
              name="hourly_rate"
              placeholder="e.g. 250.00 in USD"
              value={formData.hourly_rate}
              onChange={handleInputChange}
            />

              <InputField
              label="years of experience"
              name="years_of_experience"
              placeholder="e.g. 5 in years"
              value={formData.years_of_experience}
              onChange={handleInputChange}
            />
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
          {mutation.isPending ? "Saving..." : "Next"}
        </button>

    </form>
  );
};

export default PersonalInfoForm;
