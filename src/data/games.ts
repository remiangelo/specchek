import { Game } from '../types';

export const games: Game[] = [
  {
    id: "1",
    title: "Cyber Odyssey 2077",
    coverImage: "https://placehold.co/600x400?text=Cyber+Odyssey",
    releaseDate: "2023-11-15",
    developer: "Red Project Studios",
    publisher: "CD Games",
    genre: ["RPG", "Open World", "Action"],
    minimumRequirements: {
      cpu: "Intel Core i5-8400 or AMD Ryzen 3 3300X",
      gpu: "NVIDIA GeForce GTX 1060 or AMD Radeon RX 580",
      ram: 8,
      storage: 70,
      os: ["Windows 10", "Windows 11"]
    },
    recommendedRequirements: {
      cpu: "Intel Core i7-10700K or AMD Ryzen 5 5600X",
      gpu: "NVIDIA GeForce RTX 3070 or AMD Radeon RX 6800 XT",
      ram: 16,
      storage: 70,
      os: ["Windows 10", "Windows 11"]
    }
  },
  {
    id: "2",
    title: "Battlefield Legacy",
    coverImage: "https://placehold.co/600x400?text=Battlefield+Legacy",
    releaseDate: "2023-10-20",
    developer: "DICE Games",
    publisher: "Electronic Art",
    genre: ["FPS", "Multiplayer", "Action"],
    minimumRequirements: {
      cpu: "Intel Core i5-6600K or AMD Ryzen 5 1600",
      gpu: "NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 560",
      ram: 8,
      storage: 100,
      os: ["Windows 10"]
    },
    recommendedRequirements: {
      cpu: "Intel Core i7-9700K or AMD Ryzen 7 3700X",
      gpu: "NVIDIA GeForce RTX 2060 or AMD Radeon RX 5700",
      ram: 16,
      storage: 100,
      os: ["Windows 10", "Windows 11"]
    }
  },
  {
    id: "3",
    title: "Elden Circle",
    coverImage: "https://placehold.co/600x400?text=Elden+Circle",
    releaseDate: "2022-02-25",
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    genre: ["Action RPG", "Souls-like", "Open World"],
    minimumRequirements: {
      cpu: "Intel Core i5-8400 or AMD Ryzen 3 3300X",
      gpu: "NVIDIA GeForce GTX 1060 3GB or AMD Radeon RX 580 4GB",
      ram: 12,
      storage: 60,
      os: ["Windows 10", "Windows 11"]
    },
    recommendedRequirements: {
      cpu: "Intel Core i7-8700K or AMD Ryzen 5 3600X",
      gpu: "NVIDIA GeForce GTX 1070 8GB or AMD Radeon RX VEGA 56 8GB",
      ram: 16,
      storage: 60,
      os: ["Windows 10", "Windows 11"]
    }
  },
  {
    id: "4",
    title: "Fantasy Legend VII Remake",
    coverImage: "https://placehold.co/600x400?text=Fantasy+Legend+VII",
    releaseDate: "2023-06-02",
    developer: "Square Phoenix",
    publisher: "Square Phoenix",
    genre: ["JRPG", "Action", "Adventure"],
    minimumRequirements: {
      cpu: "Intel Core i5-7500 or AMD Ryzen 3 3100",
      gpu: "NVIDIA GeForce GTX 780 or AMD Radeon RX 470",
      ram: 8,
      storage: 100,
      os: ["Windows 10", "Windows 11"]
    },
    recommendedRequirements: {
      cpu: "Intel Core i7-9700K or AMD Ryzen 5 3600X",
      gpu: "NVIDIA GeForce RTX 2070 or AMD Radeon RX 5700 XT",
      ram: 16,
      storage: 100,
      os: ["Windows 10", "Windows 11"]
    }
  },
  {
    id: "5",
    title: "Red Dead Retribution",
    coverImage: "https://placehold.co/600x400?text=Red+Dead+Retribution",
    releaseDate: "2022-11-05",
    developer: "Rockstar North",
    publisher: "Rockstar Games",
    genre: ["Open World", "Action", "Adventure"],
    minimumRequirements: {
      cpu: "Intel Core i5-6600K or AMD Ryzen 3 1200",
      gpu: "NVIDIA GeForce GTX 1060 6GB or AMD Radeon RX 580 4GB",
      ram: 8,
      storage: 150,
      os: ["Windows 10"]
    },
    recommendedRequirements: {
      cpu: "Intel Core i7-8700K or AMD Ryzen 5 3600",
      gpu: "NVIDIA GeForce RTX 2060 or AMD Radeon RX 5700",
      ram: 16,
      storage: 150,
      os: ["Windows 10", "Windows 11"]
    }
  },
  {
    id: "6",
    title: "Witcher 3: Wild Chase",
    coverImage: "https://placehold.co/600x400?text=Witcher+3",
    releaseDate: "2015-05-19",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    genre: ["RPG", "Open World", "Action"],
    minimumRequirements: {
      cpu: "Intel Core i5-2500K or AMD Phenom II X4 940",
      gpu: "NVIDIA GeForce GTX 660 or AMD Radeon HD 7870",
      ram: 6,
      storage: 35,
      os: ["Windows 7", "Windows 8.1", "Windows 10"]
    },
    recommendedRequirements: {
      cpu: "Intel Core i7-3770 or AMD FX-8350",
      gpu: "NVIDIA GeForce GTX 770 or AMD Radeon R9 290",
      ram: 8,
      storage: 35,
      os: ["Windows 7", "Windows 8.1", "Windows 10", "Windows 11"]
    }
  }
]; 