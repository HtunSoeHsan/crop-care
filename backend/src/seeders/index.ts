import { connectDatabase } from '../config/database';
import { seedDiseases } from './disease.seeder';
import { seedPlantGuides } from './plant-guide.seeder';
import { seedHealthyFoods } from './healthy-food.seeder';
import { seedResources } from './resource.seeder';

const runSeeders = async () => {
  try {
    await connectDatabase();
    await seedDiseases();
    await seedPlantGuides();
    await seedHealthyFoods();
    await seedResources();
    console.log('🎉 All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
};

runSeeders();