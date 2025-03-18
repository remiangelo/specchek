import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader, Chip, Button, Tooltip, Progress } from '@nextui-org/react';
import { CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useSystemInfo } from '../hooks/useSystemInfo';

interface GameRequirement {
  name: string;
  description: string;
  minScore: number;
  recommendedScore: number;
}

interface GameRequirementsProps {
  gameId?: string;
  gameName?: string;
  className?: string;
}

const defaultRequirements: GameRequirement[] = [
  {
    name: "CPU",
    description: "Processor performance requirements",
    minScore: 40,
    recommendedScore: 60
  },
  {
    name: "GPU",
    description: "Graphics card performance requirements",
    minScore: 45,
    recommendedScore: 65
  },
  {
    name: "RAM",
    description: "Memory requirements",
    minScore: 35,
    recommendedScore: 55
  },
  {
    name: "Storage",
    description: "Free disk space required",
    minScore: 50,
    recommendedScore: 50
  }
];

const presetGames = [
  { id: "cyberpunk", name: "Cyberpunk 2077", requirements: [
    { name: "CPU", description: "Quad-core Intel or AMD processor", minScore: 60, recommendedScore: 80 },
    { name: "GPU", description: "DirectX 12 compatible graphics card", minScore: 65, recommendedScore: 85 },
    { name: "RAM", description: "Memory requirements", minScore: 50, recommendedScore: 70 },
    { name: "Storage", description: "70GB available space", minScore: 50, recommendedScore: 50 }
  ]},
  { id: "fortnite", name: "Fortnite", requirements: [
    { name: "CPU", description: "Core i3-3225 or equivalent", minScore: 40, recommendedScore: 60 },
    { name: "GPU", description: "Intel HD 4000 / AMD equivalent", minScore: 35, recommendedScore: 55 },
    { name: "RAM", description: "4GB RAM", minScore: 30, recommendedScore: 45 },
    { name: "Storage", description: "20GB available space", minScore: 50, recommendedScore: 50 }
  ]},
  { id: "minecraft", name: "Minecraft", requirements: [
    { name: "CPU", description: "Intel Core i3 or AMD A8", minScore: 30, recommendedScore: 50 },
    { name: "GPU", description: "Intel HD Graphics 4000 or AMD Radeon R5", minScore: 25, recommendedScore: 45 },
    { name: "RAM", description: "4GB RAM", minScore: 25, recommendedScore: 40 },
    { name: "Storage", description: "4GB available space", minScore: 50, recommendedScore: 50 }
  ]},
  { id: "eldenring", name: "Elden Ring", requirements: [
    { name: "CPU", description: "Intel Core i5-8400 or AMD Ryzen 3 3300X", minScore: 55, recommendedScore: 75 },
    { name: "GPU", description: "NVIDIA GeForce GTX 1060 3GB or AMD Radeon RX 580 4GB", minScore: 60, recommendedScore: 80 },
    { name: "RAM", description: "12GB RAM", minScore: 55, recommendedScore: 65 },
    { name: "Storage", description: "60GB available space", minScore: 50, recommendedScore: 50 }
  ]}
];

const RequirementItem = ({ 
  requirement, 
  systemScore = 0,
  showDetails = false
}: { 
  requirement: GameRequirement, 
  systemScore: number,
  showDetails: boolean
}) => {
  // Determine if the system meets minimum or recommended requirements
  const meetsMinimum = systemScore >= requirement.minScore;
  const meetsRecommended = systemScore >= requirement.recommendedScore;
  
  // Set status icon and color
  let StatusIcon = QuestionMarkCircleIcon;
  let statusColor = "default";
  let statusText = "Unknown";
  
  if (meetsRecommended) {
    StatusIcon = CheckCircleIcon;
    statusColor = "success";
    statusText = "Exceeds";
  } else if (meetsMinimum) {
    StatusIcon = CheckCircleIcon;
    statusColor = "warning";
    statusText = "Meets Min";
  } else {
    StatusIcon = XCircleIcon;
    statusColor = "danger";
    statusText = "Below Min";
  }
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="font-semibold mr-2">{requirement.name}</span>
          {showDetails && (
            <Tooltip content={requirement.description}>
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />
            </Tooltip>
          )}
        </div>
        <Chip
          color={statusColor as any}
          variant="flat"
          startContent={<StatusIcon className="h-4 w-4" />}
          size="sm"
        >
          {statusText}
        </Chip>
      </div>
      
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
        {/* Min requirements line */}
        <div 
          className="absolute h-full w-px bg-yellow-500 z-10" 
          style={{ left: `${requirement.minScore}%` }}
        />
        
        {/* Recommended requirements line */}
        <div 
          className="absolute h-full w-px bg-green-500 z-10" 
          style={{ left: `${requirement.recommendedScore}%` }}
        />
        
        {/* User's system score */}
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${systemScore}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Min</span>
        <span>Recommended</span>
        <span>Max</span>
      </div>
    </div>
  );
};

