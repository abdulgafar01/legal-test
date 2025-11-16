'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

interface SpecializationStepProps {
  onNext: (data: string[]) => void;
  initialData?: string[];
}

const SPECIALIZATIONS = [
  'Criminal Law',
  'Civil Law',
  'Constitutional Law',
  'Administrative Law',
  'International Law',
  'Labour & Employment Law',
  'Corporate (or Company) Law',
  'Tax Law',
  'Commercial Law',
  'Family Law',
  'Property Law',
  'Environmental Law',
  'Intellectual Property Law',
  'Human Rights Law',
  'Immigration Law',
];

const SpecializationStep: React.FC<SpecializationStepProps> = ({
  onNext,
  initialData = [],
}) => {
  const [selected, setSelected] = useState<string[]>(initialData);
  const t = useTranslations('account');

  const toggle = (item: string) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    );
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      onNext(selected);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">
        {t('specializations.title')}
      </h2>
      <p className="text-gray-600 text-center mb-8">
        {t('specializations.description')}
      </p>

      <div className="space-y-4 mb-8">
        <Label className="text-sm font-medium">
          {t('specializations.label')}
        </Label>
        <div className="flex flex-wrap gap-3">
          {SPECIALIZATIONS.map(specialization => {
            const checked = selected.includes(specialization);
            return (
              <div
                key={specialization}
                onClick={() => toggle(specialization)}
                aria-pressed={checked}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full border transition-colors ${
                  checked
                    ? 'bg-black text-white border-black'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Checkbox
                  id={specialization}
                  checked={checked}
                  onCheckedChange={() => toggle(specialization)}
                  className="data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
                />
                <label
                  htmlFor={specialization}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {t(`specializations.options.${specialization}`)}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleContinue}
        disabled={selected.length === 0}
        className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed bg-black hover:bg-gray-800"
      >
        {t('specializations.continueButton')}
      </Button>
    </div>
  );
};

export default SpecializationStep;
