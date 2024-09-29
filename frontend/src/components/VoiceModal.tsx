import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import uploadToS3 from "@/utils/awsS3";

const VoiceUploadDialog = ({ isOpen, onUploadComplete, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
    setUploadCompleted(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const s3Url = await uploadToS3(file);
      onUploadComplete(s3Url);
      setUploadCompleted(true);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>
        
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Voice Recording</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="voice" className="text-right">
              Voice File
            </Label>
            <Input
              id="voice"
              type="file"
              accept="audio/*"
              className="col-span-3"
              onChange={handleFileChange}
              disabled={uploading || uploadCompleted}
            />
          </div>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {uploadCompleted ? (
          <div className="flex items-center gap-2 mx-auto">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Upload Completed</span>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload"}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VoiceUploadDialog;
