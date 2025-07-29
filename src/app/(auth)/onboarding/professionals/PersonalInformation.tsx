"use client"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { format } from "date-fns"

const PersonalInformation = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  const selectedDate: Date | undefined = watch("dateOfBirth")

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">First Name</label>
        <input
          type="text"
          {...register("firstName")}
          className="w-full border rounded p-2"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">
            {errors.firstName.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Last Name</label>
        <input
          type="text"
          {...register("lastName")}
          className="w-full border rounded p-2"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">
            {errors.lastName.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Middle Name</label>
        <input
          type="text"
          {...register("middleName")}
          className="w-full border rounded p-2"
        />
        {errors.middleName && (
          <p className="text-red-500 text-sm">
            {errors.middleName.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Country</label>
        <input
          type="text"
          {...register("country")}
          className="w-full border rounded p-2"
        />
        {errors.country && (
          <p className="text-red-500 text-sm">
            {errors.country.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Qualification</label>
        <input
          type="text"
          {...register("qualification")}
          className="w-full border rounded p-2"
        />
        {errors.qualification && (
          <p className="text-red-500 text-sm">
            {errors.qualification.message as string}
          </p>
        )}
      </div>

      {/* Date of Birth with Calendar Popover */}
      <div className="flex flex-col gap-2">
        <label htmlFor="dateOfBirth" className="text-sm font-medium">
          Date of Birth
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-between font-normal ${
                errors.dateOfBirth ? "border-red-500" : ""
              }`}
            >
              {selectedDate
                ? format(selectedDate, "MM-dd-yyyy")
                : "Select date"}
              <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
             onSelect={(date) => {
                if (date) {
                  const formatted = format(date, "MM-dd-yyyy")
                  setValue("dateOfBirth", formatted, { shouldValidate: true })
                }
              }}
            />
          </PopoverContent>
        </Popover>
        {errors.dateOfBirth && (
          <p className="text-red-500 text-sm">
            {errors.dateOfBirth.message as string}
          </p>
        )}
      </div>
    </div>
  )
}

export default PersonalInformation
