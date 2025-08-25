'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TrainingJob {
  _id: string;
  datasetName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped';
  progress: number;
  accuracy?: number;
  startTime?: string;
  endTime?: string;
  epochs: number;
  logs?: string[];
  createdAt: string;
}

interface TrainingJobCardProps {
  job: TrainingJob;
  onUpdate: () => void;
}

export function TrainingJobCard({ job, onUpdate }: TrainingJobCardProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'stopped': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'stopped': return '⏹️';
      default: return '⏳';
    }
  };

  const handleStop = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
      await fetch(`${API_URL}/training/stop/${job._id}`, {
        method: 'POST'
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to stop training:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/training/jobs/${job._id}`);
      const data = await response.json();
      setLogs(data.logs || []);
      setShowLogs(true);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDuration = () => {
    if (!job.startTime) return null;
    const start = new Date(job.startTime);
    const end = job.endTime ? new Date(job.endTime) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <>
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{job.datasetName}</h3>
            <p className="text-sm text-gray-500">Created: {formatDate(job.createdAt)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
              {getStatusIcon(job.status)} {job.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500">Progress</div>
            <div className="font-medium">{job.progress}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Epochs</div>
            <div className="font-medium">{job.epochs}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Accuracy</div>
            <div className="font-medium">
              {job.accuracy ? `${(job.accuracy * 100).toFixed(2)}%` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Duration</div>
            <div className="font-medium">{getDuration() || 'N/A'}</div>
          </div>
        </div>

        {job.status === 'running' && (
          <div className="mb-4">
            <Progress value={job.progress} className="h-2" />
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
          >
            📋 View Logs
          </Button>
          
          {job.status === 'running' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleStop}
            >
              ⏹️ Stop Training
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Training Logs - {job.datasetName}</DialogTitle>
          </DialogHeader>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            ) : (
              <div>No logs available</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}