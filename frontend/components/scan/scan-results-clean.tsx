"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  DownloadCloud, 
  Share2, 
  Leaf, 
  Beaker, 
  Clock, 
  AlertCircle, 
  Info,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  FileText,
  Heart,
  Bot
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { ScanResult, ScanDetectionResult } from '@/lib/api-service';
import { getLocalizedProperty, isPlantHealthy } from '@/lib/utils';
import PlantDiseaseChatbot from '@/components/chat/plant-disease-chatbot';
import ChatTriggerButton from '@/components/chat/chat-trigger-button';
import SaveScanButton from './save-scan-button';

interface ScanResultsProps {
  results: ScanResult;
  image: string | null;
}

const ScanResults = ({ results, image }: ScanResultsProps) => {
  const t = useTranslations('scanResults');
  const locale = useLocale();
  const [selectedDetection, setSelectedDetection] = useState<ScanDetectionResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatbotReady, setIsChatbotReady] = useState(false);

  // Set primary detection as default selected
  useEffect(() => {
    if (results.primaryDetection && results.detections.length > 0) {
      setSelectedDetection(results.primaryDetection);
      // Reset chatbot ready state first
      setIsChatbotReady(false);
      // Set chatbot as ready after a short delay to ensure proper initialization
      const timer = setTimeout(() => {
        setIsChatbotReady(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // No valid scan results, chatbot not ready
      setIsChatbotReady(false);
    }
  }, [results.primaryDetection, results.detections.length]);

  const displayDetection = selectedDetection || results.primaryDetection || results.detections[0];
  const confidencePercent = displayDetection ? parseFloat(displayDetection.detection.confidence) : 0;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (confidence >= 40) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="space-y-6">
      {/* Chat Components */}
      {displayDetection && (
        <PlantDiseaseChatbot
          scanResults={displayDetection}
          isOpen={isChatOpen}
          onToggle={toggleChat}
        />
      )}
      
      <ChatTriggerButton
        onToggle={toggleChat}
        isOpen={isChatOpen}
        hasScanResults={isChatbotReady}
      />

      {/* AI Ready Indicator */}
      {!isChatbotReady && results && results.detections.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <span className="text-blue-800 dark:text-blue-200 font-medium">Preparing AI Specialist...</span>
          </div>
        </div>
      )}
      
      {isChatbotReady && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 dark:text-green-200 font-medium">AI Specialist Ready - Ask questions about your plant's condition</span>
          </div>
        </div>
      )}
      
      {results && results.detections.length === 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">No plant conditions detected - AI Specialist not available</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Sidebar: Compact Detection Results */}
        <div className="xl:col-span-3 space-y-4">
          {/* Mobile Collapsible Header */}
          <details className="xl:hidden">
            <summary className="cursor-pointer bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Detection Results</h3>
                <Badge variant="outline" className="text-xs">
                  {results.detections.length} found
                </Badge>
              </div>
            </summary>
            <div className="mt-4 space-y-4">
              {/* Mobile Image Section */}
              {image && (
                <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="relative aspect-square">
                    <Image src={image} alt="Analyzed plant" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-3 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-700 dark:to-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Analyzed Image</span>
                      <Badge variant="outline" className="text-xs">AI Processed</Badge>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mobile Detection Results */}
              <div className="space-y-3">
                {results.detections.map((detection, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      (selectedDetection && selectedDetection.name === detection.name) ||
                      (!selectedDetection && index === 0)
                        ? "border-primary/30 bg-primary/5"
                        : "border-slate-200 hover:border-primary/20 hover:bg-slate-50/50"
                    }`}
                    onClick={() => {
                      setSelectedDetection(detection);
                      setActiveTab("overview");
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                        {getLocalizedProperty(detection.name, locale)}
                      </span>
                      <Badge variant="outline" className={`text-xs flex-shrink-0 ${getConfidenceColor(parseFloat(detection.detection.confidence))}`}>
                        {parseFloat(detection.detection.confidence).toFixed(1)}%
                      </Badge>
                    </div>
                    {(selectedDetection && selectedDetection.name === detection.name) ||
                     (!selectedDetection && index === 0) ? (
                      <Badge className="bg-primary text-primary-foreground text-xs w-full justify-center">
                        {selectedDetection && selectedDetection.name === detection.name ? "Selected" : "Primary"}
                      </Badge>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </details>

          {/* Desktop Layout - Compact Sidebar */}
          <div className="hidden xl:block space-y-4">
            {/* Image Section */}
            {image && (
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <Image src={image} alt="Analyzed plant" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-3 bg-gradient-to-r from-slate-50 to-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Analyzed Image</span>
                    <Badge variant="outline" className="text-xs">AI Processed</Badge>
                  </div>
                </div>
              </div>
            )}
            
            {/* Compact Detection Results */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 text-base">Detections</h3>
                  {selectedDetection && selectedDetection.name !== results.primaryDetection?.name && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDetection(null);
                        setActiveTab("overview");
                      }}
                      className="text-xs h-7 px-2"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {results.detections.map((detection, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        (selectedDetection && selectedDetection.name === detection.name) ||
                        (!selectedDetection && index === 0)
                          ? "border-primary/30 bg-primary/5"
                          : "border-slate-200 hover:border-primary/20 hover:bg-slate-50/50"
                      }`}
                      onClick={() => {
                        setSelectedDetection(detection);
                        setActiveTab("overview");
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900 line-clamp-2">
                          {getLocalizedProperty(detection.name, locale)}
                        </span>
                        <Badge variant="outline" className={`text-xs flex-shrink-0 ${getConfidenceColor(parseFloat(detection.detection.confidence))}`}>
                          {parseFloat(detection.detection.confidence).toFixed(1)}%
                        </Badge>
                      </div>
                      {(selectedDetection && selectedDetection.name === detection.name) ||
                       (!selectedDetection && index === 0) ? (
                        <Badge className="bg-primary text-primary-foreground text-xs w-full justify-center">
                          {selectedDetection && selectedDetection.name === detection.name ? "Selected" : "Primary"}
                        </Badge>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side: Main Content Area */}
        {results.detections.length > 0 ? (
          <div className="xl:col-span-9 space-y-4 lg:space-y-6">
            {/* Detection Summary Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                        {getLocalizedProperty(displayDetection.name, locale)}
                      </h2>
                      {(selectedDetection && selectedDetection.name !== results.primaryDetection?.name) && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600 text-lg max-w-2xl">
                      {getLocalizedProperty(displayDetection.description, locale)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">{confidencePercent.toFixed(1)}%</div>
                        <div className="text-sm text-slate-500">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">
                          {isPlantHealthy({name: displayDetection.name}) ? 'Healthy' : 'Diseased'}
                        </div>
                        <div className="text-sm text-slate-500">Status</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">
                          {getLocalizedProperty(displayDetection.plantType, locale)}
                        </div>
                        <div className="text-sm text-slate-500">Plant Type</div>
                      </div>
                    </div>
                    <SaveScanButton 
                      selectedDetection={displayDetection} 
                      imageUrl={(results as any).imageUrl} 
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs Section */}
            <Card className="border-0 shadow-lg h-[600px] lg:h-[700px] 2xl:h-[800px]">
              <CardHeader className="pb-4 border-b border-slate-200">
                <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full h-full">
                  {/* Horizontal Scrollable Tabs */}
                  <div className="overflow-x-auto">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
                      <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 rounded-lg transition-all"
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="treatments"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 rounded-lg transition-all"
                      >
                        <Beaker className="h-4 w-4 mr-2" />
                        Treatments
                      </TabsTrigger>
                      <TabsTrigger
                        value="recommendations"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 rounded-lg transition-all"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Recommendations
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
              </CardHeader>
              
              <div className="p-6 h-full overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    {/* Symptoms Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-blue-900">Symptoms</h3>
                      </div>
                      <ul className="space-y-3">
                        {displayDetection.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-start gap-3 text-blue-800">
                            <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-lg">{getLocalizedProperty(symptom, locale)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Plant Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Leaf className="h-6 w-6 text-green-600" />
                          <h3 className="text-xl font-semibold text-green-900">Plant Type</h3>
                        </div>
                        <p className="text-lg text-green-800">
                          {getLocalizedProperty(displayDetection.plantType, locale)}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <TrendingUp className="h-6 w-6 text-purple-600" />
                          <h3 className="text-xl font-semibold text-purple-900">Detection Details</h3>
                        </div>
                        <div className="space-y-2 text-purple-800">
                          <p><span className="font-medium">Confidence:</span> {confidencePercent}%</p>
                          <p><span className="font-medium">Status:</span> {isPlantHealthy({name: displayDetection.name}) ? 'Healthy' : 'Disease Detected'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Clock className="h-6 w-6 text-orange-600" />
                          <h3 className="text-xl font-semibold text-orange-900">Analysis Time</h3>
                        </div>
                        <div className="space-y-2 text-orange-800">
                          <p><span className="font-medium">Detected:</span> {displayDetection.detection.detectedAt ? new Date(displayDetection.detection.detectedAt).toLocaleString() : 'Just now'}</p>
                          <p><span className="font-medium">Model:</span> AI v2.1</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="h-6 w-6 text-slate-600" />
                        <h3 className="text-xl font-semibold text-slate-900">Description</h3>
                      </div>
                      <p className="text-slate-700 text-lg leading-relaxed">
                        {getLocalizedProperty(displayDetection.description, locale)}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="treatments" className="mt-0">
                    <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2">
                      {displayDetection.treatments.map((treatment, index) => (
                        <Card key={index} className="border-slate-200 min-w-[400px] flex-shrink-0">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl">
                              <div className="p-3 bg-blue-100 rounded-full">
                                <Beaker className="h-6 w-6 text-blue-600" />
                              </div>
                              {getLocalizedProperty(treatment.name, locale)}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <div className="bg-blue-50 rounded-lg p-6">
                                <h4 className="font-semibold mb-4 text-blue-900 text-lg">Treatment Description</h4>
                                <p className="text-blue-800 text-lg leading-relaxed">
                                  {getLocalizedProperty(treatment.description, locale)}
                                </p>
                              </div>
                              
                              <div className="bg-green-50 rounded-lg p-6">
                                <h4 className="font-semibold mb-4 text-green-900 text-lg">Treatment Steps</h4>
                                <ol className="space-y-3 text-green-800">
                                  {treatment.steps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="flex items-start gap-3">
                                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                        {stepIndex + 1}
                                      </span>
                                      <span className="text-lg">{getLocalizedProperty(step, locale)}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="mt-0 h-full">
                    <div className="h-full overflow-y-auto pr-2">
                      {/* Real Recommendations from API */}
                      {displayDetection.recommendations && displayDetection.recommendations.length > 0 ? (
                        <Card className="border-slate-200">
                          <CardHeader className="sticky top-0 bg-white z-10 border-b">
                            <CardTitle className="flex items-center gap-3 text-xl">
                              <div className="p-3 bg-blue-100 rounded-full">
                                <Shield className="h-6 w-6 text-blue-600" />
                              </div>
                              Expert Recommendations
                              <Badge variant="outline" className="ml-auto">
                                {displayDetection.recommendations.length} tips
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="max-h-[400px] overflow-y-auto">
                              <div className="p-6 space-y-4">
                                {displayDetection.recommendations.map((recommendation, index) => (
                                  <div key={index} className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                                    <div className="flex items-start gap-3">
                                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </span>
                                      <p className="text-blue-800 text-base leading-relaxed">
                                        {getLocalizedProperty(recommendation, locale)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="border-slate-200">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl">
                              <div className="p-3 bg-gray-100 rounded-full">
                                <Shield className="h-6 w-6 text-gray-600" />
                              </div>
                              General Plant Care
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-gray-50 rounded-lg p-6">
                              <p className="text-gray-700 text-lg mb-6">No specific recommendations available for this condition.</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white rounded-lg border">
                                  <div className="text-xl font-bold text-gray-600 mb-2">Watering</div>
                                  <p className="text-sm text-gray-700">Maintain consistent soil moisture</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg border">
                                  <div className="text-xl font-bold text-gray-600 mb-2">Light</div>
                                  <p className="text-sm text-gray-700">Ensure adequate sunlight</p>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg border">
                                  <div className="text-xl font-bold text-gray-600 mb-2">Nutrition</div>
                                  <p className="text-sm text-gray-700">Use balanced fertilizer</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>
        ) : (
          <div className="xl:col-span-9">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="text-slate-500">
                  <p className="text-lg">No plant conditions detected in the image.</p>
                  <p className="text-sm mt-2">Please try uploading a different image or ensure the plant is clearly visible.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Help Section */}
      {results.detections.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-8 lg:p-12 border border-slate-200/50">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Need More Help?</h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
              Get detailed care guides, expert advice, and connect with our plant care community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-primary hover:bg-primary/90 shadow-lg px-8 py-3 text-lg"
                onClick={toggleChat}
              >
                <Bot className="h-5 w-5 mr-2" />
                Ask AI Specialist
              </Button>
              <Button variant="outline" className="hover:bg-white px-8 py-3 text-lg">
                View Detailed Guide
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanResults;
