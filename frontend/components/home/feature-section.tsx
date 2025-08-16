import { Leaf, Search, Sparkles, Shield, Zap, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FeatureSection = () => {
  const t = useTranslations('home.features');
  
  const features = [
    {
      icon: Leaf,
      title: t('diseaseDetection'),
      description: t('diseaseDetectionDesc')
    },
    {
      icon: Sparkles,
      title: t('treatment'),
      description: t('treatmentDesc')
    },
    {
      icon: Search,
      title: t('healthyFoodDatabase'),
      description: t('healthyFoodDatabaseDesc')
    },
    {
      icon: Shield,
      title: t('preventiveCare'),
      description: t('preventiveCareDesc')
    },
    {
      icon: Zap,
      title: t('instantResults'),
      description: t('instantResultsDesc')
    },
    {
      icon: BookOpen,
      title: t('educationalResources'),
      description: t('educationalResourcesDesc')
    }
  ];

  return (
    <section className="container py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{t('keyFeatures')}</h2>
        <p className="text-muted-foreground">
          {t('comprehensiveTools')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="group flex flex-col p-6 border rounded-lg bg-card hover:shadow-md transition-all">
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureSection;
