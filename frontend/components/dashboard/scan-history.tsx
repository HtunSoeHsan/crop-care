'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Calendar, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useScanHistory, ScanHistoryItem } from '@/hooks/use-scan-history';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from 'next-intl';
import { getLocalizedProperty } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ScanHistoryProps {
  limit?: number;
}

export function ScanHistory({ limit = 10 }: ScanHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error, refetch, deleteScan } = useScanHistory(currentPage, limit);
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const locale = useLocale();

  const handleDelete = async (scanId: string) => {
    try {
      setDeletingId(scanId);
      await deleteScan(scanId);
      toast({
        title: 'Success',
        description: 'Scan history deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete scan history',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getHealthStatus = (isHealthy: boolean, confidence: number) => {
    const conf = confidence;
    if (isHealthy) {
      return { label: 'Healthy', variant: 'default' as const, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    } else if (conf > 80) {
      return { label: 'Disease Detected', variant: 'destructive' as const, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
    } else {
      return { label: 'Needs Review', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load scan history</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  console.log(data);

  if (!data || data.scans.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground mb-4">
            <Calendar className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No scan history found</h3>
            <p>Start scanning plants to see your history here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scan History</h2>
          <p className="text-muted-foreground">
            {data.pagination.total} total scans
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {data.scans.map((scan: ScanHistoryItem) => {
          const healthStatus = getHealthStatus(scan.isHealthy, Number(scan.confidence));
          
          return (
            <Card key={scan._id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        {getLocalizedProperty(scan.diseaseInfo.name, locale)}
                      </h3>
                      <Badge className={healthStatus.color}>
                        {healthStatus.label}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {getLocalizedProperty(scan.diseaseInfo.description, locale)}
                    </p>
                    {scan.diseaseInfo.affectedCrops && (
                      <p className="text-sm text-muted-foreground">
                        Affected Crops: {getLocalizedProperty(scan.diseaseInfo.affectedCrops, locale)}
                      </p>
                    )}
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <p className="text-sm font-medium">
                      {dayjs(scan.createdAt).format('MMM DD, YYYY')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayjs(scan.createdAt).format('hh:mm A')}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                    <p className="text-lg font-semibold">{Number(scan.confidence).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Class Index</p>
                    <p className="text-lg font-semibold">{scan.classIndex}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold">
                      {scan.isHealthy ? 'Healthy' : 'Disease Detected'}
                    </p>
                  </div>
                </div>

                {scan.diseaseInfo.symptoms && scan.diseaseInfo.symptoms.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Symptoms</p>
                    <ul className="text-sm space-y-1">
                      {scan.diseaseInfo.symptoms.slice(0, 3).map((symptom, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                          {getLocalizedProperty(symptom, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
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
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Scan Date</p>
                            <p className="text-sm">{dayjs(scan.createdAt).format('MMMM DD, YYYY [at] hh:mm A')}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                            <p className="text-sm font-semibold">{Number(scan.confidence).toFixed(1)}%</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                          <p className="text-sm">{getLocalizedProperty(scan.diseaseInfo.description, locale)}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Affected Crops</p>
                          <p className="text-sm">{getLocalizedProperty(scan.diseaseInfo.affectedCrops, locale)}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Severity</p>
                          <Badge variant="outline">{scan.diseaseInfo.severity}</Badge>
                        </div>

                        {scan.diseaseInfo.symptoms && scan.diseaseInfo.symptoms.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Symptoms</p>
                            <ul className="text-sm space-y-2">
                              {scan.diseaseInfo.symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                                  {getLocalizedProperty(symptom, locale)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {scan.diseaseInfo.treatments && scan.diseaseInfo.treatments.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-3">Treatment Options</p>
                            <div className="space-y-4">
                              {scan.diseaseInfo.treatments.map((treatment, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <h4 className="font-medium mb-2">{getLocalizedProperty(treatment.name, locale)}</h4>
                                  <p className="text-sm text-muted-foreground mb-3">{getLocalizedProperty(treatment.description, locale)}</p>
                                  {treatment.steps && treatment.steps.length > 0 && (
                                    <div>
                                      <p className="text-sm font-medium mb-2">Steps:</p>
                                      <ol className="text-sm space-y-1">
                                        {treatment.steps.map((step, stepIndex) => (
                                          <li key={stepIndex} className="flex gap-2">
                                            <span className="text-muted-foreground">{stepIndex + 1}.</span>
                                            {getLocalizedProperty(step, locale)}
                                          </li>
                                        ))}
                                      </ol>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {scan.diseaseInfo.recommendations && scan.diseaseInfo.recommendations.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Recommendations</p>
                            <ul className="text-sm space-y-2">
                              {scan.diseaseInfo.recommendations.map((recommendation, index) => (
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
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={deletingId === scan._id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deletingId === scan._id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Scan History</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this scan? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(scan._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(data.pagination.pages, prev + 1))}
            disabled={currentPage === data.pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}