const GameRequirements = ({ gameId, gameName, className = "" }: GameRequirementsProps) => {
  const [selectedGameId, setSelectedGameId] = useState(gameId || presetGames[0].id);
  const [showDetails, setShowDetails] = useState(false);
  
  // Get current game requirements
  const selectedGame = presetGames.find(game => game.id === selectedGameId) || presetGames[0];
  const requirements = selectedGame.requirements || defaultRequirements;
  
  // Get system info
  const { 
    specs, 
    scanHardware, 
    isScanning 
  } = useSystemInfo();
  
  // Get system scores from specs
  const getSystemScore = (requirementName: string): number => {
    if (!specs || !specs.performanceScore) return 0;
    
    switch(requirementName.toLowerCase()) {
      case "cpu":
        return specs.cpu.estimatedPerformance || 0;
      case "gpu":
        return specs.gpu.estimatedPerformance || 0;
      case "ram":
        return specs.memory.estimatedPerformance || 0;
      case "storage":
        return 50; // Default value for storage
      default:
        return 0;
    }
  };
  
  // Calculate overall compatibility score
  const calculateOverallCompatibility = (): { 
    score: number, 
    meetsMinimum: boolean, 
    meetsRecommended: boolean 
  } => {
    if (!specs || !specs.performanceScore) {
      return { score: 0, meetsMinimum: false, meetsRecommended: false };
    }
    
    let totalSystemScore = 0;
    let totalMinScore = 0;
    let totalRecommendedScore = 0;
    let requirementsCount = 0;
    
    requirements.forEach(req => {
      const systemScore = getSystemScore(req.name);
      totalSystemScore += systemScore;
      totalMinScore += req.minScore;
      totalRecommendedScore += req.recommendedScore;
      requirementsCount++;
    });
    
    const avgSystemScore = totalSystemScore / requirementsCount;
    const avgMinScore = totalMinScore / requirementsCount;
    const avgRecommendedScore = totalRecommendedScore / requirementsCount;
    
    return {
      score: Math.round(avgSystemScore),
      meetsMinimum: avgSystemScore >= avgMinScore,
      meetsRecommended: avgSystemScore >= avgRecommendedScore
    };
  };
  
  const compatibility = calculateOverallCompatibility();
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col items-start pb-0">
        <h3 className="text-xl font-bold">System Requirements Check</h3>
        <div className="flex flex-wrap gap-2 my-2">
          {presetGames.map(game => (
            <Chip
              key={game.id}
              color={selectedGameId === game.id ? "primary" : "default"}
              variant={selectedGameId === game.id ? "shadow" : "flat"}
              onClick={() => setSelectedGameId(game.id)}
              className="cursor-pointer"
            >
              {game.name}
            </Chip>
          ))}
        </div>
      </CardHeader>
      
      <CardBody>
        {/* Show loading state if scanning */}
        {isScanning ? (
          <div className="py-8 text-center">
            <p className="mb-2">Analyzing your system...</p>
            <Progress
              size="sm"
              isIndeterminate
              aria-label="Loading..."
              className="max-w-md mx-auto"
            />
          </div>
        ) : !specs ? (
          <div className="py-8 text-center">
            <p className="mb-4">We need to scan your hardware first</p>
            <Button 
              color="primary"
              onClick={() => scanHardware()}
            >
              Scan Hardware
            </Button>
          </div>
        ) : (
          <>
            {/* Overall Compatibility */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Overall Compatibility</span>
                <Chip
                  color={compatibility.meetsRecommended ? "success" : 
                         compatibility.meetsMinimum ? "warning" : "danger"}
                  variant="flat"
                >
                  {compatibility.meetsRecommended ? "Recommended" : 
                   compatibility.meetsMinimum ? "Minimum" : "Below Minimum"}
                </Chip>
              </div>
              
              <div className="relative pt-4">
                <div className="h-8 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
                  {/* Min requirements gradient zone */}
                  <div className="absolute h-full left-0 w-1/3 bg-gradient-to-r from-red-500 to-yellow-500 opacity-50" />
                  
                  {/* Recommended requirements gradient zone */}
                  <div className="absolute h-full left-1/3 w-1/3 bg-gradient-to-r from-yellow-500 to-green-500 opacity-50" />
                  
                  {/* High-end zone */}
                  <div className="absolute h-full left-2/3 w-1/3 bg-gradient-to-r from-green-500 to-blue-500 opacity-50" />
                  
                  {/* User's system score indicator */}
                  <motion.div 
                    className="absolute top-0 w-4 h-8 bg-white dark:bg-gray-900 rounded-full transform -translate-x-1/2 border-2 border-blue-600 z-20"
                    initial={{ left: 0 }}
                    animate={{ left: `${compatibility.score}%` }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                  />
                </div>
                
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Minimum</span>
                  <span>Recommended</span>
                  <span>High-End</span>
                </div>
              </div>
            </div>
            
            {/* Individual Requirements */}
            <h4 className="font-semibold mb-4">Detailed Requirements</h4>
            <div className="space-y-5">
              {requirements.map((requirement, index) => (
                <RequirementItem 
                  key={index}
                  requirement={requirement}
                  systemScore={getSystemScore(requirement.name)}
                  showDetails={showDetails}
                />
              ))}
            </div>
            
            {/* Controls */}
            <div className="flex justify-between mt-6">
              <Button
                variant="light"
                onClick={() => setShowDetails(!showDetails)}
                size="sm"
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>
              <Button
                color="primary"
                onClick={() => scanHardware()}
                size="sm"
              >
                Rescan
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default GameRequirements; 