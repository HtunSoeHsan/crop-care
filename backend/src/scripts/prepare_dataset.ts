import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const DATASET_URL = 'https://data.mendeley.com/public-files/datasets/tywbtsjrjv/files/d5652a28-c1d8-4b76-97f3-72fb80f94efc/file_downloaded';
const TRAINING_DATA_DIR = path.join(process.cwd(), 'training_data');

async function downloadFile(url: string, outputPath: string) {
  console.log(`Downloading dataset from ${url}...`);
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });

  await pipeline(response.data, createWriteStream(outputPath));
  console.log('Download completed!');
}

async function extractDataset(zipPath: string) {
  console.log('Extracting dataset...');
  await execAsync(`unzip -q ${zipPath} -d ${TRAINING_DATA_DIR}`);
  console.log('Extraction completed!');
}

async function organizeDataset() {
  console.log('Organizing dataset...');
  
  // Create training data directory if it doesn't exist
  if (!fs.existsSync(TRAINING_DATA_DIR)) {
    fs.mkdirSync(TRAINING_DATA_DIR, { recursive: true });
  }

  // Download the dataset
  const zipPath = path.join(TRAINING_DATA_DIR, 'plant_village.zip');
  await downloadFile(DATASET_URL, zipPath);

  // Extract the dataset
  await extractDataset(zipPath);

  // Clean up
  fs.unlinkSync(zipPath);
  
  console.log('Dataset preparation completed!');
  console.log(`Training data is available at: ${TRAINING_DATA_DIR}`);
}

// Run the dataset preparation
organizeDataset().catch(console.error);