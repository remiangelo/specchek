import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchGameDetails } from '../services/gameApiService';
import { Game } from '../types';
import './GameDetails.css';

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
          setError('Failed to load game details. The IGDB API may be experiencing issues.');
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
    <div className="game-details">
      <Link to="/games" className="back-button">
        &larr; Back to Library
      </Link>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading game details...</p>
        </div>
      ) : error ? (
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-button">Retry</button>
            <button onClick={goBack} className="back-to-library-button">Back to Library</button>
          </div>
        </div>
      ) : game ? (
        <div className="game-content">
          <header className="game-header">
            <div className="game-cover">
              <img src={game.coverImage} alt={game.title} />
            </div>
            <div className="game-info">
              <h1>{game.title}</h1>
              <p className="developer">
                <span>Developer:</span> {game.developer}
              </p>
              <p className="publisher">
                <span>Publisher:</span> {game.publisher}
              </p>
              <p className="release-date">
                <span>Release Date:</span> {game.releaseDate}
              </p>
              <div className="genres">
                {game.genre.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
              {game.storeLinks && Object.keys(game.storeLinks).length > 0 && (
                <div className="store-links">
                  <h3>Available On:</h3>
                  <div className="store-buttons">
                    {game.storeLinks.steam && (
                      <a href={game.storeLinks.steam} target="_blank" rel="noopener noreferrer" className="store-button steam">
                        Steam
                      </a>
                    )}
                    {game.storeLinks.epic && (
                      <a href={game.storeLinks.epic} target="_blank" rel="noopener noreferrer" className="store-button epic">
                        Epic Games
                      </a>
                    )}
                    {game.storeLinks.gog && (
                      <a href={game.storeLinks.gog} target="_blank" rel="noopener noreferrer" className="store-button gog">
                        GOG
                      </a>
                    )}
                    {game.storeLinks.microsoft && (
                      <a href={game.storeLinks.microsoft} target="_blank" rel="noopener noreferrer" className="store-button microsoft">
                        Microsoft Store
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </header>

          <section className="game-description">
            <h2>About the Game</h2>
            <p>{game.description}</p>
          </section>

          {game.screenshots && game.screenshots.length > 0 && (
            <section className="game-media">
              <h2>Screenshots</h2>
              <div className="screenshot-viewer">
                <div className="active-screenshot">
                  <img src={activeScreenshot || game.screenshots[0]} alt={`${game.title} screenshot`} />
                </div>
                <div className="screenshot-thumbnails">
                  {game.screenshots.map((screenshot, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${activeScreenshot === screenshot ? 'active' : ''}`}
                      onClick={() => setActiveScreenshot(screenshot)}
                    >
                      <img src={screenshot} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="game-specs">
            <h2>System Requirements</h2>
            <div className="requirements-grid">
              <div className="requirement-box minimum">
                <h3>Minimum Requirements</h3>
                <ul>
                  <li>
                    <strong>OS:</strong> {game.minimumRequirements.os.join(' / ')}
                  </li>
                  <li>
                    <strong>CPU:</strong> {game.minimumRequirements.cpu}
                  </li>
                  <li>
                    <strong>GPU:</strong> {game.minimumRequirements.gpu}
                  </li>
                  <li>
                    <strong>RAM:</strong> {game.minimumRequirements.ram} GB
                  </li>
                  <li>
                    <strong>Storage:</strong> {game.minimumRequirements.storage} GB
                  </li>
                </ul>
              </div>
              <div className="requirement-box recommended">
                <h3>Recommended Requirements</h3>
                <ul>
                  <li>
                    <strong>OS:</strong> {game.recommendedRequirements.os.join(' / ')}
                  </li>
                  <li>
                    <strong>CPU:</strong> {game.recommendedRequirements.cpu}
                  </li>
                  <li>
                    <strong>GPU:</strong> {game.recommendedRequirements.gpu}
                  </li>
                  <li>
                    <strong>RAM:</strong> {game.recommendedRequirements.ram} GB
                  </li>
                  <li>
                    <strong>Storage:</strong> {game.recommendedRequirements.storage} GB
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {game.tags && game.tags.length > 0 && (
            <section className="game-tags">
              <h2>Tags</h2>
              <div className="tags-container">
                {game.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="not-found">
          <h2>Game Not Found</h2>
          <p>The game you're looking for couldn't be found.</p>
          <button onClick={goBack} className="back-to-library-button">Back to Library</button>
        </div>
      )}
    </div>
  );
};

export default GameDetails; 