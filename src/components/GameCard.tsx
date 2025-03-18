import React from 'react';
import { Game } from '../types';
import '../styles/GameCard.css';

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div className="game-card" onClick={onClick}>
      <div className="game-image-container">
        <img 
          src={game.coverImage} 
          alt={game.title} 
          className="game-image"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/264x352?text=No+Image';
          }}
        />
        <div className="game-overlay">
          <span className="game-genre">{game.genre[0] || 'Game'}</span>
        </div>
      </div>
      <div className="game-details">
        <h3 className="game-title">{game.title}</h3>
        <p className="game-developer">{game.developer}</p>
        <div className="game-release-date">
          {game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'Unknown'}
        </div>
      </div>
    </div>
  );
};

export default GameCard; 