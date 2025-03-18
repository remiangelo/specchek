import { Game } from '../types';

// Sample game data for testing and fallback
export const MOCK_GAMES: Game[] = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mjs.jpg",
    developer: "CD Projekt RED",
    publisher: "CD Projekt",
    releaseDate: "2020-12-10",
    genre: ["RPG", "Action", "Shooter"],
    tags: ["Cyberpunk", "Open World", "First-Person", "Sci-Fi"],
    price: "$59.99",
    description: "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.",
    shortDescription: "An open-world action adventure story set in Night City...",
    minimumRequirements: {
      os: ["Windows 10"],
      cpu: "Intel Core i5-3570K or AMD FX-8310",
      gpu: "NVIDIA GeForce GTX 780 or AMD Radeon RX 470",
      ram: 8,
      storage: 70
    },
    recommendedRequirements: {
      os: ["Windows 10"],
      cpu: "Intel Core i7-4790 or AMD Ryzen 3 3200G",
      gpu: "NVIDIA GeForce GTX 1060 or AMD Radeon R9 Fury",
      ram: 12,
      storage: 70
    },
    storeLinks: {
      steam: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
      gog: "https://www.gog.com/game/cyberpunk_2077",
      epic: "https://www.epicgames.com/store/en-US/product/cyberpunk-2077/home",
      official: "https://www.cyberpunk.net/"
    },
    screenshots: [
      "https://images.igdb.com/igdb/image/upload/t_1080p/sc76zu.jpg",
      "https://images.igdb.com/igdb/image/upload/t_1080p/sc76zv.jpg"
    ]
  },
  {
    id: 2,
    title: "The Witcher 3: Wild Hunt",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
    developer: "CD Projekt RED",
    publisher: "CD Projekt",
    releaseDate: "2015-05-19",
    genre: ["RPG", "Adventure"],
    tags: ["Fantasy", "Open World", "Action RPG", "Third-Person"],
    price: "$39.99",
    description: "The Witcher 3: Wild Hunt is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
    shortDescription: "A story-driven open world RPG set in a fantasy universe...",
    minimumRequirements: {
      os: ["Windows 7", "Windows 8", "Windows 10"],
      cpu: "Intel CPU Core i5-2500K 3.3GHz or AMD CPU Phenom II X4 940",
      gpu: "Nvidia GPU GeForce GTX 660 or AMD GPU Radeon HD 7870",
      ram: 6,
      storage: 50
    },
    recommendedRequirements: {
      os: ["Windows 7", "Windows 8", "Windows 10"],
      cpu: "Intel CPU Core i7 3770 3.4 GHz or AMD CPU AMD FX-8350 4 GHz",
      gpu: "Nvidia GPU GeForce GTX 770 or AMD GPU Radeon R9 290",
      ram: 8,
      storage: 50
    },
    storeLinks: {
      steam: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
      gog: "https://www.gog.com/game/the_witcher_3_wild_hunt",
      epic: "https://www.epicgames.com/store/en-US/product/the-witcher-3-wild-hunt/home"
    },
    screenshots: [
      "https://images.igdb.com/igdb/image/upload/t_1080p/scs5jc.jpg",
      "https://images.igdb.com/igdb/image/upload/t_1080p/scs5jd.jpg"
    ]
  },
  {
    id: 3,
    title: "Elden Ring",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    releaseDate: "2022-02-25",
    genre: ["RPG", "Action"],
    tags: ["Souls-like", "Fantasy", "Open World", "Difficult"],
    price: "$59.99",
    description: "Elden Ring is an action RPG which takes place in the Lands Between, sometime after the Shattering of the titular Elden Ring. The game is directed by Hidetaka Miyazaki with worldbuilding by George R. R. Martin.",
    shortDescription: "An action RPG taking place in the Lands Between...",
    minimumRequirements: {
      os: ["Windows 10"],
      cpu: "Intel Core i5-8400 or AMD Ryzen 3 3300X",
      gpu: "NVIDIA GeForce GTX 1060, 3GB or AMD Radeon RX 580, 4GB",
      ram: 12,
      storage: 60
    },
    recommendedRequirements: {
      os: ["Windows 10"],
      cpu: "Intel Core i7-8700K or AMD Ryzen 5 3600X",
      gpu: "NVIDIA GeForce GTX 1070, 8GB or AMD Radeon RX VEGA 56, 8GB",
      ram: 16,
      storage: 60
    },
    storeLinks: {
      steam: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
      official: "https://en.bandainamcoent.eu/elden-ring/elden-ring"
    },
    screenshots: [
      "https://images.igdb.com/igdb/image/upload/t_1080p/sc8bj4.jpg",
      "https://images.igdb.com/igdb/image/upload/t_1080p/sc8bj5.jpg"
    ]
  },
  {
    id: 4,
    title: "Red Dead Redemption 2",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg",
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    releaseDate: "2019-11-05",
    genre: ["Action", "Adventure"],
    tags: ["Western", "Open World", "Action-Adventure", "Realistic"],
    price: "$59.99",
    description: "America, 1899. The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs. Those who will not surrender or succumb are killed. From the creators of Grand Theft Auto V and Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America at the dawn of the modern age.",
    shortDescription: "An epic tale of life in America at the dawn of the modern age...",
    minimumRequirements: {
      os: ["Windows 7", "Windows 10"],
      cpu: "Intel Core i5-2500K / AMD FX-6300",
      gpu: "Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280 3GB",
      ram: 8,
      storage: 150
    },
    recommendedRequirements: {
      os: ["Windows 10"],
      cpu: "Intel Core i7-4770K / AMD Ryzen 5 1500X",
      gpu: "Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB",
      ram: 12,
      storage: 150
    },
    storeLinks: {
      steam: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
      epic: "https://www.epicgames.com/store/en-US/product/red-dead-redemption-2/home",
      rockstar: "https://www.rockstargames.com/reddeadredemption2/pc"
    },
    screenshots: [
      "https://images.igdb.com/igdb/image/upload/t_1080p/sc6lcl.jpg",
      "https://images.igdb.com/igdb/image/upload/t_1080p/sc6lcm.jpg"
    ]
  },
  {
    id: 5,
    title: "Halo Infinite",
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2dto.jpg",
    developer: "343 Industries",
    publisher: "Xbox Game Studios",
    releaseDate: "2021-12-08",
    genre: ["FPS", "Action"],
    tags: ["Sci-Fi", "Shooter", "Multiplayer", "Campaign"],
    price: "$59.99",
    description: "When all hope is lost and humanity's fate hangs in the balance, the Master Chief is ready to confront the most ruthless foe he's ever faced. Step inside the armor of humanity's greatest hero to experience an epic adventure and explore the massive scale of the Halo ring.",
    shortDescription: "The next chapter in the legendary Halo franchise...",
    minimumRequirements: {
      os: ["Windows 10"],
      cpu: "AMD FX-8370 / Intel i5-4440",
      gpu: "AMD RX 570 / Nvidia GTX 1050 Ti",
      ram: 8,
      storage: 50
    },
    recommendedRequirements: {
      os: ["Windows 10"],
      cpu: "AMD Ryzen 7 3700X / Intel i7-9700k",
      gpu: "Radeon RX 5700 XT / Nvidia RTX 2070",
      ram: 16,
      storage: 50
    },
    storeLinks: {
      steam: "https://store.steampowered.com/app/1240440/Halo_Infinite/",
      microsoft: "https://www.xbox.com/en-US/games/halo-infinite"
    },
    screenshots: [
      "https://images.igdb.com/igdb/image/upload/t_1080p/sc8hg7.jpg",
      "https://images.igdb.com/igdb/image/upload/t_1080p/sc8hg8.jpg"
    ]
  }
]; 