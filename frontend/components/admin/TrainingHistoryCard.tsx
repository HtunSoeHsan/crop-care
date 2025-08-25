'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  batchSize: number;
  learningRate: number;
  logs?: string[];
  createdAt: string;
}

interface TrainingHistoryCardProps {
  job: TrainingJob;
  onUpdate: () => void;
}

export function TrainingHistoryCard({ job, onUpdate }: TrainingHistoryCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'stopped': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return '⚡';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'stopped': return '⏹️';
      default: return '⏳';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDuration = () => {
    if (!job.startTime) return 'N/A';
    const start = new Date(job.startTime);
    const end = job.endTime ? new Date(job.endTime) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <>
      <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-lg">{job.datasetName}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {getStatusIcon(job.status)} {job.status.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <div>Job ID: {job._id}</div>
              <div>Created: {formatDate(job.createdAt)}</div>
              {job.startTime && <div>Started: {formatDate(job.startTime)}</div>}
              {job.endTime && <div>Completed: {formatDate(job.endTime)}</div>}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
              📊 Details
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowLogs(true)}>
              📋 Logs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Progress</div>
            <div className="font-medium">{job.progress}%</div>
          </div>
          <div>
            <div className="text-gray-500">Accuracy</div>
            <div className="font-medium">
              {job.accuracy ? `${(job.accuracy * 100).toFixed(2)}%` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Epochs</div>
            <div className="font-medium">{job.epochs}</div>
          </div>
          <div>
            <div className="text-gray-500">Batch Size</div>
            <div className="font-medium">{job.batchSize}</div>
          </div>
          <div>
            <div className="text-gray-500">Duration</div>
            <div className="font-medium">{getDuration()}</div>
          </div>
        </div>

        {job.status === 'running' && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Training Job Details - {job.datasetName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Job Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>ID:</strong> {job._id}</div>
                  <div><strong>Dataset:</strong> {job.datasetName}</div>
                  <div><strong>Status:</strong> {job.status}</div>
                  <div><strong>Progress:</strong> {job.progress}%</div>
                  <div><strong>Created:</strong> {formatDate(job.createdAt)}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Training Parameters</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Epochs:</strong> {job.epochs}</div>
                  <div><strong>Batch Size:</strong> {job.batchSize}</div>
                  <div><strong>Learning Rate:</strong> {job.learningRate}</div>
                  <div><strong>Accuracy:</strong> {job.accuracy ? `${(job.accuracy * 100).toFixed(2)}%` : 'N/A'}</div>
                  <div><strong>Duration:</strong> {getDuration()}</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logs Modal */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Training Logs - {job.datasetName}</DialogTitle>
          </DialogHeader>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {job.logs && job.logs.length > 0 ? (
              job.logs.map((log, index) => (
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