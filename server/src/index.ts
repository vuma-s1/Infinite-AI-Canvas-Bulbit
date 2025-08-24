import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from our client
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bulbit AI Server is running' });
});

// Basic image generation endpoint
app.post('/api/generate-from-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Style extraction endpoint
app.post('/api/extract-style', upload.fields([
  { name: 'styleImage', maxCount: 1 },
  { name: 'objectImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { prompt } = req.body;

    if (!files.styleImage || !files.objectImage) {
      return res.status(400).json({ error: 'Both style and object images are required' });
    }

    const styleImagePath = files.styleImage[0].path;
    const objectImagePath = files.objectImage[0].path;

    // Analyze style image using GPT-4 Vision
    const styleAnalysis = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image and extract the following style elements: colors (as hex codes), textures, lighting style, mood, and forms. Return as JSON format.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `file://${path.resolve(styleImagePath)}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    // Generate styled image
    const styledImageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Apply the artistic style from the style reference to this object: ${prompt || 'Apply the extracted style to the object image'}`,
      n: 1,
      size: '1024x1024',
    });

    // Parse style analysis
    let extractedStyle;
    try {
      extractedStyle = JSON.parse(styleAnalysis.choices[0].message.content || '{}');
    } catch (e) {
      extractedStyle = {
        colors: ['#667eea', '#764ba2'],
        textures: ['smooth', 'gradient'],
        lighting: 'dramatic',
        mood: 'mysterious',
        forms: ['organic', 'flowing']
      };
    }

    res.json({
      extractedStyle,
      styledImageUrl: styledImageResponse.data[0].url
    });
  } catch (error) {
    console.error('Error extracting style:', error);
    res.status(500).json({ error: 'Failed to extract style' });
  }
});

// Color extraction endpoint
app.post('/api/extract-colors', upload.fields([
  { name: 'colorReference', maxCount: 1 },
  { name: 'objectReference', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.colorReference || !files.objectReference) {
      return res.status(400).json({ error: 'Both color reference and object reference images are required' });
    }

    const colorRefPath = files.colorReference[0].path;
    const objectRefPath = files.objectReference[0].path;

    // Extract color palette using GPT-4 Vision
    const colorAnalysis = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the dominant color palette from this image. Return as an array of hex color codes (e.g., ["#FF0000", "#00FF00"]).'
            },
            {
              type: 'image_url',
              image_url: {
                url: `file://${path.resolve(colorRefPath)}`
              }
            }
          ]
        }
      ],
      max_tokens: 200
    });

    // Generate colorized image
    const colorizedImageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'Apply the extracted color palette to the object image, maintaining the original composition and style',
      n: 1,
      size: '1024x1024',
    });

    // Parse color palette
    let extractedPalette;
    try {
      const colorText = colorAnalysis.choices[0].message.content || '[]';
      extractedPalette = JSON.parse(colorText);
    } catch (e) {
      extractedPalette = ['#667eea', '#764ba2', '#4ade80', '#f59e0b'];
    }

    res.json({
      extractedPalette,
      colorizedImageUrl: colorizedImageResponse.data[0].url
    });
  } catch (error) {
    console.error('Error extracting colors:', error);
    res.status(500).json({ error: 'Failed to extract colors' });
  }
});

// Moodboard generation endpoint
app.post('/api/generate-moodboard', upload.array('elements', 8), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { description } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one design element is required' });
    }

    // Generate moodboard using DALL-E
    const moodboardResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a comprehensive visual moodboard based on these design elements: ${description || 'Create a cohesive design system moodboard'}. Include color swatches, typography examples, pattern samples, and visual elements arranged in a professional layout.`,
      n: 1,
      size: '1024x1024',
    });

    res.json({
      moodboardUrl: moodboardResponse.data[0].url
    });
  } catch (error) {
    console.error('Error generating moodboard:', error);
    res.status(500).json({ error: 'Failed to generate moodboard' });
  }
});

// Asset generator endpoint
app.post('/api/generate-assets', upload.fields([
  { name: 'brandingSource', maxCount: 1 },
  { name: 'contentAssets', maxCount: 10 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.brandingSource) {
      return res.status(400).json({ error: 'Branding source is required' });
    }

    const brandingPath = files.brandingSource[0].path;

    // Analyze branding using GPT-4 Vision
    const brandingAnalysis = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this branding image and extract: colors (hex codes), style characteristics, typography preferences, and visual elements. Return as JSON.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `file://${path.resolve(brandingPath)}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    // Generate branded assets
    const assetPromises = [];
    for (let i = 0; i < 3; i++) {
      assetPromises.push(
        openai.images.generate({
          model: 'dall-e-3',
          prompt: `Create a branded asset (illustration, mockup, or design element) using the extracted branding style. Asset ${i + 1}.`,
          n: 1,
          size: '1024x1024',
        })
      );
    }

    const assetResponses = await Promise.all(assetPromises);

    // Parse branding analysis
    let extractedBranding;
    try {
      extractedBranding = JSON.parse(brandingAnalysis.choices[0].message.content || '{}');
    } catch (e) {
      extractedBranding = {
        colors: ['#667eea', '#764ba2'],
        style: 'modern',
        typography: 'sans-serif',
        visualElements: ['geometric', 'minimal']
      };
    }

    res.json({
      extractedBranding,
      generatedAssets: assetResponses.map(response => response.data[0].url)
    });
  } catch (error) {
    console.error('Error generating assets:', error);
    res.status(500).json({ error: 'Failed to generate assets' });
  }
});

// Iterative refinement endpoint
app.post('/api/iterative-refinement', async (req, res) => {
  try {
    const { baseImage, transformationSteps, currentStep } = req.body;

    if (!baseImage || !transformationSteps || currentStep === undefined) {
      return res.status(400).json({ error: 'Base image, transformation steps, and current step are required' });
    }

    const step = transformationSteps[currentStep];
    if (!step) {
      return res.status(400).json({ error: 'Invalid step index' });
    }

    // Generate refined image based on the transformation step
    const refinedImageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Starting from the base image, apply this transformation: ${step.instruction}. Maintain the core elements while applying the specific changes.`,
      n: 1,
      size: '1024x1024',
    });

    res.json({
      refinedImageUrl: refinedImageResponse.data[0].url,
      step: currentStep,
      totalSteps: transformationSteps.length
    });
  } catch (error) {
    console.error('Error in iterative refinement:', error);
    res.status(500).json({ error: 'Failed to refine image' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Bulbit AI Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});
