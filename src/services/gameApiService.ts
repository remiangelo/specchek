import axios from 'axios';
import { Game } from '../types';

// IGDB API configuration
const CLIENT_ID = import.meta.env.VITE_IGDB_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_IGDB_CLIENT_SECRET;
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';
const IGDB_API_URL = 'https://api.igdb.com/v4';

// Log API credentials (but mask most of it for security)
console.log('API Configuration:');
console.log(`- Client ID: ${CLIENT_ID ? CLIENT_ID.substring(0, 4) + '...' : 'Not set'}`);
console.log(`- Client Secret: ${CLIENT_SECRET ? CLIENT_SECRET.substring(0, 4) + '...' : 'Not set'}`);

// Store the access token and its expiration
let accessToken: string | null = null;
let tokenExpiry: number | null = null;

// Flag to indicate if we're using live data
export let usingLiveData = true;

/**
 * Get an OAuth access token from Twitch for IGDB API access
 */
const getAccessToken = async (): Promise<string> => {
  // Check if we have a valid token already
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('Using existing access token');
    return accessToken;
  }

  try {
    console.log('Getting new access token from Twitch...');
    const authUrl = `${TWITCH_AUTH_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
    console.log(`Auth URL: ${TWITCH_AUTH_URL}?client_id=[MASKED]&client_secret=[MASKED]&grant_type=client_credentials`);
    
    const response = await axios.post(authUrl);
    
    console.log('Auth response status:', response.status);
    console.log('Auth response data type:', typeof response.data);
    
    const newToken = response.data.access_token;
    if (!newToken) {
      console.error('Response data:', JSON.stringify(response.data, null, 2));
      throw new Error('No access token received from Twitch');
    }
    
    accessToken = newToken;
    // Set expiry time (subtract 10 minutes to be safe)
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 600000;
    
    console.log('Successfully obtained new access token');
    console.log(`Token expiry: ${new Date(tokenExpiry).toISOString()}`);
    return newToken;
  } catch (error) {
    console.error('Failed to get access token:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    throw new Error('Authentication with IGDB failed');
  }
};

/**
 * Make a request to the IGDB API
 */
const queryIGDB = async (endpoint: string, query: string): Promise<any> => {
  try {
    const token = await getAccessToken();
    
    console.log(`Making IGDB API request to ${endpoint}:`);
    console.log('Query:', query);
    
    const response = await axios({
      url: `${IGDB_API_URL}/${endpoint}`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${token}`
      },
      data: query
    });
    
    console.log(`IGDB response status: ${response.status}`);
    console.log(`Response data length: ${Array.isArray(response.data) ? response.data.length : 'Not an array'}`);
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('First item in response:', JSON.stringify(response.data[0], null, 2).substring(0, 200) + '...');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error querying IGDB ${endpoint}:`, error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    
    throw error;
  }
};

/**
 * Fetch a list of games
 */
export const fetchGames = async (page = 1, pageSize = 20): Promise<Game[]> => {
  try {
    console.log(`Fetching games from IGDB (page ${page}, pageSize ${pageSize})...`);
    
    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;
    
    // Use a simplified query with only essential fields
    const query = `
      fields name, cover.image_id, first_release_date;
      limit ${pageSize};
      offset ${offset};
      sort total_rating desc;
    `;
    
    const games = await queryIGDB('games', query);
    console.log(`Fetched ${games.length} games from IGDB`);
    
    if (games.length === 0) {
      console.warn('IGDB returned zero games, this is unusual');
    }
    
    // If we get games back, do a second query to get more details for these specific games
    const detailedGames = [];
    if (games.length > 0) {
      // Map the simplified games to our Game format with placeholder values
      for (const game of games) {
        try {
          detailedGames.push({
            id: game.id,
            title: game.name,
            coverImage: game.cover 
              ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
              : 'https://placehold.co/600x800?text=No+Image',
            developer: 'Loading...',
            publisher: 'Loading...',
            releaseDate: game.first_release_date 
              ? new Date(game.first_release_date * 1000).toISOString().split('T')[0]
              : 'Unknown',
            genre: ['Loading...'],
            tags: [],
            description: 'Loading description...',
            shortDescription: 'Loading description...',
            minimumRequirements: {
              os: ['Windows 10'],
              cpu: 'Information not available',
              gpu: 'Information not available',
              ram: 8,
              storage: 50
            },
            recommendedRequirements: {
              os: ['Windows 10'],
              cpu: 'Information not available',
              gpu: 'Information not available',
              ram: 16,
              storage: 50
            },
            website: '#',
            storeLinks: {},
            screenshots: []
          });
        } catch (conversionError) {
          console.error(`Error converting game ${game.id}:`, conversionError);
        }
      }
    }
    
    // Convert to our Game format
    usingLiveData = true;
    return detailedGames.length > 0 ? detailedGames : [];
  } catch (error) {
    console.error('Error fetching games:', error);
    usingLiveData = false;
    // Return empty array
    return [];
  }
};

/**
 * Fetch details for a specific game
 */
export const fetchGameDetails = async (id: number): Promise<Game> => {
  try {
    console.log(`Fetching details for game ${id} from IGDB...`);
    
    // Use a simplified query with only essential fields
    const query = `
      fields name, cover.image_id, first_release_date, summary;
      where id = ${id};
    `;
    
    const games = await queryIGDB('games', query);
    
    if (!games || games.length === 0) {
      console.error(`No game found with ID ${id} in IGDB database`);
      throw new Error(`Game with ID ${id} not found`);
    }
    
    console.log(`Successfully fetched details for game: ${games[0].name} (ID: ${games[0].id})`);
    
    // Convert the game to our format with minimal information
    const game = games[0];
    const gameDetails: Game = {
      id: game.id,
      title: game.name,
      coverImage: game.cover 
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
        : 'https://placehold.co/600x800?text=No+Image',
      developer: 'Unknown Developer',
      publisher: 'Unknown Publisher',
      releaseDate: game.first_release_date 
        ? new Date(game.first_release_date * 1000).toISOString().split('T')[0]
        : 'Unknown',
      genre: ['Unknown'],
      tags: [],
      description: game.summary || 'No description available.',
      shortDescription: game.summary 
        ? (game.summary.length > 150 ? game.summary.substring(0, 150) + '...' : game.summary)
        : 'No description available.',
      minimumRequirements: {
        os: ['Windows 10'],
        cpu: 'Information not available',
        gpu: 'Information not available',
        ram: 8,
        storage: 50
      },
      recommendedRequirements: {
        os: ['Windows 10'],
        cpu: 'Information not available',
        gpu: 'Information not available',
        ram: 16,
        storage: 50
      },
      website: '#',
      storeLinks: {},
      screenshots: []
    };
    
    usingLiveData = true;
    return gameDetails;
  } catch (error) {
    console.error(`Error fetching game details for ID ${id}:`, error);
    
    if (axios.isAxiosError(error)) {
      console.error('Fetch details failed with status:', error.response?.status);
      console.error('Error details:', error.response?.data);
    }
    
    usingLiveData = false;
    throw new Error(`Game with ID ${id} not found`);
  }
};

/**
 * Search for games
 */
export const searchGames = async (searchTerm: string): Promise<Game[]> => {
  if (!searchTerm.trim()) {
    console.log('Search term is empty, returning default games');
    return fetchGames();
  }

  try {
    console.log(`Searching for games with term "${searchTerm}"...`);
    
    // Escape the search term to prevent injection
    const sanitizedTerm = searchTerm.replace(/["\\]/g, '\\$&');
    console.log(`Sanitized search term: "${sanitizedTerm}"`);
    
    // Use a simplified query with only essential fields
    const query = `
      search "${sanitizedTerm}";
      fields name, cover.image_id, first_release_date;
      limit 20;
    `;
    
    const games = await queryIGDB('games', query);
    console.log(`Found ${games.length} games matching "${searchTerm}"`);
    
    if (games.length === 0) {
      console.log(`No games found matching "${searchTerm}" in IGDB database`);
      return [];
    }
    
    // Map the simplified games to our Game format with placeholder values
    const detailedGames = [];
    for (const game of games) {
      try {
        detailedGames.push({
          id: game.id,
          title: game.name,
          coverImage: game.cover 
            ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
            : 'https://placehold.co/600x800?text=No+Image',
          developer: 'Loading...',
          publisher: 'Loading...',
          releaseDate: game.first_release_date 
            ? new Date(game.first_release_date * 1000).toISOString().split('T')[0]
            : 'Unknown',
          genre: ['Loading...'],
          tags: [],
          description: 'Loading description...',
          shortDescription: 'Loading description...',
          minimumRequirements: {
            os: ['Windows 10'],
            cpu: 'Information not available',
            gpu: 'Information not available',
            ram: 8,
            storage: 50
          },
          recommendedRequirements: {
            os: ['Windows 10'],
            cpu: 'Information not available',
            gpu: 'Information not available',
            ram: 16,
            storage: 50
          },
          website: '#',
          storeLinks: {},
          screenshots: []
        });
      } catch (conversionError) {
        console.error(`Error converting search result ${game.id}:`, conversionError);
      }
    }
    
    usingLiveData = true;
    return detailedGames;
  } catch (error) {
    console.error(`Error searching for "${searchTerm}":`, error);
    
    if (axios.isAxiosError(error)) {
      console.error('Search failed with status:', error.response?.status);
      console.error('Error details:', error.response?.data);
    }
    
    usingLiveData = false;
    return [];
  }
}; 