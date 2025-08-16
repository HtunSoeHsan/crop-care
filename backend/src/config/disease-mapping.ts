import { PlantDisease } from "../types";

// This mapping matches your actual training data structure
// Based on the folders found in /home/hsh/Documents/ME/ayar-care-be/training_data
export const diseaseMapping: PlantDisease[] = [
  {
    classIndex: 0,
    name: {
      en: 'Apple Scab',
      my: 'ပန်းသီး အညိုစက်'
    },
    description: {
      en: 'A fungal disease that affects apple trees, causing scabby lesions on leaves and fruit.',
      my: 'ပန်းသီးပင်များကို ထိခိုက်စေသော မှိုရောဂါဖြစ်ပြီး အရွက်နှင့် အသီးများတွင် အညိုစက်များ ဖြစ်စေသည်။'
    },
    symptoms: [
      {
        en: 'Dark spots on leaves',
        my: 'အရွက်များတွင် အမဲစက်များ'
      },
      {
        en: 'Cracked fruit',
        my: 'အသီးများ ကွဲအက်ခြင်း'
      },
      {
        en: 'Premature leaf drop',
        my: 'အရွက်များ စောစောကြွေခြင်း'
      }
    ],
    plantType: {
      en: 'Apple',
      my: 'ပန်းသီး'
    },
    treatments: [
      {
        name: {
          en: 'Cultural Control',
          my: 'ယဉ်ကျေးမှုဆိုင်ရာ ထိန်းချုပ်မှု'
        },
        description: {
          en: 'Implement cultural practices to manage apple scab',
          my: 'ပန်းသီး အညိုစက်ကို ထိန်းချုပ်ရန် ယဉ်ကျေးမှုဆိုင်ရာ လုပ်ငန်းများ ဆောင်ရွက်ခြင်း'
        },
        steps: [
          {
            en: 'Rake and remove fallen leaves',
            my: 'ကြွေကျသော အရွက်များကို ရိုက်ချွတ်ပြီး ဖယ်ရှားခြင်း'
          },
          {
            en: 'Prune for better air circulation',
            my: 'လေဝင်လေထွက် ကောင်းမွန်စေရန် ခုတ်ယူခြင်း'
          },
          {
            en: 'Apply fungicide in spring',
            my: 'နွေဦးရာသီတွင် မှိုသတ်ဆေး သုံးစွဲခြင်း'
          },
          {
            en: 'Use resistant varieties',
            my: 'ခံနိုင်ရည်ရှိသော မျိုးများ သုံးစွဲခြင်း'
          }
        ]
      }
    ],
    recommendations: [
      {
        en: 'Monitor trees regularly during growing season for early detection',
        my: 'ကြီးထွားရာသီအတွင်း စောစောသိရှိရန် ပင်များကို ပုံမှန်စစ်ဆေးပါ'
      },
      {
        en: 'Maintain proper spacing between trees for better air circulation',
        my: 'လေဝင်လေထွက် ကောင်းမွန်စေရန် ပင်များအကြား အကွာအဝေး သင့်တင့်အောင် ထိန်းသိမ်းပါ'
      },
      {
        en: 'Apply preventive fungicide treatments before bud break',
        my: 'အညွန့်မထွက်မီ ကာကွယ်ဆေး မှိုသတ်ဆေးများ သုံးစွဲပါ'
      },
      {
        en: 'Remove and destroy infected plant material immediately',
        my: 'ရောဂါကူးစက်နေသော အပင်ပစ္စည်းများကို ချက်ချင်း ဖယ်ရှားပြီး ဖျက်ဆီးပါ'
      }
    ]
  },
  {
    classIndex: 1,
    name: {
      en: 'Apple Black Rot',
      my: 'ပန်းသီး အမဲပုပ်ရောဂါ'
    },
    description: {
      en: 'A fungal disease that causes black rot on apple fruit and leaves.',
      my: 'ပန်းသီးအသီးနှင့် အရွက်များတွင် အမဲပုပ်ရောဂါ ဖြစ်စေသော မှိုရောဂါဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'Black rot on fruit',
        my: 'အသီးများတွင် အမဲပုပ်ခြင်း'
      },
      {
        en: 'Leaf spots',
        my: 'အရွက်များတွင် အစက်များ'
      },
      {
        en: 'Cankers on branches',
        my: 'အကိုင်းများတွင် အနာများ'
      }
    ],
    plantType: {
      en: 'Apple',
      my: 'ပန်းသီး'
    },
    treatments: [
      {
        name: {
          en: 'Fungicide Application',
          my: 'မှိုသတ်ဆေး သုံးစွဲခြင်း'
        },
        description: {
          en: 'Apply fungicide to control black rot',
          my: 'အမဲပုပ်ရောဂါကို ထိန်းချုပ်ရန် မှိုသတ်ဆေး သုံးစွဲခြင်း'
        },
        steps: [
          {
            en: 'Remove infected fruit and leaves',
            my: 'ရောဂါကူးစက်နေသော အသီးနှင့် အရွက်များကို ဖယ်ရှားခြင်း'
          },
          {
            en: 'Apply fungicide',
            my: 'မှိုသတ်ဆေး သုံးစွဲခြင်း'
          },
          {
            en: 'Prune infected branches',
            my: 'ရောဂါကူးစက်နေသော အကိုင်းများကို ခုတ်ယူခြင်း'
          },
          {
            en: 'Improve air circulation',
            my: 'လေဝင်လေထွက် ကောင်းမွန်စေခြင်း'
          }
        ]
      }
    ],
    recommendations: [
      {
        en: 'Inspect trees weekly during fruit development for early signs of infection',
        my: 'ရောဂါကူးစက်မှု လက္ခဏာများကို စောစောသိရှိရန် အသီးဖွံ့ဖြိုးရာကာလအတွင်း ပင်များကို အပတ်စဉ် စစ်ဆေးပါ'
      },
      {
        en: 'Maintain tree vigor through proper fertilization and watering',
        my: 'မြေဩဇာနှင့် ရေလောင်းခြင်း သင့်တင့်အောင် ပြုလုပ်ပြီး ပင်အားကောင်းအောင် ထိန်းသိမ်းပါ'
      },
      {
        en: 'Use disease-resistant apple varieties when planting new trees',
        my: 'ပင်သစ်များ စိုက်ပျိုးရာတွင် ရောဂါခံနိုင်ရည်ရှိသော ပန်းသီးမျိုးများ သုံးစွဲပါ'
      },
      {
        en: 'Apply protective fungicide sprays during critical growth periods',
        my: 'အရေးကြီးသော ကြီးထွားရာကာလများအတွင်း ကာကွယ်ဆေး မှိုသတ်ဆေးများ ဖျန်းပါ'
      }
    ]
  },
  {
    classIndex: 2,
    name: {
      en: 'Apple Cedar Rust',
      my: 'ပန်းသီး သစ်ကတိုး မှိုစွဲရောဂါ'
    },
    description: {
      en: 'A fungal disease that affects apple trees, causing orange spots on leaves.',
      my: 'ပန်းသီးပင်များကို ထိခိုက်စေသော မှိုရောဂါဖြစ်ပြီး အရွက်များတွင် လိမ္မော်ရောင် အစက်များ ဖြစ်စေသည်။'
    },
    symptoms: [
      {
        en: 'Orange spots on leaves',
        my: 'အရွက်များတွင် လိမ္မော်ရောင် အစက်များ'
      },
      {
        en: 'Fruit distortion',
        my: 'အသီးများ ပုံပျက်ခြင်း'
      },
      {
        en: 'Premature leaf drop',
        my: 'အရွက်များ စောစောကြွေခြင်း'
      }
    ],
    plantType: {
      en: 'Apple',
      my: 'ပန်းသီး'
    },
    treatments: [
      {
        name: {
          en: 'Rust Management',
          my: 'မှိုစွဲရောဂါ စီမံခန့်ခွဲမှု'
        },
        description: {
          en: 'Manage cedar rust through cultural and chemical controls',
          my: 'ယဉ်ကျေးမှုနှင့် ဓာတုဗေဒဆိုင်ရာ ထိန်းချုပ်မှုများဖြင့် သစ်ကတိုး မှိုစွဲရောဂါကို စီမံခန့်ခွဲခြင်း'
        },
        steps: [
          {
            en: 'Remove nearby cedar trees',
            my: 'အနီးအနားရှိ သစ်ကတိုးပင်များကို ဖယ်ရှားခြင်း'
          },
          {
            en: 'Apply fungicide in spring',
            my: 'နွေဦးရာသီတွင် မှိုသတ်ဆေး သုံးစွဲခြင်း'
          },
          {
            en: 'Use resistant varieties',
            my: 'ခံနိုင်ရည်ရှိသော မျိုးများ သုံးစွဲခြင်း'
          },
          {
            en: 'Improve air circulation',
            my: 'လေဝင်လေထွက် ကောင်းမွန်စေခြင်း'
          }
        ]
      }
    ],
    recommendations: [
      {
        en: 'Plant apple trees at least 500 feet away from cedar trees to prevent spore transmission',
        my: 'မျိုးစေ့ပျံ့နှံ့မှုကို ကာကွယ်ရန် ပန်းသီးပင်များကို သစ်ကတိုးပင်များမှ အနည်းဆုံး ပေ ၅၀၀ အကွာတွင် စိုက်ပျိုးပါ'
      },
      {
        en: 'Monitor weather conditions and apply fungicide before rain events',
        my: 'ရာသီဥတုအခြေအနေများကို စောင့်ကြည့်ပြီး မိုးရွာမည့်အချိန်မတိုင်မီ မှိုသတ်ဆေး သုံးစွဲပါ'
      },
      {
        en: 'Prune trees to maintain open canopy structure for better air flow',
        my: 'လေဝင်လေထွက် ကောင်းမွန်စေရန် ပင်များကို ခွဲခုတ်ပြီး ဖွင့်လင်းသော အရွက်ဖုံးအုပ်ပုံစံ ထိန်းသိမ်းပါ'
      },
      {
        en: 'Consider using systemic fungicides for long-term protection during growing season',
        my: 'ကြီးထွားရာကာလအတွင်း ရေရှည်ကာကွယ်မှုအတွက် စနစ်တကျ မှိုသတ်ဆေးများ သုံးစွဲရန် စဉ်းစားပါ'
      }
    ]
  },
  {
    classIndex: 3,
    name: {
      en: 'Apple Healthy',
      my: 'ပန်းသီး ကျန်းမာ'
    },
    description: {
      en: 'A healthy apple tree showing no signs of disease.',
      my: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ပန်းသီးပင်ဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'No symptoms',
        my: 'လက္ခဏာ မရှိ'
      }
    ],
    plantType: {
      en: 'Apple',
      my: 'ပန်းသီး'
    },
    treatments: [
      {
        name: {
          en: 'Preventive Care',
          my: 'ကာကွယ်ရေး စောင့်ရှောက်မှု'
        },
        description: {
          en: 'Maintain tree health through proper care',
          my: 'သင့်တော်သော စောင့်ရှောက်မှုဖြင့် ပင်စည်ကျန်းမာရေး ထိန်းသိမ်းခြင်း'
        },
        steps: [
          {
            en: 'Regular pruning',
            my: 'ပုံမှန် ခုတ်ယူခြင်း'
          },
          {
            en: 'Proper fertilization',
            my: 'သင့်တော်သော မြေဩဇာ သုံးစွဲခြင်း'
          },
          {
            en: 'Adequate irrigation',
            my: 'လုံလောက်သော ရေသွင်းခြင်း'
          },
          {
            en: 'Pest monitoring',
            my: 'ပိုးမွှားများ စောင့်ကြည့်ခြင်း'
          }
        ]
      }
    ],
    recommendations: [
      {
        en: 'Continue regular monitoring and preventive care to maintain tree health',
        my: 'ပင်ကျန်းမာရေး ထိန်းသိမ်းရန် ပုံမှန်စောင့်ကြည့်ခြင်းနှင့် ကာကွယ်ရေး စောင့်ရှောက်မှုများ ဆက်လက်ပြုလုပ်ပါ'
      },
      {
        en: 'Implement integrated pest management strategies to prevent future infestations',
        my: 'အနာဂတ်တွင် ပိုးမွှားကျရောက်မှုများကို ကာကွယ်ရန် ပိုးမွှားစီမံခန့်ခွဲမှု ဗျူဟာများ အကောင်အထည်ဖော်ပါ'
      },
      {
        en: 'Maintain soil health through proper pH management and organic matter addition',
        my: 'မြေချဉ်ငံဓာတ် စီမံခန့်ခွဲခြင်းနှင့် သဘာဝပစ္စည်းများ ထည့်သွင်းခြင်းဖြင့် မြေဆီလွှာ ကျန်းမာရေး ထိန်းသိမ်းပါ'
      },
      {
        en: 'Document tree growth patterns and health indicators for future reference',
        my: 'အနာဂတ်အတွက် ပင်ကြီးထွားမှုပုံစံများနှင့် ကျန်းမာရေး ညွှန်ပြချက်များကို မှတ်တမ်းတင်ပါ'
      }
    ]
  },
  {
    classIndex: 4,
    name: {
      en: 'Background Without Leaves',
      my: 'အရွက်မပါသော နောက်ခံ'
    },
    description: {
      en: 'Image contains no plant material - background only.',
      my: 'ပုံတွင် အပင်ပစ္စည်း မပါဝင် - နောက်ခံသာ ဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'No plant visible',
        my: 'အပင် မမြင်ရ'
      }
    ],
    plantType: {
      en: 'None',
      my: 'မရှိ'
    },
    treatments: [
      {
        name: {
          en: 'No Treatment Required',
          my: 'ကုသမှု မလိုအပ်'
        },
        description: {
          en: 'This is not a plant disease - retake photo focusing on plant leaves',
          my: 'ဤသည် အပင်ရောဂါ မဟုတ် - အပင်အရွက်များကို အာရုံစိုက်ပြီး ဓာတ်ပုံ ပြန်ရိုက်ပါ'
        },
        steps: [
          {
            en: 'Retake photo with plant leaves visible',
            my: 'အပင်အရွက်များ မြင်ရသော ဓာတ်ပုံ ပြန်ရိုက်ခြင်း'
          },
          {
            en: 'Ensure good lighting',
            my: 'အလင်းရောင် ကောင်းမွန်စေခြင်း'
          },
          {
            en: 'Focus on affected plant parts',
            my: 'ထိခိုက်နေသော အပင်အစိတ်အပိုင်းများကို အာရုံစိုက်ခြင်း'
          },
          {
            en: 'Try a different angle',
            my: 'ထောင့်မတူသော ရှုထောင့်မှ ကြိုးစားကြည့်ခြင်း'
          }
        ]
      }
    ],
    recommendations: [
      {
        en: 'Ensure the plant leaves are clearly visible and in focus when taking photos',
        my: 'ဓာတ်ပုံရိုက်ရာတွင် အပင်အရွက်များ ရှင်းလင်းစွာ မြင်ရပြီး အာရုံစိုက်ထားစေရန် သေချာပါစေ'
      },
      {
        en: 'Use natural lighting and avoid shadows that might obscure plant details',
        my: 'သဘာဝအလင်းရောင်ကို သုံးစွဲပြီး အပင်အသေးစိတ်များကို ဖုံးကွယ်နိုင်သော အရိပ်များကို ရှောင်ကြဉ်ပါ'
      },
      {
        en: 'Position camera at a 45-degree angle to capture both leaf surface and edges',
        my: 'အရွက်မျက်နှာပြင်နှင့် အစွန်းများကို ဖမ်းယူရန် ကင်မရာကို ၄၅ ဒီဂရီ ထောင့်တွင် ထားပါ'
      },
      {
        en: 'Include a reference object (like a coin) to show scale and improve accuracy',
        my: 'အရွယ်အစားပြရန်နှင့် တိကျမှုတိုးတက်စေရန် ကိုးကားရာပစ္စည်း (ဒင်္ဂါးပြားကဲ့သို့) ထည့်သွင်းပါ'
      }
    ]
  },
  {
    classIndex: 5,
    name: {
      en: 'Blueberry Healthy',
      my: 'ဘလူးဘယ်ရီ ကျန်းမာ'
    },
    description: {
      en: 'A healthy blueberry plant showing no signs of disease.',
      my: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ဘလူးဘယ်ရီပင်ဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'No symptoms',
        my: 'လက္ခဏာ မရှိ'
      }
    ],
    plantType: {
      en: 'Blueberry',
      my: 'ဘလူးဘယ်ရီ'
    },
    treatments: [
      {
        name: {
          en: 'Preventive Care',
          my: 'ကာကွယ်ရေး စောင့်ရှောက်မှု'
        },
        description: {
          en: 'Maintain plant health through proper care',
          my: 'သင့်တော်သော စောင့်ရှောက်မှုဖြင့် အပင်ကျန်းမာရေး ထိန်းသိမ်းခြင်း'
        },
        steps: [
          {
            en: 'Maintain acidic soil (pH 4.5-5.5)',
            my: 'အက်စစ်ဓာတ်ပါသော မြေဆီလွှာ ထိန်းသိမ်းခြင်း (pH 4.5-5.5)'
          },
          {
            en: 'Provide adequate water',
            my: 'လုံလောက်သော ရေပေးခြင်း'
          },
          {
            en: 'Mulch around plants',
            my: 'အပင်များပတ်လည်တွင် မြေဖုံးခြင်း'
          },
          {
            en: 'Regular pruning',
            my: 'ပုံမှန် ခုတ်ယူခြင်း'
          }
        ]
      }
    ],
    recommendations: [
      {
        en: 'Test soil pH annually and adjust with sulfur or peat moss to maintain acidity',
        my: 'မြေချဉ်ငံဓာတ်ကို နှစ်စဉ်စမပ်ပြီး အက်စစ်ဓာတ်ထိန်းသိမ်းရန် ကန့်သို့မဟုတ် သစ်ဆွေးမြေဆွေး ထည့်သွင်းပါ'
      },
      {
        en: 'Apply organic mulch annually to conserve moisture and suppress weeds',
        my: 'ရေထိန်းသိမ်းရန်နှင့် ပေါင်းပင်များ ထိန်းချုပ်ရန် နှစ်စဉ် သဘာဝမြေဖုံး ထည့်သွင်းပါ'
      },
      {
        en: 'Monitor for signs of iron deficiency and apply chelated iron if needed',
        my: 'သံဓာတ်ချို့တဲ့မှု လက္ခဏာများကို စောင့်ကြည့်ပြီး လိုအပ်ပါက သံဓာတ်ပါသော မြေဩဇာ သုံးစွဲပါ'
      },
      {
        en: 'Prune in late winter to early spring to remove dead wood and improve air circulation',
        my: 'သစ်သေများကို ဖယ်ရှားရန်နှင့် လေဝင်လေထွက် ကောင်းမွန်စေရန် ဆောင်းရာသီနှောင်းပိုင်းမှ နွေဦးရာသီ အစောပိုင်းအထိ ခုတ်ယူပါ'
      }
    ]
  },
  {
    classIndex: 6,
    name: {
      en: 'Cherry Healthy',
      my: 'ချယ်ရီ ကျန်းမာ'
    },
    description: {
      en: 'A healthy cherry tree showing no signs of disease.',
      my: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ချယ်ရီပင်ဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'No symptoms',
        my: 'လက္ခဏာ မရှိ'
      }
    ],
    plantType: {
      en: 'Cherry',
      my: 'ချယ်ရီ'
    },
    treatments: [
      {
        name: {
          en: 'Preventive Care',
          my: 'ကာကွယ်ရေး စောင့်ရှောက်မှု'
        },
        description: {
          en: 'Maintain tree health through proper care',
          my: 'သင့်တော်သော စောင့်ရှောက်မှုဖြင့် ပင်စည်ကျန်းမာရေး ထိန်းသိမ်းခြင်း'
        },
        steps: [
          {
            en: 'Regular pruning',
            my: 'ပုံမှန် ခုတ်ယူခြင်း'
          },
          {
            en: 'Proper fertilization',
            my: 'သင့်တော်သော မြေဩဇာ သုံးစွဲခြင်း'
          },
          {
            en: 'Adequate irrigation',
            my: 'လုံလောက်သော ရေသွင်းခြင်း'
          },
          {
            en: 'Pest monitoring',
            my: 'ပိုးမွှားများ စောင့်ကြည့်ခြင်း'
          }
        ]
      }
    ],
    recommendations: [
      {
        en: 'Prune cherry trees in late winter to early spring to promote healthy growth and fruit production',
        my: 'ကျန်းမာသော ကြီးထွားမှုနှင့် အသီးထွက်ရှိမှုကို အားပေးရန် ချယ်ရီပင်များကို ဆောင်းရာသီနှောင်းပိုင်းမှ နွေဦးရာသီ အစောပိုင်းအထိ ခုတ်ယူပါ'
      },
      {
        en: 'Apply balanced fertilizer in early spring and after harvest to maintain tree vigor',
        my: 'ပင်အားကောင်းအောင် ထိန်းသိမ်းရန် နွေဦးရာသီ အစောပိုင်းနှင့် ရိတ်သိမ်းပြီးနောက် မျှတသော မြေဩဇာ သုံးစွဲပါ'
      },
      {
        en: 'Monitor for common cherry pests like cherry fruit fly and implement control measures early',
        my: 'ချယ်ရီသီးယင်ကောင်ကဲ့သို့သော ပိုးမွှားများကို စောင့်ကြည့်ပြီး စောစောစီးစီး ထိန်းချုပ်မှုများ အကောင်အထည်ဖော်ပါ'
      },
      {
        en: 'Ensure proper drainage and avoid overwatering to prevent root rot and other soil-borne diseases',
        my: 'အမြစ်ပုပ်ရောဂါနှင့် အခြားမြေဆီလွှာမှ ကူးစက်သော ရောဂါများကို ကာကွယ်ရန် ရေထုတ်မှု သင့်တင့်အောင် ပြုလုပ်ပြီး ရေလွန်ကဲခြင်းကို ရှောင်ကြဉ်ပါ'
      }
    ]
  },
  {
    classIndex: 7,
    name: {
      en: 'Corn Comyon Rust',
      my: 'ပြောင်း မှိုစွဲရောဂါ'
    },
    description: {
      en: 'A fungal disease that causes rust-colored pustules on corn leaves.',
      my: 'ပြောင်းအရွက်များတွင် သံချေးရောင် အဖုများ ဖြစ်စေသော မှိုရောဂါဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'Rust-colored pustules',
        my: 'သံချေးရောင် အဖုများ'
      },
      {
        en: 'Leaf yellowing',
        my: 'အရွက်များ အဝါရောင် ဖြစ်ခြင်း'
      },
      {
        en: 'Reduced yield',
        my: 'အထွက်နှုန်း လျော့ကျခြင်း'
      }
    ],
    plantType: {
      en: 'Corn',
      my: 'ပြောင်း'
    },
    treatments: [
      {
        name: {
          en: 'Rust Control',
          my: 'မှိုစွဲရောဂါ ထိန်းချုပ်ခြင်း'
        },
        description: {
          en: 'Control comyon rust through cultural and chemical means',
          my: 'ယဉ်ကျေးမှုနှင့် ဓာတုဗေဒဆိုင်ရာ နည်းလမ်းများဖြင့် မှိုစွဲရောဂါကို ထိန်းချုပ်ခြင်း'
        },
        steps: [
          {
            en: 'Use resistant varieties',
            my: 'ခံနိုင်ရည်ရှိသော မျိုးများ သုံးစွဲခြင်း'
          },
          {
            en: 'Apply fungicide',
            my: 'မှိုသတ်ဆေး သုံးစွဲခြင်း'
          },
          {
            en: 'Practice crop rotation',
            my: 'စိုက်ပျိုးမှု လည်ပတ်ခြင်း လုပ်ဆောင်ခြင်း'
          },
          {
            en: 'Control plant density',
            my: 'အပင်သိပ်သည်းမှု ထိန်းချုပ်ခြင်း'
          }
        ]
      }
    ],
    recommendations: [
      {
        en: 'Plant corn early in the season to avoid peak rust pressure during critical growth stages',
        my: 'အရေးကြီးသော ကြီးထွားရာကာလများအတွင်း မှိုစွဲရောဂါ ဖိအားမြင့်မားမှုကို ရှောင်ရှားရန် ရာသီအစောပိုင်းတွင် ပြောင်းစိုက်ပါ'
      },
      {
        en: 'Maintain adequate spacing between plants to improve air circulation and reduce humidity',
        my: 'လေဝင်လေထွက် ကောင်းမွန်စေရန်နှင့် စိုထိုင်းမှု လျော့ကျစေရန် အပင်များအကြား အကွာအဝေး သင့်တင့်အောင် ထိန်းသိမ်းပါ'
      },
      {
        en: 'Monitor weather conditions and apply fungicide preventively before rust development',
        my: 'ရာသီဥတုအခြေအနေများကို စောင့်ကြည့်ပြီး မှိုစွဲရောဂါ ဖွံ့ဖြိုးမှုမတိုင်မီ ကာကွယ်ဆေး မှိုသတ်ဆေး သုံးစွဲပါ'
      },
      {
        en: 'Remove and destroy infected plant debris after harvest to reduce overwintering inoculum',
        my: 'ဆောင်းရာသီတွင် ရောဂါပိုးများ ကျန်ရှိမှုကို လျော့ကျစေရန် ရိတ်သိမ်းပြီးနောက် ရောဂါကူးစက်နေသော အပင်ပစ္စည်းများကို ဖယ်ရှားပြီး ဖျက်ဆီးပါ'
      }
    ]
  },
  {
    classIndex: 8,
    name: {
      en: 'Corn Healthy',
      my: 'ပြောင်း ကျန်းမာ'
    },
    description: {
      en: 'A healthy corn plant showing no signs of disease.',
      my: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ပြောင်းပင်ဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'No symptoms',
        my: 'လက္ခဏာ မရှိ'
      }
    ],
    plantType: {
      en: 'Corn',
      my: 'ပြောင်း'
    },
    treatments: [
      {
        name: {
          en: 'Preventive Care',
          my: 'ကာကွယ်ရေး စောင့်ရှောက်မှု'
        },
        description: {
          en: 'Maintain plant health through proper care',
          my: 'သင့်တော်သော စောင့်ရှောက်မှုဖြင့် အပင်ကျန်းမာရေး ထိန်းသိမ်းခြင်း'
        },
        steps: [
          {
            en: 'Proper fertilization',
            my: 'သင့်တော်သော မြေဩဇာ သုံးစွဲခြင်း'
          },
          {
            en: 'Adequate irrigation',
            my: 'လုံလောက်သော ရေသွင်းခြင်း'
          },
          {
            en: 'Pest monitoring',
            my: 'ပိုးမွှားများ စောင့်ကြည့်ခြင်း'
          },
          {
            en: 'Weed control',
            my: 'ပေါင်းမြက်များ ထိန်းချုပ်ခြင်း'
          }
        ]
      }
    ]
  },
  {
    classIndex: 9,
    name: {
      en: 'Corn Northern Leaf Blight',
      my: 'ပြောင်း မြောက်ပိုင်း အရွက်မီးလောင်ရောဂါ'
    },
    description: {
      en: 'A fungal disease that causes long, gray-green lesions on corn leaves.',
      my: 'ပြောင်းအရွက်များတွင် ရှည်လျားသော မီးခိုးရောင်-အစိမ်းရောင် အနာများ ဖြစ်စေသော မှိုရောဂါဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'Long gray-green lesions',
        my: 'ရှည်လျားသော မီးခိုးရောင်-အစိမ်းရောင် အနာများ'
      },
      {
        en: 'Leaf death',
        my: 'အရွက်များ သေဆုံးခြင်း'
      },
      {
        en: 'Reduced yield',
        my: 'အထွက်နှုန်း လျော့ကျခြင်း'
      }
    ],
    plantType: {
      en: 'Corn',
      my: 'ပြောင်း'
    },
    treatments: [
      {
        name: {
          en: 'Blight Management',
          my: 'မီးလောင်ရောဂါ စီမံခန့်ခွဲမှု'
        },
        description: {
          en: 'Manage northern leaf blight through cultural and chemical controls',
          my: 'ယဉ်ကျေးမှုနှင့် ဓာတုဗေဒဆိုင်ရာ ထိန်းချုပ်မှုများဖြင့် မြောက်ပိုင်း အရွက်မီးလောင်ရောဂါကို စီမံခန့်ခွဲခြင်း'
        },
        steps: [
          {
            en: 'Use resistant varieties',
            my: 'ခံနိုင်ရည်ရှိသော မျိုးများ သုံးစွဲခြင်း'
          },
          {
            en: 'Apply fungicide',
            my: 'မှိုသတ်ဆေး သုံးစွဲခြင်း'
          },
          {
            en: 'Practice crop rotation',
            my: 'စိုက်ပျိုးမှု လည်ပတ်ခြင်း လုပ်ဆောင်ခြင်း'
          },
          {
            en: 'Control plant density',
            my: 'အပင်သိပ်သည်းမှု ထိန်းချုပ်ခြင်း'
          }
        ]
      }
    ]
  },
  {
    classIndex: 10,
    name: {
      en: 'Grape Black Rot',
      my: 'သဖန်းသီး အမဲပုပ်ရောဂါ'
    },
    description: {
      en: 'A fungal disease that affects grape vines, causing black rot on fruit and leaves.',
      my: 'သဖန်းသီးခြံများကို ထိခိုက်စေသော မှိုရောဂါဖြစ်ပြီး အသီးနှင့် အရွက်များတွင် အမဲပုပ်ရောဂါ ဖြစ်စေသည်။'
    },
    symptoms: [
      {
        en: 'Black rot on fruit',
        my: 'အသီးများတွင် အမဲပုပ်ခြင်း'
      },
      {
        en: 'Leaf spots',
        my: 'အရွက်များတွင် အစက်များ'
      },
      {
        en: 'Cankers on stems',
        my: 'ပင်စည်များတွင် အနာများ'
      }
    ],
    plantType: {
      en: 'Grape',
      my: 'သဖန်းသီး'
    },
    treatments: [
      {
        name: {
          en: 'Fungicide Application',
          my: 'မှိုသတ်ဆေး သုံးစွဲခြင်း'
        },
        description: {
          en: 'Apply fungicide to control black rot',
          my: 'အမဲပုပ်ရောဂါကို ထိန်းချုပ်ရန် မှိုသတ်ဆေး သုံးစွဲခြင်း'
        },
        steps: [
          {
            en: 'Remove infected fruit and leaves',
            my: 'ရောဂါကူးစက်နေသော အသီးနှင့် အရွက်များကို ဖယ်ရှားခြင်း'
          },
          {
            en: 'Apply fungicide',
            my: 'မှိုသတ်ဆေး သုံးစွဲခြင်း'
          },
          {
            en: 'Prune infected canes',
            my: 'ရောဂါကူးစက်နေသော အကိုင်းများကို ခုတ်ယူခြင်း'
          },
          {
            en: 'Improve air circulation',
            my: 'လေဝင်လေထွက် ကောင်းမွန်စေခြင်း'
          }
        ]
      }
    ]
  },
  {
    classIndex: 11,
    name: {
      en: 'Grape Esca (Black Measles)',
      my: 'သဖန်းသီး Esca (အမဲစက်ရောဂါ)'
    },
    description: {
      en: 'A fungal disease that causes wood decay in grape vines.',
      my: 'သဖန်းသီးခြံများတွင် သစ်သား ပုပ်သိုးခြင်းကို ဖြစ်စေသော မှိုရောဂါဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'Wood decay',
        my: 'သစ်သား ပုပ်သိုးခြင်း'
      },
      {
        en: 'Leaf yellowing',
        my: 'အရွက်များ အဝါရောင် ဖြစ်ခြင်း'
      },
      {
        en: 'Reduced vigor',
        my: 'အားအင်လျော့ကျခြင်း'
      },
      {
        en: 'Black spots on leaves',
        my: 'အရွက်များတွင် အမဲစက်များ'
      }
    ],
    plantType: {
      en: 'Grape',
      my: 'သဖန်းသီး'
    },
    treatments: [
      {
        name: {
          en: 'Cultural Control',
          my: 'ယဉ်ကျေးမှုဆိုင်ရာ ထိန်းချုပ်မှု'
        },
        description: {
          en: 'Implement cultural practices to manage esca',
          my: 'Esca ရောဂါကို စီမံခန့်ခွဲရန် ယဉ်ကျေးမှုဆိုင်ရာ လုပ်ငန်းများ ဆောင်ရွက်ခြင်း'
        },
        steps: [
          {
            en: 'Prune infected wood',
            my: 'ရောဂါကူးစက်နေသော သစ်သားကို ခုတ်ယူခြင်း'
          },
          {
            en: 'Apply fungicide to pruning wounds',
            my: 'ခုတ်ယူခြင်းကြောင့် ဖြစ်သော ဒဏ်ရာများတွင် မှိုသတ်ဆေး သုံးစွဲခြင်း'
          },
          {
            en: 'Improve air circulation',
            my: 'လေဝင်လေထွက် ကောင်းမွန်စေခြင်း'
          },
          {
            en: 'Control irrigation',
            my: 'ရေသွင်းခြင်း ထိန်းချုပ်ခြင်း'
          }
        ]
      }
    ]
  },
  {
    classIndex: 12,
    name: {
      en: 'Grape Healthy',
      my: 'သဖန်းသီး ကျန်းမာ'
    },
    description: {
      en: 'A healthy grape vine showing no signs of disease.',
      my: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော သဖန်းသီးခြံဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'No symptoms',
        my: 'လက္ခဏာ မရှိ'
      }
    ],
    plantType: {
      en: 'Grape',
      my: 'သဖန်းသီး'
    },
    treatments: [
      {
        name: {
          en: 'Preventive Care',
          my: 'ကာကွယ်ရေး စောင့်ရှောက်မှု'
        },
        description: {
          en: 'Maintain vine health through proper care',
          my: 'သင့်တော်သော စောင့်ရှောက်မှုဖြင့် ခြံကျန်းမာရေး ထိန်းသိမ်းခြင်း'
        },
        steps: [
          {
            en: 'Regular pruning',
            my: 'ပုံမှန် ခုတ်ယူခြင်း'
          },
          {
            en: 'Proper fertilization',
            my: 'သင့်တော်သော မြေဩဇာ သုံးစွဲခြင်း'
          },
          {
            en: 'Adequate irrigation',
            my: 'လုံလောက်သော ရေသွင်းခြင်း'
          },
          {
            en: 'Pest monitoring',
            my: 'ပိုးမွှားများ စောင့်ကြည့်ခြင်း'
          }
        ]
      }
    ]
  },
  {
    classIndex: 13,
    name: {
      en: 'Grape Leaf Blight (Isariopsis Leaf Spot)',
      my: 'သဖန်းသီး အရွက်မီးလောင်ရောဂါ (Isariopsis အရွက်စက်)'
    },
    description: {
      en: 'A fungal disease that causes blight on grape leaves.',
      my: 'သဖန်းသီးအရွက်များတွင် မီးလောင်ရောဂါ ဖြစ်စေသော မှိုရောဂါဖြစ်သည်။'
    },
    symptoms: [
      {
        en: 'Leaf spots',
        my: 'အရွက်များတွင် အစက်များ'
      },
      {
        en: 'Leaf death',
        my: 'အရွက်များ သေဆုံးခြင်း'
      },
      {
        en: 'Reduced vigor',
        my: 'အားအင်လျော့ကျခြင်း'
      },
      {
        en: 'Brown lesions',
        my: 'အညိုရောင် အနာများ'
      }
    ],
    plantType: {
      en: 'Grape',
      my: 'သဖန်းသီး'
    },
    treatments: [
      {
        name: {
          en: 'Blight Control',
          my: 'မီးလောင်ရောဂါ ထိန်းချုပ်ခြင်း'
        },
        description: {
          en: 'Control leaf blight through cultural and chemical means',
          my: 'ယဉ်ကျေးမှုနှင့် ဓာတုဗေဒဆိုင်ရာ နည်းလမ်းများဖြင့် အရွက်မီးလောင်ရောဂါကို ထိန်းချုပ်ခြင်း'
        },
        steps: [
          {
            en: 'Remove infected leaves',
            my: 'ရောဂါကူးစက်နေသော အရွက်များကို ဖယ်ရှားခြင်း'
          },
          {
            en: 'Apply fungicide',
            my: 'မှိုသတ်ဆေး သုံးစွဲခြင်း'
          },
          {
            en: 'Improve air circulation',
            my: 'လေဝင်လေထွက် ကောင်းမွန်စေခြင်း'
          },
          {
            en: 'Control irrigation',
            my: 'ရေသွင်းခြင်း ထိန်းချုပ်ခြင်း'
          }
        ]
      }
    ]
  }
];

// Helper function to get disease info by class index
export function getDiseaseByClassIndex(classIndex: number): PlantDisease | undefined {
  return diseaseMapping.find(disease => disease.classIndex === classIndex);
}
