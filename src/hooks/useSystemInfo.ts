import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { scanSystem, SystemSpecs } from '../services/hardwareService';

export const useSystemInfo = () => {
  console.log('useSystemInfo hook initialized');
  const [isScanning, setIsScanning] = useState(false);

  const { 
    data: systemSpecs, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<SystemSpecs>({
    queryKey: ['systemSpecs'],
    queryFn: scanSystem,
    staleTime: Infinity, // Don't auto-refetch
    enabled: false, // Don't run automatically on component mount
  });

  console.log('systemSpecs from useQuery:', systemSpecs);

  // Function to manually scan hardware
  const scanHardware = async () => {
    console.log('scanHardware called');
    setIsScanning(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error in scanHardware:', error);
    } finally {
      setIsScanning(false);
    }
  };

  if (error) {
    console.error('Error in useSystemInfo:', error);
  }

  return {
    systemSpecs,
    isLoading: isLoading || isScanning,
    error,
    scanSystem: scanHardware
  };
}; 