import HealthyFood from '../models/HealthyFood';

const healthyFoodData = [
  {
    name: { en: 'Spinach', my: 'ဟင်းနုနွယ်' },
    category: 'leafy-greens',
    nutrients: ['iron', 'vitamin-k', 'folate', 'antioxidants', 'vitamin-c'],
    benefits: { 
      en: 'Supports bone health and immune system, rich in iron and antioxidants',
      my: 'အရိုးကျန်းမာရေးနှင့် ကိုယ်ခံအားစနစ်ကို ထောက်ပံ့ပေးသည်၊ သံဓာတ်နှင့် အန်တီအောက်ဆီဒင့်ကြွယ်ဝသည်'
    },
    season: 'spring',
    tags: ['vegetables', 'iron-rich', 'low-calorie', 'antioxidant'],
    featured: true
  },
  {
    name: { en: 'Blueberries', my: 'ဘလူးဘယ်ရီ' },
    category: 'berries',
    nutrients: ['vitamin-c', 'fiber', 'antioxidants', 'vitamin-k', 'manganese'],
    benefits: { 
      en: 'Excellent source of antioxidants and supports brain health, may improve memory',
      my: 'အန်တီအောက်ဆီဒင့်၏ ထူးကဲသော အရင်းအမြစ်နှင့် ဦးနှောက်ကျန်းမာရေးကို ထောက်ပံ့ပေးသည်၊ မှတ်ဉာဏ်ကို တိုးတက်စေနိုင်သည်'
    },
    season: 'summer',
    tags: ['fruits', 'antioxidant', 'brain-health', 'low-sugar'],
    featured: true
  },
  {
    name: { en: 'Sweet Potato', my: 'ပန်းနီ' },
    category: 'vegetables',
    nutrients: ['beta-carotene', 'vitamin-a', 'fiber', 'potassium', 'vitamin-c'],
    benefits: { 
      en: 'Rich in beta-carotene for eye health, provides sustained energy and fiber',
      my: 'မျက်လုံးကျန်းမာရေးအတွက် ဘီတာကာရိုတင်ကြွယ်ဝသည်၊ တည်ငြိမ်သော စွမ်းအင်နှင့် အမျှင်ဓာတ်ပေးသည်'
    },
    season: 'autumn',
    tags: ['vegetables', 'vitamin-a', 'fiber-rich', 'complex-carbs'],
    featured: false
  },
  {
    name: { en: 'Salmon', my: 'ဆယ်လမွန်ငါး' },
    category: 'fish',
    nutrients: ['omega-3', 'protein', 'vitamin-d', 'selenium', 'b-vitamins'],
    benefits: { 
      en: 'High in omega-3 fatty acids for heart and brain health, excellent protein source',
      my: 'နှလုံးနှင့် ဦးနှောက်ကျန်းမာရေးအတွက် အိုမီဂါ-၃ ဓာတ်ကြွယ်ဝသည်၊ ပရိုတင်း၏ ထူးကဲသော အရင်းအမြစ်'
    },
    season: 'year-round',
    tags: ['fish', 'omega-3', 'protein', 'heart-healthy'],
    featured: true
  },
  {
    name: { en: 'Avocado', my: 'ထောပတ်သီး' },
    category: 'fruits',
    nutrients: ['healthy-fats', 'fiber', 'potassium', 'vitamin-k', 'folate'],
    benefits: { 
      en: 'Rich in healthy monounsaturated fats, supports heart health and nutrient absorption',
      my: 'ကျန်းမာသော မိုနိုအန်စက်ချူရေးတက် ဓာတ်ကြွယ်ဝသည်၊ နှလုံးကျန်းမာရေးနှင့် အာဟာရစုပ်ယူမှုကို ထောက်ပံ့ပေးသည်'
    },
    season: 'year-round',
    tags: ['fruits', 'healthy-fats', 'fiber', 'heart-healthy'],
    featured: false
  },
  {
    name: { en: 'Quinoa', my: 'ကွီနိုအာ' },
    category: 'grains',
    nutrients: ['complete-protein', 'fiber', 'iron', 'magnesium', 'b-vitamins'],
    benefits: { 
      en: 'Complete protein containing all essential amino acids, gluten-free grain alternative',
      my: 'မရှိမဖြစ်လိုအပ်သော အမိုင်နိုအက်ဆစ်အားလုံးပါဝင်သော ပြည့်စုံပရိုတင်း၊ ဂလူတင်မပါသော ကောက်နှံအစားထိုး'
    },
    season: 'year-round',
    tags: ['grains', 'complete-protein', 'gluten-free', 'fiber-rich'],
    featured: false
  }
];

export const seedHealthyFoods = async () => {
  try {
    await HealthyFood.deleteMany({});
    await HealthyFood.insertMany(healthyFoodData);
    console.log('Healthy foods seeded successfully');
  } catch (error) {
    console.error('Error seeding healthy foods:', error);
  }
};