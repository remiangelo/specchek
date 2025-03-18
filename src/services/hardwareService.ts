import { SystemSpec, CPUSpec, GPUSpec, RAMSpec, StorageSpec } from '../types';

// Mock data for browser testing
const mockCPU: CPUSpec = {
  name: "Core i7-10700K",
  brand: "Intel",
  cores: 8,
  threads: 16,
  speed: 3.8,
  physicalCores: 8
};

const mockGPU: GPUSpec = {
  vendor: "NVIDIA",
  model: "GeForce RTX 3070",
  vram: 8192,
  driverVersion: "456.71"
};

const mockRAM: RAMSpec = {
  total: 32,
  free: 24,
  used: 8
};

const mockStorage: StorageSpec = {
  total: 1000,
  free: 750,
  used: 250
};

const mockOS = {
  platform: "darwin",
  distro: "Mac OS",
  release: "11.2.3",
  arch: "x64"
};

// Hardware information types
export interface SystemSpecs {
  cpu: {
    brand: string;
    cores: number;
    estimatedPerformance?: number; // 0-100 benchmark score
  };
  gpu: {
    vendor: string;
    renderer: string;
    tier?: string; // "Low", "Medium", "High", "Ultra"
    estimatedPerformance?: number; // 0-100 benchmark score
  };
  memory: {
    total: string;
    estimatedPerformance?: number; // 0-100 benchmark score
  };
  os: {
    name: string;
    version: string;
    platform: string;
  };
  browser: {
    name: string;
    version: string;
    features: {
      webGL: boolean;
      webGL2: boolean;
      webGPU: boolean;
      webAssembly: boolean;
    };
  };
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
  };
  performanceScore?: {
    overall: number;
    gaming: number;
    productivity: number;
  };
}

// Function to estimate CPU performance
const estimateCPUPerformance = (cores: number): number => {
  // Base score
  let score = 10;
  
  // Add points for number of cores
  if (cores >= 16) score += 50;
  else if (cores >= 12) score += 40;
  else if (cores >= 8) score += 30;
  else if (cores >= 6) score += 20;
  else if (cores >= 4) score += 10;
  
  // Cap at 100
  return Math.min(score, 100);
};

// Function to estimate GPU performance
const estimateGPUPerformance = (renderer: string): { score: number, tier: string } => {
  const rendererLower = renderer.toLowerCase();
  let score = 10;
  let tier = "Low";
  
  // NVIDIA GPUs
  if (rendererLower.includes('nvidia') || rendererLower.includes('geforce')) {
    if (rendererLower.includes('rtx 40')) {
      score = 95;
      tier = "Ultra";
    } else if (rendererLower.includes('rtx 30')) {
      score = 85;
      tier = "Ultra";
    } else if (rendererLower.includes('rtx 20')) {
      score = 75;
      tier = "High";
    } else if (rendererLower.includes('gtx 16')) {
      score = 65;
      tier = "High";
    } else if (rendererLower.includes('gtx 10')) {
      score = 55;
      tier = "Medium";
    } else if (rendererLower.includes('gtx 9')) {
      score = 40;
      tier = "Medium";
    } else if (rendererLower.includes('gtx')) {
      score = 30;
      tier = "Low";
    }
  }
  
  // AMD GPUs
  else if (rendererLower.includes('amd') || rendererLower.includes('radeon')) {
    if (rendererLower.includes('rx 7')) {
      score = 90;
      tier = "Ultra";
    } else if (rendererLower.includes('rx 6')) {
      score = 80;
      tier = "High";
    } else if (rendererLower.includes('rx 5')) {
      score = 70;
      tier = "High";
    } else if (rendererLower.includes('rx 4')) {
      score = 50;
      tier = "Medium";
    } else if (rendererLower.includes('rx ') || rendererLower.includes('vega')) {
      score = 40;
      tier = "Medium";
    }
  }
  
  // Intel GPUs
  else if (rendererLower.includes('intel')) {
    if (rendererLower.includes('arc')) {
      score = 60;
      tier = "Medium";
    } else if (rendererLower.includes('iris')) {
      score = 30;
      tier = "Low";
    } else if (rendererLower.includes('uhd')) {
      score = 20;
      tier = "Low";
    } else if (rendererLower.includes('hd')) {
      score = 15;
      tier = "Low";
    }
  }
  
  // Apple GPUs
  else if (rendererLower.includes('apple')) {
    if (rendererLower.includes('m3')) {
      score = 75;
      tier = "High";
    } else if (rendererLower.includes('m2')) {
      score = 65;
      tier = "High";
    } else if (rendererLower.includes('m1')) {
      score = 55;
      tier = "Medium";
    }
  }
  
  return { score, tier };
};

