'use client';

import { useState } from 'react';
import { getCurrentUser } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { API_CONFIG } from '@/config/api';

const ApiTestComponent = () => {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCurrentUser();
      console.log('Direct API call response:', response);
      setApiResponse(response);
    } catch (err) {
      console.error('Direct API call error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-yellow-50 mb-4">
      <h3 className="text-lg font-bold mb-2">🔧 API Debug Tool</h3>
      
      <div className="mb-3 p-2 bg-blue-50 rounded">
        <h4 className="font-semibold text-sm">Current API Configuration:</h4>
        <p className="text-xs">Base URL: <code>{API_CONFIG.baseUrl}</code></p>
        <p className="text-xs">Environment: <code>{process.env.NODE_ENV}</code></p>
        <p className="text-xs">Profile Endpoint: <code>{API_CONFIG.endpoints.profile.me}</code></p>
      </div>
      
      <Button onClick={testApi} disabled={loading} className="mb-3">
        {loading ? 'Testing...' : 'Test API Direct Call'}
      </Button>
      
      {apiResponse && (
        <div className="mt-3">
          <h4 className="font-semibold">API Response:</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="mt-3 text-red-600">
          <h4 className="font-semibold">Error:</h4>
          <pre className="text-xs bg-red-100 p-2 rounded">
            {JSON.stringify(error?.response?.data || error?.message || error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent;
