'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CheckCircle, ChevronDownIcon, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const License = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();


   const date_of_license: Date | undefined = watch("date_of_license")

   const [uploadedFile, setUploadedFile] = useState<string | null>(null);

     const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (file) setUploadedFile(file.name);
     }, []);
   

  return (
    <div className="space-y-4">

        {/* date of Incorporation */}
      <div>
        <label className="block text-sm font-medium">Date of Incorporation</label>
         <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-between font-normal ${
                errors.dateOfBirth ? "border-red-500" : ""
              }`}
            >
              {date_of_license
                ? format(date_of_license, "MM-dd-yyyy")
                : "Select date"}
              <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date_of_license}
              captionLayout="dropdown"
             onSelect={(date) => {
                if (date) {
                  const formatted = format(date, "MM-dd-yyyy")
                  setValue("date_of_license", formatted, { shouldValidate: true })
                }
              }}
            />
          </PopoverContent>
        </Popover>
        {errors.date_of_license && (
          <p className="text-red-500 text-sm">{errors.date_of_license.message as string}</p>
        )}
      </div>


          {/* License type */}
      <div>
        <label className="block text-sm font-medium">Type of License</label>
        <input
          type="text"
          {...register('typeOfLicense')}
          className="w-full p-2 border border-gray-200 rounded-lg transition-all"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Proof of Licence
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
          {uploadedFile ? (
            <div className="space-y-2">
              <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <p className="text-sm text-blue-600">{uploadedFile}</p>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Upload
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-14 h-14 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <Upload size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Click to upload</p>
              <p className="text-xs text-gray-500">PDF, PNG, JPG, GIF</p>
              <input
                  id="license-file-upload"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.gif"
                  {...register("proofOfLicense")}
                  onChange={(e) => {
                    handleFileUpload(e);
                    setValue("proofOfLicense", e.target.files, { shouldValidate: true });
                  }}
                  className="hidden"
                />
              <label
                htmlFor="license-file-upload"
                className="inline-block bg-black text-white px-6 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors"
              >
                Browse Files
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default License;
