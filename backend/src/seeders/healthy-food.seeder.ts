import HealthyFood from '../models/HealthyFood';

const healthyFoodData = [
  {
    title: { en: 'Spinach', my: 'ဟင်းနုနွယ်' },
    description: { 
      en: 'Supports bone health and immune system, rich in iron and antioxidants',
      my: 'အရိုးကျန်းမာရေးနှင့် ကိုယ်ခံအားစနစ်ကို ထောက်ပံ့ပေးသည်၊ သံဓာတ်နှင့် အန်တီအောက်ဆီဒင့်ကြွယ်ဝသည်'
    },
    category: 'Vegetables',
    keyNutrients: {
      en: ['Iron', 'Vitamin K', 'Folate', 'Antioxidants', 'Vitamin C'],
      my: ['သံဓာတ်', 'ဗီတာမင် K', 'ဖောလိတ်', 'အန်တီအောက်ဆီဒင့်', 'ဗီတာမင် C']
    },
    keyBenefits: {
      en: ['Bone health support', 'Immune system boost', 'Rich in iron', 'High in antioxidants'],
      my: ['အရိုးကျန်းမာရေး ထောက်ပံ့မှု', 'ကိုယ်ခံအားစနစ် မြှင့်တင်မှု', 'သံဓာတ်ကြွယ်ဝ', 'အန်တီအောက်ဆီဒင့်များ']
    },
    season: 'Spring',
    isActive: true
  },
  {
    title: { en: 'Blueberries', my: 'ဘလူးဘယ်ရီ' },
    description: { 
      en: 'Excellent source of antioxidants and supports brain health, may improve memory',
      my: 'အန်တီအောက်ဆီဒင့်၏ ထူးကဲသော အရင်းအမြစ်နှင့် ဦးနှောက်ကျန်းမာရေးကို ထောက်ပံ့ပေးသည်'
    },
    category: 'Fruits',
    keyNutrients: {
      en: ['Vitamin C', 'Fiber', 'Antioxidants', 'Vitamin K', 'Manganese'],
      my: ['ဗီတာမင် C', 'အမျှင်ဓာတ်', 'အန်တီအောက်ဆီဒင့်', 'ဗီတာမင် K', 'မန်ဂနီး']
    },
    keyBenefits: {
      en: ['Brain health support', 'Memory improvement', 'High in antioxidants', 'Low sugar content'],
      my: ['ဦးနှောက်ကျန်းမာရေး ထောက်ပံ့မှု', 'မှတ်ဉာဏ် တိုးတက်မှု', 'အန်တီအောက်ဆီဒင့်များ', 'သကြားဓာတ်နည်း']
    },
    season: 'Summer',
    isActive: true
  },
  {
    title: { en: 'Sweet Potato', my: 'ပန်းနီ' },
    description: { 
      en: 'Rich in beta-carotene for eye health, provides sustained energy and fiber',
      my: 'မျက်လုံးကျန်းမာရေးအတွက် ဘီတာကာရိုတင်ကြွယ်ဝသည်၊ တည်ငြိမ်သော စွမ်းအင်နှင့် အမျှင်ဓာတ်ပေးသည်'
    },
    category: 'Vegetables',
    keyNutrients: {
      en: ['Beta-carotene', 'Vitamin A', 'Fiber', 'Potassium', 'Vitamin C'],
      my: ['ဘီတာကာရိုတင်', 'ဗီတာမင် A', 'အမျှင်ဓာတ်', 'ပိုတက်ဆီယမ်', 'ဗီတာမင် C']
    },
    keyBenefits: {
      en: ['Eye health support', 'Sustained energy', 'High fiber content', 'Complex carbohydrates'],
      my: ['မျက်လုံးကျန်းမာရေး ထောက်ပံ့မှု', 'တည်ငြိမ်သော စွမ်းအင်', 'အမျှင်ဓာတ်များ', 'ရှုပ်ထွေးသော ကာဗိုဟိုက်ဒရိတ်']
    },
    season: 'Fall',
    isActive: true
  },
  {
    title: { en: 'Salmon', my: 'ဆယ်လမွန်ငါး' },
    description: { 
      en: 'High in omega-3 fatty acids for heart and brain health, excellent protein source',
      my: 'နှလုံးနှင့် ဦးနှောက်ကျန်းမာရေးအတွက် အိုမီဂါ-၃ ဓာတ်ကြွယ်ဝသည်၊ ပရိုတင်း၏ ထူးကဲသော အရင်းအမြစ်'
    },
    category: 'Proteins',
    keyNutrients: {
      en: ['Omega-3', 'Protein', 'Vitamin D', 'Selenium', 'B Vitamins'],
      my: ['အိုမီဂါ-၃', 'ပရိုတင်း', 'ဗီတာမင် D', 'ဆီလီနီယမ်', 'ဗီတာမင် B များ']
    },
    keyBenefits: {
      en: ['Heart health support', 'Brain health support', 'High quality protein', 'Anti-inflammatory'],
      my: ['နှလုံးကျန်းမာရေး ထောက်ပံ့မှု', 'ဦးနှောက်ကျန်းမာရေး ထောက်ပံ့မှု', 'အရည်အသွေးမြင့် ပရိုတင်း', 'ရောင်ရမ်းမှု တားဆီးမှု']
    },
    season: 'Year-round',
    isActive: true
  },
  {
    title: { en: 'Avocado', my: 'ထောပတ်သီး' },
    description: { 
      en: 'Rich in healthy monounsaturated fats, supports heart health and nutrient absorption',
      my: 'ကျန်းမာသော မိုနိုအန်စက်ချူရေးတက် ဓာတ်ကြွယ်ဝသည်၊ နှလုံးကျန်းမာရေးနှင့် အာဟာရစုပ်ယူမှုကို ထောက်ပံ့ပေးသည်'
    },
    category: 'Fruits',
    keyNutrients: {
      en: ['Healthy fats', 'Fiber', 'Potassium', 'Vitamin K', 'Folate'],
      my: ['ကျန်းမာသော ဓာတ်ဆီများ', 'အမျှင်ဓာတ်', 'ပိုတက်ဆီယမ်', 'ဗီတာမင် K', 'ဖိုလိတ်']
    },
    keyBenefits: {
      en: ['Heart health support', 'Nutrient absorption', 'Healthy fats', 'High fiber'],
      my: ['နှလုံးကျန်းမာရေး ထောက်ပံ့မှု', 'အာဟာရစုပ်ယူမှု', 'ကျန်းမာသော ဓာတ်ဆီများ', 'အမျှင်ဓာတ်များ']
    },
    season: 'Year-round',
    isActive: true
  },
  {
    title: { en: 'Quinoa', my: 'ကွီနိုအာ' },
    description: { 
      en: 'Complete protein containing all essential amino acids, gluten-free grain alternative',
      my: 'မရှိမဖြစ်လိုအပ်သော အမိုင်နိုအက်ဆစ်အားလုံးပါဝင်သော ပြည့်စုံပရိုတင်း၊ ဂလူတင်မပါသော ကောက်နှံအစားထိုး'
    },
    category: 'Grains',
    keyNutrients: {
      en: ['Complete protein', 'Fiber', 'Iron', 'Magnesium', 'B Vitamins'],
      my: ['ပြည့်စုံပရိုတင်း', 'အမျှင်ဓာတ်', 'သံဓာတ်', 'မဂ္ဂနီဆီယမ်', 'ဗီတာမင် B များ']
    },
    keyBenefits: {
      en: ['Complete protein source', 'Gluten-free', 'High fiber', 'Essential amino acids'],
      my: ['ပြည့်စုံပရိုတင်း အရင်းအမြစ်', 'ဂလူတင်မပါ', 'အမျှင်ဓာတ်များ', 'မရှိမဖြစ် အမိုင်နိုအက်ဆစ်များ']
    },
    season: 'Year-round',
    isActive: true
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