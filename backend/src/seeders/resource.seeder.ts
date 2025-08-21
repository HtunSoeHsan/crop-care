import Resource from '../models/Resource';

const resourcesData = [
  // Articles
  {
    title: "Understanding Common Plant Diseases",
    description: "Learn about the most prevalent plant diseases, their causes, and how to identify them.",
    type: "article",
    category: "Education",
    image: "https://images.pexels.com/photos/7228341/pexels-photo-7228341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    readTime: "5 min read",
    content: "Plant diseases are a major concern for gardeners and farmers alike. Understanding the common types of diseases that affect plants is crucial for maintaining healthy crops and gardens...",
    tags: ["plant diseases", "education", "identification"]
  },
  {
    title: "Organic Treatment Methods for Plant Diseases",
    description: "Explore natural and organic approaches to treating various plant diseases without harmful chemicals.",
    type: "article",
    category: "Treatment",
    image: "https://images.pexels.com/photos/5503270/pexels-photo-5503270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    readTime: "8 min read",
    content: "Organic treatment methods offer safe and environmentally friendly alternatives to chemical pesticides...",
    tags: ["organic", "treatment", "natural remedies"]
  },
  {
    title: "Preventive Measures to Keep Plants Healthy",
    description: "Discover proactive strategies to prevent plant diseases from affecting your garden.",
    type: "article",
    category: "Prevention",
    image: "https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    readTime: "6 min read",
    content: "Prevention is always better than cure when it comes to plant diseases. Here are key strategies...",
    tags: ["prevention", "garden care", "plant health"]
  },
  {
    title: "The Science Behind Plant Immunity",
    description: "Understand how plants defend themselves against diseases and how you can boost their natural immunity.",
    type: "article",
    category: "Science",
    image: "https://images.pexels.com/photos/6231763/pexels-photo-6231763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    readTime: "10 min read",
    content: "Plants have evolved sophisticated defense mechanisms to protect themselves from pathogens...",
    tags: ["plant immunity", "science", "defense mechanisms"]
  },
  
  // Videos
  {
    title: "How to Identify Tomato Blight",
    description: "A visual guide to identifying early and late blight in tomato plants with treatment options.",
    type: "video",
    category: "Identification",
    image: "https://images.pexels.com/photos/5731866/pexels-photo-5731866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    duration: "5:24",
    videoUrl: "https://example.com/videos/tomato-blight",
    tags: ["tomato", "blight", "identification", "video"]
  },
  {
    title: "Organic Pest Control Methods",
    description: "Learn how to make and apply organic pesticides to protect your plants from insects and diseases.",
    type: "video",
    category: "Treatment",
    image: "https://images.pexels.com/photos/7342247/pexels-photo-7342247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    duration: "8:12",
    videoUrl: "https://example.com/videos/organic-pest-control",
    tags: ["organic", "pest control", "treatment", "video"]
  },
  {
    title: "Setting Up a Healthy Garden",
    description: "Tips and techniques for creating a garden environment that naturally resists diseases.",
    type: "video",
    category: "Prevention",
    image: "https://images.pexels.com/photos/4917093/pexels-photo-4917093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    duration: "12:45",
    videoUrl: "https://example.com/videos/healthy-garden",
    tags: ["garden setup", "prevention", "healthy environment", "video"]
  },
  {
    title: "Diagnosing Nutrient Deficiencies",
    description: "How to recognize the signs of various nutrient deficiencies in your plants and correct them.",
    type: "video",
    category: "Diagnosis",
    image: "https://images.pexels.com/photos/4505174/pexels-photo-4505174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    duration: "7:33",
    videoUrl: "https://example.com/videos/nutrient-deficiencies",
    tags: ["nutrients", "deficiency", "diagnosis", "video"]
  },
  
  // Guides
  {
    title: "Comprehensive Plant Disease Guide",
    description: "A detailed reference guide to common plant diseases, their symptoms, and treatment options.",
    type: "guide",
    category: "Reference",
    image: "https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg",
    pdfUrl: "https://example.com/guides/plant-disease-guide.pdf",
    tags: ["comprehensive", "reference", "diseases", "guide"]
  },
  {
    title: "Seasonal Plant Care Calendar",
    description: "Monthly tasks and preventive measures to keep your plants healthy throughout the year.",
    type: "guide",
    category: "Seasonal Care",
    image: "https://images.pexels.com/photos/4917093/pexels-photo-4917093.jpeg",
    pdfUrl: "https://example.com/guides/seasonal-care-calendar.pdf",
    tags: ["seasonal", "calendar", "care", "guide"]
  },
  {
    title: "Organic Treatments Handbook",
    description: "Recipes and application methods for homemade, organic plant disease treatments.",
    type: "guide",
    category: "Organic Treatment",
    image: "https://images.pexels.com/photos/5503270/pexels-photo-5503270.jpeg",
    pdfUrl: "https://example.com/guides/organic-treatments.pdf",
    tags: ["organic", "treatments", "recipes", "guide"]
  },
  {
    title: "Garden Planning for Disease Prevention",
    description: "Learn how to design your garden to minimize disease spread through companion planting and spacing.",
    type: "guide",
    category: "Garden Design",
    image: "https://images.pexels.com/photos/7228341/pexels-photo-7228341.jpeg",
    pdfUrl: "https://example.com/guides/garden-planning.pdf",
    tags: ["garden design", "prevention", "companion planting", "guide"]
  },
  {
    title: "Diagnosis Flowcharts",
    description: "Step-by-step flowcharts to help you diagnose plant problems accurately.",
    type: "guide",
    category: "Diagnosis",
    image: "https://images.pexels.com/photos/6231763/pexels-photo-6231763.jpeg",
    pdfUrl: "https://example.com/guides/diagnosis-flowcharts.pdf",
    tags: ["diagnosis", "flowcharts", "troubleshooting", "guide"]
  },
  {
    title: "Plant Recovery Guide",
    description: "Techniques for helping plants recover after disease treatment and preventing recurrence.",
    type: "guide",
    category: "Recovery",
    image: "https://images.pexels.com/photos/4505174/pexels-photo-4505174.jpeg",
    pdfUrl: "https://example.com/guides/plant-recovery.pdf",
    tags: ["recovery", "treatment", "prevention", "guide"]
  },
  
  // Community
  {
    title: "Community Forums",
    description: "Join discussions with other gardeners, share your experiences, and get help with plant disease issues.",
    type: "community",
    category: "Join the Community",
    image: "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
    linkUrl: "https://forum.example.com",
    tags: ["community", "forum", "discussion"]
  },
  {
    title: "Expert Q&A Sessions",
    description: "Weekly live sessions with plant pathologists and horticulture experts to answer your questions.",
    type: "community",
    category: "View Schedule",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
    linkUrl: "https://calendar.example.com",
    tags: ["expert", "qa", "live sessions"]
  }
];

export const seedResources = async () => {
  try {
    await Resource.deleteMany({});
    await Resource.insertMany(resourcesData);
    console.log('✅ Resources seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding resources:', error);
  }
};