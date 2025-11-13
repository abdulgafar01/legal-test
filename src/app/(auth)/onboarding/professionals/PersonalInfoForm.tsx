'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
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
import { usePractitionerFormStore } from '@/stores/usePractitionerFormStore';
import { toast } from 'sonner';

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

const experienceLevelOptions = [
  { value: "junior", label: "1-3 years" },
  { value: "mid", label: "4-7 years" },
  { value: "senior", label: "8-15 years" },
  { value: "expert", label: "15+ years" },
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
  const { formData, updatePersonalInfo } = usePractitionerFormStore();
  const { data: countries = [] } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date>();

  // Local form state - use function initialization to avoid re-rendering issues
  const [localFormData, setLocalFormData] = useState(() => ({
    first_name: formData.first_name || '',
    last_name: formData.last_name || '',
    middle_name: formData.middle_name || '',
    email:formData.email || '',
    qualification: formData.qualification || '',
    state: formData.state || '',
    city: formData.city || '',
    phone_number: formData.phone_number || '',
    experience_level: formData.experience_level || '',
    years_of_experience: formData.years_of_experience || '',
    hourly_rate: formData.hourly_rate || '',
    bio: formData.bio || '',
    education: formData.education || '',
  }));

  // Initialize existing data - add dependency optimization
  useEffect(() => {
    if (formData.date_of_birth && !dateOfBirth) {
      setDateOfBirth(new Date(formData.date_of_birth));
    }
  }, [formData.date_of_birth, dateOfBirth]);

  useEffect(() => {
    if (formData.country && countries.length > 0 && !selectedCountry) {
      const country = countries.find((c: Country) => c.name === formData.country);
      if (country) setSelectedCountry(country);
    }
  }, [formData.country, countries, selectedCountry]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLocalFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validation
      if (!localFormData.first_name.trim() || !localFormData.last_name.trim() || 
          !localFormData.qualification.trim() || !dateOfBirth) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Save to store
      const personalData = {
        ...localFormData,
        date_of_birth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : "",
        country: selectedCountry ? selectedCountry.name : "",
      };

      updatePersonalInfo(personalData);
      toast.success("Personal information saved!");
      onNext();
    },
    [localFormData, dateOfBirth, selectedCountry, updatePersonalInfo, onNext]
  );
  
  const isFormValid = localFormData.first_name.trim() &&
                    localFormData.last_name.trim() &&
                    localFormData.qualification.trim() &&
                    dateOfBirth;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="First Name"
        name="first_name"
        placeholder="e.g. John"
        value={localFormData.first_name}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Last Name"
        name="last_name"
        placeholder="e.g. Doe"
        value={localFormData.last_name}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Middle Name (optional)"
        name="middle_name"
        placeholder="e.g. Sam"
        value={localFormData.middle_name}
        onChange={handleInputChange}
      />
      <InputField
        label="Email"
        name="email"
        placeholder="sam@example.com"
        value={localFormData.email}
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
                !dateOfBirth && "text-gray-400"
              )}
            >
              <span>
                {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : "DD/MM/YYYY"}
              </span>
              <CalendarIcon size={20} className="text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dateOfBirth}
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
          value={localFormData.qualification || ""}
          onValueChange={(value) => setLocalFormData(prev => ({ ...prev, qualification: value }))}
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
          value={localFormData.experience_level || ""}
          onValueChange={(value) => setLocalFormData(prev => ({ ...prev, experience_level: value }))}
        >
          <SelectTrigger className="w-full px-5 py-3 border border-gray-200 rounded-lg transition-all">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            {experienceLevelOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country of Residence
        </label>
        <Select
          value={selectedCountry?.name || ""}
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
              label="State"
              name="state"
              placeholder="e.g. Lagos"
              value={localFormData.state}
              onChange={handleInputChange}
            />

              <InputField
              label="City"
              name="city"
              placeholder="e.g. Lagos"
              value={localFormData.city}
              onChange={handleInputChange}
            />
          </div>

          {/* phone_number and years_of_experience */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
              label="Phone Number"
              name="phone_number"
              placeholder="e.g. +2348012345678"
              value={localFormData.phone_number}
              onChange={handleInputChange}
            />

              <InputField
              label="Years of Experience"
              name="years_of_experience"
              placeholder="e.g. 5"
              value={localFormData.years_of_experience}
              onChange={handleInputChange}
            />
          </div>

          {/* hourly rate and bio */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
              label="Hourly Rate (USD)"
              name="hourly_rate"
              placeholder="e.g. 250.00"
              value={localFormData.hourly_rate}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              placeholder="Brief description about yourself..."
              value={localFormData.bio}
              onChange={(e) => setLocalFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-2 border border-gray-200 rounded-lg transition-all"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Education (Optional)
            </label>
            <textarea
              name="education"
              placeholder="Your educational background..."
              value={localFormData.education}
              onChange={(e) => setLocalFormData(prev => ({ ...prev, education: e.target.value }))}
              className="w-full p-2 border border-gray-200 rounded-lg transition-all"
              rows={2}
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
          Next
        </button>

    </form>
  );
};

export default PersonalInfoForm;
