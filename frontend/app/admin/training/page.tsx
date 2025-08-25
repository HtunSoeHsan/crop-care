'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TrainingModal } from '@/components/admin/TrainingModal';
import { TrainingJobCard } from '@/components/admin/TrainingJobCard';

interface TrainingJob {
  _id: string;
  datasetName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped';
  progress: number;
  accuracy?: number;
  startTime?: string;
  endTime?: string;
  epochs: number;
  createdAt: string;
}

export default function TrainingPage() {
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/training/jobs`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch training jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handleTrainingStart = () => {
    fetchJobs();
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading training jobs...</div>
      </div>
    );
  }

  const runningJobs = jobs.filter(job => job.status === 'running');
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const failedJobs = jobs.filter(job => job.status === 'failed');
  const pendingJobs = jobs.filter(job => job.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🤖 AI Model Training</h1>
              <p className="text-gray-600 mt-1">Train and manage plant disease detection models</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = '/admin/training/history'} 
                variant="outline" 
                className="px-6 py-3"
              >
                📊 View History
              </Button>
              <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                🚀 New Training Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 text-blue-600">📊</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 text-green-600">⚡</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Running</p>
                <p className="text-2xl font-bold text-green-600">{runningJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <div className="w-6 h-6 text-emerald-600">✅</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-emerald-600">{completedJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <div className="w-6 h-6 text-red-600">❌</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedJobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Training Jobs Sections */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">No Training Jobs Yet</h3>
            <p className="text-gray-600 mb-6">Start your first training session to begin building AI models for plant disease detection</p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
              🚀 Start First Training
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Running Jobs */}
            {runningJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Running Training Sessions
                </h2>
                <div className="grid gap-4">
                  {runningJobs.map((job) => (
                    <TrainingJobCard key={job._id} job={job} onUpdate={fetchJobs} />
                  ))}
                </div>
              </div>
            )}

            {/* Pending Jobs */}
            {pendingJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Pending Jobs
                </h2>
                <div className="grid gap-4">
                  {pendingJobs.map((job) => (
                    <TrainingJobCard key={job._id} job={job} onUpdate={fetchJobs} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Jobs */}
            {completedJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
                  Completed Training Sessions
                </h2>
                <div className="grid gap-4">
                  {completedJobs.slice(0, 5).map((job) => (
                    <TrainingJobCard key={job._id} job={job} onUpdate={fetchJobs} />
                  ))}
                  {completedJobs.length > 5 && (
                    <div className="text-center py-4">
                      <Button variant="outline">View All {completedJobs.length} Completed Jobs</Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Failed Jobs */}
            {failedJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Failed Jobs
                </h2>
                <div className="grid gap-4">
                  {failedJobs.slice(0, 3).map((job) => (
                    <TrainingJobCard key={job._id} job={job} onUpdate={fetchJobs} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <TrainingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onTrainingStart={handleTrainingStart}
      />
    </div>
  );
}