"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { useTranslations } from 'next-intl';

const FaqSection = () => {
  const t = useTranslations('home.faq');
  
  const faqs = [
    {
      question: t('accuracy.question'),
      answer: t('accuracy.answer')
    },
    {
      question: t('plantTypes.question'),
      answer: t('plantTypes.answer')
    },
    {
      question: t('photoTips.question'),
      answer: t('photoTips.answer')
    },
    {
      question: t('treatment.question'),
      answer: t('treatment.answer')
    },
    {
      question: t('dataSecurity.question'),
      answer: t('dataSecurity.answer')
    },
    {
      question: t('offline.question'),
      answer: t('offline.answer')
    }
  ];

  return (
    <section className="container py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{t('title')}</h2>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;