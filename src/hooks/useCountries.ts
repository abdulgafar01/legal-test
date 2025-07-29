// hooks/useCountries.ts
import { useQuery } from "@tanstack/react-query"
import { getActiveCountries } from "@/data/countries"

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getActiveCountries,
  })
}
