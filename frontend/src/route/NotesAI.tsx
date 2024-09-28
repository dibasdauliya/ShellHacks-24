import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import uploadToS3 from "@/utils/awsS3";
import axios from "axios";
import { Constants } from "@/Constants";
import ReactMarkdown from "react-markdown";
import ClipLoader from "react-spinners/ClipLoader";
import { AccordionCustom } from "@/components/AccordianCustom";

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
}): Promise<{
  ai_msg: string;
  id: number;
}> => {
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
    return { ai_msg: response.data.ai_msg, id: response.data.id };
  } catch (error) {
    console.error("Error making API request:", error);
  }
};

export default function NotesAI() {
  const [images, setImages] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [formattedContent, setFormattedContent] = useState("");
  const [contentId, setContentId] = useState<Number>();
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<string>("");
  const [quizLoading, setQuizLoading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      setIsLoading(true);
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadToAWS(file))
      );
      setImages((prev) => [...prev, ...uploadedUrls]);
      setIsLoading(false);
    }
  };

  async function requestQuiz() {
    setQuizLoading(true);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${Constants.API_URL}/api/getquiz?content_id=${contentId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      setQuiz(response.data.quiz);
      setQuizLoading(false);
    } catch (error) {
      console.error("Error making API request:", error);
      setQuizLoading(false);
    }
  }

  const replaceImagePlaceholders = (
    response: string,
    images: string[]
  ): string => {
    let updatedResponse = response;
    images.forEach((image, index) => {
      const placeholder = `[IMAGE_${index}]`;
      updatedResponse = updatedResponse.replace(
        placeholder,
        `![Uploaded image](${image})`
      );
    });
    return updatedResponse;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    console.log({ images, text });
    try {
      const response = await sendToBackend({ images, text });
      const responseWithImages = replaceImagePlaceholders(
        response.ai_msg,
        images
      );

      setFormattedContent(responseWithImages);
      setContentId(response.id);
      setIsLoading(false);
    } catch (error) {
      console.error("Error making API request:", error);
      alert("Error making API request");
      setIsLoading(false);
    }
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

      {isLoading && (
        <div className="flex justify-center items-center">
          <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
        </div>
      )}

      {formattedContent && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Formatted Note</CardTitle>
          </CardHeader>
          <CardContent className="prose lg:prose-md">
            {/* <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
             */}
            <ReactMarkdown>{formattedContent}</ReactMarkdown>
          </CardContent>
        </Card>
      )}

      {contentId && (
        <Button disabled={quizLoading} onClick={requestQuiz}>
          {quizLoading ? "Loading Quiz..." : "Get Practice Questions"}
        </Button>
      )}

      {quizLoading && (
        <div className="flex justify-center items-center">
          <ClipLoader size={50} color={"#123abc"} loading={quizLoading} />
        </div>
      )}

      {quiz && (
        <Card className="my-6">
          <CardHeader>
            <CardTitle>Get Practice Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <pre>
              {JSON.stringify(
                JSON.parse(quiz.replace(/```json|```/g, "")),
                null,
                2
              )}
            </pre> */}

            <AccordionCustom
              quizzes={
                JSON.parse(quiz.replace(/```json|```/g, ""))
                  .questions_and_answers
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
