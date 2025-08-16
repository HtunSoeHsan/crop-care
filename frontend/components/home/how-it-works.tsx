"use client";

import Image from 'next/image';
import { Camera, Search, FlaskRound, Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';

const HowItWorks = () => {
  const t = useTranslations('home.howItWorks');
  
  const steps = [
    {
      icon: Camera,
      title: t('takePhoto'),
      description: t('takePhotoDesc')
    },
    {
      icon: Search,
      title: t('aiAnalysis'),
      description: t('aiAnalysisDesc')
    },
    {
      icon: FlaskRound,
      title: t('getResults'),
      description: t('getResultsDesc')
    },
    {
      icon: Lightbulb,
      title: t('treatmentPlan'),
      description: t('treatmentPlanDesc')
    }
  ];

  return (
    <section className="bg-muted py-12">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{t('title')}</h2>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-card rounded-lg p-6 border relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="mb-4 pt-2">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 relative rounded-lg overflow-hidden border">
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20 z-10" />
          <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">{t('seeItInAction')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('seeItInActionDesc')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                  <p className="font-medium mb-1">{t('diseasesIdentified')}</p>
                  <p className="text-sm text-muted-foreground">{t('diseasesIdentified')}</p>
                </div>
                <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                  <p className="font-medium mb-1">{t('accuracyRate')}</p>
                  <p className="text-sm text-muted-foreground">{t('accuracyRate')}</p>
                </div>
                <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                  <p className="font-medium mb-1">{t('processingTime')}</p>
                  <p className="text-sm text-muted-foreground">{t('processingTime')}</p>
                </div>
                <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                  <p className="font-medium mb-1">{t('treatmentOptions')}</p>
                  <p className="text-sm text-muted-foreground">{t('treatmentOptions')}</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 h-[300px] md:h-[400px] relative rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/7728395/pexels-photo-7728395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt={"Plant disease analysis"}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;