import { Request, Response } from 'express';
import ScanHistory from '../models/ScanHistory';
import Disease from '../models/Disease';

export const getScanAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    // Get all user scans
    const scans = await ScanHistory.find({ userId }).sort({ createdAt: -1 });
    
    // Monthly scan data (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const count = scans.filter(scan => {
        const scanDate = new Date(scan.createdAt);
        const scanKey = `${scanDate.getFullYear()}-${String(scanDate.getMonth() + 1).padStart(2, '0')}`;
        return scanKey === monthKey;
      }).length;
      
      monthlyData.push({
        name: date.toLocaleDateString('en', { month: 'short' }),
        scans: count
      });
    }
    
    // Health status distribution
    const healthyCount = scans.filter(scan => scan.isHealthy).length;
    const diseaseCount = scans.length - healthyCount;
    
    // Confidence distribution
    const confidenceRanges = { high: 0, medium: 0, low: 0 };
    scans.forEach(scan => {
      const confidence = parseFloat(scan.confidence);
      if (confidence >= 80) confidenceRanges.high++;
      else if (confidence >= 60) confidenceRanges.medium++;
      else confidenceRanges.low++;
    });
    
    // Top diseases detected
    const diseaseStats: { [key: number]: number } = {};
    scans.filter(scan => !scan.isHealthy).forEach(scan => {
      diseaseStats[scan.classIndex] = (diseaseStats[scan.classIndex] || 0) + 1;
    });
    
    const topDiseases = await Promise.all(
      Object.entries(diseaseStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(async ([classIndex, count]) => {
          const disease = await Disease.findOne({ classIndex: parseInt(classIndex) });
          return {
            name: disease?.name || { en: 'Unknown', my: 'Unknown' },
            count,
            classIndex: parseInt(classIndex)
          };
        })
    );
    
    res.json({
      status: 'success',
      data: {
        totalScans: scans.length,
        healthyScans: healthyCount,
        diseaseScans: diseaseCount,
        monthlyData,
        healthDistribution: [
          { name: 'Healthy', value: healthyCount },
          { name: 'Disease Detected', value: diseaseCount }
        ],
        confidenceDistribution: [
          { name: 'High (80-100%)', value: confidenceRanges.high },
          { name: 'Medium (60-79%)', value: confidenceRanges.medium },
          { name: 'Low (0-59%)', value: confidenceRanges.low }
        ],
        topDiseases,
        averageConfidence: scans.length > 0 
          ? scans.reduce((sum, scan) => sum + parseFloat(scan.confidence), 0) / scans.length 
          : 0
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching analytics data'
    });
  }
};