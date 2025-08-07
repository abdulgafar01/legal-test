"use client"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {  ChevronDown, ChevronDownIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { format } from "date-fns"
import React from "react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Icon } from "@iconify/react";
import { CountryCombobox } from "@/components/CountryCombobox"
import { useCountries } from "@/hooks/useCountries"

const SeekerInfo = () => {
  const {
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()



const { data: countries = [] } = useCountries()

  const selectedDate: Date | undefined = watch("date_of_birth")
  const selected = watch("country") 
  // const selectedCountry = countries.find((c) => c.name === selected)
  const selectedDialCode = countries.find((c) => c.name === selected)
  const [open, setOpen] = React.useState(false)

//   const renderCountryLabel = (country: { name: string; code: string }) => (
//   <span className="flex items-center gap-3">
//     <Icon
//       icon={`flag:${country.code.toLowerCase()}-4x3`}
//       className="h-5 w-5 rounded-sm"
//     />
//     {country.name}
//   </span>
// )


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">First Name</label>
        <input
          type="text"
          {...register("first_name")}
          className="w-full border rounded-md p-2"
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm">
            {errors.first_name.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Last Name</label>
        <input
          type="text"
          {...register("last_name")}
          className="w-full border rounded-md p-2"
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm">
            {errors.last_name.message as string}
          </p>
        )}
      </div>
            
      {/* Date of Birth with Calendar Popover */}
      <div className="">
        <label htmlFor="date_of_birth" className="text-sm font-medium">
          Date of Birth
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-between p-2 rounded-md font-normal ${
                errors.dateOfBirth ? "border-red-500" : ""
              }`}
            >
              {selectedDate
                ? format(selectedDate, "yyyy-MM-dd")
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
                  const formatted = format(date, "yyyy-MM-dd")
                  setValue("date_of_birth", formatted, { shouldValidate: true })
                }
              }}
            />
          </PopoverContent>
        </Popover>
        {errors.date_of_birth && (
          <p className="text-red-500 text-sm">
            {errors.date_of_birth.message as string}
          </p>
        )}
      </div>


  


    {/* Phone Number Input with Flag + Dial Code */}
      <div>
     <label className="block text-sm font-medium mb-1">Phone Number</label>
      <div className="flex gap-2">
        {/* Dial Code Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-2 min-w-[120px] justify-between p-2 rounded-md",
                errors.phone_number ? "border-red-500" : ""
              )}
            >
              {selectedDialCode ? (
                <>
                  <Icon
                    icon={`flag:${selectedDialCode.code.toLowerCase()}-4x3`}
                    className="h-5 w-5 rounded-sm"
                  />
                  <span>{selectedDialCode.dial_code}</span>
                </>
              ) : (
                <span>Select</span>
              )}
              <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[260px] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.filter(c => c.is_active).map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    onSelect={() => {
                      setValue("country", country.name)
                      setValue("dialCode", country.dial_code)
                      const phone = getValues("rawPhone") || ""
                      setValue("phone_number", `${country.dial_code}${phone}`)
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Icon
                        icon={`flag:${country.code.toLowerCase()}-4x3`}
                        className="h-5 w-5 rounded-sm"
                      />
                      {country.name} ({country.dial_code})
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Text Input */}
        <input
          type="text"
          placeholder="7012345678"
          onChange={(e) => {
            const rawPhone = e.target.value.replace(/^0+/, "")
            const dialCode = watch("dialCode") || ""
            setValue("rawPhone", rawPhone) // not submitted
            setValue("phone_number", `${dialCode}${rawPhone}`, {
              shouldValidate: true,
            })

          }}
          className="w-full border rounded-md p-2"
        />
      </div>

        {/* Hidden Fields for phone_number and rawPhone
        <input type="hidden" {...register("phone_number")} />
        <input type="hidden" {...register("rawPhone")} />
        <input type="hidden" {...register("dialCode")} /> */}

        {errors.phone_number && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone_number.message as string}
          </p>
        )}
      </div>






        {/* Country Selection */}

              {/* Country Selection */}
        <CountryCombobox/>
        {/* {errors.country && (
          <p className="text-red-500 text-sm">
            {errors.country.message as string}
          </p>
        )} */}
    
      
      <div>
        {/* <label className="block text-sm font-medium">Country</label>
        <input
          type="text"
          {...register("country")}
          className="w-full border rounded-md p-2"
        />
        {errors.country && (
          <p className="text-red-500 text-sm">
            {errors.country.message as string}
          </p>
        )} */}
      </div>

        <div className="grid grid-cols-2 gap-3">
            {/* state */}
        <div>
            <label className="block text-sm font-medium">State</label>
            <input
            type="text"
            {...register("state")}
            className="w-full border rounded-md p-2"
            />
            {errors.state && (
            <p className="text-red-500 text-sm">
                {errors.state.message as string}
            </p>
            )}  
        </div>

            {/* city */}
        <div>
            <label className="block text-sm font-medium">City</label>
            <input
            type="text"
            {...register("city")}
            className="w-full border rounded-md p-2"
            />
            {errors.city && (
            <p className="text-red-500 text-sm">
                {errors.city.message as string}
            </p>
            )}  
        </div>
        </div>
        
        

    </div>
  )
}

export default SeekerInfo









{/* <div>
      <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between p-2 rounded-md",
              errors.country ? "border-red-500" : ""
            )}
          >
            {selectedCountry ? renderCountryLabel(selectedCountry) : "Select a country"}
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.filter(c => c.is_active).map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100"
                  onSelect={() => {
                    setValue("country", country.name, { shouldValidate: true })
                    setOpen(false)
                  }}
                >
                    <span className="flex items-center gap-2">
                        <Icon icon={`flag:${country.code.toLowerCase()}-4x3`}
                         className="h-5 w-5 rounded-sm" />
                        {country.name}
                    </span>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {errors.country && (
        <p className="text-red-500 text-sm mt-1">
          {errors.country.message as string}
        </p>
      )}
    </div> */}

