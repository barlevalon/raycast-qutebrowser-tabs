const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convertIcon() {
  try {
    const inputPath = path.join(__dirname, '../assets/command-icon.svg');
    const outputPath = path.join(__dirname, '../assets/command-icon.png');
    
    await sharp(inputPath)
      .resize(512, 512)
      .png()
      .toFile(outputPath);
    
    console.log('Icon converted successfully!');
  } catch (error) {
    console.error('Error converting icon:', error);
  }
}

convertIcon();