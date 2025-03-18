import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Divider } from '@nextui-org/react';
import { fetchGames, fetchGameDetails, searchGames } from '../services/igdbApiService';
import { Game } from '../types';

const IgdbApiTest: React.FC = () => {
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [searchResult, setSearchResult] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameDetails, setGameDetails] = useState<Game | null>(null);
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<{
    popular: 'idle' | 'loading' | 'success' | 'error';
    search: 'idle' | 'loading' | 'success' | 'error';
    details: 'idle' | 'loading' | 'success' | 'error';
  }>({
    popular: 'idle',
    search: 'idle',
    details: 'idle'
  });

  // Save original console methods
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const [logs, setLogs] = useState<{ type: string; message: string }[]>([]);

  // Override console methods to capture logs
  useEffect(() => {
    console.log = (...args) => {
      originalConsoleLog(...args);
      setLogs(prev => [...prev, { type: 'log', message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ') }]);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      setLogs(prev => [...prev, { type: 'error', message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ') }]);
    };

    // Restore original console methods on cleanup
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);

  const fetchPopularGames = async () => {
    setTestStatus(prev => ({ ...prev, popular: 'loading' }));
    setError(null);
    
    try {
      console.log('[IgdbApiTest] Fetching popular games...');
      const games = await fetchGames(1, 5);
      console.log(`[IgdbApiTest] Successfully fetched ${games.length} popular games`);
      setPopularGames(games);
      setTestStatus(prev => ({ ...prev, popular: 'success' }));
    } catch (err) {
      console.error('[IgdbApiTest] Error fetching popular games:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setTestStatus(prev => ({ ...prev, popular: 'error' }));
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setTestStatus(prev => ({ ...prev, search: 'loading' }));
    setError(null);
    
    try {
      console.log(`[IgdbApiTest] Searching for games with term: "${searchTerm}"`);
      const results = await searchGames(searchTerm);
      console.log(`[IgdbApiTest] Search returned ${results.length} results`);
      setSearchResult(results);
      setTestStatus(prev => ({ ...prev, search: 'success' }));
    } catch (err) {
      console.error('[IgdbApiTest] Error searching for games:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setTestStatus(prev => ({ ...prev, search: 'error' }));
    }
  };
  
  const handleFetchGameDetails = async () => {
    if (!gameId.trim()) return;
    
    const parsedId = parseInt(gameId);
    if (isNaN(parsedId)) {
      setError('Please enter a valid game ID (number)');
      return;
    }
    
    setTestStatus(prev => ({ ...prev, details: 'loading' }));
    setError(null);
    
    try {
      console.log(`[IgdbApiTest] Fetching details for game with ID: ${parsedId}`);
      const game = await fetchGameDetails(parsedId);
      console.log(`[IgdbApiTest] Successfully fetched details for: ${game.title} (ID: ${game.id})`);
      setGameDetails(game);
      setTestStatus(prev => ({ ...prev, details: 'success' }));
    } catch (err) {
      console.error('[IgdbApiTest] Error fetching game details:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setTestStatus(prev => ({ ...prev, details: 'error' }));
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">IGDB API Test</h1>
      
      <Divider className="my-4" />
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Test API Functionality</h2>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <Button 
            color="primary" 
            onClick={fetchPopularGames} 
            isDisabled={testStatus.popular === 'loading'}
          >
            {testStatus.popular === 'loading' ? 'Loading...' : 'Fetch Popular Games'}
          </Button>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Input
            label="Search Games"
            placeholder="Enter game title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            color="primary" 
            onClick={handleSearch} 
            isDisabled={testStatus.search === 'loading'}
          >
            {testStatus.search === 'loading' ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Input
            label="Game ID"
            placeholder="Enter game ID..."
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          <Button 
            color="primary" 
            onClick={handleFetchGameDetails}
            isDisabled={testStatus.details === 'loading'}
          >
            {testStatus.details === 'loading' ? 'Loading...' : 'Fetch Details'}
          </Button>
        </div>
      </div>
      
      {testStatus.popular === 'success' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Popular Games ({popularGames.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularGames.map(game => (
              <Card key={game.id} className="p-3">
                <div className="flex gap-3">
                  <img 
                    src={game.coverImage} 
                    alt={game.title} 
                    className="w-24 h-32 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold">{game.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">ID: {game.id}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {testStatus.search === 'success' && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Search Results ({searchResult.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResult.map(game => (
              <Card key={game.id} className="p-3">
                <div className="flex gap-3">
                  <img 
                    src={game.coverImage} 
                    alt={game.title} 
                    className="w-24 h-32 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold">{game.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">ID: {game.id}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {testStatus.details === 'success' && gameDetails && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Game Details</h2>
          <Card className="p-4">
            <div className="flex gap-4">
              {gameDetails.coverImage && (
                <img 
                  src={gameDetails.coverImage} 
                  alt={gameDetails.title} 
                  className="w-24 h-32 object-cover rounded"
                />
              )}
              <div>
                <h3 className="text-lg font-bold">{gameDetails.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {gameDetails.id}</p>
                <p className="text-sm mt-2">{gameDetails.shortDescription}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {gameDetails.genre?.map((genre, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 mb-6">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </Card>
      )}
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">API Logs</h2>
          <Button 
            color="default" 
            size="sm" 
            onClick={clearLogs}
          >
            Clear Logs
          </Button>
        </div>
        <Card className="bg-gray-100 dark:bg-gray-900 p-3">
          <div className="max-h-96 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-gray-400">No logs yet...</p>
            ) : (
              logs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`p-1 ${log.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}
                >
                  {log.message}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default IgdbApiTest; 