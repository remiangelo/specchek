import { Game, SystemSpec, GameCompatibility, CompatibilityLevel } from '../types';
import { games } from '../data/games';

// Get all games from our database
export const getAllGames = (): Game[] => {
  return games;
};

// Get a specific game by ID
export const getGameById = (id: number): Game | undefined => {
  return games.find(game => game.id === id);
};

// Simple string comparison for CPU - in a real app, this would be more sophisticated
const isCPUCompatible = (systemCpu: string, requiredCpu: string): boolean => {
  // This is a very simplified check - would need a proper CPU benchmark database in reality
  return systemCpu.toLowerCase().includes(requiredCpu.toLowerCase());
};

// Simple string comparison for GPU - in a real app, this would be more sophisticated
const isGPUCompatible = (systemGpu: string, requiredGpu: string): boolean => {
  // This is a very simplified check - would need a proper GPU benchmark database in reality
  return systemGpu.toLowerCase().includes(requiredGpu.toLowerCase());
};

// Check if the system meets game requirements
export const checkGameCompatibility = (
  game: Game, 
  systemSpecs: SystemSpec
): GameCompatibility => {
  const issues: string[] = [];
  
  // Check OS compatibility
  const osCompatible = game.minimumRequirements.os.some(os => 
    systemSpecs.os.platform.toLowerCase().includes(os.toLowerCase())
  );
  
  if (!osCompatible) {
    issues.push(`Operating system ${systemSpecs.os.platform} ${systemSpecs.os.distro} is not compatible`);
  }
  
  // Check RAM
  const hasMinimumRam = systemSpecs.ram.total >= game.minimumRequirements.ram;
  const hasRecommendedRam = systemSpecs.ram.total >= game.recommendedRequirements.ram;
  
  if (!hasMinimumRam) {
    issues.push(`Insufficient RAM: You have ${systemSpecs.ram.total}GB, but ${game.minimumRequirements.ram}GB is required`);
  }
  
  // Check Storage
  const hasMinimumStorage = systemSpecs.storage.free >= game.minimumRequirements.storage;
  
  if (!hasMinimumStorage) {
    issues.push(`Insufficient storage: You have ${systemSpecs.storage.free}GB free, but ${game.minimumRequirements.storage}GB is required`);
  }
  
  // Check CPU - this is simplified
  const cpuName = `${systemSpecs.cpu.brand} ${systemSpecs.cpu.name}`;
  const hasMinimumCpu = isCPUCompatible(cpuName, game.minimumRequirements.cpu);
  const hasRecommendedCpu = isCPUCompatible(cpuName, game.recommendedRequirements.cpu);
  
  if (!hasMinimumCpu) {
    issues.push(`CPU may not be sufficient: You have ${cpuName}, but ${game.minimumRequirements.cpu} is required`);
  }
  
  // Check GPU - this is simplified
  const gpuName = `${systemSpecs.gpu.vendor} ${systemSpecs.gpu.model}`;
  const hasMinimumGpu = isGPUCompatible(gpuName, game.minimumRequirements.gpu);
  const hasRecommendedGpu = isGPUCompatible(gpuName, game.recommendedRequirements.gpu);
  
  if (!hasMinimumGpu) {
    issues.push(`GPU may not be sufficient: You have ${gpuName}, but ${game.minimumRequirements.gpu} is required`);
  }
  
  // Determine compatibility level
  let level: CompatibilityLevel;
  
  if (!osCompatible || !hasMinimumRam || !hasMinimumStorage || !hasMinimumCpu || !hasMinimumGpu) {
    level = CompatibilityLevel.NOT_COMPATIBLE;
  } else if (hasRecommendedRam && hasRecommendedCpu && hasRecommendedGpu) {
    level = CompatibilityLevel.RECOMMENDED;
  } else {
    level = CompatibilityLevel.MINIMUM;
  }
  
  return {
    game,
    level,
    issues: issues.length > 0 ? issues : undefined
  };
};

// Check compatibility for all games
export const checkAllGamesCompatibility = (
  systemSpecs: SystemSpec
): GameCompatibility[] => {
  return games.map(game => checkGameCompatibility(game, systemSpecs));
}; 