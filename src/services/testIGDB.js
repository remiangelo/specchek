// Node.js script to test IGDB API connectivity
// Run this with: node src/services/testIGDB.js

import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';

// Setup dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');
dotenv.config({ path: path.join(rootDir, '.env') });

// IGDB API configuration
const CLIENT_ID = process.env.VITE_IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_IGDB_CLIENT_SECRET;
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';
const IGDB_API_URL = 'https://api.igdb.com/v4';

console.log('=== IGDB API Test ===');
console.log('API Credentials:');
console.log(`- Client ID: ${CLIENT_ID ? CLIENT_ID.substring(0, 4) + '...' : 'Not set'}`);
console.log(`- Client Secret: ${CLIENT_SECRET ? CLIENT_SECRET.substring(0, 4) + '...' : 'Not set'}`);

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('ERROR: Missing IGDB API credentials in .env file');
  console.error('Please create a .env file with VITE_IGDB_CLIENT_ID and VITE_IGDB_CLIENT_SECRET');
  process.exit(1);
}

// Get an OAuth access token from Twitch for IGDB API access
const getAccessToken = async () => {
  try {
    console.log('\nGetting access token from Twitch...');
    const response = await axios.post(
      `${TWITCH_AUTH_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
    );
    
    console.log('Token received successfully.');
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get access token:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw new Error('Authentication with IGDB failed');
  }
};

// Make a request to the IGDB API
const queryIGDB = async (endpoint, query) => {
  try {
    const token = await getAccessToken();
    
    console.log(`\nQuerying IGDB ${endpoint} with:`, query);
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
    
    return response.data;
  } catch (error) {
    console.error(`Error querying IGDB ${endpoint}:`, error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
};

// Test function
const testIGDBApi = async () => {
  try {
    // Test 1: Get popular games
    console.log('\nTest 1: Fetching popular games...');
    const gamesQuery = `
      fields name, cover.image_id, genres.name;
      sort total_rating desc;
      limit 5;
    `;
    const games = await queryIGDB('games', gamesQuery);
    console.log(`✅ Successfully fetched ${games.length} games:`);
    games.forEach((game, i) => {
      console.log(`  ${i+1}. ${game.name}`);
    });
    
    // Test 2: Search for a game
    console.log('\nTest 2: Searching for "Zelda"...');
    const searchQuery = `
      search "Zelda";
      fields name;
      limit 5;
    `;
    const searchResults = await queryIGDB('games', searchQuery);
    console.log(`✅ Successfully searched for "Zelda", found ${searchResults.length} results:`);
    searchResults.forEach((game, i) => {
      console.log(`  ${i+1}. ${game.name}`);
    });
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
};

// Run the test
testIGDBApi(); 