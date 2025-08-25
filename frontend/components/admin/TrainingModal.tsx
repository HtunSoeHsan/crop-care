'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Dataset {
  name: string;
  imageCount: number;
}

interface DatasetInfo {
  datasets: Dataset[];
  classIndices: { [key: string]: number };
  totalClasses: number;
}

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrainingStart: () => void;
}

export function TrainingModal({ isOpen, onClose, onTrainingStart }: TrainingModalProps) {
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [epochs, setEpochs] = useState(30);
  const [batchSize, setBatchSize] = useState(16);
  const [learningRate, setLearningRate] = useState(0.0001);
  const [useTransferLearning, setUseTransferLearning] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDatasets();
    }
  }, [isOpen]);

  const fetchDatasets = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/training/datasets`);
      const data = await response.json();
      setDatasetInfo(data);
    } catch (error) {
      console.error('Failed to fetch datasets:', error);
    }
  };

  const handleStartTraining = async () => {
    if (isMultiSelect && selectedDatasets.length === 0) return;
    if (!isMultiSelect && !selectedDataset) return;
    
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/training/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetName: isMultiSelect ? 'CUSTOM_DATASETS' : selectedDataset,
          selectedDatasets: isMultiSelect ? selectedDatasets : undefined,
          epochs,
          batchSize,
          learningRate,
          useTransferLearning
        })
      });

      if (response.ok) {
        onTrainingStart();
      }
    } catch (error) {
      console.error('Failed to start training:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center">
            🚀 Start New Training Session
          </DialogTitle>
          <p className="text-gray-600 mt-1">Configure and launch AI model training for plant disease detection</p>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Dataset Selection */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <div className="w-6 h-6 text-blue-600">📊</div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Dataset Selection</h3>
                <p className="text-sm text-gray-600">Choose the plant disease dataset for training</p>
              </div>
            </div>
            
            {datasetInfo ? (
              <div className="space-y-4">
                <div className="space-y-4">
                  {/* Selection Mode Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Selection Mode:</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => { setIsMultiSelect(false); setSelectedDatasets([]); }}
                        className={`px-3 py-1 rounded text-sm ${
                          !isMultiSelect ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Single
                      </button>
                      <button
                        onClick={() => { setIsMultiSelect(true); setSelectedDataset(''); }}
                        className={`px-3 py-1 rounded text-sm ${
                          isMultiSelect ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        🎯 Custom Multi-Select
                      </button>
                    </div>
                  </div>

                  {/* Train All Option */}
                  {!isMultiSelect && (
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedDataset === 'ALL_DATASETS'
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedDataset('ALL_DATASETS')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-lg text-green-700">🌟 Train All Datasets</div>
                        {selectedDataset === 'ALL_DATASETS' && <div className="text-green-500">✓</div>}
                      </div>
                      <div className="text-sm text-green-600">
                        Train on all {datasetInfo.totalClasses} disease classes with {datasetInfo.datasets.reduce((sum, d) => sum + d.imageCount, 0)} total images
                      </div>
                    </div>
                  )}

                  {/* Multi-Select Info */}
                  {isMultiSelect && selectedDatasets.length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-sm font-medium text-purple-800 mb-1">
                        🎯 Selected: {selectedDatasets.length} datasets
                      </div>
                      <div className="text-xs text-purple-600">
                        Total Images: {selectedDatasets.reduce((sum, name) => {
                          const dataset = datasetInfo.datasets.find(d => d.name === name);
                          return sum + (dataset?.imageCount || 0);
                        }, 0)}
                      </div>
                    </div>
                  )}
                  
                  {/* Individual Datasets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {datasetInfo.datasets.map((dataset) => {
                      const isSelected = isMultiSelect 
                        ? selectedDatasets.includes(dataset.name)
                        : selectedDataset === dataset.name;
                      
                      return (
                        <div
                          key={dataset.name}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            isSelected
                              ? isMultiSelect 
                                ? 'border-purple-500 bg-purple-50 shadow-md'
                                : 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => {
                            if (isMultiSelect) {
                              setSelectedDatasets(prev => 
                                prev.includes(dataset.name)
                                  ? prev.filter(name => name !== dataset.name)
                                  : [...prev, dataset.name]
                              );
                            } else {
                              setSelectedDataset(dataset.name);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm truncate">{dataset.name.replace(/_/g, ' ')}</div>
                            {isSelected && (
                              <div className={isMultiSelect ? 'text-purple-500' : 'text-blue-500'}>
                                {isMultiSelect ? '✓' : '✓'}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Index: {datasetInfo.classIndices[dataset.name]}</div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                              {dataset.imageCount} images
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{datasetInfo.totalClasses}</div>
                      <div className="text-xs text-gray-600">Classes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {datasetInfo.datasets.reduce((sum, d) => sum + d.imageCount, 0)}
                      </div>
                      <div className="text-xs text-gray-600">Total Images</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(datasetInfo.datasets.reduce((sum, d) => sum + d.imageCount, 0) / datasetInfo.totalClasses)}
                      </div>
                      <div className="text-xs text-gray-600">Avg/Class</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <div className="text-gray-600">Loading datasets...</div>
              </div>
            )}
          </div>

          {/* Training Configuration */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <div className="w-6 h-6 text-green-600">⚙️</div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Training Configuration</h3>
                <p className="text-sm text-gray-600">Set parameters for optimal model performance</p>
              </div>
            </div>

            {/* Transfer Learning Toggle */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-green-800">🚀 Transfer Learning</div>
                  <div className="text-sm text-green-700">Pre-trained model + Your Data (Currently unavailable)</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useTransferLearning}
                    onChange={(e) => setUseTransferLearning(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Epochs */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🔄</span>
                    <span className="font-medium">Epochs</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">{epochs}</span>
                </div>
                <input
                  type="range"
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full mb-3 accent-blue-600"
                  min="5"
                  max="100"
                  step="5"
                />
                <div className="text-xs text-gray-600">
                  Complete passes through dataset
                  <div className="mt-1 text-gray-500">
                    {epochs <= 15 ? '⚡ Fast' : epochs <= 50 ? '⚖️ Balanced' : '🎯 Thorough'}
                  </div>
                </div>
              </div>

              {/* Batch Size */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">📦</span>
                    <span className="font-medium">Batch Size</span>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">{batchSize}</span>
                </div>
                <input
                  type="range"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full mb-3 accent-green-600"
                  min="4"
                  max="64"
                  step="4"
                />
                <div className="text-xs text-gray-600">
                  Images per training step
                  <div className="mt-1 text-gray-500">
                    {batchSize <= 16 ? '💾 Low Memory' : batchSize <= 32 ? '⚖️ Balanced' : '🚀 High Speed'}
                  </div>
                </div>
              </div>

              {/* Learning Rate */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">⚡</span>
                    <span className="font-medium">Learning Rate</span>
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">{learningRate}</span>
                </div>
                <select
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md mb-3 text-sm"
                >
                  <option value={0.01}>0.01 - High 🔥</option>
                  <option value={0.001}>0.001 - Medium ✅</option>
                  <option value={0.0001}>0.0001 - Low 🛡️</option>
                  <option value={0.00001}>0.00001 - Very Low</option>
                </select>
                <div className="text-xs text-gray-600">
                  Learning step size
                  <div className="mt-1 text-gray-500">
                    {learningRate >= 0.001 ? '🚀 Fast Learning' : '🐌 Stable Learning'}
                  </div>
                </div>
              </div>
            </div>

            {/* Estimates */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800">⏱️ Training Time</div>
                <div className="text-lg font-bold text-blue-900">
                  {epochs <= 20 ? '15-30 min' : epochs <= 50 ? '30-60 min' : '1-2 hours'}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-800">💾 Memory Usage</div>
                <div className="text-lg font-bold text-purple-900">
                  {batchSize <= 16 ? '~2GB' : batchSize <= 32 ? '~4GB' : '~6GB+'}
                </div>
              </div>
            </div>
          </div>

          {/* Training Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <div className="w-6 h-6 text-blue-600">📋</div>
              </div>
              <h4 className="font-semibold text-lg">Training Summary</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Dataset</span>
                  <span className="font-medium">
                    {isMultiSelect 
                      ? `🎯 Custom (${selectedDatasets.length} selected)`
                      : selectedDataset === 'ALL_DATASETS' 
                        ? '🌟 All Datasets Combined' 
                        : selectedDataset?.replace(/_/g, ' ') || 'Not selected'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Classes</span>
                  <span className="font-medium">
                    {isMultiSelect ? selectedDatasets.length : datasetInfo?.totalClasses || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Images</span>
                  <span className="font-medium">
                    {isMultiSelect 
                      ? selectedDatasets.reduce((sum, name) => {
                          const dataset = datasetInfo?.datasets.find(d => d.name === name);
                          return sum + (dataset?.imageCount || 0);
                        }, 0)
                      : datasetInfo?.datasets.reduce((sum, d) => sum + d.imageCount, 0) || 0
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Transfer Learning</span>
                  <span className={`font-medium ${useTransferLearning ? 'text-green-600' : 'text-gray-500'}`}>
                    {useTransferLearning ? '✅ Enabled' : '❌ Disabled'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Epochs</span>
                  <span className="font-medium">{epochs}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Batch Size</span>
                  <span className="font-medium">{batchSize}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Learning Rate</span>
                  <span className="font-medium">{learningRate}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Expected Accuracy</span>
                  <span className="font-medium text-green-600">
                    {useTransferLearning ? '85-95%' : '75-85%'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-500">
              {(!selectedDataset && !isMultiSelect) && '⚠️ Please select a dataset to continue'}
              {(isMultiSelect && selectedDatasets.length === 0) && '⚠️ Please select at least one dataset to continue'}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} disabled={loading} className="px-6">
                Cancel
              </Button>
              <Button 
                onClick={handleStartTraining}
                disabled={(isMultiSelect ? selectedDatasets.length === 0 : !selectedDataset) || loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 text-white font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Starting Training...
                  </>
                ) : (
                  <>
                    🚀 Start Training Session
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}