// Function to estimate RAM performance
const estimateRAMPerformance = (memory: string): number => {
  let score = 10;
  
  // Extract GB value if possible
  const gbMatch = memory.match(/(\d+)\s*GB/i);
  if (gbMatch) {
    const gb = parseInt(gbMatch[1], 10);
    if (gb >= 32) score = 90;
    else if (gb >= 16) score = 75;
    else if (gb >= 8) score = 60;
    else if (gb >= 4) score = 40;
    else score = 20;
  }
  
  return score;
};

// Run a quick JavaScript benchmark
const runJSBenchmark = (): number => {
  const startTime = performance.now();
  
  // Simple prime number calculation as a CPU benchmark
  const findPrimes = (max: number) => {
    const sieve = new Array(max).fill(true);
    sieve[0] = sieve[1] = false;
    
    for (let i = 2; i * i <= max; i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= max; j += i) {
          sieve[j] = false;
        }
      }
    }
    
    return sieve.reduce((count, isPrime) => isPrime ? count + 1 : count, 0);
  };
  
  // Run benchmark (size adjusted based on expected performance)
  findPrimes(100000);
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Convert duration to a 0-100 score (lower duration = higher score)
  // Typical range might be ~100ms (fast) to ~1000ms (slow)
  const score = Math.max(0, Math.min(100, 100 - (duration / 10)));
  
  return score;
};

// Get CPU information (limited in browser)
const getCPUInfo = (): SystemSpecs['cpu'] => {
  // Try to detect number of logical processors
  const cores = navigator.hardwareConcurrency || 4;
  const estimatedPerformance = estimateCPUPerformance(cores);
  
  return {
    brand: 'Browser API limitation', // Browsers don't expose CPU model
    cores: cores as number,
    estimatedPerformance
  };
};

// Get GPU information using WebGL
const getGPUInfo = (): SystemSpecs['gpu'] => {
  try {
    const canvas = document.createElement('canvas');
    // Explicitly type the context as WebGLRenderingContext
    const gl = canvas.getContext('webgl') as WebGLRenderingContext || 
              canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    
    if (!gl) {
      return { vendor: 'Unknown', renderer: 'Unknown' };
    }
    
    // Explicitly type the extension
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
      return { vendor: 'Unknown', renderer: 'WebGL supported but details unavailable' };
    }
    
    // Define the parameters we need
    const UNMASKED_VENDOR_WEBGL = debugInfo.UNMASKED_VENDOR_WEBGL;
    const UNMASKED_RENDERER_WEBGL = debugInfo.UNMASKED_RENDERER_WEBGL;
    
    const vendor = gl.getParameter(UNMASKED_VENDOR_WEBGL) || 'Unknown';
    const renderer = gl.getParameter(UNMASKED_RENDERER_WEBGL) || 'Unknown';
    
    const { score, tier } = estimateGPUPerformance(String(renderer));
    
    return { 
      vendor: String(vendor), 
      renderer: String(renderer),
      tier,
      estimatedPerformance: score
    };
  } catch (error) {
    console.error('Error detecting GPU:', error);
    return { vendor: 'Error', renderer: 'Unable to detect' };
  }
};

