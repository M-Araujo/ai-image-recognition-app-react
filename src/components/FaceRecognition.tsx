import Button from './ui/Button.tsx';
import { useState, useRef, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';

function FaceRecognition() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Use canvasRef
  const [defaultImage, setDefaultImage] = useState<boolean>(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [detections, setDetections] = useState<faceapi.FaceDetection[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('loading the face detection models');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        console.log('face detection models loaded');
      } catch (error) {
        console.log('error loading face detection models', error);
      }
    };
    loadModels();
  }, []);

  // Draw detections on canvas
  useEffect(() => {
    if (canvasRef.current && detections.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Match canvas to image display size
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw properly scaled detections
        faceapi.draw.drawDetections(canvas, detections);
      }
    }
  }, [detections, dimensions]);

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    resetAllStates();

    console.log('updating the image preview');
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    }
    reader.readAsDataURL(file);
  };

  const handleImageLoaded = async () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const displayWidth = img.clientWidth; // Use display dimensions
      const displayHeight = img.clientHeight;

      setDimensions({ width: displayWidth, height: displayHeight });

      try {
        const detections = await faceapi.detectAllFaces(
          img,
          new faceapi.TinyFaceDetectorOptions()
        );

        // Resize detections to display dimensions
        const resizedDetections = faceapi.resizeResults(detections, {
          width: displayWidth,
          height: displayHeight
        });

        setDetections(resizedDetections);
      } catch (error) {
        console.error('Detection error:', error);
      }
    }
  };


  const resetAllStates = (): void => {
    setDefaultImage(false);
    setDetections([]); // Clear previous detections
    setImageLoaded(false);
    setDimensions({ width: 0, height: 0 });

  } 

  // Reset image
  const resetImage = () => {
    setDefaultImage(true);
    setDetections([]);
    setDimensions({ width: 0, height: 0 });
    setImageLoaded(false);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white rounded-2xl">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="p-5 flex-1 min-h-[175px]">
          <div className="intro-container flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="intro-title text-3xl text-center mb-6">
              Welcome to My Face Detection App!
            </h1>
            <div className="max-w-prose space-y-4">
              <p className="intro-text text-left">
                This is an AI-powered face detection app built with React & Face-api.js.
                Upload an image, and the app will detect faces instantly!
              </p>
              <p className="intro-text text-left">
                I'm Miriam Araújo a Web Developer focused on frontend applications.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
              />
              <Button onClick={triggerFileInput} btnClasses="uploadBtn" text="Upload Image" />
              <Button onClick={resetImage} btnClasses="uploadBtn" text="Delete image" />
            </div>
          </div>
        </div>
        <div className=" p-5 flex-1 min-h-[175px]">
          <div className="image-preview-container flex flex-col items-center justify-center min-h-screen px-4">
            <div className="status-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Detecting Faces...</p>
              </div>
              <p className="face-count">
                {defaultImage ? (
                  <span> ⏳ Waiting for image...</span>
                ) : (
                    <>
                      {detections.length > 0 ? (
                        <span className="text-green-500">
                          🟢 Detected Faces: {detections.length}
                        </span>
                      ) : (
                        <span className="text-red-500">
                          🔴 No Faces Detected
                        </span>
                      )}
                  </>
                )}
              </p>
            </div>
            <div className="canvas-wrapper">
              {defaultImage ? (
                <img
                  src="./assets/defaultImg.jpg"
                  alt="Uploaded Image"
                  className="image-preview rounded-2xl"
                />
              ) : (
                <>
                    {preview && (
                      <div className="mt-4">
                        <img
                          src={preview}
                          ref={imageRef}
                          alt="Preview"
                          className="image-preview rounded-2xl"
                          onLoad={handleImageLoaded}
                        />
                      </div>
                    )}
                  </>
              )}
              <canvas ref={canvasRef} className="canvas-overlay"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceRecognition;