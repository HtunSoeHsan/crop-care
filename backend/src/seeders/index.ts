import { connectDatabase } from '../config/database';
import { seedDiseases } from './disease.seeder';

const runSeeders = async () => {
  try {
    await connectDatabase();
    await seedDiseases();
    console.log('🎉 All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
};

runSeeders();