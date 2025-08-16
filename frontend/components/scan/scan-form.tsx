"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Camera, AlertCircle, Leaf, MessageCircle } from 'lucide-react';
import ScanResults from '@/components/scan/scan-results-clean';
import { useTranslations } from 'next-intl';
import { ApiService, ScanResult } from '@/lib/api-service';
import { useChatbot } from '@/components/chat/chatbot-provider';

const ScanForm = () => {
  const t = useTranslations('scanForm');
  const { setScanResults, openChat } = useChatbot();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setResults(null);
      setScanResults(null); // Clear previous scan results
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    setResults(null);
    setScanResults(null); // Clear scan results
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ApiService.scanPlant(imageFile);
      console.log(result);
      setResults(result);
      
      // Set scan results for chatbot if primary detection exists
      if (result.primaryDetection) {
        setScanResults(result.primaryDetection);
      }
    } catch (error: any) {
      console.error('Error during plant scan:', error);
      setError(error.message || 'Failed to analyze plant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAI = () => {
    if (results?.primaryDetection) {
      openChat(results.primaryDetection);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">Plant Disease Detection</h2>
        <p className="text-slate-600 text-lg">Upload a clear photo of your plant to get instant AI-powered analysis</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="plant-image" className="text-lg font-semibold text-slate-900">{t('uploadPlantImage')}</Label>
          
          {!selectedImage ? (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-primary/50 transition-colors duration-300">
              <Input
                id="plant-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Label
                htmlFor="plant-image"
                className="flex flex-col items-center justify-center h-40 cursor-pointer group"
              >
                <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Upload className="h-12 w-12 text-primary" />
                </div>
                <p className="text-lg text-slate-700 mb-2 font-medium">
                  {t('dragAndDrop')}
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  {t('supportedFormats')}
                </p>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("plant-image")?.click()}
                  className="gap-2 px-8 py-3 text-base hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Camera className="h-5 w-5" />
                  {t('selectImage')}
                </Button>
              </Label>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
              <div className="relative aspect-video">
                <Image
                  src={selectedImage}
                  alt={t('selectedPlant')}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4 h-10 w-10 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleRemoveImage}
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-medium text-center">Image Selected - Ready for Analysis</p>
              </div>
            </div>
          )}
        </div>
        
        {selectedImage && !results && (
          <div className="flex justify-center">
            <Button
              type="submit"
              className="px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  {t('analyzingImage')}
                </>
              ) : (
                <>
                  <Leaf className="h-5 w-5 mr-3" />
                  {t('analyzePlant')}
                </>
              )}
            </Button>
          </div>
        )}
      </form>
      
      {error && (
        <div className="flex items-center gap-3 p-6 border border-destructive/20 bg-destructive/10 rounded-xl text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-base font-medium">{error}</p>
        </div>
      )}
      
      {results && (
        <div className="space-y-6">
          <ScanResults results={results} image={selectedImage} />
          
          {/* AI Chat Integration */}
          {results.primaryDetection && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    🤖 AI Assistant Ready
                  </h3>
                  <p className="text-green-700">
                    Get personalized advice about {results.primaryDetection.name.en} from our AI specialist
                  </p>
                </div>
                <Button
                  onClick={handleAskAI}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Ask AI
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanForm;