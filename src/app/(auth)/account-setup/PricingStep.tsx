'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Calendar } from '@/components/ui/calendar';
import { useTranslations } from 'next-intl';

export interface PricingFormData {
  consultationRate: string;
  consultationCurrency: 'USD' | 'EUR' | 'GBP';
  hireRate: string;
  hireCurrency: 'USD' | 'EUR' | 'GBP';
  minConsultation: string;
  maxConsultation: string;
  unavailableDates: Date[];
}

interface PricingStepProps {
  onNext: (data: PricingFormData) => void;
  initialData?: Partial<PricingFormData>;
}

const PricingStep: React.FC<PricingStepProps> = ({ onNext, initialData = {} }) => {
  const router = useRouter();
  const t = useTranslations('account');

  const [formData, setFormData] = useState<PricingFormData>({
    consultationRate: initialData.consultationRate || '',
    consultationCurrency: initialData.consultationCurrency || 'USD',
    hireRate: initialData.hireRate || '',
    hireCurrency: initialData.hireCurrency || 'USD',
    minConsultation: initialData.minConsultation || '',
    maxConsultation: initialData.maxConsultation || '',
    unavailableDates: initialData.unavailableDates || [],
  });

  const [selectedDates, setSelectedDates] = useState<Date[]>(formData.unavailableDates);

  const handleInputChange = <K extends keyof PricingFormData>(field: K, value: PricingFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.consultationRate &&
    formData.hireRate &&
    formData.minConsultation &&
    formData.maxConsultation;

  const handleSubmit = () => {
    if (isFormValid) {
      const payload = { ...formData, unavailableDates: selectedDates };
      onNext(payload);
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-2">{t('pricing.title')}</h2>
      <p className="text-gray-600 text-center mb-8">{t('pricing.description')}</p>

      <div className="space-y-6">
        {/* Consultation Rate */}
        <div>
          <Label htmlFor="consultationRate">{t('pricing.consultationRate')}</Label>
          <div className="flex mt-1">
            <div className="flex items-center bg-gray-50 px-3 rounded-l-md border border-r-0">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id="consultationRate"
              value={formData.consultationRate}
              onChange={(e) => handleInputChange('consultationRate', e.target.value)}
              className="rounded-l-none flex-1"
              placeholder={t('pricing.placeholder')}
            />
            <Select
              value={formData.consultationCurrency}
              onValueChange={(value) =>
                handleInputChange('consultationCurrency', value as 'USD' | 'EUR' | 'GBP')
              }
            >
              <SelectTrigger className="w-20 rounded-l-none border-l-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('pricing.consultationFee')}</p>
        </div>

        {/* Hire Rate */}
        <div>
          <Label htmlFor="hireRate">{t('pricing.hireRate')}</Label>
          <div className="flex mt-1">
            <div className="flex items-center bg-gray-50 px-3 rounded-l-md border border-r-0">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id="hireRate"
              value={formData.hireRate}
              onChange={(e) => handleInputChange('hireRate', e.target.value)}
              className="rounded-l-none flex-1"
              placeholder={t('pricing.placeholder')}
            />
            <Select
              value={formData.hireCurrency}
              onValueChange={(value) =>
                handleInputChange('hireCurrency', value as 'USD' | 'EUR' | 'GBP')
              }
            >
              <SelectTrigger className="w-20 rounded-l-none border-l-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('pricing.hireFee')}</p>
        </div>

        {/* Min and Max Consultation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minConsultation">{t('pricing.minConsultation')}</Label>
            <Input
              id="minConsultation"
              value={formData.minConsultation}
              onChange={(e) => handleInputChange('minConsultation', e.target.value)}
              className="mt-1"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">{t('pricing.minConsultationInfo')}</p>
          </div>
          <div>
            <Label htmlFor="maxConsultation">{t('pricing.maxConsultation')}</Label>
            <Input
              id="maxConsultation"
              value={formData.maxConsultation}
              onChange={(e) => handleInputChange('maxConsultation', e.target.value)}
              className="mt-1"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">{t('pricing.maxConsultationInfo')}</p>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <Label>{t('pricing.unavailableDates')}</Label>
          <div className="mt-2 bg-gray-50 p-4 rounded-lg">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates?: Date[]) => setSelectedDates(dates || [])}
              className="rounded-md border bg-white"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`w-full mt-8 cursor-pointer ${
          isFormValid ? 'bg-black hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {t('pricing.submitButton')}
      </Button>
    </div>
  );
};

export default PricingStep;
