import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchGameDetails } from '../services/igdbApiService';
import { Game } from '../types';
import GameRequirements from '../components/GameRequirements';
import { Tabs, Tab } from '@nextui-org/react';

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  // Helper function to validate and parse game ID
  const getValidGameId = (): number | null => {
    if (!id) {
      console.error('[GameDetails] No game ID provided in URL');
      return null;
    }
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      console.error(`[GameDetails] Invalid game ID: ${id}`);
      return null;
    }
    
    return parsedId;
  };

  useEffect(() => {
    const loadGame = async () => {
      const gameId = getValidGameId();
      
      if (!gameId) {
        setError('Invalid game ID. Please select a game from the library.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(`[GameDetails] Loading game with ID: ${gameId}`);
        const gameData = await fetchGameDetails(gameId);
        console.log(`[GameDetails] Successfully loaded game: ${gameData.title} (ID: ${gameData.id})`);
        setGame(gameData);
        
        // Set the first screenshot as active if available
        if (gameData.screenshots && gameData.screenshots.length > 0) {
          setActiveScreenshot(gameData.screenshots[0]);
        }
      } catch (err) {
        console.error('[GameDetails] Error loading game details:', err);
        
        // Provide more specific error messages based on the error
        if (err instanceof Error) {
          const errorMessage = err.message.toLowerCase();
          
          if (errorMessage.includes('not found')) {
            setError(`Game with ID ${gameId} was not found. This might be due to an invalid game ID or the game being removed from the database.`);
          } else if (errorMessage.includes('network error')) {
            setError('Unable to connect to the game database. Please check your internet connection and ensure the API proxy is accessible.');
          } else if (errorMessage.includes('timeout')) {
            setError('Request timed out while fetching game data. The server might be slow or overloaded.');
          } else if (errorMessage.includes('cors')) {
            setError('CORS policy prevented loading game data. This is a technical issue with the API access.');
          } else if (errorMessage.includes('authentication') || errorMessage.includes('auth') || errorMessage.includes('token')) {
            setError('Authentication error with the game database. The API credentials might be invalid or expired.');
          } else {
            setError(`Error loading game: ${err.message}. Please try again later.`);
          }
          
          // Log detailed information for debugging
          console.error(`[GameDetails] Detailed error for game ID ${gameId}:`, {
            message: err.message,
            stack: err.stack,
            gameId: gameId
          });
        } else {
          setError('An unknown error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id]);

  const handleRetry = () => {
    const gameId = getValidGameId();
    
    if (gameId) {
      console.log(`[GameDetails] Retrying game load with ID: ${gameId}`);
      setLoading(true);
      setError(null);
      fetchGameDetails(gameId)
        .then(gameData => {
          console.log(`[GameDetails] Retry successful for game: ${gameData.title} (ID: ${gameData.id})`);
          setGame(gameData);
          if (gameData.screenshots && gameData.screenshots.length > 0) {
            setActiveScreenshot(gameData.screenshots[0]);
          }
        })
        .catch(err => {
          console.error('[GameDetails] Error retrying game details:', err);
          
          // Provide more specific error messages based on the error
          if (err instanceof Error) {
            const errorMessage = err.message.toLowerCase();
            
            if (errorMessage.includes('not found')) {
              setError(`Game with ID ${gameId} was not found after retry. Please try a different game.`);
            } else if (errorMessage.includes('network')) {
              setError('Still unable to connect to the game database. Please check your internet connection or try again later.');
            } else {
              setError(`Failed to load game details: ${err.message}. Please try again later.`);
            }
          } else {
            setError('An unknown error occurred during retry. Please try again later.');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error('[GameDetails] Cannot retry - invalid game ID');
      setError('Invalid game ID. Please return to the game library.');
    }
  };

  const goBack = () => {
    navigate('/games');
  };

  // Display price if available
  const renderPrice = () => {
    if (game?.price) {
      return (
        <div className="mt-4 md:mt-0">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {game.price}
          </span>
        </div>
      );
    }
    return null;
  };

  // Render game store links if available
  const renderStoreLinks = () => {
    if (!game?.storeLinks || Object.keys(game.storeLinks).length === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Available on</h3>
        <div className="flex flex-wrap gap-3">
          {game.storeLinks.steam && (
            <a href={game.storeLinks.steam} target="_blank" rel="noopener noreferrer" 
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                <path fill="currentColor" d="M496 256c0 137-111.2 248-248.4 248-113.8 0-209.6-76.3-239-180.4l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.9-32.4 70.2-73.5l84.5-60.2c52.1 1.3 95.8-40.9 95.8-93.5 0-51.6-42-93.5-93.7-93.5s-93.7 42-93.7 93.5v1.2L176.6 279c-15.5-.9-30.7 3.4-43.5 12.1L0 236.1C10.2 108.4 117.1 8 247.6 8 384.8 8 496 119 496 256zM155.7 384.3l-30.5-12.6a52.79 52.79 0 0 0 27.2 25.8c26.9 11.2 57.8-1.6 69-28.4 5.4-13 5.5-27.3.1-40.3-5.4-13-15.5-23.2-28.5-28.6-12.9-5.4-26.7-5.2-38.9-.6l31.5 13c19.8 8.2 29.2 30.9 20.9 50.7-8.3 19.9-31 29.2-50.8 21zm173.8-129.9c-34.4 0-62.4-28-62.4-62.3s28-62.3 62.4-62.3 62.4 28 62.4 62.3-27.9 62.3-62.4 62.3zm.1-15.6c25.9 0 46.9-21 46.9-46.8 0-25.9-21-46.8-46.9-46.8s-46.9 21-46.9 46.8c.1 25.8 21.1 46.8 46.9 46.8z"/>
              </svg>
              Steam
            </a>
          )}
          {game.storeLinks.epic && (
            <a href={game.storeLinks.epic} target="_blank" rel="noopener noreferrer" 
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 256 301" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M28.6 242L0 270.7L0 0L181.3 0L121.7 60.7L60.7 60.7L60.7 181.3L28.6 242Z"/>
                <path fill="currentColor" d="M84.3 242L84.3 84.3L145 84.3L145 204.9L204.9 204.9L255.9 255.9L84.3 255.9L84.3 242Z"/>
              </svg>
              Epic Games
            </a>
          )}
          {game.storeLinks.gog && (
            <a href={game.storeLinks.gog} target="_blank" rel="noopener noreferrer" 
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <span className="font-bold mr-1">GOG</span>
              .com
            </a>
          )}
          {game.storeLinks.official && (
            <a href={game.storeLinks.official} target="_blank" rel="noopener noreferrer" 
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Official Site
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <button 
          onClick={goBack} 
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Game Library
        </button>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading game details...</p>
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 max-w-lg mx-auto"
        >
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl border border-red-100 dark:border-red-900/30">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
            <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={handleRetry} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
              <button 
                onClick={goBack} 
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                Back to Library
              </button>
            </div>
          </div>
        </motion.div>
      ) : game ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Game hero section */}
          <div className="relative w-full h-[350px] md:h-[450px] rounded-lg overflow-hidden mb-8">
            {/* Background hero image with gradient overlay */}
            {activeScreenshot && (
              <div className="absolute inset-0 z-0">
                <img 
                  src={activeScreenshot} 
                  alt={game.title} 
                  className="w-full h-full object-cover blur-xl transform scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              </div>
            )}
            
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Game cover */}
                <div className="w-32 h-44 md:w-48 md:h-64 flex-shrink-0 overflow-hidden rounded-lg shadow-xl">
                  <img 
                    src={game.coverImage} 
                    alt={game.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Game info */}
                <div className="flex-grow">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{game.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.genre?.map((genre, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {game.tags?.map((platform, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-sm"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                  
                  {/* Add price display */}
                  {renderPrice()}
                </div>
              </div>
              
              {/* Add store links */}
              {renderStoreLinks()}
            </div>
          </div>

          {/* Game content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content area - left 2/3 */}
            <div className="lg:col-span-2">
              <Tabs 
                aria-label="Game details tabs" 
                color="primary" 
                variant="underlined" 
                classNames={{
                  tab: "text-base font-semibold",
                  tabList: "border-b border-gray-200 dark:border-gray-800",
                  cursor: "bg-gradient-to-r from-blue-600 to-purple-600"
                }}
              >
                <Tab key="overview" title="Overview">
                  {/* Description */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">About</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: game.description || 'No description available.'
                      }} />
                    </div>
                  </div>
              
                  {/* Screenshots */}
                  {game.screenshots && game.screenshots.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                      <div className="grid grid-~`cols-1 sm:grid-cols-2 gap-4">
                        {game.screenshots.map((screenshot, index) => (
                          <motion.div
                            key={index}
                            className="cursor-pointer overflow-hidden rounded-lg aspect-video"
                            whileHover={{ scale: 1.03 }}
                            onClick={() => setActiveScreenshot(screenshot)}
                          >
                            <img 
                              src={screenshot} 
                              alt={`${game.title} screenshot ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </Tab>
                <Tab key="system-requirements" title="System Requirements">
                  <div className="py-4">
                    <GameRequirements 
                      gameId={game.id.toString()}
                    />
                  </div>
                </Tab>
                <Tab key="details" title="Details">
                  {/* Game details section with platforms, genres, etc. */}
                  <div className="py-4">
                    <h2 className="text-2xl font-bold mb-4">Game Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Platforms</h3>
                        <div className="flex flex-wrap gap-2">
                          {game.tags?.map((platform, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {game.genre?.map((genre, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Release Date</h3>
                        <p>{game.releaseDate || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Developer</h3>
                        <p>{game.developer || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Publisher</h3>
                        <p>{game.publisher || 'Unknown'}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Rating</h3>
                        <p>{typeof game.rating === 'string' ? game.rating : 'Not rated'}</p>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>

            {/* Sidebar - right 1/3 */}
            <div>
              {/* Additional details for the sidebar */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                {/* Game rating section */}
                {game.rating && game.rating.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Ratings</h3>
                    <div className="space-y-3">
                      {game.rating.map((rating, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{rating.source}</span>
                          <div className="flex items-center">
                            <span className="font-medium text-lg">{rating.score}/</span>
                            <span className="text-gray-500 text-sm">{rating.outOf}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* ... existing sidebar content ... */}
              </div>
            </div>
          </div>

          {/* ... existing screenshot modal ... */}
          
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The game you're looking for couldn't be found.</p>
            <button 
              onClick={goBack} 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Library
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GameDetails; 