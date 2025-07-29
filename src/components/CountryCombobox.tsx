"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Icon } from "@iconify/react"
import { useCountries } from "@/hooks/useCountries"
import { Country } from "@/data/countries"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown} from "lucide-react"
import { cn } from "@/lib/utils"

export const CountryCombobox = () => {
  const { setValue, watch } = useFormContext()
  const selectedCountry = watch("country")
  const [open, setOpen] = useState(false)

  const { data: countries = [] } = useCountries()

  const handleSelect = (country: Country) => {
    setValue("country", country.name, { shouldValidate: true })
    // setValue("dial_code", country.dial_code) // Optionally store dial code separately
    setOpen(false)
  }

  const getCodeFromName = (name: string) =>
    countries.find((c) => c.name === name)?.code || ""

 

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <Icon
                icon={`flag:${getCodeFromName(selectedCountry).toLowerCase()}-4x3`}
                className="h-5 w-5 rounded-sm"
              />
              {selectedCountry}
            </div>
          ) : (
            "Select a country"
          )}
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            {countries.map((country) => (
              <CommandItem
                key={country.code}
                value={country.name}
                onSelect={() => handleSelect(country)}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    icon={`flag:${country.code.toLowerCase()}-4x3`}
                    className="h-5 w-5 rounded-sm"
                  />
                  <span className="flex-1">{country.name}</span>
                  {/* <span className="text-muted-foreground">{country.dial_code}</span> */}
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedCountry === country.name ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
