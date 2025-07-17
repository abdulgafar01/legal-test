"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddExperienceModal from './AddExperienceModal';


interface Experience {
  id: string;
  jobTitle: string;
  employmentType: string;
  industry: string;
  company: string;
  startDate: string;
  endDate: string;
  duties: string;
}

interface ExperienceStepProps {
  onNext: (data: any) => void;
  initialData?: any;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({ onNext, initialData = {} }) => {
  const [experiences, setExperiences] = useState<Experience[]>(initialData.experiences || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience = {
      ...experience,
      id: Date.now().toString()
    };
    setExperiences(prev => [...prev, newExperience]);
    setIsModalOpen(false);
  };

  const handleContinue = () => {
    onNext({ experiences });
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">Setup your experience</h2>
      <p className="text-gray-600 text-center mb-8">This details will be displayed on your profile for service seekers to see.</p>

      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="text-gray-400 text-2xl">📄</div>
          </div>
          <h3 className="text-lg font-medium mb-2">You are yet to add work experience</h3>
          <p className="text-gray-600 text-sm mb-6">Click on the button below to add experience.</p>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-black hover:bg-gray-800 mb-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add experience
          </Button>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Work Experience</h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              size="sm"
              className="border-dashed border-2 border-gray-300 text-gray-600 hover:border-gray-400"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add experience
            </Button>
          </div>
          
          {experiences.map((experience) => (
            <div key={experience.id} className="border border-gray-200 p-4 rounded-lg">
              <h4 className="font-medium">{experience.jobTitle}</h4>
              <p className="text-sm text-gray-600">{experience.company}</p>
              <p className="text-sm text-gray-500">{experience.startDate} - {experience.endDate}</p>
              <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mt-2">
                {experience.employmentType}
              </span>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleContinue}
        className="w-full bg-black hover:bg-gray-800"
      >
        Continue
      </Button>

      <AddExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExperience}
      />
    </div>
  );
};

export default ExperienceStep;
