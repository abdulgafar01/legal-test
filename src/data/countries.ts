

// data/countries.ts
import axios from "axios"

export interface Country {
  name: string
  code: string
  dial_code: string 
  is_active: boolean
}

interface ApiResponse {
  success: boolean
  data: Country[]
  timestamp: string
  message: string
}

export const getActiveCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get("/api/v1/countries/active")

    const apiData = response.data as ApiResponse

    if (!Array.isArray(apiData.data)) {
      throw new Error("Invalid response: expected an array of countries")
    }

    console.log("Fetched countries:", apiData.data)
    // console.log("Number of countries fetched:", apiData.data.length)

    return apiData.data
  } catch (error) {
    console.error("Error fetching countries:", error)
    return []
  }
}