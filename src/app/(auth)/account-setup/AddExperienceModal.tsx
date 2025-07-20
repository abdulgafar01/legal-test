"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface ExperienceFormData {
  jobTitle: string;
  employmentType: string;
  industry: string;
  company: string;
  startDate: string;
  endDate: string;
  duties: string;
}

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (experience: ExperienceFormData) => void;
}

const employmentTypes = ['Full time', 'Part time', 'Contract'] as const;
// type EmploymentType = typeof employmentTypes[number];

const AddExperienceModal: React.FC<AddExperienceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<ExperienceFormData>({
    jobTitle: '',
    employmentType: '',
    industry: '',
    company: '',
    startDate: '',
    endDate: '',
    duties: ''
  });

  const handleInputChange = (field: keyof ExperienceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Boolean(
    formData.jobTitle && 
    formData.employmentType && 
    formData.industry && 
    formData.company && 
    formData.startDate && 
    formData.endDate
  );

  const handleAdd = () => {
    if (isFormValid) {
      onAdd(formData);
      // Reset form
      setFormData({
        jobTitle: '',
        employmentType: '',
        industry: '',
        company: '',
        startDate: '',
        endDate: '',
        duties: ''
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">Add Experience</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title / Position Held</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className="mt-1"
              placeholder="Company Lawyer"
            />
          </div>

          <div>
            <Label htmlFor="employmentType" className="text-sm font-medium">Type of Employment</Label>
            <Select 
              value={formData.employmentType} 
              onValueChange={(value: string) => handleInputChange('employmentType', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="industry" className="text-sm font-medium">Industry/Field</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="mt-1"
              placeholder="IT"
            />
          </div>

          <div>
            <Label htmlFor="company" className="text-sm font-medium">Company/Organization Name</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="mt-1"
              placeholder="Neoflux Digitals"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium">Start date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium">End date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duties" className="text-sm font-medium">List Key Duties Performed</Label>
            <Textarea
              id="duties"
              value={formData.duties}
              onChange={(e) => handleInputChange('duties', e.target.value)}
              className="mt-1"
              rows={4}
              placeholder="Draft, review, and negotiate contracts, agreements, MoUs, and other legal documents to ensure legal protection and compliance."
            />
          </div>
        </div>

        <Button
          onClick={handleAdd}
          disabled={!isFormValid}
          className={`w-full mt-6 ${isFormValid ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Add experience
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddExperienceModal;