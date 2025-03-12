// Hardware specification types
export interface CPUSpec {
  name: string;
  brand: string;
  cores: number;
  threads: number;
  speed: number;
  physicalCores: number;
}

export interface GPUSpec {
  vendor: string;
  model: string;
  vram: number;
  driverVersion?: string;
}

export interface RAMSpec {
  total: number;
  free: number;
  used: number;
}

export interface StorageSpec {
  total: number;
  free: number;
  used: number;
}

export interface SystemSpec {
  cpu: CPUSpec;
  gpu: GPUSpec;
  ram: RAMSpec;
  storage: StorageSpec;
  os: {
    platform: string;
    distro: string;
    release: string;
    arch: string;
  };
}

// Game requirement types
export interface GameRequirement {
  cpu: string;
  gpu: string;
  ram: number;
  storage: number;
  os: string[];
}

export interface Game {
  id: string;
  title: string;
  coverImage: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  genre: string[];
  minimumRequirements: GameRequirement;
  recommendedRequirements: GameRequirement;
}

// Compatibility result
export enum CompatibilityLevel {
  NOT_COMPATIBLE = "NOT_COMPATIBLE",
  MINIMUM = "MINIMUM",
  RECOMMENDED = "RECOMMENDED"
}

export interface GameCompatibility {
  game: Game;
  level: CompatibilityLevel;
  issues?: string[];
} 