"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Search, Loader2 } from "lucide-react";

interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
}

interface NewsResponse {
  articles: Article[];
}

const API_KEY = import.meta.env.VITE_NEWS_API;

if (!API_KEY) {
  throw new Error("VITE_NEWS_API is not set");
}

export async function fetchNews(query: string = ""): Promise<NewsResponse> {
  const url = query
    ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&apiKey=${API_KEY}`
    : `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  return res.json();
}

export default function NewsPage() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInitialNews();
  }, []);

  const fetchInitialNews = async () => {
    try {
      const data = await fetchNews();
      setNews(data.articles);
    } catch (err) {
      setError("Failed to fetch initial news");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNews(searchQuery);
      setNews(data.articles);
    } catch (err) {
      setError("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-xl font-bold">News App</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("work in progress")}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>

        {error && (
          <Card className="mb-6 bg-destructive/15">
            <CardContent className="p-4">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && (
          <div className="space-y-6">
            {news.map((article, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="text-muted-foreground mb-4">
                    {article.description}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(article.url, "_blank", "noopener,noreferrer")
                    }
                  >
                    Read more
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && news.length === 0 && (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground">
                No news articles to display. Try searching for a topic.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
