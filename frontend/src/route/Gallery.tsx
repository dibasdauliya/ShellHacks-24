import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Share, Info } from "lucide-react";
import axios from "axios";
import { Constants } from "@/Constants";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  //   const images = [
  //     {
  //       id: 1,
  //       src: "/placeholder.svg?height=300&width=300",
  //       alt: "Gallery image 1",
  //     },
  //     {
  //       id: 2,
  //       src: "/placeholder.svg?height=300&width=300",
  //       alt: "Gallery image 2",
  //     },
  //     {
  //       id: 3,
  //       src: "/placeholder.svg?height=300&width=300",
  //       alt: "Gallery image 3",
  //     },
  //     {
  //       id: 4,
  //       src: "/placeholder.svg?height=300&width=300",
  //       alt: "Gallery image 4",
  //     },
  //     {
  //       id: 5,
  //       src: "/placeholder.svg?height=300&width=300",
  //       alt: "Gallery image 5",
  //     },
  //     {
  //       id: 6,
  //       src: "/placeholder.svg?height=300&width=300",
  //       alt: "Gallery image 6",
  //     },
  //   ];
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get(Constants.API_URL + "/api/images/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        console.log({ response: response.data });
        setImages(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchImages();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
        {/* <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button> */}
        <h1 className="text-xl font-semibold">Gallery</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-6 w-6" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Share className="h-6 w-6" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.image}
                alt={image.alt}
                className="hover:opacity-80 object-cover transition-opacity cursor-pointer"
              />
            </div>
          ))}
        </div>
      </main>

      {selectedImage && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg max-w-3xl w-full mx-4">
            <div className="relative aspect-video mb-4">
              <img src={selectedImage.image} alt={selectedImage.alt} />
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}
              >
                <Info className="h-6 w-6" />
                <span className="sr-only">Image info</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedImage(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
