import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../types';
import { fetchGames, searchGames } from '../services/gameApiService';
import './GameLibrary.css';

const GameLibrary = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const gamesPerPage = 12;

  // Fetch games on component mount
  useEffect(() => {
    if (!isSearching) {
      console.log("GameLibrary: Initiating game loading for page", currentPage);
      loadGames();
    }
  }, [currentPage, isSearching]);

  const loadGames = async () => {
    try {
      console.log("GameLibrary: Starting to load games...");
      setLoading(true);
      setError(null);
      
      console.time("fetchGames");
      const fetchedGames = await fetchGames(currentPage, gamesPerPage);
      console.timeEnd("fetchGames");
      
      console.log(`GameLibrary: Received ${fetchedGames.length} games from API`);
      
      if (fetchedGames.length === 0) {
        console.log('No games returned from API');
        setError('No games found. The IGDB API might be experiencing issues or rate limits.');
      } else {
        console.log("GameLibrary: Setting games in state:", fetchedGames.map(g => g.title).join(", "));
        setGames(fetchedGames);
      }
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Failed to load games. Please try again later.');
    } finally {
      setLoading(false);
      console.log("GameLibrary: Finished loading attempt");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      console.log("GameLibrary: Empty search, showing all games");
      setIsSearching(false);
      loadGames();
      return;
    }

    try {
      console.log(`GameLibrary: Searching for "${searchTerm}"...`);
      setLoading(true);
      setError(null);
      setIsSearching(true);
      
      console.time("searchGames");
      const searchResults = await searchGames(searchTerm);
      console.timeEnd("searchGames");
      
      console.log(`GameLibrary: Search returned ${searchResults.length} results`);
      
      if (searchResults.length === 0) {
        console.log(`GameLibrary: No results found for "${searchTerm}"`);
        setError(`No games found matching "${searchTerm}". Try a different search term.`);
      } else {
        console.log("GameLibrary: Setting search results in state");
        setGames(searchResults);
      }
    } catch (err) {
      console.error('Error searching games:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
      console.log("GameLibrary: Finished search attempt");
    }
  };

  const handleRetry = () => {
    if (isSearching && searchTerm) {
      handleSearch(new Event('submit') as any);
    } else {
      setIsSearching(false);
      loadGames();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    loadGames();
  };

  const nextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="game-library">
      <h1>Game Library</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
        {searchTerm && (
          <button 
            type="button" 
            onClick={clearSearch}
            className="clear-button"
          >
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{isSearching ? `Searching for "${searchTerm}"...` : `Loading games (page ${currentPage})...`}</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-button">Retry</button>
          {isSearching && (
            <button onClick={clearSearch} className="retry-button">Show All Games</button>
          )}
        </div>
      ) : (
        <>
          {games.length === 0 ? (
            <div className="no-games">
              <p>No games found. {isSearching ? 'Try a different search term.' : 'There might be an issue with the IGDB API connection.'}</p>
              {isSearching ? (
                <button onClick={clearSearch} className="retry-button">Show All Games</button>
              ) : (
                <button onClick={handleRetry} className="retry-button">Retry Loading</button>
              )}
            </div>
          ) : (
            <>
              <div className="results-info">
                {isSearching ? (
                  <p>Found {games.length} games matching "{searchTerm}"</p>
                ) : (
                  <p>Showing page {currentPage} • {games.length} games</p>
                )}
              </div>
              
              <div className="games-grid">
                {games.map(game => (
                  <Link to={`/games/${game.id}`} key={game.id} className="game-card">
                    <div className="game-image">
                      <img src={game.coverImage} alt={game.title} />
                    </div>
                    <div className="game-info">
                      <h3>{game.title}</h3>
                      <p className="game-developer">{game.developer}</p>
                      <div className="game-genres">
                        {game.genre.slice(0, 3).map((genre, index) => (
                          <span key={index} className="genre-tag">{genre}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
          
          {!isSearching && games.length > 0 && (
            <div className="pagination">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1}
                className="page-button"
              >
                Previous
              </button>
              <span className="page-indicator">Page {currentPage}</span>
              <button 
                onClick={nextPage}
                className="page-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameLibrary; 