'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useScanHistory } from '@/hooks/use-scan-history';

interface DashboardStatsProps {
  className?: string;
}

export function DashboardStats({ className }: DashboardStatsProps) {
  const { data, loading } = useScanHistory(1, 100); // Get more data for stats
  const [stats, setStats] = useState({
    totalScans: 0,
    healthyScans: 0,
    diseaseDetected: 0,
    averageConfidence: 0,
    recentScans: 0
  });

  useEffect(() => {
    if (data?.scans) {
      const scans = data.scans;
      const totalScans = scans.length;
      const healthyScans = scans.filter(scan => scan.isHealthy).length;
      const diseaseDetected = totalScans - healthyScans;
      
      const totalConfidence = scans.reduce((sum, scan) => sum + parseFloat(scan.confidence), 0);
      const averageConfidence = totalScans > 0 ? totalConfidence / totalScans : 0;
      
      // Recent scans (last 7 days)
      const sevenDaysAgo = dayjs().subtract(7, 'day');
      const recentScans = scans.filter(scan => 
        dayjs(scan.createdAt).isAfter(sevenDaysAgo)
      ).length;

      setStats({
        totalScans,
        healthyScans,
        diseaseDetected,
        averageConfidence,
        recentScans
      });
    }
  }, [data]);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${className}`}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
          <CardDescription className="text-3xl font-bold">{stats.totalScans}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {stats.recentScans} in the last 7 days
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Healthy Plants</CardTitle>
          <CardDescription className="text-3xl font-bold">{stats.healthyScans}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {stats.totalScans > 0 ? Math.round((stats.healthyScans / stats.totalScans) * 100) : 0}% of total scans
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Diseases Detected</CardTitle>
          <CardDescription className="text-3xl font-bold">{stats.diseaseDetected}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {stats.totalScans > 0 ? Math.round((stats.diseaseDetected / stats.totalScans) * 100) : 0}% of total scans
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Confidence</CardTitle>
          <CardDescription className="text-3xl font-bold">
            {stats.averageConfidence.toFixed(1)}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Detection accuracy rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
}