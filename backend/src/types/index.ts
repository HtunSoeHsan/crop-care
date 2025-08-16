interface DiseaseTreatment {
  name: { en: string; my: string };
  description: { en: string; my: string };
  steps: { en: string; my: string }[];
}

export interface PlantDisease {
  classIndex: number;
  name: { en: string; my: string };
  description: { en: string; my: string };
  symptoms: { en: string; my: string }[];
  plantType: { en: string; my: string };
  treatments: DiseaseTreatment[];
  prevention?: { en: string; my: string }[];
  recommendations?: { en: string; my: string }[];
  detection?: DiseaseDetection;
  preventionTips?: { en: string; my: string }[];
}

export interface PlantCareGuide {
  plantName: { en: string; my: string };
  scientificName?: string;
  plantType: { en: string; my: string };
  description: { en: string; my: string };
  images: string[];
  careInstructions: {
    watering: {
      frequency: { en: string; my: string };
      amount: { en: string; my: string };
      tips: { en: string; my: string }[];
    };
    sunlight: {
      requirement: { en: string; my: string };
      hours: { en: string; my: string };
      tips: { en: string; my: string }[];
    };
    soil: {
      type: { en: string; my: string };
      pH?: string;
      drainage: { en: string; my: string };
      tips: { en: string; my: string }[];
    };
    fertilizing: {
      frequency: { en: string; my: string };
      type: { en: string; my: string };
      tips: { en: string; my: string }[];
    };
  };
}

interface DiseaseDetection {
  confidence: string; // e.g. 0.92 for 92%
  imageUrl?: string;  // Optional image used for detection
  detectedAt?: Date;  // Optional timestamp of detection
}
