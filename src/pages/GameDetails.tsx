import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGameDetails } from '../services/gameApiService';
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

  useEffect(() => {
    const loadGame = async () => {
      if (!id) {
        setError('Game ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const gameData = await fetchGameDetails(parseInt(id));
        setGame(gameData);
        
        // Set the first screenshot as active if available
        if (gameData.screenshots && gameData.screenshots.length > 0) {
          setActiveScreenshot(gameData.screenshots[0]);
        }
      } catch (err: any) {
        console.error('Error loading game details:', err);
        // Check if it's a "not found" error
        if (err.message && err.message.includes('not found')) {
          setError(`Game with ID ${id} was not found. It may have been removed or the ID is incorrect.`);
        } else {
          setError('Failed to load game details. The API may be experiencing issues.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id]);

  const handleRetry = () => {
    if (id) {
      setLoading(true);
      setError(null);
      fetchGameDetails(parseInt(id))
        .then(gameData => {
          setGame(gameData);
          if (gameData.screenshots && gameData.screenshots.length > 0) {
            setActiveScreenshot(gameData.screenshots[0]);
          }
        })
        .catch(err => {
          console.error('Error retrying game details:', err);
          setError('Failed to load game details. Please try again later.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const goBack = () => {
    navigate('/games');
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
                  alt={game.name} 
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
                    alt={game.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Game info */}
                <div className="flex-grow">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{game.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.genres?.map((genre, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {game.platforms?.map((platform, index) => (
                      <span 
                        key={index}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                    <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: game.description }} />
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
                              alt={`${game.name} screenshot ${index + 1}`} 
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
                      gameName={game.name}
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
                          {game.platforms?.map((platform, index) => (
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
                          {game.genres?.map((genre, index) => (
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
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Age Rating</h3>
                        <p>{game.ageRating || 'Not rated'}</p>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>

            {/* Sidebar - right 1/3 */}
            <div>
              {/* ... existing sidebar content ... */}
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