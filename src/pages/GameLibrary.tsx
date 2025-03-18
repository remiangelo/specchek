import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Game } from '../types';
import { fetchGames, searchGames } from '../services/gameApiService';
import './GameLibrary.css';

const GameCard = ({ game, index }: { game: Game, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Link to={`/games/${game.id}`} className="block h-full">
        <div className="h-full overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-200 shadow-sm hover:shadow-md">
          <div className="aspect-[3/4] overflow-hidden relative">
            <img 
              src={game.coverImage} 
              alt={game.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2 py-1 mb-2 bg-blue-600 text-xs font-semibold rounded-full">
                  {game.genre[0] || 'Game'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">{game.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{game.developer}</p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span>{game.releaseDate.split('-')[0] || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

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
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center space-y-4 mb-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Game Library
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover detailed information about your favorite games
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-xl mx-auto mt-6"
        >
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg transition-colors duration-200"
            >
              Search
            </button>
          </form>
          
          {searchTerm && (
            <div className="mt-2 text-right">
              <button 
                type="button" 
                onClick={clearSearch}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </motion.div>
      </section>

      {/* Games Section */}
      <section>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {isSearching ? `Searching for "${searchTerm}"...` : `Loading games (page ${currentPage})...`}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30 mb-6">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={handleRetry} 
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
                {isSearching && (
                  <button 
                    onClick={clearSearch} 
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
                  >
                    Show All Games
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {games.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                  No games found. {isSearching ? 'Try a different search term.' : 'There might be an issue with the API connection.'}
                </p>
                {isSearching ? (
                  <button 
                    onClick={clearSearch} 
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Show All Games
                  </button>
                ) : (
                  <button 
                    onClick={handleRetry} 
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Retry Loading
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                    {isSearching ? (
                      <span>Found {games.length} games matching "{searchTerm}"</span>
                    ) : (
                      <span>Showing page {currentPage} • {games.length} games</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {games.map((game, index) => (
                    <GameCard key={game.id} game={game} index={index} />
                  ))}
                </div>
              </>
            )}
            
            {!isSearching && games.length > 0 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <motion.button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    currentPage === 1 
                      ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-900 dark:text-white'
                  }`}
                  whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  Previous
                </motion.button>
                <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-lg">
                  Page {currentPage}
                </span>
                <motion.button 
                  onClick={nextPage}
                  className="px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-900 dark:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default GameLibrary; 