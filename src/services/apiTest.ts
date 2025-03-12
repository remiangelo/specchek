import { fetchGames, searchGames, fetchGameDetails } from './gameApiService';

// Test the IGDB API integration
const testIGDBApi = async () => {
  try {
    console.log('Testing IGDB API integration');
    
    // Test fetching games
    console.log('\n1. Testing fetchGames()');
    const games = await fetchGames(1, 5);
    console.log(`Fetched ${games.length} games`);
    games.forEach((game, index) => {
      console.log(`Game ${index + 1}: ${game.title} (ID: ${game.id})`);
    });
    
    // Test searching
    console.log('\n2. Testing searchGames("Zelda")');
    const searchResults = await searchGames('Zelda');
    console.log(`Found ${searchResults.length} games matching "Zelda"`);
    searchResults.slice(0, 3).forEach((game, index) => {
      console.log(`Result ${index + 1}: ${game.title} (ID: ${game.id})`);
    });
    
    // Test fetching game details (using ID from first game if available)
    if (games.length > 0) {
      console.log(`\n3. Testing fetchGameDetails(${games[0].id})`);
      const gameDetails = await fetchGameDetails(games[0].id);
      console.log(`Game details: ${gameDetails.title}`);
      console.log(`Description: ${gameDetails.shortDescription}`);
      console.log(`Developer: ${gameDetails.developer}`);
      console.log(`Genre: ${gameDetails.genre.join(', ')}`);
      console.log(`Screenshots: ${gameDetails.screenshots?.length || 0}`);
    }
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Error testing IGDB API:', error);
  }
};

// Run the test
testIGDBApi();

export default testIGDBApi; 