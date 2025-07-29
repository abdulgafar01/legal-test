'use client';

import { useFormContext } from 'react-hook-form';

const License = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">

        {/* date of Incorporation */}
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


          {/* License type */}
      <div>
        <label className="block text-sm font-medium">Type of License</label>
        <input
          type="text"
          {...register('typeOfLicense')}
          className="w-full border rounded p-2"
        />
        {errors.typeOfLicense && (
          <p className="text-red-500 text-sm">{errors.typeOfLicense.message as string}</p>
        )}
      </div>
      

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
        <label className="block text-sm font-medium">Proof of License</label>
        <input
          type="file"
          {...register('proofOfLicence')}
          className="w-full border rounded p-2"
        />
        {errors.proofOfLicence && (
          <p className="text-red-500 text-sm">{errors.proofOfLicence.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default License;
