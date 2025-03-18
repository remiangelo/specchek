import { Game } from '../types';
import { MOCK_GAMES } from './mockData';

// Key for storing games in localStorage
const GAMES_STORAGE_KEY = 'specchek_games';

// Initialize the mock database with default data if not already initialized
const initMockDatabase = (): void => {
  if (!localStorage.getItem(GAMES_STORAGE_KEY)) {
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(MOCK_GAMES));
  }
};

// Get all games from the mock database
export const getAllGames = (): Game[] => {
  initMockDatabase();
  try {
    const games = localStorage.getItem(GAMES_STORAGE_KEY);
    return games ? JSON.parse(games) : [];
  } catch (error) {
    console.error('Error reading from mock database:', error);
    return MOCK_GAMES; // Fallback to hardcoded data
  }
};

// Get a game by ID from the mock database
export const getGameById = (id: number): Game | null => {
  const games = getAllGames();
  return games.find(game => game.id === id) || null;
};

// Search games in the mock database
export const searchGames = (searchTerm: string): Game[] => {
  const games = getAllGames();
  const searchTermLower = searchTerm.toLowerCase();
  
  return games.filter(game => 
    game.title.toLowerCase().includes(searchTermLower) || 
    game.genre.some(genre => genre.toLowerCase().includes(searchTermLower)) ||
    (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchTermLower)))
  );
};

// Add a new game to the mock database
export const addGame = (game: Game): void => {
  const games = getAllGames();
  games.push(game);
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
};

// Update a game in the mock database
export const updateGame = (game: Game): void => {
  const games = getAllGames();
  const index = games.findIndex(g => g.id === game.id);
  
  if (index !== -1) {
    games[index] = game;
    localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
  }
};

// Reset the mock database to default values
export const resetMockDatabase = (): void => {
  localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(MOCK_GAMES));
}; 