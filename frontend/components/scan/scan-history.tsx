'use client';

import { useState, useEffect } from 'react';
import { ApiService, ScanHistoryItem } from '@/lib/api-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, History } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ScanHistoryProps {
  limit?: number;
  showHeader?: boolean;
}

export default function ScanHistory({ limit = 5, showHeader = true }: ScanHistoryProps) {
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentScans = async () => {
      try {
        const response = await ApiService.getScanHistory(1, limit);
        setScanHistory(response.data.scans);
      } catch (error) {
        console.error('Failed to fetch scan history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentScans();
  }, [limit]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading scan history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Scans
          </CardTitle>
          {scanHistory.length > 0 && (
            <Link href="/scan-history">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          )}
        </CardHeader>
      )}
      <CardContent className={showHeader ? '' : 'p-6'}>
        {scanHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No scan history found</p>
            <Link href="/scan">
              <Button size="sm">Start Scanning</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {scanHistory.map((scan) => (
              <div key={scan._id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'}${scan.imageUrl}`}
                    alt="Scanned plant"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {scan.diseaseInfo.name.en}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scan.isHealthy 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {Number(scan.confidence).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}