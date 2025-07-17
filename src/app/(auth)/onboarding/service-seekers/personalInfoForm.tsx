import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
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

interface PersonalInfoFormProps {
  onNext: () => void;
}

const qualificationOptions = ['Bachelor of Laws', 'Master of Laws (LL.M)', 'Doctor of Philosophy in Law (PhD in Law)'];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    qualification: '',
    phoneNumber:""
  });
  
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [selectedCountry, setSelectedCountry] = useState<Country>({ 
    name: "Nigeria", 
    code: "NG", 
    flag: "🇳🇬" 
  });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Personal Info:', { 
      ...formData, 
      dateOfBirth: dateOfBirth ? format(dateOfBirth, 'dd/MM/yyyy') : '',
      country: selectedCountry 
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className='mb-3'>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First name
        </label>
        <input
          type="text"
          name="fullName"
          placeholder='e.g john'
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-200 rounded-lg transition-all"
          required
        />
      </div>
      <div className='mb-3'>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last name
        </label>
        <input
          type="text"
          name="fullName"
          placeholder='e.g doe'
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-200 rounded-lg transition-all"
          required
        />
      </div>
      <div className='mb-3'>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Middle Name(optional)
        </label>
        <input
          type="text"
          name="fullName"
          placeholder='e.g sam'
          value={formData.middleName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-200 rounded-md transition-all"
          required
        />
      </div>

      <div className='mb-3'>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of birth
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left flex items-center justify-between bg-white hover:bg-gray-50",
                !dateOfBirth && "text-gray-400"
              )}
            >
              <span>
                {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : "DD/MM/YYYY"}
              </span>
              <Calendar size={20} className="text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dateOfBirth}
              onSelect={setDateOfBirth}
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
          Qualification
        </label>
        <Select value={formData.qualification} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
          <SelectTrigger className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {qualificationOptions.map((qualification) => (
              <SelectItem key={qualification} value={qualification} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                {qualification}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country
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
          Phone number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors text-lg"
      >
        Next
      </button>
    </form>
  );
};

export default PersonalInfoForm;
