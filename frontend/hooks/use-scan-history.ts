'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/lib/api-service';

export interface ScanHistoryItem {
  _id: string;
  userId: string;
  classIndex: number;
  confidence: string;
  isHealthy: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  diseaseInfo: {
    name: { en: string; my: string };
    description: { en: string; my: string };
    symptoms: Array<{ en: string; my: string }>;
    affectedCrops: { en: string; my: string };
    treatments: Array<{
      name: { en: string; my: string };
      description: { en: string; my: string };
      steps: Array<{ en: string; my: string }>;
    }>;
    recommendations: Array<{ en: string; my: string }>;
    severity: string;
    classIndex: number;
  };
}

export interface ScanHistoryData {
  scans: ScanHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useScanHistory(page: number = 1, limit: number = 10) {
  const [data, setData] = useState<ScanHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScanHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getScanHistory(page, limit);
      console.log(response.data);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scan history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScanHistory();
  }, [page, limit]);

  const deleteScan = async (scanId: string) => {
    try {
      await ApiService.deleteScanHistory(scanId);
      // Refresh the data after deletion
      await fetchScanHistory();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete scan');
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchScanHistory,
    deleteScan
  };
}