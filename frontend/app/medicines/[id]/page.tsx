import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Leaf,
  Beaker,
  Clock,
  AlertCircle,
  AlertTriangle,
  ThermometerSun,
  Droplets,
  ShieldCheck,
  Sprout,
  BadgeInfo,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLocalizedProperty } from '@/lib/utils';
import { useLocale } from 'next-intl';

// Using the same medicine data from the list page
// In a real app, this would come from an API or database
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
      certification: "OMRI Listed for organic use",
      detailed_instructions: [
        "Shake well before use",
        "Mix 2-4 tablespoons per gallon of water",
        "Add a small amount of liquid soap as an emulsifier",
        "Test on a small area first",
        "Apply to all plant surfaces until dripping",
        "Reapply after rain"
      ],
      benefits: [
        "Controls multiple types of pests",
        "Safe for most beneficial insects when dry",
        "Can be used up to day of harvest",
        "Minimal risk of pest resistance",
        "Breaks down quickly in environment"
      ],
      common_uses: [
        "Powdery mildew control",
        "Aphid control",
        "Spider mite control",
        "Leaf spot diseases",
        "Preventive treatment"
      ]
    },
    // ... other medicines
  ],
  conventional: [
    // ... conventional medicines
  ]
};

const allMedicines = [...medicines.organic, ...medicines.conventional];

export async function generateStaticParams() {
  return allMedicines.map((medicine) => ({
    id: medicine.id,
  }));
}

export default async function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const medicine = allMedicines.find(m => m.id === id);
  const locale = useLocale();

  if (!medicine) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Medicine not found</h1>
          <Link href="/medicines">
            <Button>Return to Medicine List</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/medicines">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Medicines
          </Button>
        </Link>
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

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden border">
          <Image
            src={medicine.image}
            alt={getLocalizedProperty(medicine.name, locale)}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{getLocalizedProperty(medicine.name, locale)}</h1>
            <p className="text-lg text-muted-foreground">{getLocalizedProperty(medicine.description, locale)}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timing and Duration
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Application Frequency</span>
                <span>{getLocalizedProperty(medicine.frequency, locale)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Waiting Period</span>
                <span>{getLocalizedProperty(medicine.waiting_period, locale)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Expiry</span>
                <span>{getLocalizedProperty(medicine.expiry, locale)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <AlertCircle className="h-5 w-5" />
                Safety Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 mt-0.5 text-red-500" />
                <div>
                  <p className="font-medium">Precautions</p>
                  <p className="text-sm text-muted-foreground">{getLocalizedProperty(medicine.precautions, locale)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 mt-0.5 text-red-500" />
                <div>
                  <p className="font-medium">Things to Avoid</p>
                  <p className="text-sm text-muted-foreground">{getLocalizedProperty(medicine.avoid, locale)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Application Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {medicine.detailed_instructions.map((instruction, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{getLocalizedProperty(instruction, locale)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {medicine.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {getLocalizedProperty(benefit, locale)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5" />
              Common Uses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {medicine.common_uses.map((use, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {getLocalizedProperty(use, locale)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeInfo className="h-5 w-5" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Suitable For</p>
              <p className="text-sm text-muted-foreground">{medicine.suitable_for.map(item => getLocalizedProperty(item, locale)).join(', ')}</p>
            </div>
            <div>
              <p className="font-medium">Environmental Impact</p>
              <p className="text-sm text-muted-foreground">{getLocalizedProperty(medicine.environmental_impact, locale)}</p>
            </div>
            <div>
              <p className="font-medium">Certification</p>
              <p className="text-sm text-muted-foreground">{getLocalizedProperty(medicine.certification, locale)}</p>
            </div>
            <div>
              <p className="font-medium">Storage</p>
              <p className="text-sm text-muted-foreground">{getLocalizedProperty(medicine.storage, locale)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}