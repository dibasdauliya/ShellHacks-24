import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Play } from "lucide-react";
import axios from "axios";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;

const searchYouTube = async (query: string) => {
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 5,
        key: YOUTUBE_API_KEY,
      },
    }
  );

  return response.data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.default.url,
  }));
};

export default function YouTubeMobileApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const results = await searchYouTube(searchQuery);
    setSearchResults(results);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <form onSubmit={handleSearch} className="flex items-center p-4 border-b">
        <Input
          type="text"
          placeholder="Search YouTube"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow mr-2"
        />
        <Button type="submit" onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>

      <ScrollArea className="flex-grow">
        {searchResults.length === 0 && (
          <div className="flex items-center justify-center h-full mt-24">
            <p className="text-lg text-gray-400">Search for videos</p>
          </div>
        )}

        {selectedVideo ? (
          <div className="p-4">
            <div className="aspect-video mb-4">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h2 className="text-lg font-semibold mb-2">
              {selectedVideo.title}
            </h2>
            <Button onClick={() => setSelectedVideo(null)} variant="outline">
              Back to results
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 p-4">
            {searchResults.map((video) => (
              <Card key={video.id} className="flex items-center">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-30 h-[90px] object-cover ml-4 rounded-md"
                />
                <CardContent className="flex-grow p-4">
                  <h3 className="font-semibold">{video.title}</h3>
                  <Button
                    onClick={() => setSelectedVideo(video)}
                    variant="ghost"
                    className="mt-2"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
