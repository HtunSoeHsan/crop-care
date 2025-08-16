import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TreatmentPlan {
  immediate: ImmediateTreatment[];
  preventive: PreventiveMeasure[];
  monitoring: MonitoringPlan;
  schedule: TreatmentSchedule[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

interface ImmediateTreatment {
  action: string;
  description: string;
  materials: string[];
  timeframe: string;
  priority: number;
  cost: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface PreventiveMeasure {
  measure: string;
  description: string;
  frequency: string;
  season: string;
  effectiveness: number;
}

interface MonitoringPlan {
  frequency: string;
  indicators: string[];
  alertThresholds: { [key: string]: any };
  documentation: string[];
}

interface TreatmentSchedule {
  week: number;
  actions: string[];
  checkpoints: string[];
}

export class TreatmentRecommendationService {
  
  // Generate comprehensive treatment plan
  static async generateTreatmentPlan(
    diseaseName: string,
    plantType: string,
    confidence: number,
    reliability: string,
    severity?: string
  ): Promise<TreatmentPlan> {
    
    const disease = await prisma.plantDisease.findFirst({
      where: { name: diseaseName },
      include: { treatments: true }
    });

    if (!disease) {
      throw new Error('Disease not found in database');
    }

    const assessedSeverity = this.assessSeverity(diseaseName, confidence, reliability, severity);
    const urgency = this.determineUrgency(diseaseName, assessedSeverity);

    return {
      immediate: this.generateImmediateTreatment(disease, assessedSeverity, urgency),
      preventive: this.generatePreventiveMeasures(plantType, diseaseName),
      monitoring: this.generateMonitoringPlan(diseaseName, assessedSeverity),
      schedule: this.generateTreatmentSchedule(diseaseName, assessedSeverity),
      severity: assessedSeverity,
      urgency
    };
  }

  // Assess disease severity
  private static assessSeverity(
    diseaseName: string,
    confidence: number,
    reliability: string,
    providedSeverity?: string
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    
    if (providedSeverity) {
      return providedSeverity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    }

    // Critical diseases that require immediate attention
    const criticalDiseases = [
      'Tomato Late Blight',
      'Potato Late Blight',
      'Fire Blight',
      'Bacterial Wilt'
    ];

    // High severity diseases
    const highSeverityDiseases = [
      'Tomato Early Blight',
      'Apple Scab',
      'Powdery Mildew',
      'Bacterial Spot'
    ];

    if (criticalDiseases.some(disease => diseaseName.includes(disease))) {
      return 'CRITICAL';
    }

    if (highSeverityDiseases.some(disease => diseaseName.includes(disease))) {
      return confidence > 0.8 ? 'HIGH' : 'MEDIUM';
    }

    // Base severity on confidence and reliability
    if (confidence > 0.9 && reliability === 'HIGH') return 'HIGH';
    if (confidence > 0.7 && reliability === 'MEDIUM') return 'MEDIUM';
    return 'LOW';
  }

  // Determine urgency
  private static determineUrgency(
    diseaseName: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    
    const urgentDiseases = ['Late Blight', 'Fire Blight', 'Bacterial Wilt'];
    
    if (urgentDiseases.some(disease => diseaseName.includes(disease))) {
      return 'URGENT';
    }

    switch (severity) {
      case 'CRITICAL': return 'URGENT';
      case 'HIGH': return 'HIGH';
      case 'MEDIUM': return 'MEDIUM';
      default: return 'LOW';
    }
  }

  // Generate immediate treatment actions
  private static generateImmediateTreatment(
    disease: any,
    severity: string,
    urgency: string
  ): ImmediateTreatment[] {
    
    const treatments: ImmediateTreatment[] = [];

    // Always start with isolation and sanitation
    treatments.push({
      action: 'Isolate Affected Plants',
      description: 'Immediately isolate affected plants to prevent spread',
      materials: ['Pruning shears', 'Disinfectant', 'Disposal bags'],
      timeframe: 'Within 24 hours',
      priority: 1,
      cost: 'LOW'
    });

    // Remove infected parts
    treatments.push({
      action: 'Remove Infected Plant Parts',
      description: 'Carefully remove and dispose of infected leaves, stems, or fruits',
      materials: ['Sterilized pruning tools', 'Plastic bags', 'Gloves'],
      timeframe: 'Immediately',
      priority: 2,
      cost: 'LOW'
    });

    // Treatment based on disease type
    if (disease.name.includes('Fungal') || disease.name.includes('Blight') || disease.name.includes('Mildew')) {
      treatments.push({
        action: 'Apply Fungicide',
        description: 'Apply appropriate fungicide as per disease type',
        materials: ['Copper-based fungicide', 'Sprayer', 'Protective equipment'],
        timeframe: 'Within 48 hours',
        priority: 3,
        cost: 'MEDIUM'
      });
    }

    if (disease.name.includes('Bacterial')) {
      treatments.push({
        action: 'Apply Bactericide',
        description: 'Apply copper-based bactericide to affected areas',
        materials: ['Copper bactericide', 'Sprayer', 'Protective equipment'],
        timeframe: 'Within 48 hours',
        priority: 3,
        cost: 'MEDIUM'
      });
    }

    if (disease.name.includes('Virus')) {
      treatments.push({
        action: 'Vector Control',
        description: 'Control insects that may spread the virus',
        materials: ['Insecticidal soap', 'Neem oil', 'Yellow sticky traps'],
        timeframe: 'Within 72 hours',
        priority: 3,
        cost: 'MEDIUM'
      });
    }

    // Severity-based additional treatments
    if (severity === 'CRITICAL' || urgency === 'URGENT') {
      treatments.push({
        action: 'Emergency Plant Nutrition',
        description: 'Provide balanced nutrition to boost plant immunity',
        materials: ['Balanced fertilizer', 'Foliar spray', 'Watering system'],
        timeframe: 'Within 24 hours',
        priority: 4,
        cost: 'MEDIUM'
      });
    }

    return treatments;
  }

  // Generate preventive measures
  private static generatePreventiveMeasures(
    plantType: string,
    diseaseName: string
  ): PreventiveMeasure[] {
    
    const measures: PreventiveMeasure[] = [];

    // Universal preventive measures
    measures.push(
      {
        measure: 'Proper Plant Spacing',
        description: 'Maintain adequate spacing between plants for air circulation',
        frequency: 'At planting',
        season: 'All seasons',
        effectiveness: 85
      },
      {
        measure: 'Sanitation Practices',
        description: 'Remove fallen leaves and plant debris regularly',
        frequency: 'Weekly',
        season: 'Growing season',
        effectiveness: 80
      },
      {
        measure: 'Watering Management',
        description: 'Water at the base of plants, avoid wetting foliage',
        frequency: 'Daily',
        season: 'Growing season',
        effectiveness: 75
      }
    );

    // Plant-specific measures
    const plantSpecificMeasures: { [key: string]: PreventiveMeasure[] } = {
      'Tomato': [
        {
          measure: 'Staking and Pruning',
          description: 'Stake plants and prune lower branches for air circulation',
          frequency: 'Monthly',
          season: 'Growing season',
          effectiveness: 70
        },
        {
          measure: 'Mulching',
          description: 'Apply mulch to prevent soil splash on lower leaves',
          frequency: 'At planting',
          season: 'Growing season',
          effectiveness: 65
        }
      ],
      'Potato': [
        {
          measure: 'Hilling',
          description: 'Hill soil around plants to prevent tuber exposure',
          frequency: 'Bi-weekly',
          season: 'Growing season',
          effectiveness: 80
        },
        {
          measure: 'Certified Seed',
          description: 'Use only certified disease-free seed potatoes',
          frequency: 'At planting',
          season: 'Spring',
          effectiveness: 90
        }
      ],
      'Apple': [
        {
          measure: 'Dormant Oil Application',
          description: 'Apply dormant oil to control overwintering pests',
          frequency: 'Annually',
          season: 'Late winter',
          effectiveness: 70
        },
        {
          measure: 'Pruning for Air Circulation',
          description: 'Prune to maintain open canopy structure',
          frequency: 'Annually',
          season: 'Winter',
          effectiveness: 75
        }
      ]
    };

    const specificMeasures = plantSpecificMeasures[plantType] || [];
    measures.push(...specificMeasures);

    // Disease-specific preventive measures
    if (diseaseName.includes('Fungal') || diseaseName.includes('Blight')) {
      measures.push({
        measure: 'Preventive Fungicide Application',
        description: 'Apply preventive fungicide during high-risk periods',
        frequency: 'Bi-weekly',
        season: 'High humidity periods',
        effectiveness: 85
      });
    }

    return measures;
  }

  // Generate monitoring plan
  private static generateMonitoringPlan(
    diseaseName: string,
    severity: string
  ): MonitoringPlan {
    
    const baseFrequency = severity === 'CRITICAL' ? 'Daily' : 
                         severity === 'HIGH' ? 'Every 2 days' : 
                         severity === 'MEDIUM' ? 'Every 3 days' : 'Weekly';

    return {
      frequency: baseFrequency,
      indicators: [
        'New symptom appearance',
        'Symptom progression',
        'Plant vigor changes',
        'Environmental conditions',
        'Treatment effectiveness'
      ],
      alertThresholds: {
        symptomSpread: '10% increase in affected area',
        plantDecline: 'Visible wilting or yellowing',
        weatherConditions: 'High humidity + warm temperatures',
        treatmentFailure: 'No improvement after 7 days'
      },
      documentation: [
        'Photo documentation of symptoms',
        'Weather condition logs',
        'Treatment application records',
        'Symptom progression notes',
        'Recovery progress tracking'
      ]
    };
  }

  // Generate treatment schedule
  private static generateTreatmentSchedule(
    diseaseName: string,
    severity: string
  ): TreatmentSchedule[] {
    
    const schedule: TreatmentSchedule[] = [];

    // Week 1: Immediate response
    schedule.push({
      week: 1,
      actions: [
        'Isolate affected plants',
        'Remove infected plant parts',
        'Apply initial treatment',
        'Implement sanitation measures'
      ],
      checkpoints: [
        'Assess spread containment',
        'Verify treatment application',
        'Document initial condition'
      ]
    });

    // Week 2: Follow-up treatment
    schedule.push({
      week: 2,
      actions: [
        'Assess treatment effectiveness',
        'Reapply treatment if necessary',
        'Monitor environmental conditions',
        'Continue sanitation practices'
      ],
      checkpoints: [
        'Evaluate symptom progression',
        'Check for new infections',
        'Review treatment success'
      ]
    });

    // Week 3-4: Maintenance and monitoring
    schedule.push({
      week: 3,
      actions: [
        'Continue monitoring',
        'Implement preventive measures',
        'Adjust treatment if needed',
        'Document recovery progress'
      ],
      checkpoints: [
        'Assess overall plant health',
        'Evaluate preventive measures',
        'Plan long-term management'
      ]
    });

    // Extended schedule for severe cases
    if (severity === 'HIGH' || severity === 'CRITICAL') {
      schedule.push({
        week: 4,
        actions: [
          'Intensive monitoring',
          'Nutritional support',
          'Environmental optimization',
          'Prepare for next season'
        ],
        checkpoints: [
          'Final assessment',
          'Plan prevention for next season',
          'Document lessons learned'
        ]
      });
    }

    return schedule;
  }

  // Generate seasonal recommendations
  static generateSeasonalRecommendations(
    plantType: string,
    currentSeason: string
  ): any {
    
    const seasonalRecommendations: { [key: string]: any } = {
      'Spring': {
        focus: 'Prevention and early detection',
        actions: [
          'Apply preventive treatments',
          'Inspect for overwintering diseases',
          'Prepare monitoring systems',
          'Implement sanitation practices'
        ]
      },
      'Summer': {
        focus: 'Active monitoring and treatment',
        actions: [
          'Intensive plant monitoring',
          'Manage irrigation carefully',
          'Control pest vectors',
          'Maintain plant nutrition'
        ]
      },
      'Fall': {
        focus: 'Cleanup and preparation',
        actions: [
          'Remove plant debris',
          'Apply dormant treatments',
          'Prepare soil for winter',
          'Plan next season prevention'
        ]
      },
      'Winter': {
        focus: 'Planning and preparation',
        actions: [
          'Plan crop rotation',
          'Prepare treatment equipment',
          'Study disease patterns',
          'Order resistant varieties'
        ]
      }
    };

    return seasonalRecommendations[currentSeason] || seasonalRecommendations['Spring'];
  }
}
