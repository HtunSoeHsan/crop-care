import { connectDatabase } from '../config/database';
import { PlantDisease, Treatment, TreatmentType } from '../models';

const seedData = async () => {
  console.log('🌱 Starting database seeding...');

  try {
    // Connect to database
    await connectDatabase();

    // Clear existing data
    await PlantDisease.deleteMany({});
    await Treatment.deleteMany({});
    
    console.log('🧹 Cleared existing data');

    // Seed plant diseases
    const diseases = [
      {
        name: 'Tomato Early Blight',
        description: 'Early blight is a fungal disease that affects tomato plants, causing brown spots with concentric rings on leaves, stems, and fruits.',
        symptoms: [
          'Brown spots with concentric rings on leaves',
          'Yellowing around the lesions',
          'Lower leaves are affected first',
          'Infected leaves may drop',
          'Spots may appear on stems and fruits'
        ],
        plantType: 'Tomato',
        classIndex: 0
      },
      {
        name: 'Tomato Late Blight',
        description: 'Late blight is a devastating disease caused by Phytophthora infestans, affecting tomato leaves, stems, and fruits.',
        symptoms: [
          'Dark brown to black lesions on leaves',
          'White fuzzy growth on leaf undersides',
          'Rapid spreading during humid conditions',
          'Stems show dark streaks'
        ],
        plantType: 'Tomato',
        classIndex: 1
      },
      {
        name: 'Tomato Septoria Leaf Spot',
        description: 'Septoria leaf spot causes small, circular spots with dark borders on tomato leaves.',
        symptoms: [
          'Small circular spots with gray centers',
          'Dark brown borders around spots',
          'Black specks in spot centers',
          'Lower leaves affected first'
        ],
        plantType: 'Tomato',
        classIndex: 2
      },
      {
        name: 'Tomato Bacterial Spot',
        description: 'Bacterial spot causes small, dark spots on leaves and fruits of tomato plants.',
        symptoms: [
          'Small dark spots on leaves',
          'Spots may have yellow halos',
          'Fruit lesions are raised and scabby',
          'Defoliation in severe cases'
        ],
        plantType: 'Tomato',
        classIndex: 3
      },
      {
        name: 'Tomato Mosaic Virus',
        description: 'Tomato mosaic virus causes mottled light and dark green patterns on leaves.',
        symptoms: [
          'Mottled light and dark green leaf patterns',
          'Stunted plant growth',
          'Leaf distortion and curling',
          'Reduced fruit quality'
        ],
        plantType: 'Tomato',
        classIndex: 4
      },
      {
        name: 'Healthy Tomato',
        description: 'Healthy tomato plants show no signs of disease and have vibrant green foliage.',
        symptoms: [
          'Vibrant green leaves',
          'No spots or lesions',
          'Normal growth patterns',
          'Healthy fruit development'
        ],
        plantType: 'Tomato',
        classIndex: 5
      }
    ];

    const createdDiseases = await PlantDisease.insertMany(diseases);
    console.log(`✅ Created ${createdDiseases.length} plant diseases`);

    // Seed treatments for each disease (except healthy)
    const treatments = [];
    
    for (let i = 0; i < createdDiseases.length - 1; i++) { // -1 to skip healthy
      const disease = createdDiseases[i];
      
      // Organic treatments
      treatments.push({
        diseaseId: disease._id,
        name: 'Organic Treatment',
        description: 'Natural and environmentally friendly treatment options',
        steps: [
          'Remove and destroy infected plant parts',
          'Apply copper-based fungicides',
          'Use neem oil spray once a week',
          'Mulch around plants to prevent soil splash',
          'Ensure good air circulation'
        ],
        type: TreatmentType.ORGANIC
      });

      // Chemical treatments
      treatments.push({
        diseaseId: disease._id,
        name: 'Chemical Treatment',
        description: 'Chemical-based treatment for severe infections',
        steps: [
          'Apply appropriate fungicide as directed',
          'Follow label instructions for timing',
          'Rotate different fungicides to prevent resistance',
          'Use protective equipment when applying',
          'Monitor plant response'
        ],
        type: TreatmentType.CHEMICAL
      });

      // Preventive treatments
      treatments.push({
        diseaseId: disease._id,
        name: 'Prevention',
        description: 'Preventive measures to avoid disease occurrence',
        steps: [
          'Practice crop rotation',
          'Space plants for good air circulation',
          'Water at the base of plants to keep foliage dry',
          'Remove plant debris at the end of the season',
          'Use disease-resistant varieties when available'
        ],
        type: TreatmentType.PREVENTIVE
      });
    }

    const createdTreatments = await Treatment.insertMany(treatments);
    console.log(`✅ Created ${createdTreatments.length} treatments`);

    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedData();
}

export default seedData;
