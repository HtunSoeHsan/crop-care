import Disease from '../models/Disease';
import { diseaseMapping } from '../config/disease-mapping';

export const seedDiseases = async () => {
  try {
    console.log('🌱 Seeding diseases...');
    
    // Clear existing diseases
    await Disease.deleteMany({});
    
    // Insert disease data
    await Disease.insertMany(diseaseMapping);
    
    console.log(`✅ Successfully seeded ${diseaseMapping.length} diseases`);
  } catch (error) {
    console.error('❌ Error seeding diseases:', error);
    throw error;
  }
};