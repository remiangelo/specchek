import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SystemSpec } from '../types';
import { getSystemSpecs } from '../services/hardwareService';

export const useSystemInfo = () => {
  console.log('useSystemInfo hook initialized');
  
  // Use React Query to fetch system specs
  const {
    data: systemSpecs,
    error,
    isLoading,
    isError,
    refetch
  } = useQuery<SystemSpec>({
    queryKey: ['systemSpecs'],
    queryFn: getSystemSpecs,
    // Don't refetch on window focus or component remount
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    staleTime: Infinity
  });

  console.log('systemSpecs from useQuery:', systemSpecs);
  
  // Handle errors more gracefully
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isError && error instanceof Error) {
      console.error('Error in useSystemInfo:', error);
      setErrorMessage(error.message || 'Failed to scan system hardware');
    } else if (isError) {
      console.error('Unknown error in useSystemInfo');
      setErrorMessage('An unknown error occurred while scanning your system');
    }
  }, [isError, error]);

  // Function to trigger a manual scan
  const scanSystem = async () => {
    console.log('scanSystem called');
    try {
      setErrorMessage(null);
      await refetch();
    } catch (err) {
      console.error('Error in scanSystem:', err);
      if (err instanceof Error) {
        setErrorMessage(err.message || 'Failed to scan system hardware');
      } else {
        setErrorMessage('An unknown error occurred while scanning your system');
      }
    }
  };

  return {
    systemSpecs,
    isLoading,
    isError,
    errorMessage,
    scanSystem
  };
}; 