import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGames, searchGames } from '../services/igdbApiService';
import { Game } from '../types';
import GameCard from '../components/GameCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/GameLibrary.css';

const GameLibrary: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const navigate = useNavigate();

  // Load games when component mounts or page changes
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`[GameLibrary] Loading games, page: ${currentPage}, search mode: ${searchMode}, term: ${searchTerm}`);
        
        // If we're in search mode and have a search term, search for games
        // Otherwise, fetch the popular games for the current page
        const loadedGames = searchMode && searchTerm 
          ? await searchGames(searchTerm)
          : await fetchGames(currentPage);
        
        console.log(`[GameLibrary] Successfully loaded ${loadedGames.length} games`);
        setGames(loadedGames);
      } catch (err) {
        console.error('[GameLibrary] Error loading games:', err);
        
        // Provide more specific error messages based on the error
        if (err instanceof Error) {
          const errorMessage = err.message.toLowerCase();
          
          if (errorMessage.includes('network')) {
            setError('Unable to connect to the game database. Please check your internet connection and ensure you have the correct API credentials.');
          } else if (errorMessage.includes('timeout')) {
            setError('Request timed out while loading games. The server might be slow or overloaded.');
          } else if (errorMessage.includes('cors')) {
            setError('CORS policy prevented loading games. Try using a different browser or network.');
          } else if (errorMessage.includes('authentication') || errorMessage.includes('auth') || errorMessage.includes('token')) {
            setError('Authentication error with the game database. Please check your API credentials.');
          } else {
            setError(`Error loading games: ${err.message}. Please try again later.`);
          }
        } else {
          setError('An unknown error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [currentPage, searchMode, searchTerm]);

  // Handle game card click
  const handleGameClick = (game: Game) => {
    navigate(`/games/${game.id}`);
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchMode(!!searchTerm.trim());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle load more button click
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Clear search and return to main library
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchMode(false);
    setCurrentPage(1);
  };
  
  // Handle retry button click
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // The useEffect will trigger a reload
  };

  return (
    <div className="game-library-container">
      <h1>Game Library</h1>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
        {searchMode && (
          <button type="button" onClick={handleClearSearch} className="clear-button">
            Clear Search
          </button>
        )}
      </form>

      {/* Error message */}
      {error && (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Loading spinner */}
      {loading && <LoadingSpinner />}

      {/* Game cards */}
      {!loading && !error && games.length === 0 ? (
        <div className="no-results">No games found. Try a different search term.</div>
      ) : (
        <div className="game-grid">
          {games.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onClick={() => handleGameClick(game)}
            />
          ))}
        </div>
      )}

      {/* Load more button */}
      {!loading && !error && !searchMode && games.length > 0 && (
        <button onClick={handleLoadMore} className="load-more-button">
          Load More
        </button>
      )}
    </div>
  );
};

export default GameLibrary; 