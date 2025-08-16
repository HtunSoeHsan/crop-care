import { Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Mock data structure for plant collection
interface UserPlant {
  _id: string;
  userId: string;
  plantName: string;
  scientificName?: string;
  plantType: string;
  nickname?: string;
  images: string[];
  dateAcquired: Date;
  location: string;
  notes: string;
  careHistory: {
    _id: string;
    date: Date;
    activity: 'watered' | 'fertilized' | 'pruned' | 'repotted' | 'treated' | 'other';
    notes?: string;
    images?: string[];
  }[];
  healthStatus: 'healthy' | 'sick' | 'recovering' | 'dead';
  detectionHistory: string[];
  reminders: {
    _id: string;
    type: 'watering' | 'fertilizing' | 'pruning' | 'checkup';
    frequency: number; // in days
    lastDone: Date;
    nextDue: Date;
    isActive: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock database for demonstration
let mockUserPlants: UserPlant[] = [
  {
    _id: 'plant1',
    userId: 'user1',
    plantName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    plantType: 'Vegetable',
    nickname: 'Big Tom',
    images: ['/uploads/plant-collection/plant-1-main.jpg'],
    dateAcquired: new Date('2023-03-15'),
    location: 'Garden bed 1',
    notes: 'Started from seed, growing well in sunny spot',
    careHistory: [
      {
        _id: 'care1',
        date: new Date('2023-07-01'),
        activity: 'watered',
        notes: 'Deep watering in the morning'
      },
      {
        _id: 'care2',
        date: new Date('2023-06-28'),
        activity: 'fertilized',
        notes: 'Applied balanced liquid fertilizer'
      }
    ],
    healthStatus: 'healthy',
    detectionHistory: [],
    reminders: [
      {
        _id: 'reminder1',
        type: 'watering',
        frequency: 2,
        lastDone: new Date('2023-07-01'),
        nextDue: new Date('2023-07-03'),
        isActive: true
      },
      {
        _id: 'reminder2',
        type: 'fertilizing',
        frequency: 14,
        lastDone: new Date('2023-06-28'),
        nextDue: new Date('2023-07-12'),
        isActive: true
      }
    ],
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-07-01')
  }
];

export const getUserPlants = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { status, plantType, sortBy = 'createdAt' } = req.query;
    
    let userPlants = mockUserPlants.filter(plant => plant.userId === userId);
    
    // Apply filters
    if (status) {
      userPlants = userPlants.filter(plant => plant.healthStatus === status);
    }
    
    if (plantType) {
      userPlants = userPlants.filter(plant => 
        plant.plantType.toLowerCase().includes((plantType as string).toLowerCase())
      );
    }
    
    // Sort
    userPlants.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.plantName.localeCompare(b.plantName);
        case 'dateAcquired':
          return new Date(b.dateAcquired).getTime() - new Date(a.dateAcquired).getTime();
        case 'healthStatus':
          return a.healthStatus.localeCompare(b.healthStatus);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    res.json({
      status: 'success',
      data: {
        plants: userPlants,
        count: userPlants.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user plants'
    });
  }
};

export const getPlantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    
    const plant = mockUserPlants.find(p => p._id === id && p.userId === userId);
    
    if (!plant) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant not found'
      });
    }
    
    res.json({
      status: 'success',
      data: { plant }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching plant'
    });
  }
};

export const addPlantToCollection = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { plantName, scientificName, plantType, nickname, location, notes } = req.body;
    
    // Process uploaded images
    const images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        // Resize and optimize image
        const optimizedPath = file.path.replace(path.extname(file.path), '-optimized.jpg');
        
        await sharp(file.path)
          .resize(800, 600, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(optimizedPath);
        
        // Remove original and use optimized version
        fs.unlinkSync(file.path);
        images.push(optimizedPath.replace(process.cwd(), ''));
      }
    }
    
    const newPlant: UserPlant = {
      _id: `plant${Date.now()}`,
      userId,
      plantName,
      scientificName,
      plantType,
      nickname,
      images,
      dateAcquired: new Date(),
      location: location || '',
      notes: notes || '',
      careHistory: [],
      healthStatus: 'healthy',
      detectionHistory: [],
      reminders: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockUserPlants.push(newPlant);
    
    res.status(201).json({
      status: 'success',
      data: { plant: newPlant }
    });
  } catch (error) {
    console.error('Error adding plant to collection:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding plant to collection'
    });
  }
};

export const updatePlant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const updates = req.body;
    
    const plantIndex = mockUserPlants.findIndex(p => p._id === id && p.userId === userId);
    
    if (plantIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant not found'
      });
    }
    
    const plant = mockUserPlants[plantIndex];
    
    // Process new uploaded images
    let newImages: string[] = [...plant.images];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const optimizedPath = file.path.replace(path.extname(file.path), '-optimized.jpg');
        
        await sharp(file.path)
          .resize(800, 600, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(optimizedPath);
        
        fs.unlinkSync(file.path);
        newImages.push(optimizedPath.replace(process.cwd(), ''));
      }
    }
    
    // Update plant
    mockUserPlants[plantIndex] = {
      ...plant,
      ...updates,
      images: newImages,
      updatedAt: new Date()
    };
    
    res.json({
      status: 'success',
      data: { plant: mockUserPlants[plantIndex] }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating plant'
    });
  }
};

