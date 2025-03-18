import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { scanSystem, meetsMinRequirements, meetsRecommendedRequirements } from '../services/hardwareService';
import { SystemSpecs } from '../services/hardwareService';

// Define the hook interface
interface UseSystemInfoReturn {
  specs: SystemSpecs | undefined;
  isScanning: boolean;
  error: Error | null;
  isSuccess: boolean;
  scanHardware: () => Promise<void>;
  isScanningEnabled: boolean;
  toggleScanning: () => void;
  meetsMinRequirements: (requiredScore: number) => boolean;
  meetsRecommendedRequirements: (requiredScore: number) => boolean;
  performanceCategory: 'entry' | 'mainstream' | 'highend' | 'ultra' | 'unknown';
}

// Hook for managing system information
export const useSystemInfo = (): UseSystemInfoReturn => {
  const [isScanning, setIsScanning] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);

  // Use react-query for handling the system spec state
  const { 
    data: specs, 
    isLoading, 
    error, 
    refetch, 
    isSuccess 
  } = useQuery<SystemSpecs, Error>({
    queryKey: ['systemSpecs'],
    queryFn: scanSystem,
    // Only fetch on demand
    enabled: false,
    // Keep data fresh but not too aggressive
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });

  // Manual scan trigger
  const scanHardware = useCallback(async () => {
    if (!isScanningEnabled) return;
    
    try {
      setIsScanning(true);
      console.log('Scanning hardware...');
      await refetch();
      console.log('Scan complete, system specs:', specs);
    } catch (err) {
      console.error('Error scanning hardware:', err);
    } finally {
      setIsScanning(false);
    }
  }, [refetch, specs, isScanningEnabled]);

  // Toggle scanning functionality
  const toggleScanning = useCallback(() => {
    setIsScanningEnabled(prev => !prev);
    console.log(`Hardware scanning ${!isScanningEnabled ? 'enabled' : 'disabled'}`);
  }, [isScanningEnabled]);

  // Check if system meets minimum requirements
  const checkMinRequirements = useCallback((requiredScore: number): boolean => {
    if (!specs || !specs.performanceScore) return false;
    return meetsMinRequirements(specs, requiredScore);
  }, [specs]);

  // Check if system meets recommended requirements
  const checkRecommendedRequirements = useCallback((requiredScore: number): boolean => {
    if (!specs || !specs.performanceScore) return false;
    return meetsRecommendedRequirements(specs, requiredScore);
  }, [specs]);

  // Determine performance category
  const getPerformanceCategory = useCallback((): 'entry' | 'mainstream' | 'highend' | 'ultra' | 'unknown' => {
    if (!specs || !specs.performanceScore) return 'unknown';
    
    const score = specs.performanceScore.overall;
    if (score >= 80) return 'ultra';
    if (score >= 65) return 'highend';
    if (score >= 40) return 'mainstream';
    if (score >= 10) return 'entry';
    return 'unknown';
  }, [specs]);

  return {
    specs,
    isScanning: isScanning || isLoading,
    error,
    isSuccess,
    scanHardware,
    isScanningEnabled,
    toggleScanning,
    meetsMinRequirements: checkMinRequirements,
    meetsRecommendedRequirements: checkRecommendedRequirements,
    performanceCategory: getPerformanceCategory(),
  };
}; 