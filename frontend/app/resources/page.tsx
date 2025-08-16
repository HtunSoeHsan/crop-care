import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Book, Video, FileText, Users } from 'lucide-react';
import { getLocalizedProperty } from '@/lib/utils';
import { useLocale } from 'next-intl';

export default function ResourcesPage() {
  const locale = useLocale();
  
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
              {[
                {
                  title: "Understanding Common Plant Diseases",
                  description: "Learn about the most prevalent plant diseases, their causes, and how to identify them.",
                  image: "https://images.pexels.com/photos/7228341/pexels-photo-7228341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  category: "Education",
                  readTime: "5 min read"
                },
                {
                  title: "Organic Treatment Methods for Plant Diseases",
                  description: "Explore natural and organic approaches to treating various plant diseases without harmful chemicals.",
                  image: "https://images.pexels.com/photos/5503270/pexels-photo-5503270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  category: "Treatment",
                  readTime: "8 min read"
                },
                {
                  title: "Preventive Measures to Keep Plants Healthy",
                  description: "Discover proactive strategies to prevent plant diseases from affecting your garden.",
                  image: "https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  category: "Prevention",
                  readTime: "6 min read"
                },
                {
                  title: "The Science Behind Plant Immunity",
                  description: "Understand how plants defend themselves against diseases and how you can boost their natural immunity.",
                  image: "https://images.pexels.com/photos/6231763/pexels-photo-6231763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  category: "Science",
                  readTime: "10 min read"
                }
              ].map((article, index) => (
                <Card key={index} className="overflow-hidden">
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
                      <span className="text-xs text-muted-foreground">{getLocalizedProperty(article.readTime, locale)}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{getLocalizedProperty(article.title, locale)}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{getLocalizedProperty(article.description, locale)}</p>
                    <Link href={`/resources/articles/${index}`}>
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
              {[
                {
                  title: "How to Identify Tomato Blight",
                  description: "A visual guide to identifying early and late blight in tomato plants with treatment options.",
                  image: "https://images.pexels.com/photos/5731866/pexels-photo-5731866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  duration: "5:24"
                },
                {
                  title: "Organic Pest Control Methods",
                  description: "Learn how to make and apply organic pesticides to protect your plants from insects and diseases.",
                  image: "https://images.pexels.com/photos/7342247/pexels-photo-7342247.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  duration: "8:12"
                },
                {
                  title: "Setting Up a Healthy Garden",
                  description: "Tips and techniques for creating a garden environment that naturally resists diseases.",
                  image: "https://images.pexels.com/photos/4917093/pexels-photo-4917093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  duration: "12:45"
                },
                {
                  title: "Diagnosing Nutrient Deficiencies",
                  description: "How to recognize the signs of various nutrient deficiencies in your plants and correct them.",
                  image: "https://images.pexels.com/photos/4505174/pexels-photo-4505174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                  duration: "7:33"
                }
              ].map((video, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={video.image}
                      alt={getLocalizedProperty(video.title, locale)}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-primary ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                      {getLocalizedProperty(video.duration, locale)}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{getLocalizedProperty(video.title, locale)}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{getLocalizedProperty(video.description, locale)}</p>
                    <Link href={`/resources/videos/${index}`}>
                      <Button variant="outline" size="sm">Watch Video</Button>
                    </Link>
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
              {[
                {
                  title: "Comprehensive Plant Disease Guide",
                  description: "A detailed reference guide to common plant diseases, their symptoms, and treatment options.",
                  icon: Book
                },
                {
                  title: "Seasonal Plant Care Calendar",
                  description: "Monthly tasks and preventive measures to keep your plants healthy throughout the year.",
                  icon: Book
                },
                {
                  title: "Organic Treatments Handbook",
                  description: "Recipes and application methods for homemade, organic plant disease treatments.",
                  icon: Book
                },
                {
                  title: "Garden Planning for Disease Prevention",
                  description: "Learn how to design your garden to minimize disease spread through companion planting and spacing.",
                  icon: Book
                },
                {
                  title: "Diagnosis Flowcharts",
                  description: "Step-by-step flowcharts to help you diagnose plant problems accurately.",
                  icon: Book
                },
                {
                  title: "Plant Recovery Guide",
                  description: "Techniques for helping plants recover after disease treatment and preventing recurrence.",
                  icon: Book
                }
              ].map((guide, index) => {
                const Icon = guide.icon;
                return (
                  <Card key={index} className="p-6">
                    <div className="mb-4">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{getLocalizedProperty(guide.title, locale)}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{getLocalizedProperty(guide.description, locale)}</p>
                    <Link href={`/resources/guides/${index}`}>
                      <Button variant="outline" size="sm">Download PDF</Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="community" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Community Forums</h3>
                <p className="text-muted-foreground mb-4">
                  Join discussions with other gardeners, share your experiences, and get help with plant disease issues.
                </p>
                <Button>Join the Community</Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Expert Q&A Sessions</h3>
                <p className="text-muted-foreground mb-4">
                  Weekly live sessions with plant pathologists and horticulture experts to answer your questions.
                </p>
                <Button>View Schedule</Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">User Success Stories</h3>
                <p className="text-muted-foreground mb-4">
                  Read about how other users successfully diagnosed and treated plant diseases using AyarCare.
                </p>
                <Button variant="outline">Read Success Stories</Button>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contribute to Our Database</h3>
                <p className="text-muted-foreground mb-4">
                  Help improve our disease detection by submitting verified cases and treatment outcomes.
                </p>
                <Button variant="outline">Learn How to Contribute</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}