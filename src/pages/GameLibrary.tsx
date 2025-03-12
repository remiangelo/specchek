import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, CardFooter, Button, Input } from '@nextui-org/react';
import { MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Game item component with animations
const GameCard = ({ game, index }: { game: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 100 }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="brutal-card h-full" isHoverable isPressable>
        <CardHeader className="p-0">
          <div className="w-full aspect-video overflow-hidden brutal-border relative">
            <img 
              src={game.coverImage} 
              alt={game.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-sm font-bold">{game.title}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pb-0">
          <h4 className="text-lg font-bold mb-1">{game.title}</h4>
          <p className="text-sm text-gray-600">
            {game.developer} • {game.releaseDate.split('-')[0]}
          </p>
        </CardBody>
        <CardFooter>
          <Button 
            size="sm" 
            radius="full" 
            variant="flat" 
            color="primary"
            className="w-full"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Background decorative elements
const BackgroundElements = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-cyan-500/5" />
    <motion.div 
      className="absolute -top-[20%] -left-[10%] h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
      animate={{ 
        x: [0, 100, 0],
        y: [0, 50, 0]
      }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.div 
      className="absolute top-[40%] -right-[10%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
      animate={{ 
        x: [0, -100, 0],
        y: [0, -50, 0]
      }}
      transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
    />
  </div>
);

const GameLibrary = () => {
  console.log('GameLibrary component rendered');
  const [searchTerm, setSearchTerm] = useState('');

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
    },
    { 
      id: 4, 
      title: 'Elden Ring', 
      developer: 'FromSoftware',
      releaseDate: '2022-02-25',
      coverImage: 'https://via.placeholder.com/300x200?text=Elden+Ring'
    },
    { 
      id: 5, 
      title: 'God of War Ragnarök', 
      developer: 'Santa Monica Studio',
      releaseDate: '2022-11-09',
      coverImage: 'https://via.placeholder.com/300x200?text=God+of+War'
    },
    { 
      id: 6, 
      title: 'Horizon Forbidden West', 
      developer: 'Guerrilla Games',
      releaseDate: '2022-02-18',
      coverImage: 'https://via.placeholder.com/300x200?text=Horizon'
    }
  ];

  // Filter games based on search
  const filteredGames = mockGames.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.developer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8 relative overflow-hidden">
      <BackgroundElements />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-brutalist-accent to-brutalist-secondary">Library</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our collection of games and see which ones are compatible with your system
        </p>
      </motion.div>
      
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <Button
            as={Link}
            to="/"
            variant="light"
            startContent={<ArrowLeftIcon className="h-4 w-4" />}
            className="self-start"
          >
            Back to Home
          </Button>
          
          <div className="w-full max-w-md">
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<MagnifyingGlassIcon className="h-5 w-5 text-default-400" />}
              className="brutal-border"
              classNames={{
                inputWrapper: "bg-white brutal-border border-2 border-brutalist-dark px-3",
              }}
              radius="none"
              variant="bordered"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>
        
        {filteredGames.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center p-12 brutal-card mt-8"
          >
            <p className="text-xl font-bold mb-2">No games found</p>
            <p className="text-gray-600">Try a different search term</p>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div
        className="w-full h-1 bg-gradient-to-r from-brutalist-accent via-brutalist-secondary to-brutalist-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  );
};

export default GameLibrary; 