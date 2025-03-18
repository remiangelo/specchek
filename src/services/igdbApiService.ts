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

// Get an OAuth token from Twitch for IGDB API access
const getAuthToken = async (): Promise<string> => {
  // Check if we have a valid token
  if (authToken && tokenExpiry > Date.now()) {
    return authToken;
  }

  try {
    const response = await axios.post(
      `${AUTH_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
    );

    if (response.data && response.data.access_token) {
      authToken = response.data.access_token;
      // Set expiry (subtract 300 seconds to be safe)
      tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
      return authToken;
    } else {
      throw new Error('Failed to obtain auth token');
    }
  } catch (error) {
    console.error('Error getting IGDB auth token:', error);
    throw new Error('Authentication failed');
  }
};

// Make an API request to IGDB
const makeIgdbRequest = async <T>(endpoint: string, query: string): Promise<T> => {
  try {
    const token = await getAuthToken();
    const response = await axios({
      url: `${BASE_URL}${endpoint}`,
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
      },
      data: query
    });

    return response.data;
  } catch (error) {
    console.error(`Error making IGDB API request to ${endpoint}:`, error);
    throw error;
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
  console.log(`IGDB: Fetching page ${page} with ${pageSize} games per page`);
  
  try {
    const offset = (page - 1) * pageSize;
    const query = `
      fields name, cover.url, first_release_date, genres.name, themes.name, 
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher, 
             platforms.name, platforms.abbreviation, summary, screenshots.url, videos.*, websites.*;
      where platforms = (6) & category = (0) & version_parent = null;
      sort first_release_date desc;
      limit ${pageSize};
      offset ${offset};
    `;
    
    const games = await makeIgdbRequest('/games', query);
    console.log(`IGDB: Received ${games.length} games from API`);
    
    return games.map(convertIgdbGameToGame);
  } catch (error) {
    console.error('IGDB: Error fetching games:', error);
    throw error;
  }
};

// Fetch details for a specific game
export const fetchGameDetails = async (id: number): Promise<Game> => {
  console.log(`IGDB: Fetching details for game ${id}`);
  
  try {
    const query = `
      fields name, cover.url, first_release_date, genres.name, themes.name, 
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher, 
             platforms.name, platforms.abbreviation, platforms.platform_version_release_dates.platform_version.specifications,
             summary, storyline, aggregated_rating, rating, screenshots.url, videos.*, websites.*,
             similar_games.name, similar_games.cover.url, dlcs.name, dlcs.cover.url;
      where id = ${id};
    `;
    
    const games = await makeIgdbRequest('/games', query);
    
    if (!games || games.length === 0) {
      throw new Error(`Game with ID ${id} not found`);
    }
    
    console.log('IGDB: Received game details from API');
    return convertIgdbGameToGame(games[0]);
  } catch (error) {
    console.error('IGDB: Error fetching game details:', error);
    throw error;
  }
};

// Search for games
export const searchGames = async (searchTerm: string): Promise<Game[]> => {
  console.log(`IGDB: Searching for "${searchTerm}"`);
  
  try {
    const query = `
      search "${searchTerm}";
      fields name, cover.url, first_release_date, genres.name, themes.name, 
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher, 
             platforms.name, platforms.abbreviation, summary, screenshots.url;
      where platforms = (6);
      limit 12;
    `;
    
    const games = await makeIgdbRequest('/games', query);
    console.log(`IGDB: Search returned ${games.length} results`);
    
    return games.map(convertIgdbGameToGame);
  } catch (error) {
    console.error('IGDB: Error searching games:', error);
    throw error;
  }
};

// Fetch game system requirements by ID
export const fetchGameRequirements = async (id: number): Promise<{minimum: GameRequirements; recommended: GameRequirements}> => {
  console.log(`IGDB: Fetching requirements for game ${id}`);
  
  try {
    const query = `
      fields platforms.name, platforms.abbreviation, platforms.platform_version_release_dates.platform_version.specifications;
      where id = ${id};
    `;
    
    const games = await makeIgdbRequest('/games', query);
    
    if (!games || games.length === 0) {
      throw new Error(`Game with ID ${id} not found`);
    }
    
    const game = games[0];
    // Find PC platform specifications
    const pcPlatform = game.platforms?.find((p: any) => 
      p.name === 'PC' || p.abbreviation === 'PC'
    );
    
    const specifications = pcPlatform?.platform_version_release_dates?.[0]?.platform_version?.specifications;
    
    return parseSystemRequirements(specifications);
  } catch (error) {
    console.error('IGDB: Error fetching game requirements:', error);
    throw error;
  }
}; 