import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getLocalizedProperty } from '@/lib/utils';
import { useLocale } from 'next-intl';

const foods = [
  {
    name: "Blueberries",
    category: "Fruits",
    image: "https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    benefits: ["Antioxidants", "Brain Health", "Heart Health"],
    nutrients: ["Vitamin C", "Vitamin K", "Manganese", "Fiber"]
  },
  {
    name: "Kale",
    category: "Vegetables",
    image: "https://images.pexels.com/photos/539431/pexels-photo-539431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    benefits: ["Anti-inflammatory", "Eye Health", "Detoxification"],
    nutrients: ["Vitamin A", "Vitamin K", "Vitamin C", "Calcium"]
  },
  {
    name: "Salmon",
    category: "Protein",
    image: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    benefits: ["Heart Health", "Brain Function", "Reduces Inflammation"],
    nutrients: ["Omega-3", "Protein", "B Vitamins", "Selenium"]
  },
  {
    name: "Quinoa",
    category: "Grains",
    image: "https://images.pexels.com/photos/7439169/pexels-photo-7439169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    benefits: ["Complete Protein", "Digestive Health", "Blood Sugar Control"],
    nutrients: ["Protein", "Fiber", "Magnesium", "Iron"]
  },
  {
    name: "Avocado",
    category: "Fruits",
    image: "https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    benefits: ["Heart Health", "Weight Management", "Nutrient Absorption"],
    nutrients: ["Healthy Fats", "Fiber", "Potassium", "Vitamin E"]
  },
  {
    name: "Turmeric",
    category: "Herbs & Spices",
    image: "https://images.pexels.com/photos/4198818/pexels-photo-4198818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    benefits: ["Anti-inflammatory", "Antioxidant", "Brain Function"],
    nutrients: ["Curcumin", "Manganese", "Iron", "Vitamin B6"]
  }
];

const PopularHealthyFoods = () => {
  const locale = useLocale();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Popular Healthy Foods</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <Image
                src={food.image}
                alt={getLocalizedProperty(food.name, locale)}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {getLocalizedProperty(food.category, locale)}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">{getLocalizedProperty(food.name, locale)}</h3>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Key Benefits:</h4>
                <div className="flex flex-wrap gap-1">
                  {food.benefits.map((benefit, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {getLocalizedProperty(benefit, locale)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Key Nutrients:</h4>
                <div className="flex flex-wrap gap-1">
                  {food.nutrients.map((nutrient, idx) => (
                    <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                      {getLocalizedProperty(nutrient, locale)}
                    </span>
                  ))}
                </div>
              </div>

              <Link href={`/foods/${getLocalizedProperty(food.name, locale).toLowerCase()}`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopularHealthyFoods;