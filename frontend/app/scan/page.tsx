import ScanForm from '@/components/scan/scan-form';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, Leaf } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function ScanPage() {
  const t = useTranslations('scan');
  const tTips = useTranslations('scan.tips');
  const tExpectations = useTranslations('scan.expectations');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
        
        {/* Main Scan Form - Full Width */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
            <div className="p-8 lg:p-12">
              <ScanForm />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tips Section - Wide Grid Layout */}
      <div className="bg-white border-t border-slate-200/50">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">{tTips('title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Follow these best practices for accurate plant disease detection
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 lg:p-10 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-500 text-white rounded-2xl w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-blue-900">{tTips('clearPhotos.title')}</h3>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">
                {tTips('clearPhotos.description')}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-8 lg:p-10 border border-green-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-500 text-white rounded-2xl w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-green-900">{tTips('multipleAngles.title')}</h3>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">
                {tTips('multipleAngles.description')}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-8 lg:p-10 border border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-500 text-white rounded-2xl w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-purple-900">{tTips('includeContext.title')}</h3>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">
                {tTips('includeContext.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expectations Section - Enhanced Layout */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">{tExpectations('title')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover what our AI-powered analysis provides for your plant care journey
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
              {/* Left Side - Features Grid */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="bg-primary/10 text-primary rounded-2xl w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900">{tExpectations('diseaseIdentification.title')}</h3>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {tExpectations('diseaseIdentification.description')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="bg-primary/10 text-primary rounded-2xl w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900">{tExpectations('diseaseInformation.title')}</h3>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {tExpectations('diseaseInformation.description')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="bg-primary/10 text-primary rounded-2xl w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900">{tExpectations('treatmentRecommendations.title')}</h3>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {tExpectations('treatmentRecommendations.description')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="bg-primary/10 text-primary rounded-2xl w-14 h-14 flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900">{tExpectations('preventionTips.title')}</h3>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {tExpectations('preventionTips.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Enhanced Image */}
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200/50">
                  <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200/50">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent z-10" />
                    <Image
                      src="https://images.pexels.com/photos/6231713/pexels-photo-6231713.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="Plant disease analysis"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <p className="text-lg font-semibold text-center text-slate-800">
                          {tExpectations('dataDrivenDecisions')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}