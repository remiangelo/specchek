import axios from 'axios';
import { Game } from '../types';
import gamesData from '../data/gamesData.json';

// API configuration
const API_KEY = import.meta.env.VITE_RAWG_API_KEY || 'YOUR_API_KEY_HERE'; // Replace with your actual RAWG API key
const CORS_PROXY = 'https://corsproxy.io/?'; // CORS proxy service
const BASE_URL = 'https://api.rawg.io/api';

// Helper function to construct API URL
const getApiUrl = (endpoint: string, params: Record<string, string | number> = {}) => {
  // Add API key to params
  const paramsWithKey = { ...params, key: API_KEY };
  
  // Construct query string
  const queryString = Object.entries(paramsWithKey)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  // Use CORS proxy during development
  const useProxy = import.meta.env.DEV;
  const baseUrlWithProxy = useProxy ? `${CORS_PROXY}${encodeURIComponent(`${BASE_URL}`)}` : BASE_URL;
  
  return `${baseUrlWithProxy}${endpoint}?${queryString}`;
};

// Interface for RAWG API game data structure
interface RawgGame {
  id: number;
  name: string;
  released: string;
  background_image: string;
  description?: string;
  description_raw?: string;
  developers?: Array<{ name: string }>;
  publishers?: Array<{ name: string }>;
  genres?: Array<{ name: string }>;
  tags?: Array<{ name: string }>;
  platforms?: Array<{
    platform: { name: string };
    requirements?: {
      minimum?: string;
      recommended?: string;
    };
  }>;
  short_screenshots?: Array<{ image: string }>;
  stores?: Array<{
    store: { name: string; domain?: string };
    url: string;
  }>;
}

// Function to parse system requirements from RAWG API
const parseRequirements = (platforms?: RawgGame['platforms']) => {
  const defaultReqs = {
    os: ['Windows 10'],
    cpu: 'Information not available',
    gpu: 'Information not available',
    ram: 8,
    storage: 50
  };

  if (!platforms || platforms.length === 0) {
    return { minimum: defaultReqs, recommended: defaultReqs };
  }

  // Find PC platform
  const pcPlatform = platforms.find(p => 
    p.platform.name.includes('PC') || 
    p.platform.name.includes('Windows')
  );

  if (!pcPlatform || !pcPlatform.requirements) {
    return { minimum: defaultReqs, recommended: defaultReqs };
  }

  const { minimum, recommended } = pcPlatform.requirements;

  // Parse minimum requirements
  const minReqs = { ...defaultReqs };
  if (minimum) {
    const minText = minimum.toLowerCase();
    
    // Extract OS
    if (minText.includes('windows')) {
      minReqs.os = ['Windows 10'];
      if (minText.includes('windows 7')) minReqs.os.push('Windows 7');
      if (minText.includes('windows 8')) minReqs.os.push('Windows 8');
    }
    
    // Extract CPU
    const cpuMatch = minText.match(/cpu:([^,;]+)/i) || minText.match(/processor:([^,;]+)/i);
    if (cpuMatch) minReqs.cpu = cpuMatch[1].trim();
    
    // Extract GPU
    const gpuMatch = minText.match(/graphics:([^,;]+)/i) || minText.match(/gpu:([^,;]+)/i);
    if (gpuMatch) minReqs.gpu = gpuMatch[1].trim();
    
    // Extract RAM
    const ramMatch = minText.match(/memory:([^,;]+)gb/i) || minText.match(/ram:([^,;]+)gb/i);
    if (ramMatch) minReqs.ram = parseInt(ramMatch[1].trim(), 10) || 8;
    
    // Extract Storage
    const storageMatch = minText.match(/storage:([^,;]+)gb/i) || minText.match(/space:([^,;]+)gb/i);
    if (storageMatch) minReqs.storage = parseInt(storageMatch[1].trim(), 10) || 50;
  }

  // Parse recommended requirements
  const recReqs = { ...defaultReqs };
  if (recommended) {
    const recText = recommended.toLowerCase();
    
    // Extract OS
    if (recText.includes('windows')) {
      recReqs.os = ['Windows 10'];
      if (recText.includes('windows 7')) recReqs.os.push('Windows 7');
      if (recText.includes('windows 8')) recReqs.os.push('Windows 8');
    }
    
    // Extract CPU
    const cpuMatch = recText.match(/cpu:([^,;]+)/i) || recText.match(/processor:([^,;]+)/i);
    if (cpuMatch) recReqs.cpu = cpuMatch[1].trim();
    
    // Extract GPU
    const gpuMatch = recText.match(/graphics:([^,;]+)/i) || recText.match(/gpu:([^,;]+)/i);
    if (gpuMatch) recReqs.gpu = gpuMatch[1].trim();
    
    // Extract RAM
    const ramMatch = recText.match(/memory:([^,;]+)gb/i) || recText.match(/ram:([^,;]+)gb/i);
    if (ramMatch) recReqs.ram = parseInt(ramMatch[1].trim(), 10) || 12;
    
    // Extract Storage
    const storageMatch = recText.match(/storage:([^,;]+)gb/i) || recText.match(/space:([^,;]+)gb/i);
    if (storageMatch) recReqs.storage = parseInt(storageMatch[1].trim(), 10) || 50;
  }

  return {
    minimum: minReqs,
    recommended: recReqs
  };
};

