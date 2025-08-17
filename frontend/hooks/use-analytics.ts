'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/lib/api-service';

export interface AnalyticsData {
  totalScans: number;
  healthyScans: number;
  diseaseScans: number;
  monthlyData: Array<{ name: string; scans: number }>;
  healthDistribution: Array<{ name: string; value: number }>;
  confidenceDistribution: Array<{ name: string; value: number }>;
  topDiseases: Array<{
    name: { en: string; my: string };
    count: number;
    classIndex: number;
  }>;
  averageConfidence: number;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = ApiService.getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api'}/analytics/scans`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics
  };
}