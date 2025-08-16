import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');
  
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-bold">AyarCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {tCommon('description')}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary">{tCommon('home')}</Link></li>
              <li><Link href="/scan" className="text-sm text-muted-foreground hover:text-primary">{tCommon('scan')}</Link></li>
              <li><Link href="/search" className="text-sm text-muted-foreground hover:text-primary">{tCommon('search')}</Link></li>
              <li><Link href="/resources" className="text-sm text-muted-foreground hover:text-primary">{tCommon('resources')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">{t('resources')}</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">{t('blog')}</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="/diseases" className="text-sm text-muted-foreground hover:text-primary">{t('diseaseDatabase')}</Link></li>
              <li><Link href="/treatments" className="text-sm text-muted-foreground hover:text-primary">{t('treatmentGuide')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">{t('contact')}</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">support@ayarcare.com</li>
              <li className="text-sm text-muted-foreground">+1 (555) 123-4567</li>
              <li className="text-sm text-muted-foreground">123 Green Street, Plant City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AyarCare. {t('rights')}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">{t('privacyPolicy')}</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">{t('termsOfService')}</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">{t('contactUs')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;