// Function to convert RAWG game to our Game type
const convertRawgGameToGame = (game: RawgGame): Game => {
  // Parse requirements
  const { minimum, recommended } = parseRequirements(game.platforms);
  
  // Extract store links
  const storeLinks: Record<string, string> = {};
  if (game.stores) {
    game.stores.forEach(store => {
      const storeName = store.store.name.toLowerCase();
      if (storeName.includes('steam')) storeLinks.steam = store.url;
      else if (storeName.includes('epic')) storeLinks.epic = store.url;
      else if (storeName.includes('gog')) storeLinks.gog = store.url;
      else if (storeName.includes('microsoft')) storeLinks.microsoft = store.url;
      else if (storeName.includes('playstation')) storeLinks.playstation = store.url;
    });
  }
  
  return {
    id: game.id,
    title: game.name,
    developer: game.developers && game.developers.length > 0 ? game.developers[0].name : 'Unknown Developer',
    publisher: game.publishers && game.publishers.length > 0 ? game.publishers[0].name : 'Unknown Publisher',
    releaseDate: game.released || 'Unknown',
    genre: game.genres ? game.genres.map(g => g.name) : ['Unknown'],
    tags: game.tags ? game.tags.slice(0, 10).map(t => t.name) : [],
    description: game.description_raw || game.description || 'No description available.',
    shortDescription: game.description_raw ? 
      game.description_raw.substring(0, 100) + '...' : 
      'No short description available.',
    coverImage: game.background_image || 'https://via.placeholder.com/600x400?text=Game+Image+Not+Available',
    screenshots: game.short_screenshots ? 
      game.short_screenshots.map(s => s.image) : 
      ['https://via.placeholder.com/1920x1080?text=Screenshot+Not+Available'],
    minimumRequirements: minimum,
    recommendedRequirements: recommended,
    storeLinks: storeLinks
  };
};

// Function to fetch games from the RAWG API
export const fetchGames = async (page = 1, pageSize = 12): Promise<Game[]> => {
  console.log(`fetchGames: Fetching page ${page} with ${pageSize} games per page`);
  try {
    const apiUrl = getApiUrl('/games', {
      page,
      page_size: pageSize,
      ordering: '-released',
      platforms: '4', // PC platform ID
    });
    
    console.log('fetchGames: API URL:', apiUrl);
    
    const response = await axios.get(apiUrl);
    console.log(`fetchGames: Received ${response.data.results.length} games from API`);
    
    if (!response.data.results || response.data.results.length === 0) {
      console.warn('fetchGames: No results returned from API, using fallback data');
      // Return a portion of our local data
      const startIndex = (page - 1) * pageSize;
      return (gamesData as Game[]).slice(startIndex, startIndex + pageSize);
    }
    
    // Convert API response to our Game type
    return response.data.results.map((game: RawgGame) => convertRawgGameToGame(game));
  } catch (error) {
    console.error('fetchGames: Error fetching games from API:', error);
    console.log('fetchGames: Using fallback data');
    
    // Return a portion of our local data
    const startIndex = (page - 1) * pageSize;
    return (gamesData as Game[]).slice(startIndex, startIndex + pageSize);
  }
};

