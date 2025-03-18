import axios from 'axios';
import { Game, GameRequirements } from '../types';

// IGDB API configuration
const CLIENT_ID = import.meta.env.VITE_IGDB_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_IGDB_CLIENT_SECRET;
const BASE_URL = 'https://api.igdb.com/v4';
const AUTH_URL = 'https://id.twitch.tv/oauth2/token';

// Token storage
let authToken = '';
let tokenExpiry = 0;

// IGDB API types
interface IgdbCompany {
  id: number;
  name: string;
}

interface IgdbInvolvedCompany {
  id: number;
  company: IgdbCompany;
  developer: boolean;
  publisher: boolean;
}

interface IgdbGenre {
  id: number;
  name: string;
}

interface IgdbTheme {
  id: number;
  name: string;
}

interface IgdbCover {
  id: number;
  url: string;
}

interface IgdbScreenshot {
  id: number;
  url: string;
}

interface IgdbVideo {
  id: number;
  name?: string;
  video_id: string;
}

interface IgdbWebsite {
  id: number;
  url: string;
  category: number;
  price?: number;
}

interface IgdbPlatformSpecification {
  minimum?: string;
  recommended?: string;
}

interface IgdbPlatformVersion {
  id: number;
  specifications?: IgdbPlatformSpecification;
}

interface IgdbPlatformVersionReleaseDate {
  id: number;
  platform_version: IgdbPlatformVersion;
}

interface IgdbPlatform {
  id: number;
  name: string;
  abbreviation?: string;
  platform_version_release_dates?: IgdbPlatformVersionReleaseDate[];
}

interface IgdbGame {
  id: number;
  name: string;
  first_release_date?: number;
  cover?: IgdbCover;
  genres?: IgdbGenre[];
  themes?: IgdbTheme[];
  involved_companies?: IgdbInvolvedCompany[];
  platforms?: IgdbPlatform[];
  summary?: string;
  storyline?: string;
  aggregated_rating?: number;
  rating?: number;
  screenshots?: IgdbScreenshot[];
  videos?: IgdbVideo[];
  websites?: IgdbWebsite[];
  similar_games?: Partial<IgdbGame>[];
  dlcs?: Partial<IgdbGame>[];
}

// Set of public CORS proxies to try when one fails
// NOTE: For a more permanent solution, consider setting up your own server-side proxy.
// This would involve:
// 1. Creating a simple Express.js server endpoint that forwards requests to IGDB
// 2. Storing your API credentials securely on the server
// 3. Properly handling CORS by allowing your frontend origins
// Public CORS proxies may be unreliable or have usage limits.
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors.sh/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://proxy.cors.sh/',
  'https://corsproxy.io/?'
];

// Track which proxy we're currently using
let currentProxyIndex = 0;

// Get the current CORS proxy URL
const getCurrentProxy = (): string => {
  return CORS_PROXIES[currentProxyIndex];
};

// Try the next proxy in the list
const switchToNextProxy = (): string => {
  currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
  console.log(`Switching to next CORS proxy: ${getCurrentProxy()}`);
  return getCurrentProxy();
};

// Test connectivity to a proxy
const testProxyConnectivity = async (proxyUrl: string): Promise<boolean> => {
  try {
    console.log(`[IGDB API] Testing connectivity to proxy: ${proxyUrl}`);
    
    // Use a simple HEAD request to test connection
    const testUrl = proxyUrl + 'https://api.igdb.com';
    const response = await fetch(testUrl, { 
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    });
    
    console.log(`[IGDB API] Proxy test result: ${response.status} ${response.statusText}`);
    return response.status >= 200 && response.status < 400;
  } catch (error) {
    console.error(`[IGDB API] Proxy connectivity test failed for ${proxyUrl}:`, error);
    return false;
  }
};

