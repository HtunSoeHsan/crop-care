import Disease from '../models/Disease';

const diseaseData = [
  // Apple Diseases (Class Index 0-3)
  {
    classIndex: 0,
    name: { en: 'Apple Scab', my: 'ပန်းသီး အညိုစက်' },
    description: { en: 'A fungal disease that affects apple trees, causing scabby lesions on leaves and fruit.', my: 'ပန်းသီးပင်များကို ထိခိုက်စေသော မှိုရောဂါဖြစ်ပြီး အရွက်နှင့် အသီးများတွင် အညိုစက်များ ဖြစ်စေသည်။' },
    symptoms: { en: 'Dark spots on leaves, cracked fruit, premature leaf drop', my: 'အရွက်များတွင် အမဲစက်များ, အသီးများ ကွဲအက်ခြင်း, အရွက်များ စောစောကြွေခြင်း' },
    causes: { en: 'Caused by the fungus Venturia inaequalis, spread by wind and rain', my: 'Venturia inaequalis မှိုကြောင့် ဖြစ်ပြီး လေနှင့် မိုးရေကြောင့် ပျံ့နှံ့သည်' },
    treatment: { en: 'Apply fungicide sprays, remove infected leaves, improve air circulation', my: 'မှိုသတ်ဆေး ဖျန်းခြင်း, ရောဂါကူးစက်နေသော အရွက်များ ဖယ်ရှားခြင်း, လေဝင်လေထွက် ကောင်းမွန်စေခြင်း' },
    prevention: { en: 'Use resistant varieties, proper pruning, avoid overhead watering', my: 'ခံနိုင်ရည်ရှိသော မျိုးများ သုံးစွဲခြင်း, သင့်တော်သော ခုတ်ယူခြင်း, အပေါ်မှ ရေမလောင်းခြင်း' },
    severity: 'Medium', affectedCrops: { en: 'Apple', my: 'ပန်းသီး' }, imageUrl: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg'
  },
  {
    classIndex: 1,
    name: { en: 'Apple Black Rot', my: 'ပန်းသီး အမဲပုပ်ရောဂါ' },
    description: { en: 'A fungal disease that causes black rot on apple fruit and leaves.', my: 'ပန်းသီးအသီးနှင့် အရွက်များတွင် အမဲပုပ်ရောဂါ ဖြစ်စေသော မှိုရောဂါဖြစ်သည်။' },
    symptoms: { en: 'Black rot on fruit, leaf spots, cankers on branches', my: 'အသီးများတွင် အမဲပုပ်ခြင်း, အရွက်များတွင် အစက်များ, အကိုင်းများတွင် အနာများ' },
    causes: { en: 'Fungal infection, high humidity, poor sanitation', my: 'မှိုကူးစက်ခြင်း, စိုထိုင်းမှု များခြင်း, သန့်ရှင်းမှု မကောင်းခြင်း' },
    treatment: { en: 'Remove infected parts, apply fungicide, improve air circulation', my: 'ရောဂါကူးစက်နေသော အပိုင်းများ ဖယ်ရှားခြင်း, မှိုသတ်ဆေး သုံးစွဲခြင်း, လေဝင်လေထွက် ကောင်းမွန်စေခြင်း' },
    prevention: { en: 'Proper pruning, fungicide application, sanitation', my: 'သင့်တော်သော ခုတ်ယူခြင်း, မှိုသတ်ဆေး သုံးစွဲခြင်း, သန့်ရှင်းမှု' },
    severity: 'High', affectedCrops: { en: 'Apple', my: 'ပန်းသီး' }, imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
  },
  {
    classIndex: 2,
    name: { en: 'Apple Cedar Rust', my: 'ပန်းသီး သစ်ကတိုး မှိုစွဲရောဂါ' },
    description: { en: 'A fungal disease that affects apple trees, causing orange spots on leaves.', my: 'ပန်းသီးပင်များကို ထိခိုက်စေသော မှိုရောဂါဖြစ်ပြီး အရွက်များတွင် လိမ္မော်ရောင် အစက်များ ဖြစ်စေသည်။' },
    symptoms: { en: 'Orange spots on leaves, fruit distortion, premature leaf drop', my: 'အရွက်များတွင် လိမ္မော်ရောင် အစက်များ, အသီးများ ပုံပျက်ခြင်း, အရွက်များ စောစောကြွေခြင်း' },
    causes: { en: 'Fungal spores from cedar trees, wet weather conditions', my: 'သစ်ကတိုးပင်များမှ မှိုမျိုးစေ့များ, စိုစွတ်သော ရာသီဥတု အခြေအနေများ' },
    treatment: { en: 'Remove nearby cedar trees, apply fungicide, improve air circulation', my: 'အနီးအနားရှိ သစ်ကတိုးပင်များကို ဖယ်ရှားခြင်း, မှိုသတ်ဆေး သုံးစွဲခြင်း, လေဝင်လေထွက် ကောင်းမွန်စေခြင်း' },
    prevention: { en: 'Plant away from cedar trees, use resistant varieties, fungicide sprays', my: 'သစ်ကတိုးပင်များမှ ဝေးဝေး စိုက်ပျိုးခြင်း, ခံနိုင်ရည်ရှိသော မျိုးများ သုံးစွဲခြင်း, မှိုသတ်ဆေး ဖျန်းခြင်း' },
    severity: 'Medium', affectedCrops: { en: 'Apple', my: 'ပန်းသီး' }, imageUrl: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg'
  },
  {
    classIndex: 3,
    name: { en: 'Apple Healthy', my: 'ပန်းသီး ကျန်းမာ' },
    description: { en: 'A healthy apple tree showing no signs of disease.', my: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ပန်းသီးပင်ဖြစ်သည်။' },
    symptoms: { en: 'No symptoms present', my: 'လက္ခဏာများ မရှိ' },
    causes: { en: 'No disease present', my: 'ရောဂါ မရှိ' },
    treatment: { en: 'Continue preventive care', my: 'ကာကွယ်ရေး စောင့်ရှောက်မှု ဆက်လက်ပြုလုပ်ခြင်း' },
    prevention: { en: 'Regular monitoring, proper nutrition, good sanitation', my: 'ပုံမှန်စောင့်ကြည့်ခြင်း, သင့်တော်သော အာဟာရ, ကောင်းမွန်သော သန့်ရှင်းမှု' },
    severity: 'Low', affectedCrops: { en: 'Apple', my: 'ပန်းသီး' }, imageUrl: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg'
  },
  
  // Rice Diseases (Class Index 14-25)
  {
    classIndex: 14,
    name: { en: 'Rice Bacterial Leaf Blight', my: 'ဆန် ဘက်တီးရီးယား အရွက်မီးလောင်ရောဂါ' },
    description: { en: 'A bacterial disease that causes leaf blight in rice plants.', my: 'ဆန်ပင်များတွင် အရွက်မီးလောင်ရောဂါ ဖြစ်စေသော ဘက်တီးရီးယား ရောဂါဖြစ်သည်။' },
    symptoms: { en: 'Water-soaked lesions, yellowing leaves, wilting', my: 'ရေစိုနေသော အနာများ, အရွက်များ အဝါရောင်ဖြစ်ခြင်း, ညှိုးနွမ်းခြင်း' },
    causes: { en: 'Xanthomonas oryzae bacteria, high humidity, wounds', my: 'Xanthomonas oryzae ဘက်တီးရီးယား, စိုထိုင်းမှု များခြင်း, ဒဏ်ရာများ' },
    treatment: { en: 'Apply copper-based bactericides, remove infected plants', my: 'ကြေးနီအခြေခံ ဘက်တီးရီးယားသတ်ဆေး သုံးစွဲခြင်း, ရောဂါကူးစက်နေသော အပင်များ ဖယ်ရှားခြင်း' },
    prevention: { en: 'Use resistant varieties, avoid overhead irrigation, crop rotation', my: 'ခံနိုင်ရည်ရှိသော မျိုးများ သုံးစွဲခြင်း, အပေါ်မှ ရေမလောင်းခြင်း, သီးနှံလည်ပတ်စိုက်ပျိုးခြင်း' },
    severity: 'High', affectedCrops: { en: 'Rice', my: 'ဆန်' }, imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
  },
  {
    classIndex: 15,
    name: { en: 'Rice Bacterial Leaf Streak', my: 'ဆန် ဘက်တီးရီးယား အရွက်မျဉ်းရောဂါ' },
    description: { en: 'A bacterial disease causing streaks on rice leaves.', my: 'ဆန်အရွက်များတွင် မျဉ်းများ ဖြစ်စေသော ဘက်တီးရီးယား ရောဂါဖြစ်သည်။' },
    symptoms: { en: 'Yellow to brown streaks on leaves, stunted growth', my: 'အရွက်များတွင် အဝါမှ အညိုရောင် မျဉ်းများ, ကြီးထွားမှု နှေးကွေးခြင်း' },
    causes: { en: 'Xanthomonas oryzae bacteria, wet conditions', my: 'Xanthomonas oryzae ဘက်တီးရီးယား, စိုစွတ်သော အခြေအနေများ' },
    treatment: { en: 'Apply bactericides, improve field drainage', my: 'ဘက်တီးရီးယားသတ်ဆေး သုံးစွဲခြင်း, လယ်ကွင်း ရေနုတ်မှု ကောင်းမွန်စေခြင်း' },
    prevention: { en: 'Use certified seeds, avoid mechanical damage, proper water management', my: 'အသိအမှတ်ပြု မျိုးစေ့များ သုံးစွဲခြင်း, စက်ပိုင်းဆိုင်ရာ ပျက်စီးမှု ရှောင်ကြဉ်ခြင်း, သင့်တော်သော ရေစီမံခန့်ခွဲမှု' },
    severity: 'Medium', affectedCrops: { en: 'Rice', my: 'ဆန်' }, imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
  },
  {
    classIndex: 16,
    name: { en: 'Rice Blast', my: 'ဆန် မီးလောင်ရောဂါ' },
    description: { en: 'A fungal disease that causes blast lesions on rice plants.', my: 'ဆန်ပင်များတွင် မီးလောင်အနာများ ဖြစ်စေသော မှိုရောဂါဖြစ်သည်။' },
    symptoms: { en: 'Diamond-shaped lesions, neck rot, panicle blast', my: 'စိန်ပုံသဏ္ဍာန် အနာများ, လည်ပင်းပုပ်ခြင်း, အသီးပြွတ် မီးလောင်ခြင်း' },
    causes: { en: 'Magnaporthe oryzae fungus, high humidity, nitrogen excess', my: 'Magnaporthe oryzae မှို, စိုထိုင်းမှု များခြင်း, နိုက်ထရိုဂျင် လွန်ကဲခြင်း' },
    treatment: { en: 'Apply fungicides, reduce nitrogen fertilizer, improve air circulation', my: 'မှိုသတ်ဆေး သုံးစွဲခြင်း, နိုက်ထရိုဂျင် မြေဩဇာ လျှော့ခြင်း, လေဝင်လေထွက် ကောင်းမွန်စေခြင်း' },
    prevention: { en: 'Use resistant varieties, balanced fertilization, proper water management', my: 'ခံနိုင်ရည်ရှိသော မျိုးများ သုံးစွဲခြင်း, မျှတသော မြေဩဇာပေးခြင်း, သင့်တော်သော ရေစီမံခန့်ခွဲမှု' },
    severity: 'Critical', affectedCrops: { en: 'Rice', my: 'ဆန်' }, imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
  },
  {
    classIndex: 17,
    name: { en: 'Rice Brown Spot', my: 'ဆန် အညိုစက်ရောဂါ' },
    description: { en: 'A fungal disease causing brown spots on rice leaves and grains.', my: 'ဆန်အရွက်များနှင့် စပါးစေ့များတွင် အညိုစက်များ ဖြစ်စေသော မှိုရောဂါဖြစ်သည်။' },
    symptoms: { en: 'Brown oval spots on leaves, grain discoloration, reduced yield', my: 'အရွက်များတွင် အညိုရောင် ဘဲဥပုံ အစက်များ, စပါးစေ့ အရောင်ပြောင်းခြင်း, အထွက်နှုန်း လျော့ကျခြင်း' },
    causes: { en: 'Bipolaris oryzae fungus, nutrient deficiency, stress conditions', my: 'Bipolaris oryzae မှို, အာဟာရ ချို့တဲ့မှု, ဖိစီးမှု အခြေအနေများ' },
    treatment: { en: 'Apply fungicides, improve nutrition, manage water stress', my: 'မှိုသတ်ဆေး သုံးစွဲခြင်း, အာဟာရ ကောင်းမွန်စေခြင်း, ရေဖိစီးမှု စီမံခန့်ခွဲခြင်း' },
    prevention: { en: 'Balanced fertilization, proper water management, use healthy seeds', my: 'မျှတသော မြေဩဇာပေးခြင်း, သင့်တော်သော ရေစီမံခန့်ခွဲမှု, ကျန်းမာသော မျိုးစေ့များ သုံးစွဲခြင်း' },
    severity: 'Medium', affectedCrops: { en: 'Rice', my: 'ဆန်' }, imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
  },
  {
    classIndex: 18,
    name: { en: 'Rice Healthy', my: 'ဆန် ကျန်းမာ' },
    description: { en: 'A healthy rice plant showing no signs of disease.', my: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ဆန်ပင်ဖြစ်သည်။' },
    symptoms: { en: 'No symptoms present', my: 'လက္ခဏာများ မရှိ' },
    causes: { en: 'No disease present', my: 'ရောဂါ မရှိ' },
    treatment: { en: 'Continue preventive care', my: 'ကာကွယ်ရေး စောင့်ရှောက်မှု ဆက်လက်ပြုလုပ်ခြင်း' },
    prevention: { en: 'Regular monitoring, proper nutrition, good water management', my: 'ပုံမှန်စောင့်ကြည့်ခြင်း, သင့်တော်သော အာဟာရ, ကောင်းမွန်သော ရေစီမံခန့်ခွဲမှု' },
    severity: 'Low', affectedCrops: { en: 'Rice', my: 'ဆန်' }, imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
  }
];

export const seedDiseases = async () => {
  try {
    console.log('🌱 Seeding diseases...');
    await Disease.deleteMany({});
    await Disease.insertMany(diseaseData);
    console.log(`✅ ${diseaseData.length} diseases seeded successfully`);
  } catch (error) {
    console.error('❌ Error seeding diseases:', error);
  }
};