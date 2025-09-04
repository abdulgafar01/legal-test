'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { usePractitionerFormStore } from '@/stores/usePractitionerFormStore';
import { toast } from 'sonner';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExperienceFormProps {
  onNext: () => void;
}

const employmentTypeOptions = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
  { value: "volunteer", label: "Volunteer" },
];

interface Experience {
  position_title: string;
  company_name: string;
  employment_type: string;
  start_date: string;
  end_date?: string;
  location: string;
  description: string;
  skills_used: string;
  is_current: boolean;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ onNext }) => {
  const { formData, updateExperiences } = usePractitionerFormStore();
  const [experiences, setExperiences] = useState<Experience[]>(
    formData.experiences.length > 0 ? formData.experiences : [
      {
        position_title: '',
        company_name: '',
        employment_type: '',
        start_date: '',
        end_date: '',
        location: '',
        description: '',
        skills_used: '',
        is_current: false,
      }
    ]
  );

  const addExperience = () => {
    setExperiences(prev => [...prev, {
      position_title: '',
      company_name: '',
      employment_type: '',
      start_date: '',
      end_date: '',
      location: '',
      description: '',
      skills_used: '',
      is_current: false,
    }]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    setExperiences(prev => prev.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    ));
  };

  const handleCurrentJobToggle = (index: number, isCurrent: boolean) => {
    setExperiences(prev => prev.map((exp, i) => 
      i === index 
        ? { ...exp, is_current: isCurrent, end_date: isCurrent ? '' : exp.end_date }
        : exp
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one experience with required fields
    const validExperiences = experiences.filter(exp => 
      exp.position_title.trim() && 
      exp.company_name.trim() && 
      exp.start_date.trim()
    );

    if (validExperiences.length === 0) {
      toast.error('Please add at least one valid work experience with position title, company name, and start date');
      return;
    }

    updateExperiences(validExperiences);
    toast.success(`${validExperiences.length} experience(s) added!`);
    onNext();
  };

  const isFormValid = experiences.some(exp => 
    exp.position_title.trim() && 
    exp.company_name.trim() && 
    exp.start_date.trim()
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Briefcase size={20} />
          Work Experience
        </h3>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Experience #{index + 1}
              </span>
              {experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Position Title and Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Associate"
                  value={experience.position_title}
                  onChange={(e) => updateExperience(index, 'position_title', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smith & Associates"
                  value={experience.company_name}
                  onChange={(e) => updateExperience(index, 'company_name', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                  required
                />
              </div>
            </div>

            {/* Employment Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <Select
                  value={experience.employment_type}
                  onValueChange={(value) => updateExperience(index, 'employment_type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York, NY, USA"
                  value={experience.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                />
              </div>
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={experience.start_date}
                  onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={experience.end_date || ''}
                    onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                    disabled={experience.is_current}
                    className="w-full p-2 border border-gray-200 rounded-lg transition-all disabled:bg-gray-100"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={experience.is_current}
                      onChange={(e) => handleCurrentJobToggle(index, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-600">This is my current position</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                placeholder="Describe your responsibilities and achievements..."
                value={experience.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg transition-all"
                rows={3}
              />
            </div>

            {/* Skills Used */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills & Technologies Used
              </label>
              <input
                type="text"
                placeholder="e.g. Corporate Law, Contract Negotiation, Legal Research"
                value={experience.skills_used}
                onChange={(e) => updateExperience(index, 'skills_used', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg transition-all"
              />
            </div>
          </div>
        ))}
      </div>

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

export default ExperienceForm;
