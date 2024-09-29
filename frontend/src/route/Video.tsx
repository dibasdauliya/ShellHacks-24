import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Play, Loader } from "lucide-react";
import axios from "axios";
import { Constants } from "@/Constants";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: Constants.API_URL + "/api/validquery/",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        data: {
          query: searchQuery,
        },
      };

      try {
        const response = await axios.request(config);
        const { status, comment } = JSON.parse(response.data.response);
        console.log(JSON.parse(response.data.response));

        if (status === true) {
          const results = await searchYouTube(searchQuery);
          setSearchResults(results);
        } else {
          alert(comment);
          setSearchQuery("");
        }
      } catch (error) {
        console.error("Error making API request:", error);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setIsLoading(false);
    }
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          Search
        </Button>
      </form>

      <ScrollArea className="flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-full mt-24">
            <Loader className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex items-center justify-center h-full mt-24">
            <p className="text-lg text-gray-400">Search for videos</p>
          </div>
        ) : selectedVideo ? (
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
                  className="w-30 h-[90px] object-cover mt-3 ml-3 mb-3 self-start rounded-md"
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
