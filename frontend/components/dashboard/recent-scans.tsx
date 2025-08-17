'use client';

import dayjs from 'dayjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, AlertCircle, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useScanHistory, ScanHistoryItem } from '@/hooks/use-scan-history';
import { useLocale } from 'next-intl';
import { getLocalizedProperty } from '@/lib/utils';

interface RecentScansProps {
  limit?: number;
  className?: string;
}

export function RecentScans({ limit = 4, className }: RecentScansProps) {
  const { data, loading, error } = useScanHistory(1, limit);
  const locale = useLocale();

  const getHealthStatus = (isHealthy: boolean, confidence: string) => {
    const conf = parseFloat(confidence);
    if (isHealthy) {
      return { label: 'Healthy', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    } else if (conf > 80) {
      return { label: 'Disease', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
    } else {
      return { label: 'Review', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load recent scans</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.scans.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recent scans found</p>
            <p className="text-xs text-muted-foreground mt-1">Start scanning plants to see results here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.scans.map((scan: ScanHistoryItem) => {
            const healthStatus = getHealthStatus(scan.isHealthy, scan.confidence);
            
            return (
              <Card key={scan._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm truncate">
                        {getLocalizedProperty(scan.diseaseInfo.name, locale)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {scan.diseaseInfo.plantType ? getLocalizedProperty(scan.diseaseInfo.plantType, locale) : 'Unknown Plant'}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {dayjs(scan.createdAt).format('MMM DD')}
                      </span>
                      <Badge className={`text-xs ${healthStatus.color}`}>
                        {healthStatus.label}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Confidence: {parseFloat(scan.confidence).toFixed(1)}%
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            {getLocalizedProperty(scan.diseaseInfo.name, locale)}
                            <Badge className={healthStatus.color}>
                              {healthStatus.label}
                            </Badge>
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Scan Date</p>
                              <p className="text-sm">{dayjs(scan.createdAt).format('MMMM DD, YYYY [at] hh:mm A')}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                              <p className="text-sm font-semibold">{parseFloat(scan.confidence).toFixed(1)}%</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                            <p className="text-sm">{getLocalizedProperty(scan.diseaseInfo.description, locale)}</p>
                          </div>

                          {scan.diseaseInfo.symptoms && scan.diseaseInfo.symptoms.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Symptoms</p>
                              <ul className="text-sm space-y-1">
                                {scan.diseaseInfo.symptoms.slice(0, 5).map((symptom, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                    {getLocalizedProperty(symptom, locale)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {scan.diseaseInfo.recommendations && scan.diseaseInfo.recommendations.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Recommendations</p>
                              <ul className="text-sm space-y-1">
                                {scan.diseaseInfo.recommendations.slice(0, 3).map((recommendation, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    {getLocalizedProperty(recommendation, locale)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}