'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import 'quill/dist/quill.snow.css';

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  content?: string;
  readTime?: string;
  tags: string[];
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/resources/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Link href="/resources">
          <Button>Back to Resources</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <Link href="/resources" className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Resources
      </Link>
      
      <article>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-muted px-2 py-1 rounded-full">{article.category}</span>
            {article.readTime && <span className="text-xs text-muted-foreground">{article.readTime}</span>}
          </div>
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{article.description}</p>
        </div>

        <div className="relative h-64 mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          {article.content ? (
            <div 
              className="ql-editor text-base leading-relaxed p-0"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-muted-foreground">Content not available for this article.</p>
          )}
        </div>

        {article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-medium mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}