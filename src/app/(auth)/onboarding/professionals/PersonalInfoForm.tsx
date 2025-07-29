'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { countries, Country } from '@/data/countries1';
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

interface PersonalInfoFormProps {
  onNext: () => void;
}

const qualificationOptions = [
  'Bachelor of Laws',
  'Master of Laws (LL.M)',
  'Doctor of Philosophy in Law (PhD in Law)',
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
    firstName: '',
    lastName: '',
    middleName: '',
    qualification: '',
  });

  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "Nigeria",
    code: "NG",
    flag: "🇳🇬"
  });
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Personal Info:', {
        ...formData,
        dateOfBirth: dateOfBirth ? format(dateOfBirth, 'dd/MM/yyyy') : '',
        country: selectedCountry,
      });
      onNext();
    },
    [formData, dateOfBirth, selectedCountry, onNext]
  );
  
const isFormValid = formData.firstName.trim() &&
                    formData.lastName.trim() &&
                    formData.middleName.trim() &&
                    formData.qualification.trim() &&
                    dateOfBirth;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="First Name"
        name="firstName"
        placeholder="e.g. John"
        value={formData.firstName}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Last Name"
        name="lastName"
        placeholder="e.g. Doe"
        value={formData.lastName}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Middle Name (optional)"
        name="middleName"
        placeholder="e.g. Sam"
        value={formData.middleName}
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
              initialFocus
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
              <SelectItem key={option} value={option}>
                {option}
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
          {filteredCountries.map(country => (
            <SelectItem key={country.code} value={country.name}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
