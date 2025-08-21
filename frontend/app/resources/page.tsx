'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Book, Video, FileText, Users } from 'lucide-react';
import { getLocalizedProperty } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'community';
  category: string;
  image: string;
  readTime?: string;
  duration?: string;
  videoUrl?: string;
  pdfUrl?: string;
  linkUrl?: string;
}

export default function ResourcesPage() {
  const locale = useLocale();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoModal, setVideoModal] = useState<{ open: boolean; url: string }>({ open: false, url: '' });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/resources');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const getResourcesByType = (type: string) => {
    return resources.filter(resource => resource.type === type);
  };

  if (loading) {
    return (
      <div className="container py-12 space-y-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Resources</h1>
        <p className="text-muted-foreground">
          Educational content and resources to help you understand plant diseases, prevention, and treatment methods.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="articles">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex gap-2">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex gap-2">
              <Book className="h-4 w-4" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="community" className="flex gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getResourcesByType('article').map((article) => (
                <Card key={article._id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={article.image}
                      alt={getLocalizedProperty(article.title, locale)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">{getLocalizedProperty(article.category, locale)}</span>
                      {article.readTime && <span className="text-xs text-muted-foreground">{getLocalizedProperty(article.readTime, locale)}</span>}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{getLocalizedProperty(article.title, locale)}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{getLocalizedProperty(article.description, locale)}</p>
                    <Link href={`/resources/articles/${article._id}`}>
                      <Button variant="outline" size="sm">Read Article</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline">View All Articles</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getResourcesByType('video').map((video) => (
                <Card key={video._id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={video.image}
                      alt={getLocalizedProperty(video.title, locale)}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => video.videoUrl && setVideoModal({ open: true, url: video.videoUrl })}>
                      <div className="w-14 h-14 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background/90 transition-colors">
                        <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-primary ml-1" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                        {getLocalizedProperty(video.duration, locale)}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{getLocalizedProperty(video.title, locale)}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{getLocalizedProperty(video.description, locale)}</p>
                    {video.videoUrl ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setVideoModal({ open: true, url: video.videoUrl! })}
                      >
                        Watch Video
                      </Button>
                    ) : (
                      <Link href={`/resources/videos/${video._id}`}>
                        <Button variant="outline" size="sm">Watch Video</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline">View All Videos</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="guides" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getResourcesByType('guide').map((guide) => {
                return (
                  <Card key={guide._id} className="p-6">
                    <div className="mb-4">
                      <Book className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{getLocalizedProperty(guide.title, locale)}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{getLocalizedProperty(guide.description, locale)}</p>
                    {guide.pdfUrl ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(guide.pdfUrl, '_blank')}
                      >
                        Download PDF
                      </Button>
                    ) : (
                      <Link href={`/resources/guides/${guide._id}`}>
                        <Button variant="outline" size="sm">View Guide</Button>
                      </Link>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="community" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getResourcesByType('community').map((community) => (
                <Card key={community._id} className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{getLocalizedProperty(community.title, locale)}</h3>
                  <p className="text-muted-foreground mb-4">
                    {getLocalizedProperty(community.description, locale)}
                  </p>
                  {community.linkUrl ? (
                    <Button onClick={() => window.open(community.linkUrl, '_blank')}>
                      {community.category}
                    </Button>
                  ) : (
                    <Button variant="outline">Coming Soon</Button>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Video Modal */}
      {videoModal.open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setVideoModal({ open: false, url: '' })}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Video Player</h3>
              <button onClick={() => setVideoModal({ open: false, url: '' })} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="aspect-video">
              <iframe
                src={videoModal.url.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}