// Function to fetch game details from the RAWG API
export const fetchGameDetails = async (id: number): Promise<Game> => {
  console.log(`fetchGameDetails: Fetching details for game ${id}`);
  try {
    const apiUrl = getApiUrl(`/games/${id}`);
    console.log('fetchGameDetails: API URL:', apiUrl);
    
    const response = await axios.get(apiUrl);
    console.log('fetchGameDetails: Received game details from API');
    
    // Get screenshots
    const screenshotsUrl = getApiUrl(`/games/${id}/screenshots`);
    const screenshotsResponse = await axios.get(screenshotsUrl);
    
    const gameData = response.data;
    if (screenshotsResponse.data.results) {
      gameData.short_screenshots = screenshotsResponse.data.results;
    }
    
    // Convert API response to our Game type
    return convertRawgGameToGame(gameData);
  } catch (error) {
    console.error('fetchGameDetails: Error fetching game details:', error);
    console.log('fetchGameDetails: Looking for game in fallback data');
    
    // Try to find the game in our local data
    const gameFromLocal = (gamesData as Game[]).find(game => game.id === id);
    
    if (gameFromLocal) {
      console.log('fetchGameDetails: Found game in fallback data');
      return gameFromLocal;
    }
    
    // If game not found in local data, throw an error
    throw new Error(`Game with ID ${id} not found`);
  }
};

// Function to search for games from the RAWG API
export const searchGames = async (searchTerm: string): Promise<Game[]> => {
  console.log(`searchGames: Searching for "${searchTerm}"`);
  try {
    const apiUrl = getApiUrl('/games', {
      search: searchTerm,
      page_size: 20,
      platforms: '4', // PC platform ID
    });
    
    console.log('searchGames: API URL:', apiUrl);
    
    const response = await axios.get(apiUrl);
    
    console.log(`searchGames: Received ${response.data.results.length} results from API`);
    
    if (!response.data.results || response.data.results.length === 0) {
      console.log('searchGames: No results from API, searching in fallback data');
      // Search in local data
      const searchTermLower = searchTerm.toLowerCase();
      const localResults = (gamesData as Game[]).filter(game => 
        game.title.toLowerCase().includes(searchTermLower) ||
        game.developer.toLowerCase().includes(searchTermLower) ||
        game.publisher.toLowerCase().includes(searchTermLower) ||
        game.tags.some(tag => tag.toLowerCase().includes(searchTermLower)) ||
        game.genre.some(genre => genre.toLowerCase().includes(searchTermLower))
      );
      
      console.log(`searchGames: Found ${localResults.length} matches in fallback data`);
      return localResults;
    }
    
    // Convert API response to our Game type
    return response.data.results.map((game: RawgGame) => convertRawgGameToGame(game));
  } catch (error) {
    console.error('searchGames: Error searching games:', error);
    console.log('searchGames: Searching in fallback data');
    
    // Search in local data
    const searchTermLower = searchTerm.toLowerCase();
    const localResults = (gamesData as Game[]).filter(game => 
      game.title.toLowerCase().includes(searchTermLower) ||
      game.developer.toLowerCase().includes(searchTermLower) ||
      game.publisher.toLowerCase().includes(searchTermLower) ||
      game.tags.some(tag => tag.toLowerCase().includes(searchTermLower)) ||
      game.genre.some(genre => genre.toLowerCase().includes(searchTermLower))
    );
    
    console.log(`searchGames: Found ${localResults.length} matches in fallback data`);
    return localResults;
  }
}; 