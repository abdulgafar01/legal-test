import instance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';
import { 
  PractitionersResponse, 
  PractitionerFilters, 
  SpecializationsResponse,
  CountriesResponse,
  Practitioner,
  PractitionerDetail,
  Country
} from '@/lib/types';

/**
 * Get list of practitioners with filtering and pagination
 */
export const getPractitioners = async (filters: PractitionerFilters = {}): Promise<PractitionersResponse> => {
  try {
    const params: Record<string, any> = {};
    
    // Map filters to API parameters
    if (filters.search) params.search = filters.search;
    if (filters.specializations && filters.specializations.length > 0) {
      params.specializations = filters.specializations.join(',');
    }
    if (filters.country) params.country = filters.country;
    if (filters.min_price !== undefined) params.min_price = filters.min_price;
    if (filters.max_price !== undefined) params.max_price = filters.max_price;
    if (filters.min_experience !== undefined) params.min_experience = filters.min_experience;
    if (filters.availability_status) params.availability_status = filters.availability_status;
    if (filters.ordering) params.ordering = filters.ordering;
    if (filters.page) params.page = filters.page;

    console.log('🔍 Making API call to:', API_ENDPOINTS.practitioners.list);
    console.log('🔍 With parameters:', params);
    console.log('🔍 Auth token:', localStorage.getItem('accessToken') ? 'Present' : 'Missing');

    const response = await instance.get(API_ENDPOINTS.practitioners.list, {
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ API Response:', response.data);
    
    // Handle both DRF pagination format and custom list_response format
    if (response.data.results) {
      // DRF pagination format
      return {
        success: true,
        message: `Found ${response.data.count || response.data.results.length} practitioners`,
        data: response.data.results,
        pagination: {
          count: response.data.count || 0,
          next: response.data.next,
          previous: response.data.previous,
          page_size: response.data.results.length
        }
      };
    } else if (response.data.data) {
      // Custom list_response format
      return response.data;
    } else {
      // Fallback: assume response.data is the practitioners array
      return {
        success: true,
        message: `Found ${response.data.length} practitioners`,
        data: response.data,
        pagination: {
          count: response.data.length,
          next: null,
          previous: null,
          page_size: response.data.length
        }
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching practitioners:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('❌ Response status:', axiosError.response?.status);
      console.error('❌ Response data:', axiosError.response?.data);
    }
    throw error;
  }
};

/**
 * Get practitioner details by ID
 */
export const getPractitionerById = async (id: number): Promise<{ success: boolean; data: PractitionerDetail; message: string }> => {
  try {
    console.log('🔍 Fetching practitioner details for ID:', id);
    console.log('🔗 API endpoint:', `${API_ENDPOINTS.practitioners.detail}${id}/`);
    
    const response = await instance.get(`${API_ENDPOINTS.practitioners.detail}${id}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Practitioner details response:', response.data);
    
    // Handle different response formats
    if (response.data.success && response.data.data) {
      return response.data;
    } else if (response.data.id) {
      // Direct practitioner object
      return {
        success: true,
        data: response.data,
        message: 'Practitioner details retrieved successfully'
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ Error fetching practitioner details:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('❌ Response status:', axiosError.response?.status);
      console.error('❌ Response data:', axiosError.response?.data);
      
      if (axiosError.response?.status === 404) {
        throw new Error('Practitioner not found');
      }
    }
    throw error;
  }
};

/**
 * Get list of practitioner specializations for filter options
 */
export const getSpecializations = async (): Promise<SpecializationsResponse> => {
  try {
    const response = await instance.get(API_ENDPOINTS.practitioners.specializations, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 Specializations Raw Response:', response.data);

    // Handle the list_response format: { success: true, data: { results: [...] } }
    if (response.data.success && response.data.data && response.data.data.results) {
      return {
        success: true,
        message: response.data.message || 'Specializations retrieved successfully',
        data: response.data.data.results
      };
    }
    // Fallback for direct array or other formats
    else if (Array.isArray(response.data)) {
      return {
        success: true,
        message: 'Specializations retrieved successfully',
        data: response.data
      };
    }
    // Another fallback if data is directly in response.data
    else if (response.data.data && Array.isArray(response.data.data)) {
      return {
        success: true,
        message: response.data.message || 'Specializations retrieved successfully',
        data: response.data.data
      };
    }
    else {
      console.error('❌ Unexpected specializations response format:', response.data);
      return {
        success: false,
        message: 'Invalid response format',
        data: []
      };
    }
  } catch (error) {
    console.error('❌ Error fetching specializations:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('❌ Response status:', axiosError.response?.status);
      console.error('❌ Response data:', axiosError.response?.data);
    }
    throw error;
  }
};

/**
 * Get list of countries where practitioners are available
 * This function extracts unique countries from a sample of practitioners
 */
export const getPractitionerCountries = async (): Promise<CountriesResponse> => {
  try {
    console.log('📡 Getting countries where practitioners exist...');
    
    // Get a sample of practitioners to extract countries from
    const response = await instance.get(API_ENDPOINTS.practitioners.list, {
      params: {
        page_size: 100, // Get a good sample size
        ordering: '-created_at' // Get recent practitioners
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 Practitioners Sample Response:', response.data);

    let practitioners: any[] = [];
    
    // Handle different response formats
    if (response.data.results) {
      practitioners = response.data.results;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      practitioners = response.data.data;
    } else if (Array.isArray(response.data)) {
      practitioners = response.data;
    }

    // Extract unique countries from practitioners
    const countriesSet = new Set<string>();
    practitioners.forEach((practitioner) => {
      if (practitioner.user_info && practitioner.user_info.country) {
        countriesSet.add(practitioner.user_info.country);
      }
    });

    // Convert to Country objects
    const uniqueCountries: Country[] = Array.from(countriesSet).map((countryName) => ({
      name: countryName,
      code: countryName.slice(0, 2).toUpperCase(), // Generate a simple code
      is_active: true
    }));

    console.log('✅ Extracted countries from practitioners:', uniqueCountries);

    return {
      success: true,
      message: `Found ${uniqueCountries.length} countries with practitioners`,
      data: uniqueCountries
    };
  } catch (error) {
    console.error('❌ Error fetching practitioner countries:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('❌ Response status:', axiosError.response?.status);
      console.error('❌ Response data:', axiosError.response?.data);
    }
    throw error;
  }
};

/**
 * Get available practitioners (those available for booking)
 */
export const getAvailablePractitioners = async (filters: PractitionerFilters = {}): Promise<PractitionersResponse> => {
  const availableFilters = {
    ...filters,
    only_available: true,
  };
  
  return getPractitioners(availableFilters);
};
