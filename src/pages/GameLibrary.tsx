import React from 'react';
import { Link } from 'react-router-dom';

const GameLibrary = () => {
  console.log('GameLibrary component rendered');

  // Mock game data
  const mockGames = [
    { 
      id: 1, 
      title: 'Cyberpunk 2077', 
      developer: 'CD Projekt Red',
      releaseDate: '2020-12-10',
      coverImage: 'https://via.placeholder.com/300x200?text=Cyberpunk+2077'
    },
    { 
      id: 2, 
      title: 'Red Dead Redemption 2', 
      developer: 'Rockstar Games',
      releaseDate: '2018-10-26',
      coverImage: 'https://via.placeholder.com/300x200?text=RDR2'
    },
    { 
      id: 3, 
      title: 'The Witcher 3', 
      developer: 'CD Projekt Red',
      releaseDate: '2015-05-19',
      coverImage: 'https://via.placeholder.com/300x200?text=Witcher+3'
    }
  ];

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Game Library
      </h1>
      
      <div className="mb-6 text-center">
        <Link to="/" className="brutal-btn-secondary">
          Back to Home
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGames.map(game => (
          <div key={game.id} className="brutal-card p-4 bg-white">
            <div className="aspect-video mb-3 overflow-hidden brutal-border">
              <img 
                src={game.coverImage} 
                alt={game.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-lg font-bold mb-1">{game.title}</h4>
            <p className="text-sm text-gray-600 mb-2">
              {game.developer} • {game.releaseDate.split('-')[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLibrary; 