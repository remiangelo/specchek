import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SystemSpec, GameCompatibility } from '../types';
import { checkAllGamesCompatibility, getAllGames } from '../services/gameService';

export const useGameCompatibility = (systemSpecs: SystemSpec | undefined) => {
  // State for compatibility results
  const [compatibilityResults, setCompatibilityResults] = useState<GameCompatibility[]>([]);

  // Use React Query to fetch and process compatibility
  const {
    data,
    error,
    isLoading,
    isError,
  } = useQuery<GameCompatibility[]>({
    queryKey: ['gameCompatibility', systemSpecs],
    queryFn: () => {
      if (!systemSpecs) {
        return [];
      }
      return checkAllGamesCompatibility(systemSpecs);
    },
    // Only run when system specs are available
    enabled: !!systemSpecs,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  });

  // Update state when data changes
  useEffect(() => {
    if (data) {
      setCompatibilityResults(data);
    }
  }, [data]);

  // Get all games regardless of compatibility
  const allGames = getAllGames();

  // Error handling
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isError && error instanceof Error) {
      setErrorMessage(error.message || 'Failed to check game compatibility');
    } else if (isError) {
      setErrorMessage('An unknown error occurred while checking compatibility');
    }
  }, [isError, error]);

  return {
    compatibilityResults,
    allGames,
    isLoading,
    isError,
    errorMessage
  };
}; 