// Get memory information (very limited in browser)
const getMemoryInfo = (): SystemSpecs['memory'] => {
  let total = 'Unknown';
  let estimatedPerformance = 50; // Default mid-range score
  
  try {
    // @ts-expect-error - This property exists in some browsers but isn't in the standard TypeScript definitions
    if (navigator.deviceMemory) {
      // @ts-expect-error - Using non-standard browser API for memory detection
      total = `${navigator.deviceMemory} GB`;
      estimatedPerformance = estimateRAMPerformance(total);
    }
  } catch (error) {
    console.error('Error detecting memory:', error);
  }
  
  return { total, estimatedPerformance };
};

// Get OS information
const getOSInfo = (): SystemSpecs['os'] => {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  const platform = navigator.platform || 'Unknown';
  
  // Detect OS name and version
  if (userAgent.indexOf('Windows') !== -1) {
    name = 'Windows';
    const windowsVersion = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (windowsVersion) {
      const versionMap: {[key: string]: string} = {
        '10.0': '10/11',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
        '6.0': 'Vista',
        '5.1': 'XP',
      };
      version = versionMap[windowsVersion[1]] || windowsVersion[1];
    }
  } else if (userAgent.indexOf('Mac') !== -1) {
    name = 'macOS';
    const macVersion = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
    if (macVersion) {
      version = macVersion[1].replace(/_/g, '.');
    }
  } else if (userAgent.indexOf('Linux') !== -1) {
    name = 'Linux';
    if (userAgent.indexOf('Android') !== -1) {
      name = 'Android';
      const androidVersion = userAgent.match(/Android (\d+(\.\d+)+)/);
      if (androidVersion) {
        version = androidVersion[1];
      }
    }
  } else if (userAgent.indexOf('iOS') !== -1 || userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
    name = 'iOS';
    const iosVersion = userAgent.match(/OS (\d+_\d+(_\d+)?)/);
    if (iosVersion) {
      version = iosVersion[1].replace(/_/g, '.');
    }
  }
  
  return { name, version, platform };
};

// Get browser information
const getBrowserInfo = (): SystemSpecs['browser'] => {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  
  // Detect WebGL support
  const hasWebGL = !!document.createElement('canvas').getContext('webgl');
  const hasWebGL2 = !!document.createElement('canvas').getContext('webgl2');
  
  // Detect WebGPU support (still experimental)
  const hasWebGPU = 'gpu' in navigator;
  
  // Detect WebAssembly support
  const hasWebAssembly = typeof WebAssembly === 'object' && typeof WebAssembly.compile === 'function';
  
  // Detect browser type
  if (userAgent.indexOf('Chrome') !== -1) {
    name = 'Chrome';
    const chromeVersion = userAgent.match(/Chrome\/(\d+(\.\d+)+)/);
    if (chromeVersion) {
      version = chromeVersion[1];
    }
  } else if (userAgent.indexOf('Firefox') !== -1) {
    name = 'Firefox';
    const firefoxVersion = userAgent.match(/Firefox\/(\d+(\.\d+)+)/);
    if (firefoxVersion) {
      version = firefoxVersion[1];
    }
  } else if (userAgent.indexOf('Safari') !== -1) {
    name = 'Safari';
    const safariVersion = userAgent.match(/Version\/(\d+(\.\d+)+)/);
    if (safariVersion) {
      version = safariVersion[1];
    }
  } else if (userAgent.indexOf('Edge') !== -1 || userAgent.indexOf('Edg/') !== -1) {
    name = 'Edge';
    const edgeVersion = userAgent.match(/Edg(e)?\/(\d+(\.\d+)+)/);
    if (edgeVersion) {
      version = edgeVersion[2];
    }
  }
  
  return { 
    name, 
    version,
    features: {
      webGL: hasWebGL,
      webGL2: hasWebGL2,
      webGPU: hasWebGPU,
      webAssembly: hasWebAssembly
    }
  };
};

// Get screen information
const getScreenInfo = (): SystemSpecs['screen'] => {
  return {
    width: window.screen.width,
    height: window.screen.height,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
  };
};

// Calculate overall performance score
const calculatePerformanceScore = (specs: SystemSpecs): SystemSpecs['performanceScore'] => {
  // Default values if estimations aren't available
  const cpuScore = specs.cpu.estimatedPerformance || 50;
  const gpuScore = specs.gpu.estimatedPerformance || 50;
  const ramScore = specs.memory.estimatedPerformance || 50;
  
  // Overall score is weighted average
  const overall = Math.round((cpuScore * 0.3) + (gpuScore * 0.5) + (ramScore * 0.2));
  
  // Gaming score weights GPU more heavily
  const gaming = Math.round((cpuScore * 0.25) + (gpuScore * 0.65) + (ramScore * 0.1));
  
  // Productivity score weights CPU and RAM more
  const productivity = Math.round((cpuScore * 0.45) + (gpuScore * 0.2) + (ramScore * 0.35));
  
  return {
    overall,
    gaming,
    productivity
  };
};

// Get all system specifications
export const getSystemSpecifications = (): SystemSpecs => {
  const cpu = getCPUInfo();
  const gpu = getGPUInfo();
  const memory = getMemoryInfo();
  const os = getOSInfo();
  const browser = getBrowserInfo();
  const screen = getScreenInfo();
  
  const specs: SystemSpecs = {
    cpu,
    gpu,
    memory,
    os,
    browser,
    screen
  };
  
  // Calculate performance scores
  specs.performanceScore = calculatePerformanceScore(specs);
  
  return specs;
};

// Perform hardware scan
export const scanSystem = (): Promise<SystemSpecs> => {
  return new Promise((resolve) => {
    console.log('Scanning system hardware...');
    
    // Show progress in console
    console.log('Collecting CPU information...');
    console.log('Collecting GPU information...');
    console.log('Collecting memory information...');
    console.log('Collecting system information...');
    
    // Add a small delay to simulate scanning process
    setTimeout(() => {
      const specs = getSystemSpecifications();
      console.log('Hardware scan complete:', specs);
      
      // Run JavaScript benchmark
      console.log('Running performance tests...');
      const jsBenchmarkScore = runJSBenchmark();
      console.log(`JavaScript benchmark score: ${jsBenchmarkScore.toFixed(2)}`);
      
      // Adjust CPU score based on benchmark
      if (specs.cpu.estimatedPerformance) {
        specs.cpu.estimatedPerformance = Math.round((specs.cpu.estimatedPerformance * 0.7) + (jsBenchmarkScore * 0.3));
      }
      
      // Recalculate overall scores
      specs.performanceScore = calculatePerformanceScore(specs);
      
      resolve(specs);
    }, 2000); // Longer delay for more realistic scanning experience
  });
};

// Main function to get all system specs
export const getSystemSpecs = async (): Promise<SystemSpec> => {
  console.log('Getting mock system specs');
  return {
    cpu: mockCPU,
    gpu: mockGPU,
    ram: mockRAM,
    storage: mockStorage,
    os: mockOS
  };
};

// Check if a system meets minimum requirements
export const meetsMinRequirements = (systemSpecs: SystemSpecs, requiredScore: number): boolean => {
  if (!systemSpecs.performanceScore) return false;
  return systemSpecs.performanceScore.gaming >= requiredScore;
};

// Check if a system meets recommended requirements
export const meetsRecommendedRequirements = (systemSpecs: SystemSpecs, requiredScore: number): boolean => {
  if (!systemSpecs.performanceScore) return false;
  return systemSpecs.performanceScore.gaming >= requiredScore;
}; 