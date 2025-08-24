// Sample image service that generates mock images based on prompts
// This simulates AI image generation without requiring an API key

interface SampleImage {
  url: string;
  prompt: string;
  category: string;
}

// Pre-generated sample images for different categories
const sampleImages: SampleImage[] = [
  // Landscapes
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    prompt: 'beautiful landscape mountains lake sunset',
    category: 'landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    prompt: 'forest nature trees green',
    category: 'landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    prompt: 'mountain landscape snow peaks',
    category: 'landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    prompt: 'ocean beach waves sunset',
    category: 'landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    prompt: 'desert landscape sand dunes',
    category: 'landscape'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    prompt: 'waterfall nature flowing water',
    category: 'landscape'
  },
  
  // Animals
  {
    url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=300&fit=crop',
    prompt: 'cute cat portrait',
    category: 'animal'
  },
  {
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    prompt: 'dog pet animal',
    category: 'animal'
  },
  {
    url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=300&fit=crop',
    prompt: 'wild animal lion',
    category: 'animal'
  },
  {
    url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&h=300&fit=crop',
    prompt: 'eagle bird flying',
    category: 'animal'
  },
  {
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    prompt: 'elephant wildlife',
    category: 'animal'
  },
  
  // Abstract/Art
  {
    url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    prompt: 'abstract art colorful',
    category: 'abstract'
  },
  {
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    prompt: 'modern art design',
    category: 'abstract'
  },
  {
    url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    prompt: 'geometric patterns',
    category: 'abstract'
  },
  {
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    prompt: 'minimalist design',
    category: 'abstract'
  },
  
  // City/Urban
  {
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    prompt: 'city skyline urban',
    category: 'urban'
  },
  {
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bcff?w=400&h=300&fit=crop',
    prompt: 'modern architecture building',
    category: 'urban'
  },
  {
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    prompt: 'night city lights',
    category: 'urban'
  },
  {
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bcff?w=400&h=300&fit=crop',
    prompt: 'street photography',
    category: 'urban'
  },
  
  // Technology
  {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    prompt: 'technology computer digital',
    category: 'technology'
  },
  {
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    prompt: 'robot artificial intelligence',
    category: 'technology'
  },
  {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    prompt: 'futuristic technology',
    category: 'technology'
  },
  {
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    prompt: 'cyberpunk neon lights',
    category: 'technology'
  },
  
  // Food
  {
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    prompt: 'delicious food cooking',
    category: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    prompt: 'pizza italian food',
    category: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    prompt: 'sushi japanese cuisine',
    category: 'food'
  },
  {
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    prompt: 'dessert sweet cake',
    category: 'food'
  },
  
  // Space
  {
    url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
    prompt: 'space galaxy stars',
    category: 'space'
  },
  {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    prompt: 'planet earth view',
    category: 'space'
  },
  {
    url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
    prompt: 'nebula cosmic clouds',
    category: 'space'
  },
  {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    prompt: 'astronaut space suit',
    category: 'space'
  }
];

// Keywords to match prompts with categories
const keywordMapping: Record<string, string[]> = {
  landscape: ['landscape', 'mountain', 'forest', 'lake', 'ocean', 'beach', 'sunset', 'nature', 'trees', 'green', 'snow', 'peaks', 'waves'],
  animal: ['cat', 'dog', 'pet', 'animal', 'wild', 'lion', 'tiger', 'bear', 'bird', 'fish', 'cute'],
  abstract: ['abstract', 'art', 'colorful', 'modern', 'design', 'creative', 'painting', 'artistic'],
  urban: ['city', 'skyline', 'urban', 'building', 'architecture', 'modern', 'street', 'downtown'],
  technology: ['technology', 'computer', 'digital', 'robot', 'artificial', 'intelligence', 'ai', 'tech', 'future'],
  food: ['food', 'delicious', 'cooking', 'pizza', 'italian', 'restaurant', 'meal', 'dish', 'cuisine'],
  space: ['space', 'galaxy', 'stars', 'planet', 'earth', 'universe', 'cosmic', 'astronaut', 'nebula']
};

export const generateSampleImage = async (prompt: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Convert prompt to lowercase for matching
  const lowerPrompt = prompt.toLowerCase();
  
  // Find matching category based on keywords
  let bestCategory = 'landscape'; // default
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(keywordMapping)) {
    const score = keywords.filter(keyword => lowerPrompt.includes(keyword)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  // Get images from the best matching category
  const categoryImages = sampleImages.filter(img => img.category === bestCategory);
  
  if (categoryImages.length === 0) {
    // Fallback to random image
    return sampleImages[Math.floor(Math.random() * sampleImages.length)].url;
  }
  
  // Return a random image from the matching category
  return categoryImages[Math.floor(Math.random() * categoryImages.length)].url;
};

export const generateMultipleImages = async (prompt: string, count: number = 4): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  
  // Convert prompt to lowercase for matching
  const lowerPrompt = prompt.toLowerCase();
  
  // Find matching category based on keywords
  let bestCategory = 'landscape'; // default
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(keywordMapping)) {
    const score = keywords.filter(keyword => lowerPrompt.includes(keyword)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  // Get images from the best matching category
  const categoryImages = sampleImages.filter(img => img.category === bestCategory);
  
  if (categoryImages.length === 0) {
    // Fallback to random images
    const shuffled = [...sampleImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(img => img.url);
  }
  
  // Shuffle and return multiple images from the matching category
  const shuffled = [...categoryImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(img => img.url);
};

export const getSamplePrompts = (): string[] => {
  return [
    'A beautiful landscape with mountains and a lake at sunset',
    'A cute cat sitting in a garden',
    'Modern city skyline at night',
    'Abstract colorful art with geometric shapes',
    'Delicious pizza with melted cheese',
    'Space galaxy with stars and nebula',
    'Technology robot with glowing eyes',
    'Forest with tall trees and green leaves'
  ];
};
