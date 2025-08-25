"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Leaf, Apple, Heart, AlertTriangle } from 'lucide-react';
import { SearchService, SearchFilters, SearchResult } from '@/lib/api-service';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedProperty } from '@/lib/utils';

export default function SearchPage() {
  const t = useTranslations('search');
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [activeTab, setActiveTab] = useState('all');

  const performSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (activeTab) {
        case 'diseases':
          response = await SearchService.searchDiseases(searchTerm, filters);
          break;
        case 'plants':
          response = await SearchService.searchPlantGuides(searchTerm, filters);
          break;
        case 'foods':
          response = await SearchService.searchHealthyFoods(searchTerm, filters);
          break;
        default:
          response = await SearchService.searchAll(searchTerm, filters);
      }
      
      setSearchResults(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed px-4">
            {t('description')}
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Left Sidebar */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-600" />
                    {t('search')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <Input
                        type="search"
                        placeholder={t('searchPlaceholder')}
                        className="pl-9 h-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading || !searchTerm.trim()}
                      className="w-full h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-medium"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          {t('searching')}
                        </div>
                      ) : (
                        t('searchButton')
                      )}
                    </Button>
                  </form>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Filter className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Filters</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">{t('category')}</label>
                        <select
                          className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 bg-white"
                          value={filters.category || ''}
                          onChange={(e) => updateFilter('category', e.target.value)}
                        >
                          <option value="">{t('allCategories')}</option>
                          <option value="vegetables">{t('categories.vegetables')}</option>
                          <option value="fruits">{t('categories.fruits')}</option>
                          <option value="herbs">{t('categories.herbs')}</option>
                          <option value="flowers">{t('categories.flowers')}</option>
                          <option value="leafy-greens">{t('categories.leafyGreens')}</option>
                          <option value="berries">{t('categories.berries')}</option>
                          <option value="grains">{t('categories.grains')}</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">{t('type')}</label>
                        <select
                          className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 bg-white"
                          value={filters.type || ''}
                          onChange={(e) => updateFilter('type', e.target.value)}
                        >
                          <option value="">{t('allTypes')}</option>
                          <option value="diseases">{t('types.diseases')}</option>
                          <option value="plants">{t('types.plants')}</option>
                          <option value="foods">{t('types.foods')}</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">{t('language')}</label>
                        <select
                          className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 bg-white"
                          value={filters.language || 'en'}
                          onChange={(e) => updateFilter('language', e.target.value)}
                        >
                          <option value="en">{t('languages.english')}</option>
                          <option value="my">{t('languages.burmese')}</option>
                        </select>
                      </div>
                    </div>
                    
                    {Object.keys(filters).some(key => filters[key as keyof SearchFilters]) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {Object.entries(filters).map(([key, value]) => 
                            value && (
                              <Badge key={key} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                {key}: {value}
                                <button
                                  onClick={() => updateFilter(key as keyof SearchFilters, '')}
                                  className="ml-1 hover:text-red-600"
                                >
                                  ×
                                </button>
                              </Badge>
                            )
                          )}
                        </div>
                        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full text-xs">
                          {t('clearAll')}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 min-w-0 w-full">
            {error && (
              <Card className="border-red-200 bg-red-50 mb-8">
                <CardContent className="p-6">
                  <div className="text-center text-red-600">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">{error}</p>
                    <Button onClick={performSearch} className="mt-4 bg-red-600 hover:bg-red-700">
                      {t('tryAgain')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {searchResults && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 bg-white shadow-sm border border-gray-200">
                <TabsTrigger value="all" className="data-[state=active]:bg-green-600 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 py-2">
                  <span className="hidden sm:inline">{t('results.all')}</span>
                  <span className="sm:hidden">All</span>
                  <span className="ml-1">({searchResults.totalResults})</span>
                </TabsTrigger>
                <TabsTrigger value="diseases" className="data-[state=active]:bg-green-600 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 py-2">
                  <span className="hidden sm:inline">{t('results.diseases')}</span>
                  <span className="sm:hidden">Diseases</span>
                  <span className="ml-1">({searchResults.diseases?.length || 0})</span>
                </TabsTrigger>
                <TabsTrigger value="plants" className="data-[state=active]:bg-green-600 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 py-2">
                  <span className="hidden sm:inline">{t('results.plants')}</span>
                  <span className="sm:hidden">Plants</span>
                  <span className="ml-1">({searchResults.plantGuides?.length || 0})</span>
                </TabsTrigger>
                <TabsTrigger value="foods" className="data-[state=active]:bg-green-600 data-[state=active]:text-white font-medium text-xs sm:text-sm px-2 py-2">
                  <span className="hidden sm:inline">{t('results.foods')}</span>
                  <span className="sm:hidden">Foods</span>
                  <span className="ml-1">({searchResults.healthyFoods?.length || 0})</span>
                </TabsTrigger>
              </TabsList>
            
            <TabsContent value="all" className="pt-6 space-y-6">
              {/* Diseases */}
              {searchResults.diseases?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {t('results.diseases')} ({searchResults.diseases?.length || 0})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.diseases?.map((disease: any, index: number) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{getLocalizedProperty(disease.name, locale)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{getLocalizedProperty(disease.description, locale)}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium">Symptoms:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Array.isArray(disease.symptoms) ? disease.symptoms.slice(0, 3).map((symptom: any, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {getLocalizedProperty(symptom, locale)}
                                  </Badge>
                                )) : null}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-medium">Plant Type:</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {getLocalizedProperty(disease.plantType, locale)}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Plant Guides */}
              {searchResults.plantGuides?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    {t('results.plants')} ({searchResults.plantGuides?.length || 0})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.plantGuides?.map((guide: any, index: number) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{getLocalizedProperty(guide.plantName, locale)}</CardTitle>
                          <Badge variant="outline">{guide.category}</Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{getLocalizedProperty(guide.description, locale)}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium">Care:</span>
                              <div className="text-xs text-muted-foreground">
                                <p>Watering: {getLocalizedProperty(guide.careInstructions.watering, locale)}</p>
                                <p>Sunlight: {getLocalizedProperty(guide.careInstructions.sunlight, locale)}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {guide.tags.slice(0, 3).map((tag: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Healthy Foods */}
              {searchResults.healthyFoods?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Apple className="h-5 w-5 text-orange-500" />
                    {t('results.foods')} ({searchResults.healthyFoods?.length || 0})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {searchResults.healthyFoods?.map((food: any, index: number) => (
                      <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white/80 backdrop-blur-sm overflow-hidden group">
                        {food.imageUrl && (
                          <div className="w-full h-32 sm:h-40 lg:h-48 overflow-hidden">
                            <img 
                              src={food.imageUrl} 
                              alt={getLocalizedProperty(food.title, locale)} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => e.currentTarget.style.display = 'none'}
                            />
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                              {getLocalizedProperty(food.title, locale)}
                            </CardTitle>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                              {food.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {getLocalizedProperty(food.description, locale)}
                          </p>
                          <div className="space-y-3">
                            <div>
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Benefits</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(food.keyBenefits?.[locale] || food.keyBenefits?.en || []).slice(0, 2).map((benefit: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Nutrients</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(food.keyNutrients?.[locale] || food.keyNutrients?.en || []).slice(0, 2).map((nutrient: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                    {nutrient}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Season</span>
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                {food.season}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.totalResults === 0 && (
                <div className="text-center py-16">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('noResults')}</h3>
                  <p className="text-gray-600 max-w-md mx-auto">{t('noResultsDesc')}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="diseases" className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults?.diseases?.map((disease: any, index: number) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{getLocalizedProperty(disease.name, locale)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{getLocalizedProperty(disease.description, locale)}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium">Symptoms:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Array.isArray(disease.symptoms) ? disease.symptoms.slice(0, 3).map((symptom: any, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {getLocalizedProperty(symptom, locale)}
                              </Badge>
                            )) : null}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium">Affects:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {disease.plantTypes?.slice(0, 3).map((plant: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {plant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="plants" className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults?.plantGuides?.map((guide: any, index: number) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{getLocalizedProperty(guide.plantName, locale)}</CardTitle>
                      <Badge variant="outline">{guide.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{getLocalizedProperty(guide.description, locale)}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium">Care:</span>
                          <div className="text-xs text-muted-foreground">
                            <p>Watering: {getLocalizedProperty(guide.careInstructions.watering, locale)}</p>
                            <p>Sunlight: {getLocalizedProperty(guide.careInstructions.sunlight, locale)}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {guide.tags.slice(0, 3).map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="foods" className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults?.healthyFoods?.map((food: any, index: number) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    {food.imageUrl && (
                      <div className="w-full h-32 sm:h-40 lg:h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={food.imageUrl} 
                          alt={getLocalizedProperty(food.title, locale)} 
                          className="w-full h-full object-cover"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{getLocalizedProperty(food.title, locale)}</CardTitle>
                      <Badge variant="outline">{food.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{getLocalizedProperty(food.description, locale)}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium">Benefits:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(food.keyBenefits?.[locale] || food.keyBenefits?.en || []).slice(0, 3).map((benefit: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium">Nutrients:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(food.keyNutrients?.[locale] || food.keyNutrients?.en || []).slice(0, 3).map((nutrient: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {nutrient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium">Season:</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {food.season}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}