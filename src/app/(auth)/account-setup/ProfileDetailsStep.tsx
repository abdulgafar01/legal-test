"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  address: string;
  state: string;
  city: string;
  profilePhoto: string | null;
}

interface ProfileDetailsStepProps {
  onNext: (data: ProfileFormData) => void;
  initialData?: Partial<ProfileFormData>;
}

const ProfileDetailsStep: React.FC<ProfileDetailsStepProps> = ({
  onNext,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: initialData.fullName || '',
    phoneNumber: initialData.phoneNumber || '',
    address: initialData.address || '',
    state: initialData.state || '',
    city: initialData.city || '',
    profilePhoto: initialData.profilePhoto || null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = Boolean(
    formData.fullName &&
    formData.phoneNumber &&
    formData.address &&
    formData.state &&
    formData.city
  );

  const handleInputChange = <K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          profilePhoto: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (isFormValid) {
      onNext(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">Setup your profile details</h2>
      <p className="text-gray-600 text-center mb-8">
        These details will be displayed on your profile for service seekers to see.
      </p>

      <div className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {formData.profilePhoto ? (
              <Image
                src={formData.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400 text-2xl">👤</div>
            )}
          </div>
          <div>
            <Label className="text-sm font-medium">Profile photo</Label>
            <p
              className="text-sm text-orange-500 cursor-pointer hover:underline"
              onClick={handlePhotoClick}
            >
              {formData.profilePhoto ? 'Edit photo' : 'Upload photo'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="mt-1"
            placeholder="Enter your full name"
          />
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone number</Label>
          <div className="flex mt-1">
            <Select defaultValue="US">
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">US</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="CA">CA</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="ml-2 flex-1"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium">Address (Current/Residential)</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="mt-1"
            placeholder="Enter your address"
          />
        </div>

        {/* State and City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state" className="text-sm font-medium">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="mt-1"
              placeholder="State"
            />
          </div>
          <div>
            <Label htmlFor="city" className="text-sm font-medium">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="mt-1"
              placeholder="City"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleContinue}
        disabled={!isFormValid}
        className={`w-full mt-8 ${
          isFormValid ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Continue
      </Button>
    </div>
  );
};

export default ProfileDetailsStep;
