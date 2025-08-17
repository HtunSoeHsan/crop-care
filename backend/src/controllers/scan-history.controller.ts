import { Request, Response } from 'express';
import ScanHistory from '../models/ScanHistory';
import Disease from '../models/Disease';
import fs from 'fs';

export const getScanHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const scanHistory = await ScanHistory.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Fetch disease information for each scan
    const enrichedScans = await Promise.all(
      scanHistory.map(async (scan) => {
        const diseaseInfo = await Disease.findOne({ classIndex: scan.classIndex });
        
        return {
          _id: scan._id,
          userId: scan.userId,
          classIndex: scan.classIndex,
          confidence: scan.confidence,
          isHealthy: scan.isHealthy,
          createdAt: scan.createdAt,
          updatedAt: scan.updatedAt,
          diseaseInfo: diseaseInfo || {
            name: { en: 'Unknown Disease', my: 'Penyakit Tidak Diketahui' },
            description: { en: 'Disease information not found', my: 'Maklumat penyakit tidak dijumpai' }
          }
        };
      })
    );

    const total = await ScanHistory.countDocuments({ userId });

    res.json({
      status: 'success',
      data: {
        scans: enrichedScans,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching scan history:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching scan history'
    });
  }
};

export const deleteScanHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { scanId } = req.params;

    const scanHistory = await ScanHistory.findOne({ _id: scanId, userId });

    if (!scanHistory) {
      return res.status(404).json({
        status: 'error',
        message: 'Scan history not found'
      });
    }

    await ScanHistory.findByIdAndDelete(scanId);

    res.json({
      status: 'success',
      message: 'Scan history deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scan history:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting scan history'
    });
  }
};