import PlantGuide from '../models/PlantGuide';

const plantGuideData = [
  {
    plantName: { en: 'Tomato', my: 'ခရမ်းချဉ်သီး' },
    scientificName: 'Solanum lycopersicum',
    category: 'vegetables',
    description: { 
      en: 'Popular garden vegetable with many varieties. Requires warm weather and full sun.',
      my: 'ဥယျာဉ်တွင်ရေပန်းစားသော ဟင်းသီးဟင်းရွက်မျိုးစုံ။ နွေးထွေးသော ရာသီဥတုနှင့် နေရောင်ပြည့် လိုအပ်သည်။'
    },
    careInstructions: {
      watering: { 
        en: 'Keep soil consistently moist, water at base to prevent leaf diseases',
        my: 'မြေဆီလွှာကို စိုစွတ်နေစေပါ၊ အရွက်ရောဂါများကို ကာကွယ်ရန် အမြစ်တွင် ရေလောင်းပါ'
      },
      sunlight: { 
        en: 'Full sun (6-8 hours daily), choose sunniest spot in garden',
        my: 'နေရောင်ပြည့် (တစ်နေ့ ၆-၈ နာရီ)၊ ဥယျာဉ်တွင် နေရောင်အများဆုံးနေရာကို ရွေးချယ်ပါ'
      },
      soil: { 
        en: 'Well-draining, rich loam with pH 6.0-6.8',
        my: 'ရေထုတ်ကောင်းသော၊ pH ၆.၀-၆.၈ ရှိသော မြေဆီလွှာ'
      }
    },
    tags: ['vegetables', 'summer', 'fruit-bearing', 'warm-season'],
    difficulty: 'intermediate',
    featured: true
  },
  {
    plantName: { en: 'Basil', my: 'ပန်းရံပင်' },
    scientificName: 'Ocimum basilicum',
    category: 'herbs',
    description: { 
      en: 'Aromatic herb used in cooking with natural pest-repelling properties.',
      my: 'ချက်ပြုတ်ရာတွင် အသုံးပြုသော ရနံ့ထူးသော ဆေးဖက်ဝင်အပင်။ သဘာဝအလျောက် ပိုးမွှားများကို ရှောင်ရှားစေသည်။'
    },
    careInstructions: {
      watering: { 
        en: 'Water every 2-3 days, keep soil moist but not waterlogged',
        my: '၂-၃ ရက်တစ်ကြိမ် ရေလောင်းပါ၊ မြေဆီလွှာကို စိုစွတ်နေစေပါ သို့သော် ရေများမနေစေပါ'
      },
      sunlight: { 
        en: 'Full sun to partial shade (4-6 hours daily)',
        my: 'နေရောင်ပြည့်မှ တစ်စိတ်တစ်ပိုင်းအရိပ် (တစ်နေ့ ၄-၆ နာရီ)'
      },
      soil: { 
        en: 'Well-draining, fertile soil rich in organic matter',
        my: 'ရေထုတ်ကောင်းသော၊ အော်ဂဲနစ်ဓာတ်ကြွယ်ဝသော မြေဆီလွှာ'
      }
    },
    tags: ['herbs', 'culinary', 'aromatic', 'easy', 'container'],
    difficulty: 'beginner',
    featured: false
  },
  {
    plantName: { en: 'Lettuce', my: 'လက်တုစ်' },
    scientificName: 'Lactuca sativa',
    category: 'leafy-greens',
    description: { 
      en: 'Cool-season leafy green that grows quickly and is perfect for beginners.',
      my: 'မြန်မြန်ကြီးထွားသော အအေးရာသီ အရွက်ရင်းများ၊ အစပြုသူများအတွက် အကောင်းဆုံး။'
    },
    careInstructions: {
      watering: { 
        en: 'Keep soil consistently moist, shallow frequent watering',
        my: 'မြေဆီလွှာကို စိုစွတ်နေစေပါ၊ တိုတိုနှင့် မကြာခဏ ရေလောင်းပါ'
      },
      sunlight: { 
        en: 'Partial shade to full sun, protect from hot afternoon sun',
        my: 'တစ်စိတ်တစ်ပိုင်းအရိပ်မှ နေရောင်ပြည့်၊ နေ့လယ်ပိုင်း ပူပြင်းသော နေရောင်မှ ကာကွယ်ပါ'
      },
      soil: { 
        en: 'Loose, well-draining soil with good organic content',
        my: 'ပေါ့ပေါ့ပါးပါး၊ ရေထုတ်ကောင်းသော၊ အော်ဂဲနစ်ဓာတ်ကောင်းသော မြေဆီလွှာ'
      }
    },
    tags: ['leafy-greens', 'cool-season', 'fast-growing', 'salad'],
    difficulty: 'beginner',
    featured: false
  },
  {
    plantName: { en: 'Rose', my: 'နှင်းဆီပန်း' },
    scientificName: 'Rosa spp.',
    category: 'flowers',
    description: { 
      en: 'Classic flowering plant known for beauty and fragrance, requires regular care.',
      my: 'အလှအပနှင့် ရနံ့ကောင်းမွန်မှုကြောင့် ကျော်ကြားသော ပန်းပွင့်အပင်၊ ပုံမှန်စောင့်ရှောက်မှု လိုအပ်သည်။'
    },
    careInstructions: {
      watering: { 
        en: 'Deep watering 2-3 times per week, water at base to prevent disease',
        my: 'တစ်ပတ်လျှင် ၂-၃ ကြိမ် နက်နက်ရေလောင်းပါ၊ ရောဂါကာကွယ်ရန် အမြစ်တွင် ရေလောင်းပါ'
      },
      sunlight: { 
        en: 'Full sun (6+ hours daily), morning sun is essential',
        my: 'နေရောင်ပြည့် (တစ်နေ့ ၆ နာရီထက်ပိုမို)၊ နံနက်ပိုင်း နေရောင် မရှိမဖြစ်လိုအပ်သည်'
      },
      soil: { 
        en: 'Well-draining, fertile soil with pH 6.0-7.0, rich in organic matter',
        my: 'ရေထုတ်ကောင်းသော၊ pH ၆.၀-၇.၀ ရှိသော၊ အော်ဂဲနစ်ဓာတ်ကြွယ်ဝသော မြေဆီလွှာ'
      }
    },
    tags: ['flowers', 'fragrant', 'ornamental', 'perennial'],
    difficulty: 'intermediate',
    featured: true
  }
];

export const seedPlantGuides = async () => {
  try {
    await PlantGuide.deleteMany({});
    await PlantGuide.insertMany(plantGuideData);
    console.log('Plant guides seeded successfully');
  } catch (error) {
    console.error('Error seeding plant guides:', error);
  }
};