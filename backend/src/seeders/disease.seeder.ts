import Disease, { IDisease } from '../models/Disease';
import { diseaseMapping } from '../config/disease-mapping';

// Map PlantDisease to IDisease
function mapToIDisease(disease: any): Partial<IDisease> {
  // Define severity based on name or default
  const getSeverity = (name: string): 'Low' | 'Medium' | 'High' | 'Critical' => {
    if (name.toLowerCase().includes('healthy')) return 'Low';
    if (name.toLowerCase().includes('background')) return 'Low';
    if (name.toLowerCase().includes('virus') || name.toLowerCase().includes('blast')) return 'Critical';
    if (name.toLowerCase().includes('bacterial') || name.toLowerCase().includes('rot')) return 'High';
    return 'Medium';
  };

  return {
    classIndex: disease.classIndex,
    name: disease.name,
    description: disease?.description,
    symptoms: disease?.symptoms || [{ en: 'No symptoms listed', my: 'လက္ခဏာများ မရှိ' }],
    causes: disease?.causes || {
      en: 'Cause not specified.',
      my: 'အကြောင်းရင်း မသတ်မှတ်ရသေးပါ။',
    },
    treatments:  disease?.treatments || [],
    recommendations: disease?.recommendations || [],
    severity: getSeverity(disease.name.en),
    affectedCrops: disease.plantType,
    imageUrl: `https://example.com/images/disease-${disease.classIndex}.jpg`,
    isActive: true,
  };
}

// Add new fields to match disease-mapping structure
function mapToExtendedDisease(disease: any) {
  return {
    ...mapToIDisease(disease),
    // treatments: disease.treatments || [],
    // recommendations: disease.recommendations || []
  };
}

export async function seedDiseases() {
  try {
    console.log('🌱 Seeding diseases...');
    await Disease.deleteMany({});
    
    const diseasesToInsert = diseaseMapping.map(mapToExtendedDisease) as IDisease[];
    await Disease.insertMany(diseasesToInsert);
    
    console.log(`✅ ${diseasesToInsert.length} diseases seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding diseases:', error);
  }
}