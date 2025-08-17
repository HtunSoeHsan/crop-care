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
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      
      {/* Search Form */}
      <div className="max-w-4xl mx-auto mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('search')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder={t('searchPlaceholder')}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading || !searchTerm.trim()}>
                  {loading ? t('searching') : t('searchButton')}
                </Button>
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">{t('category')}</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
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
                  <label className="text-sm font-medium">{t('type')}</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
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
                  <label className="text-sm font-medium">{t('language')}</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={filters.language || 'en'}
                    onChange={(e) => updateFilter('language', e.target.value)}
                  >
                    <option value="en">{t('languages.english')}</option>
                    <option value="my">{t('languages.burmese')}</option>
                  </select>
                </div>
              </div>
              
              {Object.keys(filters).some(key => filters[key as keyof SearchFilters]) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('activeFilters')}:</span>
                  {Object.entries(filters).map(([key, value]) => 
                    value && (
                      <Badge key={key} variant="secondary" className="gap-1">
                        {key}: {value}
                        <button
                          onClick={() => updateFilter(key as keyof SearchFilters, '')}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    )
                  )}
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    {t('clearAll')}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Search Results */}
      {error && (
        <div className="max-w-4xl mx-auto mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-destructive">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>{error}</p>
                <Button onClick={performSearch} className="mt-2">
                  {t('tryAgain')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {searchResults && (
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">{t('results.all')} ({searchResults.totalResults})</TabsTrigger>
              <TabsTrigger value="diseases">{t('results.diseases')} ({searchResults.diseases?.length || 0})</TabsTrigger>
              <TabsTrigger value="plants">{t('results.plants')} ({searchResults.plantGuides?.length || 0})</TabsTrigger>
              <TabsTrigger value="foods">{t('results.foods')} ({searchResults.healthyFoods?.length || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-6 space-y-6">
              {/* Diseases */}
              {searchResults.diseases?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {t('results.diseases')} ({searchResults.diseases?.length || 0})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                {disease.symptoms?.slice(0, 3).map((symptom: any, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {getLocalizedProperty(symptom, locale)}
                                  </Badge>
                                ))}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.healthyFoods?.map((food: any, index: number) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{getLocalizedProperty(food.name, locale)}</CardTitle>
                          <Badge variant="outline">{food.category}</Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{getLocalizedProperty(food.benefits, locale)}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium">Nutrients:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {food.nutrients.slice(0, 4).map((nutrient: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {getLocalizedProperty(nutrient, locale)}
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
                </div>
              )}

              {searchResults.totalResults === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-8 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">{t('noResults')}</h3>
                  <p>{t('noResultsDesc')}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="diseases" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            {disease.symptoms?.slice(0, 3).map((symptom: any, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {typeof symptom === 'string' ? symptom : getLocalizedProperty(symptom, locale) || 'N/A'}
                              </Badge>
                            ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults?.healthyFoods?.map((food: any, index: number) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{getLocalizedProperty(food.name, locale)}</CardTitle>
                      <Badge variant="outline">{food.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{getLocalizedProperty(food.benefits, locale)}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium">Nutrients:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {food.nutrients.slice(0, 4).map((nutrient: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {getLocalizedProperty(nutrient, locale)}
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
        </div>
      )}
    </div>
  );
}