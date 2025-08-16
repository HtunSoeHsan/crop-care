"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronUp,
  Leaf,
  Beaker,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from '@/components/ui/badge';
import { getLocalizedProperty } from '@/lib/utils';
import { useLocale } from 'next-intl';

const medicines = {
  organic: [
    {
      id: "neem-oil",
      name: "Neem Oil",
      type: "Organic",
      category: "Fungicide, Insecticide",
      active_ingredient: "Azadirachtin",
      application: "Foliar spray",
      frequency: "Every 7-14 days",
      precautions: "Apply in early morning or evening. Avoid spraying during hot sunny conditions.",
      waiting_period: "0 days",
      expiry: "2 years from manufacturing date",
      avoid: "Do not apply when temperatures exceed 85°F (29°C)",
      image: "https://images.pexels.com/photos/6231763/pexels-photo-6231763.jpeg",
      description: "A natural extract from neem tree seeds that acts as both a fungicide and insecticide. Effective against various plant diseases and pests while being safe for beneficial insects when dry.",
      suitable_for: ["Vegetables", "Fruits", "Ornamentals"],
      storage: "Store in a cool, dark place in an airtight container",
      environmental_impact: "Low environmental impact, biodegradable",
      certification: "OMRI Listed for organic use"
    },
    {
      id: "copper-fungicide",
      name: "Copper Fungicide",
      type: "Organic",
      category: "Fungicide",
      active_ingredient: "Copper octanoate",
      application: "Mix 0.5-2.0 tablespoons per gallon of water",
      frequency: "Every 7-10 days",
      precautions: "Wear protective equipment. May cause leaf burn if applied in hot weather.",
      waiting_period: "0 days",
      expiry: "3 years from manufacturing date",
      avoid: "Do not mix with other chemicals or apply during rain",
      image: "https://images.pexels.com/photos/5503270/pexels-photo-5503270.jpeg",
      description: "A copper-based fungicide that provides broad-spectrum disease control. Effective against many fungal and bacterial diseases.",
      suitable_for: ["Vegetables", "Fruits", "Ornamentals"],
      storage: "Store in a dry place away from direct sunlight",
      environmental_impact: "Moderate impact, can accumulate in soil",
      certification: "OMRI Listed for organic use"
    }
  ],
  conventional: [
    {
      id: "chlorothalonil",
      name: "Chlorothalonil",
      type: "Conventional",
      category: "Fungicide",
      active_ingredient: "Chlorothalonil",
      application: "Foliar spray",
      frequency: "Every 7-10 days",
      precautions: "Wear protective equipment. Do not apply in windy conditions.",
      waiting_period: "7 days",
      expiry: "4 years from manufacturing date",
      avoid: "Do not apply within 7 days of harvest. Avoid contact with skin and eyes.",
      image: "https://images.pexels.com/photos/6231713/pexels-photo-6231713.jpeg",
      description: "A broad-spectrum fungicide that prevents fungal diseases by inhibiting spore germination. Provides excellent protection against many plant diseases.",
      suitable_for: ["Vegetables", "Fruits", "Turf"],
      storage: "Store in original container in a locked storage area",
      environmental_impact: "Moderate to high impact, follow strict application guidelines",
      certification: "EPA Registered"
    },
    {
      id: "mancozeb",
      name: "Mancozeb",
      type: "Conventional",
      category: "Fungicide",
      active_ingredient: "Manganese ethylenebis",
      application: "2-3 tablespoons per gallon of water",
      frequency: "Every 7-10 days",
      precautions: "Use protective equipment. Apply in calm conditions.",
      waiting_period: "5 days",
      expiry: "3 years from manufacturing date",
      avoid: "Do not use on crops within 5 days of harvest. Avoid inhalation.",
      image: "https://images.pexels.com/photos/6231715/pexels-photo-6231715.jpeg",
      description: "A protective fungicide that controls many plant diseases. Works by preventing fungal spore germination and penetration into plant tissue.",
      suitable_for: ["Vegetables", "Fruits", "Ornamentals"],
      storage: "Store in a cool, dry place away from food and feedstuffs",
      environmental_impact: "Moderate impact, follow application guidelines carefully",
      certification: "EPA Registered"
    }
  ]
};

export default function MedicinesPage() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const locale = useLocale();

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredMedicines = [...medicines.organic, ...medicines.conventional]
    .filter(medicine =>
      (searchTerm === '' ||
        getLocalizedProperty(medicine.name, locale).toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (selectedTypes.length === 0 || selectedTypes.includes(medicine.type))
    );

  return (
    <div className="container py-12 space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Plant Medicine Database</h1>
        <p className="text-muted-foreground">
          Comprehensive information about organic and conventional plant disease treatments
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search medicines..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedTypes.includes('Organic') ? 'default' : 'outline'}
            onClick={() => toggleType('Organic')}
            className="gap-2"
          >
            <Leaf className="h-4 w-4" />
            Organic
          </Button>
          <Button
            variant={selectedTypes.includes('Conventional') ? 'default' : 'outline'}
            onClick={() => toggleType('Conventional')}
            className="gap-2"
          >
            <Beaker className="h-4 w-4" />
            Conventional
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredMedicines.map((medicine) => (
          <Card key={medicine.id}>
            <Collapsible
              open={expandedItems.includes(medicine.id)}
              onOpenChange={() => toggleExpanded(medicine.id)}
            >
              <div className="flex items-start gap-4 p-6">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={medicine.image}
                    alt={getLocalizedProperty(medicine.name, locale)}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {medicine.type === 'Organic' ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        <Leaf className="h-3 w-3 mr-1" />
                        Organic
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                        <Beaker className="h-3 w-3 mr-1" />
                        Conventional
                      </Badge>
                    )}
                    <Badge variant="outline">{medicine.category}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{getLocalizedProperty(medicine.name, locale)}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{getLocalizedProperty(medicine.description, locale)}</p>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {expandedItems.includes(medicine.id) ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Show More
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              <CollapsibleContent>
                <div className="px-6 pb-6 grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Application Details</h4>
                      <div className="text-sm grid gap-1">
                        <p><span className="font-medium">Active Ingredient:</span> {getLocalizedProperty(medicine.active_ingredient, locale)}</p>
                        <p><span className="font-medium">Application Method:</span> {getLocalizedProperty(medicine.application, locale)}</p>
                        <p><span className="font-medium">Frequency:</span> {getLocalizedProperty(medicine.frequency, locale)}</p>
                        <p><span className="font-medium">Waiting Period:</span> {getLocalizedProperty(medicine.waiting_period, locale)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Safety Information</h4>
                      <div className="text-sm grid gap-1">
                        <p><span className="font-medium">Precautions:</span> {getLocalizedProperty(medicine.precautions, locale)}</p>
                        <p><span className="font-medium">Things to Avoid:</span> {getLocalizedProperty(medicine.avoid, locale)}</p>
                        <p><span className="font-medium">Storage:</span> {getLocalizedProperty(medicine.storage, locale)}</p>
                        <p><span className="font-medium">Expiry:</span> {getLocalizedProperty(medicine.expiry, locale)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Additional Information</h4>
                    <div className="text-sm grid gap-1">
                      <p><span className="font-medium">Suitable For:</span> {medicine.suitable_for.map(item => getLocalizedProperty(item, locale)).join(', ')}</p>
                      <p><span className="font-medium">Environmental Impact:</span> {getLocalizedProperty(medicine.environmental_impact, locale)}</p>
                      <p><span className="font-medium">Certification:</span> {getLocalizedProperty(medicine.certification, locale)}</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link href={`/medicines/${medicine.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        View Full Details
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}