// Find a working proxy
const findWorkingProxy = async (): Promise<string> => {
  console.log(`[IGDB API] Finding a working CORS proxy...`);
  
  // Try current proxy first
  const currentProxy = getCurrentProxy();
  if (await testProxyConnectivity(currentProxy)) {
    console.log(`[IGDB API] Current proxy works: ${currentProxy}`);
    return currentProxy;
  }
  
  // Test all proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    if (await testProxyConnectivity(proxy)) {
      console.log(`[IGDB API] Found working proxy: ${proxy}`);
      currentProxyIndex = i;
      return proxy;
    }
  }
  
  // If no proxy works, return the first one as fallback
  console.error(`[IGDB API] No working CORS proxy found, using first one as fallback`);
  currentProxyIndex = 0;
  return CORS_PROXIES[0];
};

// Get an OAuth token from Twitch for IGDB API access
const getAuthToken = async (): Promise<string> => {
  // Check if we have a valid token
  if (authToken && tokenExpiry > Date.now()) {
    console.log('Using existing auth token (expires in', Math.round((tokenExpiry - Date.now()) / 1000), 'seconds)');
    return authToken;
  }

  console.log('Requesting new auth token from Twitch...');
  // Check if credentials are set
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('IGDB API credentials are missing. Make sure VITE_IGDB_CLIENT_ID and VITE_IGDB_CLIENT_SECRET are set in your .env file');
    throw new Error('Missing IGDB API credentials');
  }

  try {
    const authUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
    console.log('Auth URL:', authUrl.replace(CLIENT_SECRET, '[SECRET]')); // Log URL without exposing the secret
    
    const response = await axios.post(authUrl);

    if (response.data && response.data.access_token) {
      authToken = response.data.access_token;
      // Set expiry (subtract 300 seconds to be safe)
      tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
      console.log('New auth token received, expires in', Math.round((tokenExpiry - Date.now()) / 1000), 'seconds');
      return authToken;
    } else {
      console.error('Failed to obtain auth token, response:', response.data);
      throw new Error('Failed to obtain auth token');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error getting IGDB auth token:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error('Error getting IGDB auth token:', error);
    }
    throw new Error('Authentication failed');
  }
};

// Make an API request to IGDB
const makeIgdbRequest = async <T>(endpoint: string, query: string, retryCount = 0): Promise<T> => {
  const MAX_RETRIES = 3;
  try {
    // Get authentication token
    const token = await getAuthToken();
    
    console.log(`Making IGDB API request to ${endpoint} with data: ${query}`);
    
    // Find a working CORS proxy
    const proxyUrl = await findWorkingProxy() + BASE_URL + '/' + endpoint;
    console.log(`Using proxy URL: ${proxyUrl}`);
    
    console.log(`[IGDB API] Attempting request with proxy: ${getCurrentProxy()}`);
    
    const response = await axios({
      url: proxyUrl,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain', // IGDB requires text/plain for their API
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${token}`
      },
      data: query,
      transformRequest: [(data) => data], // Prevent axios from transforming the request body
      validateStatus: (status) => status < 500 // Don't throw for 4xx errors so we can handle them ourselves
    });

    // Check for successful response
    if (response.status >= 200 && response.status < 300) {
      console.log(`IGDB API request successful with ${endpoint}`);
      console.log(`[IGDB API] Received ${Array.isArray(response.data) ? response.data.length : 'non-array'} data items`);
      return response.data;
    } else {
      // Handle non-successful responses
      console.error(`IGDB API returned status ${response.status}: ${response.statusText}`);
      console.error(`[IGDB API] Response data:`, response.data);
      throw new Error(`IGDB API error: ${response.statusText}`);
    }
  } catch (error: unknown) {
    console.error('Error making IGDB API request:', error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.error('[IGDB API] Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: {
            ...error.config?.headers,
            Authorization: '[REDACTED]'
          }
        }
      });
      
      if (error.response) {
        console.error('[IGDB API] Error response:', error.response.data);
      } else if (error.request) {
        console.error('[IGDB API] No response received - network issue');
      }
    }
    
    // If we've tried all proxies and maxed out retries, throw
    if (retryCount >= MAX_RETRIES) {
      console.error(`[IGDB API] Maximum retries (${MAX_RETRIES}) reached for IGDB API request`);
      throw error;
    }
    
    // Try the next proxy
    switchToNextProxy();
    console.log(`[IGDB API] Retrying with new proxy ${getCurrentProxy()} (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
    return makeIgdbRequest<T>(endpoint, query, retryCount + 1);
  }
};

// Direct implementation that doesn't use CORS proxies (for use in environments where CORS is not an issue)
const makeDirectIgdbRequest = async <T>(endpoint: string, query: string): Promise<T> => {
  try {
    // Get authentication token
    const token = await getAuthToken();
    
    console.log(`[IGDB API] Making direct API request to ${endpoint} with data: ${query}`);
    
    const directUrl = `${BASE_URL}/${endpoint}`;
    console.log(`[IGDB API] Using direct URL: ${directUrl}`);
    
    const response = await axios({
      url: directUrl,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${token}`
      },
      data: query,
      transformRequest: [(data) => data],
      validateStatus: (status) => status < 500
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(`[IGDB API] Direct request successful with ${endpoint}`);
      return response.data;
    } else {
      console.error(`[IGDB API] Direct request returned status ${response.status}: ${response.statusText}`);
      console.error(`[IGDB API] Response data:`, response.data);
      throw new Error(`IGDB API error: ${response.statusText}`);
    }
  } catch (error: unknown) {
    console.error('[IGDB API] Error making direct API request:', error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.error('[IGDB API] Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      if (error.response) {
        console.error('[IGDB API] Error response:', error.response.data);
      } else if (error.request) {
        console.error('[IGDB API] No response received - network issue');
      }
    }
    
    throw error;
  }
};

// Try both proxy and direct methods
const tryBothRequestMethods = async <T>(endpoint: string, query: string): Promise<T> => {
  try {
    // Try proxy method first
    return await makeIgdbRequest<T>(endpoint, query);
  } catch (proxyError) {
    console.error('[IGDB API] Proxy request failed, attempting direct request...');
    
    try {
      // Try direct method as fallback
      return await makeDirectIgdbRequest<T>(endpoint, query);
    } catch (_directError) {
      console.error('[IGDB API] Both proxy and direct requests failed.');
      // Rethrow the proxy error as it's likely more relevant in most cases
      throw proxyError;
    }
  }
};

// Parse PC system requirements from IGDB data
const parseSystemRequirements = (requirements?: IgdbPlatformSpecification): { 
  minimum: GameRequirements; 
  recommended: GameRequirements 
} => {
  const defaultReqs: GameRequirements = {
    os: ['Windows 10'],
    cpu: 'Information not available',
    gpu: 'Information not available',
    ram: 8,
    storage: 50
  };

  if (!requirements) {
    return { minimum: { ...defaultReqs }, recommended: { ...defaultReqs } };
  }

  // Parse minimum requirements
  const minReqs = { ...defaultReqs };
  if (requirements.minimum) {
    const minText = requirements.minimum.toLowerCase();
    
    // Extract OS
    if (minText.includes('windows')) {
      minReqs.os = ['Windows 10'];
      if (minText.includes('windows 7')) minReqs.os.push('Windows 7');
      if (minText.includes('windows 8')) minReqs.os.push('Windows 8');
      if (minText.includes('windows xp')) minReqs.os.push('Windows XP');
    }
    
    // Extract CPU
    const cpuMatch = minText.match(/cpu:([^,;]+)/i) || 
                    minText.match(/processor:([^,;]+)/i) || 
                    minText.match(/minimum:([^,;]*?(i3|i5|i7|ryzen|amd|intel)[^,;]*)/i);
    if (cpuMatch) minReqs.cpu = cpuMatch[1].trim();
    
    // Extract GPU
    const gpuMatch = minText.match(/graphics:([^,;]+)/i) || 
                    minText.match(/gpu:([^,;]+)/i) || 
                    minText.match(/video card:([^,;]+)/i) ||
                    minText.match(/(nvidia|radeon|geforce|gtx|rtx)[^,;]*/i);
    if (gpuMatch) minReqs.gpu = gpuMatch[0].trim();
    
    // Extract RAM
    const ramMatch = minText.match(/(\d+)\s*gb\s*(ram|memory)/i) || 
                    minText.match(/(ram|memory)\s*:?\s*(\d+)\s*gb/i);
    if (ramMatch) {
      const ramSize = parseInt(ramMatch[1] || ramMatch[2], 10);
      if (!isNaN(ramSize)) minReqs.ram = ramSize;
    }
    
    // Extract Storage
    const storageMatch = minText.match(/(\d+)\s*gb\s*(hdd|ssd|storage|space|disk)/i) || 
                        minText.match(/(storage|space|disk)\s*:?\s*(\d+)\s*gb/i);
    if (storageMatch) {
      const storageSize = parseInt(storageMatch[1] || storageMatch[2], 10);
      if (!isNaN(storageSize)) minReqs.storage = storageSize;
    }
  }

  // Parse recommended requirements
  const recReqs = { ...defaultReqs };
  if (requirements.recommended) {
    const recText = requirements.recommended.toLowerCase();
    
    // Extract OS
    if (recText.includes('windows')) {
      recReqs.os = ['Windows 10'];
      if (recText.includes('windows 7')) recReqs.os.push('Windows 7');
      if (recText.includes('windows 8')) recReqs.os.push('Windows 8');
    }
    
    // Extract CPU
    const cpuMatch = recText.match(/cpu:([^,;]+)/i) || 
                    recText.match(/processor:([^,;]+)/i) || 
                    recText.match(/recommended:([^,;]*?(i3|i5|i7|ryzen|amd|intel)[^,;]*)/i);
    if (cpuMatch) recReqs.cpu = cpuMatch[1].trim();
    
    // Extract GPU
    const gpuMatch = recText.match(/graphics:([^,;]+)/i) || 
                    recText.match(/gpu:([^,;]+)/i) || 
                    recText.match(/video card:([^,;]+)/i) ||
                    recText.match(/(nvidia|radeon|geforce|gtx|rtx)[^,;]*/i);
    if (gpuMatch) recReqs.gpu = gpuMatch[0].trim();
    
    // Extract RAM
    const ramMatch = recText.match(/(\d+)\s*gb\s*(ram|memory)/i) || 
                    recText.match(/(ram|memory)\s*:?\s*(\d+)\s*gb/i);
    if (ramMatch) {
      const ramSize = parseInt(ramMatch[1] || ramMatch[2], 10);
      if (!isNaN(ramSize)) recReqs.ram = ramSize;
    }
    
    // Extract Storage
    const storageMatch = recText.match(/(\d+)\s*gb\s*(hdd|ssd|storage|space|disk)/i) || 
                        recText.match(/(storage|space|disk)\s*:?\s*(\d+)\s*gb/i);
    if (storageMatch) {
      const storageSize = parseInt(storageMatch[1] || storageMatch[2], 10);
      if (!isNaN(storageSize)) recReqs.storage = storageSize;
    }
  }

  return {
    minimum: minReqs,
    recommended: recReqs
  };
};

// Convert IGDB game data to our Game type
const convertIgdbGameToGame = (game: IgdbGame): Game => {
  // Parse the system requirements
  const pcPlatform = game.platforms?.find(p => 
    p.name === 'PC' || p.abbreviation === 'PC'
  );
  
  const requirements = pcPlatform?.platform_version_release_dates?.[0]?.platform_version?.specifications;
  const { minimum, recommended } = parseSystemRequirements(requirements);
  
  // Get price from stores if available
  let priceString = 'Price not available';
  if (game.websites) {
    const storeWebsite = game.websites.find(site => site.category === 13); // 13 is for Steam
    if (storeWebsite && storeWebsite.price) {
      priceString = `$${storeWebsite.price.toFixed(2)}`;
    }
  }
  
  // Extract store links
  const storeLinks: Record<string, string> = {};
  if (game.websites) {
    game.websites.forEach(site => {
      const url = site.url;
      // Map website categories to our store types
      switch (site.category) {
        case 1: storeLinks.official = url; break; // Official website
        case 13: storeLinks.steam = url; break; // Steam
        case 14: storeLinks.epic = url; break; // Epic Games
        case 17: storeLinks.gog = url; break; // GOG
        case 15: storeLinks.playstation = url; break; // PlayStation Store
        case 16: storeLinks.xbox = url; break; // Xbox Marketplace
        case 28: storeLinks.nintendo = url; break; // Nintendo eShop
      }
    });
  }
  
  // Get cover image
  const coverUrl = game.cover?.url 
    ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
    : 'https://via.placeholder.com/600x800?text=No+Image+Available';
  
  // Get screenshots
  const screenshots = game.screenshots
    ? game.screenshots.map(s => `https:${s.url.replace('t_thumb', 't_1080p')}`)
    : [];
  
  // Get rating
  const ratings = [];
  if (game.aggregated_rating) {
    ratings.push({
      score: Math.round(game.aggregated_rating),
      outOf: 100,
      source: 'Critics'
    });
  }
  if (game.rating) {
    ratings.push({
      score: Math.round(game.rating),
      outOf: 100,
      source: 'Users'
    });
  }
  
  return {
    id: game.id,
    title: game.name,
    coverImage: coverUrl,
    developer: game.involved_companies?.find(company => company.developer)?.company?.name || 'Unknown Developer',
    publisher: game.involved_companies?.find(company => company.publisher)?.company?.name || 'Unknown Publisher',
    releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : 'Unknown',
    genre: game.genres?.map(g => g.name) || ['Unknown'],
    tags: game.themes?.map(t => t.name) || [],
    price: priceString,
    description: game.summary || 'No description available.',
    shortDescription: game.summary ? `${game.summary.substring(0, 120)}...` : 'No description available.',
    minimumRequirements: minimum,
    recommendedRequirements: recommended,
    website: storeLinks.official,
    storeLinks: storeLinks,
    rating: ratings.length > 0 ? ratings : undefined,
    screenshots: screenshots,
    videos: game.videos?.map(v => ({
      thumbnail: `https://img.youtube.com/vi/${v.video_id}/maxresdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${v.video_id}`,
      title: v.name || 'Game Video'
    }))
  };
};

// Fetch a list of games
export const fetchGames = async (page = 1, pageSize = 12): Promise<Game[]> => {
  const offset = (page - 1) * pageSize;
  
  // Fields to retrieve
  const fields = 'id,name,cover.url,cover.image_id,first_release_date,genres.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,screenshots.url,screenshots.image_id,summary,themes.name';
  
  // Construct query
  const query = `
    fields ${fields};
    limit ${pageSize};
    offset ${offset};
    where cover.image_id != null & rating >= 75;
    sort rating desc;
  `;
  
  // Make request to IGDB API with both methods
  const games = await tryBothRequestMethods<IgdbGame[]>('games', query);
  
  // Convert to our Game format
  return games.map(convertIgdbGameToGame);
};

// Fetch details for a specific game
export const fetchGameDetails = async (id: number): Promise<Game> => {
  console.log(`[IGDB API] Fetching details for game with ID: ${id}`);
  
  try {
    // Fields to retrieve
    const fields = 'id,name,cover.url,cover.image_id,first_release_date,genres.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,screenshots.url,screenshots.image_id,summary,storyline,videos.*,websites.*,themes.name,similar_games.name,similar_games.cover.image_id,dlcs.name,dlcs.cover.image_id,platforms.name,platforms.platform_version_release_dates.platform_version.specifications';
    
    // Construct query
    const query = `
      fields ${fields};
      where id = ${id};
    `;
    
    console.log(`[IGDB API] Query for game details: ${query}`);
    
    // Make request to IGDB API with both methods
    const games = await tryBothRequestMethods<IgdbGame[]>('games', query);
    
    console.log(`[IGDB API] Received game details response: ${games ? 'success' : 'null'}, length: ${games?.length || 0}`);
    
    if (!games || games.length === 0) {
      console.error(`[IGDB API] No game found with ID ${id}`);
      throw new Error(`Game with ID ${id} not found`);
    }
    
    // Convert to our Game format
    const gameDetails = convertIgdbGameToGame(games[0]);
    console.log(`[IGDB API] Converted game details for: ${gameDetails.title} (ID: ${gameDetails.id})`);
    return gameDetails;
  } catch (error) {
    console.error(`[IGDB API] Error fetching game details for ID ${id}:`, error);
    
    // Try again with a simpler query using a different proxy
    try {
      console.log(`[IGDB API] Attempting fallback method for game ID: ${id}`);
      switchToNextProxy();
      
      // Simpler query with fewer fields
      const simpleFields = 'id,name,cover.url,cover.image_id,first_release_date,summary';
      const simpleQuery = `
        fields ${simpleFields};
        where id = ${id};
      `;
      
      console.log(`[IGDB API] Fallback query: ${simpleQuery}`);
      
      const games = await tryBothRequestMethods<IgdbGame[]>('games', simpleQuery);
      
      if (!games || games.length === 0) {
        console.error(`[IGDB API] Fallback method: No game found with ID ${id}`);
        throw new Error(`Game with ID ${id} not found after fallback attempt`);
      }
      
      // Convert to our Game format
      const gameDetails = convertIgdbGameToGame(games[0]);
      console.log(`[IGDB API] Fallback method succeeded for game: ${gameDetails.title} (ID: ${gameDetails.id})`);
      return gameDetails;
    } catch (fallbackError) {
      console.error(`[IGDB API] All methods failed for game ID ${id}:`, fallbackError);
      throw new Error(`Failed to fetch game details: ${error}`);
    }
  }
};

// Search for games
export const searchGames = async (searchTerm: string): Promise<Game[]> => {
  if (!searchTerm.trim()) {
    return fetchGames();
  }
  
  console.log(`Searching for games with term: "${searchTerm}"`);
  
  // Fields to retrieve
  const fields = 'id,name,cover.url,cover.image_id,first_release_date,genres.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,screenshots.url,screenshots.image_id,summary,themes.name';
  
  // Try first with search syntax
  let query = `
    search "${searchTerm}";
    fields ${fields};
    limit 20;
    where cover.image_id != null;
  `;
  
  let games = await tryBothRequestMethods<IgdbGame[]>('games', query);
  
  // If no results, try alternative search method
  if (games.length === 0) {
    console.log('No results with search query, trying name contains method');
    query = `
      fields ${fields};
      limit 20;
      where cover.image_id != null & name ~ *"${searchTerm}"*;
    `;
    
    games = await tryBothRequestMethods<IgdbGame[]>('games', query);
  }
  
  // Convert to our Game format
  return games.map(convertIgdbGameToGame);
};

// Fetch game system requirements by ID
export const fetchGameRequirements = async (id: number): Promise<{minimum: GameRequirements; recommended: GameRequirements}> => {
  // Get game details, which includes platform requirements
  const gameDetails = await fetchGameDetails(id);
  
  return {
    minimum: gameDetails.minimumRequirements,
    recommended: gameDetails.recommendedRequirements
  };
};

// Function to extract game ID from the IGDB API game object
export const getGameIdFromUrl = (url: string): number | null => {
  try {
    // Extract game ID if it's in the URL format like /games/1234
    const match = url.match(/\/games\/(\d+)/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  } catch (error) {
    console.error("Error extracting game ID:", error);
    return null;
  }
};

// Alternative implementation that fetches game directly without CORS proxy
// This might work in some cases where the regular approach fails
export const fetchGameDetailsAlternative = async (id: number): Promise<Game> => {
  console.log(`[IGDB API] Trying alternative fetch method for game ID: ${id}`);
  
  try {
    // Fields to retrieve - using minimal fields to improve chances of success
    const fields = 'id,name,cover.url,cover.image_id,first_release_date,summary';
    
    // Construct query - using a simpler query with fewer fields to increase chance of success
    const query = `
      fields ${fields};
      where id = ${id};
    `;
    
    console.log(`[IGDB API] Alternative query for game ${id}: ${query}`);
    
    // Try direct request without any proxy
    const games = await makeDirectIgdbRequest<IgdbGame[]>('games', query);
    
    if (!games || games.length === 0) {
      console.error(`[IGDB API] Alternative method: No game found with ID ${id}`);
      throw new Error(`Game with ID ${id} not found`);
    }
    
    // Convert to our Game format
    const gameDetails = convertIgdbGameToGame(games[0]);
    console.log(`[IGDB API] Alternative method succeeded for game: ${gameDetails.title} (ID: ${gameDetails.id})`);
    return gameDetails;
  } catch (error) {
    console.error(`[IGDB API] Alternative method failed for game ID ${id}:`, error);
    throw error;
  }
}; 