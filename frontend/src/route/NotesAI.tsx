import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import uploadToS3 from "@/utils/awsS3";
import axios from "axios";
import { Constants } from "@/Constants";

// Simulated function for AWS upload
const uploadToAWS = async (file: File): Promise<string> => {
  try {
    const imageUrl = await uploadToS3(file);
    return imageUrl;
  } catch (error) {
    throw new Error(`Failed to upload to AWS: ${error}`);
  }
};

// Simulated function for backend API call
const sendToBackend = async (data: {
  images: string[];
  text: string;
}): Promise<{ formattedContent: string }> => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: Constants.API_URL + "/api/notes/",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
    data: {
      imgs: data.images,
      user_msg: data.text,
    },
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.error("Error making API request:", error);
  }

  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const formattedContent = `
  //         <h1>Formatted Content</h1>
  //         <p>${data.text}</p>
  //         ${data.images
  //           .map((img) => `<img src="${img}" alt="Uploaded image" />`)
  //           .join("")}
  //       `;
  //       resolve({ formattedContent });
  //     }, 1500);
  //   });
};

export default function NotesAI() {
  const [images, setImages] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [formattedContent, setFormattedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      setIsLoading(true);
      //   const uploadedUrls = await Promise.all(
      //     Array.from(files).map((file) => uploadToAWS(file))
      //   );
      const uploadedUrls = ["https://via.placeholder.com/150"];
      setImages((prev) => [...prev, ...uploadedUrls]);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    console.log({ images, text });
    const response = await sendToBackend({ images, text });
    setFormattedContent(response.formattedContent);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Upload Content</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Images
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter Text Content
              </label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your content here..."
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {formattedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Formatted Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
