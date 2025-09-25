"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface Experience {
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
  onNext: (data: Experience[]) => void;
  initialData?: Experience[];
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({
  onNext,
  initialData = [],
}) => {
  const [experiences, setExperiences] = useState<Experience[]>(initialData);

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        jobTitle: "",
        employmentType: "",
        industry: "",
        company: "",
        startDate: "",
        endDate: "",
        duties: "",
      },
    ]);
  };

  const handleChange = <K extends keyof Experience>(
    index: number,
    field: K,
    value: Experience[K]
  ) => {
    setExperiences((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  const handleRemove = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const valid = experiences.every(
      (exp) =>
        exp.jobTitle &&
        exp.company &&
        exp.startDate &&
        exp.endDate &&
        exp.duties
    );

    if (!valid) return;

    onNext(experiences);
  };

  return (
    <div className="max-w-md mx-auto space-y-3 px-1.5">
      <h2 className="text-3xl font-semibold text-center mb-1">
        Setup your experience
      </h2>
      <p className="text-gray-600 text-sm text-center mb-2">
        These details will be displayed on your profile for service seekers to
        see.
      </p>

      {experiences.map((exp, index) => (
        <div key={exp.id} className="border rounded-lg p-4 space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            <div>
              <Label className="mb-1" htmlFor="jobTitle">
                Job Title/position held
              </Label>
              <Input
                value={exp.jobTitle}
                id="jobTitle"
                onChange={(e) =>
                  handleChange(index, "jobTitle", e.target.value)
                }
              />
            </div>
            <div>
              <Label className="mb-1" htmlFor="employmentType">
                Employment Type
              </Label>
              <Input
                value={exp.employmentType}
                id="employmentType"
                onChange={(e) =>
                  handleChange(index, "employmentType", e.target.value)
                }
              />
            </div>
            <div>
              <Label className="mb-1" htmlFor='industry'>Industry</Label>
              <Input
                value={exp.industry}
                id='industry'
                onChange={(e) =>
                  handleChange(index, "industry", e.target.value)
                }
              />
            </div>
            <div>
              <Label className="mb-1" htmlFor='company'>Company</Label>
              <Input
                value={exp.company}
                 id='company'
                onChange={(e) => handleChange(index, "company", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1" htmlFor='startDate'>Start Date</Label>
              <Input
                type="date"
                 id='startDate'
                value={exp.startDate}
                onChange={(e) =>
                  handleChange(index, "startDate", e.target.value)
                }
              />
            </div>
            <div>
              <Label className="mb-1" htmlFor='endDate'>End Date</Label>
              <Input
                type="date"
                value={exp.endDate}
                id='endDate'
                onChange={(e) => handleChange(index, "endDate", e.target.value)}
              />
            </div>
            <div className="col-span-full">
              <Label className="mb-1" htmlFor='keyDuties'>List Key Duties Performed</Label>
              <Textarea
                value={exp.duties}
                id='keyDuties'
                onChange={(e) => handleChange(index, "duties", e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="destructive"
            className="absolute top-1 right-1 rounded-lg cursor-pointer"
            onClick={() => handleRemove(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      <div className="flex justify-between">
        <Button
          onClick={handleAddExperience}
          variant="outline"
          className="cursor-pointer"
        >
          Add Experience
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={experiences.length === 0}
          className={`cursor-pointer ${
            experiences.length
              ? "bg-black hover:bg-gray-800"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ExperienceStep;
