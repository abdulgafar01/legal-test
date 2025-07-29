'use client';

import { useFormContext } from 'react-hook-form';

const Certificate = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Country</label>
        <input
          type="text"
          {...register('country')}
          className="w-full border rounded p-2"
        />
        {errors.country && <p className="text-red-500 text-sm">{errors.country.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Date of Incorporation</label>
        <input
          type="date"
          {...register('dateOfIncorporation')}
          className="w-full border rounded p-2"
        />
        {errors.dateOfIncorporation && (
          <p className="text-red-500 text-sm">{errors.dateOfIncorporation.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Type of Certification</label>
        <input
          type="text"
          {...register('typeOfCertification')}
          className="w-full border rounded p-2"
        />
        {errors.typeOfCertification && (
          <p className="text-red-500 text-sm">{errors.typeOfCertification.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Proof of Certification</label>
        <input
          type="file"
          {...register('proofOfCertification')}
          className="w-full border rounded p-2"
        />
        {errors.proofOfCertification && (
          <p className="text-red-500 text-sm">{errors.proofOfCertification.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default Certificate;