export const deletePlant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    
    const plantIndex = mockUserPlants.findIndex(p => p._id === id && p.userId === userId);
    
    if (plantIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant not found'
      });
    }
    
    const plant = mockUserPlants[plantIndex];
    
    // Delete associated images
    plant.images.forEach(imagePath => {
      const fullPath = path.join(process.cwd(), imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });
    
    // Delete plant
    mockUserPlants.splice(plantIndex, 1);
    
    res.json({
      status: 'success',
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting plant'
    });
  }
};

export const addCareActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { activity, notes } = req.body;
    
    const plantIndex = mockUserPlants.findIndex(p => p._id === id && p.userId === userId);
    
    if (plantIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant not found'
      });
    }
    
    // Process uploaded images for the activity
    const activityImages: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const optimizedPath = file.path.replace(path.extname(file.path), '-activity.jpg');
        
        await sharp(file.path)
          .resize(600, 450, { fit: 'cover' })
          .jpeg({ quality: 75 })
          .toFile(optimizedPath);
        
        fs.unlinkSync(file.path);
        activityImages.push(optimizedPath.replace(process.cwd(), ''));
      }
    }
    
    const newActivity = {
      _id: `activity${Date.now()}`,
      date: new Date(),
      activity,
      notes: notes || '',
      images: activityImages
    };
    
    const plant = mockUserPlants[plantIndex];
    plant.careHistory.push(newActivity);
    plant.updatedAt = new Date();
    
    // Update relevant reminder if exists
    const reminderMap: { [key: string]: string } = {
      'watered': 'watering',
      'fertilized': 'fertilizing',
      'pruned': 'pruning'
    };
    
    const reminderType = reminderMap[activity];
    if (reminderType) {
      const reminder = plant.reminders.find(r => r.type === reminderType && r.isActive);
      if (reminder) {
        reminder.lastDone = new Date();
        reminder.nextDue = new Date(Date.now() + reminder.frequency * 24 * 60 * 60 * 1000);
      }
    }
    
    res.status(201).json({
      status: 'success',
      data: { activity: newActivity }
    });
  } catch (error) {
    console.error('Error adding care activity:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding care activity'
    });
  }
};

export const getPlantCareHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { limit = 50, activity } = req.query;
    
    const plant = mockUserPlants.find(p => p._id === id && p.userId === userId);
    
    if (!plant) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant not found'
      });
    }
    
    let careHistory = [...plant.careHistory];
    
    // Filter by activity type if specified
    if (activity) {
      careHistory = careHistory.filter(care => care.activity === activity);
    }
    
    // Sort by date (most recent first) and limit
    careHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    careHistory = careHistory.slice(0, Number(limit));
    
    res.json({
      status: 'success',
      data: {
        careHistory,
        plantName: plant.plantName
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching care history'
    });
  }
};

export const updatePlantReminders = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { reminders } = req.body;
    
    const plantIndex = mockUserPlants.findIndex(p => p._id === id && p.userId === userId);
    
    if (plantIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Plant not found'
      });
    }
    
    const plant = mockUserPlants[plantIndex];
    
    // Update reminders
    plant.reminders = reminders.map((reminder: any) => ({
      _id: reminder._id || `reminder${Date.now()}_${Math.random()}`,
      type: reminder.type,
      frequency: reminder.frequency,
      lastDone: new Date(reminder.lastDone || Date.now()),
      nextDue: new Date(reminder.nextDue || (Date.now() + reminder.frequency * 24 * 60 * 60 * 1000)),
      isActive: reminder.isActive !== false
    }));
    
    plant.updatedAt = new Date();
    
    res.json({
      status: 'success',
      data: { reminders: plant.reminders }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating reminders'
    });
  }
};

export const getUpcomingReminders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { days = 7 } = req.query;
    
    const userPlants = mockUserPlants.filter(plant => plant.userId === userId);
    const upcomingReminders: any[] = [];
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + Number(days));
    
    userPlants.forEach(plant => {
      plant.reminders
        .filter(reminder => reminder.isActive && new Date(reminder.nextDue) <= cutoffDate)
        .forEach(reminder => {
          upcomingReminders.push({
            ...reminder,
            plantId: plant._id,
            plantName: plant.plantName,
            nickname: plant.nickname,
            isOverdue: new Date(reminder.nextDue) < new Date()
          });
        });
    });
    
    // Sort by due date
    upcomingReminders.sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime());
    
    res.json({
      status: 'success',
      data: {
        reminders: upcomingReminders,
        count: upcomingReminders.length,
        overdueCount: upcomingReminders.filter(r => r.isOverdue).length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching upcoming reminders'
    });
  }
};
