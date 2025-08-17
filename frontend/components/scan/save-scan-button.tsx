'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Check } from 'lucide-react';
import { ApiService, ScanResult } from '@/lib/api-service';
import { useToast } from '@/hooks/use-toast';

interface SaveScanButtonProps {
  selectedDetection: any;
  imageUrl?: string;
}

export default function SaveScanButton({ selectedDetection, imageUrl }: SaveScanButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  console.log("selectedDetection:", selectedDetection, imageUrl)
  const handleSave = async () => {
    try {
      setIsSaving(true);

      await ApiService.saveScanResult([selectedDetection], imageUrl || '');
      
      setIsSaved(true);
      toast({
        title: 'Success',
        description: 'Selected plant disease information saved to your history',
      });
    } catch (error) {
      console.log("error:", error)
      toast({
        title: 'Error',
        description: 'Failed to save scan result',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaved) {
    return (
      <Button
        disabled
        className="bg-green-600 text-white px-6 py-3 gap-2"
      >
        <Check className="h-5 w-5" />
        Saved
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSave}
      disabled={isSaving}
      variant="outline"
      className="px-6 py-3 gap-2"
    >
      <Save className="h-5 w-5" />
      {isSaving ? 'Saving...' : 'Save Result'}
    </Button>
  );
}