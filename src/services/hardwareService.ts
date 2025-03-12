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

// Get CPU information (limited in browser)
const getCPUInfo = (): SystemSpecs['cpu'] => {
  // Try to detect number of logical processors
  const cores = navigator.hardwareConcurrency || 'Unknown';
  
  return {
    brand: 'Browser API limitation', // Browsers don't expose CPU model
    cores: cores as number,
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
    
    return { vendor: String(vendor), renderer: String(renderer) };
  } catch (error) {
    console.error('Error detecting GPU:', error);
    return { vendor: 'Error', renderer: 'Unable to detect' };
  }
};

// Get memory information (very limited in browser)
const getMemoryInfo = (): SystemSpecs['memory'] => {
  let total = 'Unknown';
  
  try {
    // @ts-ignore - This property exists in some browsers but isn't in the standard TypeScript definitions
    if (navigator.deviceMemory) {
      // @ts-ignore
      total = `${navigator.deviceMemory} GB`;
    }
  } catch (error) {
    console.error('Error detecting memory:', error);
  }
  
  return { total };
};

// Get OS information
const getOSInfo = (): SystemSpecs['os'] => {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  let platform = navigator.platform || 'Unknown';
  
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
  
  return { name, version };
};

// Get screen information
const getScreenInfo = (): SystemSpecs['screen'] => {
  return {
    width: window.screen.width,
    height: window.screen.height,
    colorDepth: window.screen.colorDepth,
  };
};

// Get all system specifications
export const getSystemSpecifications = (): SystemSpecs => {
  return {
    cpu: getCPUInfo(),
    gpu: getGPUInfo(),
    memory: getMemoryInfo(),
    os: getOSInfo(),
    browser: getBrowserInfo(),
    screen: getScreenInfo(),
  };
};

// Perform hardware scan
export const scanSystem = (): Promise<SystemSpecs> => {
  return new Promise((resolve) => {
    console.log('Scanning system hardware...');
    
    // Add a small delay to simulate scanning process
    setTimeout(() => {
      const specs = getSystemSpecifications();
      console.log('Hardware scan complete:', specs);
      resolve(specs);
    }, 1000);
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