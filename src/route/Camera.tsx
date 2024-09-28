"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Video, Repeat, StopCircle } from "lucide-react";

export function MobileCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"photo" | "video">("photo");
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: isFrontCamera ? "user" : "environment" },
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    }
    setupCamera();
  }, [isFrontCamera]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
    }
  };

  const startRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      mediaRecorderRef.current = new MediaRecorder(
        videoRef.current.srcObject as MediaStream
      );
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedVideo(URL.createObjectURL(blob));
        chunksRef.current = [];
        clearInterval(timerRef.current!);
        setRecordingTime(0);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Start the timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="relative flex-grow">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {capturedImage && (
          <div className="absolute inset-0 bg-black">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        {recordedVideo && (
          <div className="absolute inset-0 bg-black">
            <video
              src={recordedVideo}
              controls
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {mode === "video" && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-gray-800 p-2 rounded">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center p-4 bg-gray-900">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMode(mode === "photo" ? "video" : "photo")}
          className="text-white"
        >
          {mode === "photo" ? (
            <Camera className="h-6 w-6" />
          ) : (
            <Video className="h-6 w-6" />
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={
            mode === "photo"
              ? capturePhoto
              : isRecording
              ? stopRecording
              : startRecording
          }
          className={`rounded-full w-16 h-16 ${
            isRecording ? "bg-red-500" : "bg-white"
          }`}
        >
          {mode === "photo" ? (
            <div className="w-12 h-12 rounded-full bg-white" />
          ) : isRecording ? (
            <StopCircle className="h-8 w-8 text-white" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-red-500" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCamera}
          className="text-white"
        >
          <Repeat className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
