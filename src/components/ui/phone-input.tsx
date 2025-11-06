// Custom Phone Input Component with proper styling
import PhoneInputBase from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { InputHTMLAttributes } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: string;
  international?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  disabled,
  placeholder,
  defaultCountry = 'KW',
  international = true,
}: PhoneInputProps) {
  return (
    <PhoneInputBase
      international={international}
      defaultCountry={defaultCountry as any}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className="phone-input-wrapper"
      inputClassName="phone-input-field"
      countrySelectClassName="phone-country-select"
    />
  );
}
