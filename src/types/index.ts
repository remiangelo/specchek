// Hardware specification types (for desktop/system scanning)
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

// Web-based system specs (for browser scanning)
export interface SystemSpecs {
  cpu: {
    brand: string;
    cores: number;
  };
  gpu: {
    vendor: string;
    renderer: string;
  };
  memory: {
    total: string;
  };
  os: {
    name: string;
    version: string;
    platform: string;
  };
  browser: {
    name: string;
    version: string;
  };
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
}

// Game Requirements interface
export interface GameRequirements {
  os: string[];
  cpu: string;
  gpu: string;
  ram: number; // in GB
  storage: number; // in GB
  directX?: string;
  additionalNotes?: string;
}

// Game interface
export interface Game {
  id: number;
  title: string;
  coverImage: string;
  logoImage?: string; // Optional logo image
  developer: string;
  publisher: string;
  releaseDate: string; // ISO Date format
  genre: string[];
  tags?: string[];
  price?: string;
  description?: string;
  shortDescription?: string;
  minimumRequirements: GameRequirements;
  recommendedRequirements: GameRequirements;
  website?: string;
  storeLinks?: {
    steam?: string;
    epic?: string;
    gog?: string;
    official?: string;
    [key: string]: string | undefined;
  };
  rating?: {
    score: number;
    outOf: number;
    source: string;
  }[];
  screenshots?: string[];
  videos?: {
    thumbnail: string;
    url: string;
    title: string;
  }[];
}

// Compatibility level enum
export enum CompatibilityLevel {
  RECOMMENDED = "RECOMMENDED",
  MINIMUM = "MINIMUM",
  NOT_COMPATIBLE = "NOT_COMPATIBLE"
}

// Compatibility result interface
export interface CompatibilityResult {
  game: Game;
  level: CompatibilityLevel;
  issues?: string[];
}

// Alias for backward compatibility
export type GameCompatibility = CompatibilityResult; 