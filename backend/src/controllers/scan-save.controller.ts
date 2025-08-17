import { Request, Response } from 'express';
import ScanHistory from '../models/ScanHistory';

export const saveScanResult = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { results } = req.body;
    console.log('Received scan results:', results);
    console.log("scan user:", req.user)
    console.log("req.body:", req.body)
    if (!results || !Array.isArray(results) || results.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid scan results'
      });
    }

    const primaryResult = results[0];
    const isHealthy = primaryResult.name.en.toLowerCase().includes('healthy');
    const confidence = parseFloat(primaryResult.detection.confidence);

    const scanHistory = new ScanHistory({
      userId,
      // imageUrl,
      // imagePath: imagePath || '',
      results: results.map((result: any) => ({
        classIndex: result.classIndex,
        name: result.name,
        confidence: result.detection.confidence,
        description: result.description,
        symptoms: result.symptoms,
        plantType: result.plantType,
        treatments: result.treatments
      })),
      primaryResult: {
        classIndex: primaryResult.classIndex,
        name: primaryResult.name,
        confidence: primaryResult.detection.confidence
      },
      isHealthy,
      confidence
    });

    await scanHistory.save();

    res.json({
      status: 'success',
      message: 'Scan result saved successfully',
      data: { scanId: scanHistory._id }
    });
  } catch (error) {
    console.error('Error saving scan result:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error saving scan result'
    });
  }
};