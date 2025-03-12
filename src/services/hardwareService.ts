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

// Function to get CPU information
export const getCPUInfo = async (): Promise<CPUSpec> => {
  console.log('Getting mock CPU info');
  return mockCPU;
};

// Function to get GPU information
export const getGPUInfo = async (): Promise<GPUSpec> => {
  console.log('Getting mock GPU info');
  return mockGPU;
};

// Function to get RAM information
export const getRAMInfo = async (): Promise<RAMSpec> => {
  console.log('Getting mock RAM info');
  return mockRAM;
};

// Function to get storage information
export const getStorageInfo = async (): Promise<StorageSpec> => {
  console.log('Getting mock storage info');
  return mockStorage;
};

// Function to get OS information
export const getOSInfo = async () => {
  console.log('Getting mock OS info');
  return mockOS;
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