import Button from './ui/Button.tsx';
import { useState, useRef, useEffect, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';

interface ImageDimensions {
  width: number;
  height: number;
}

function FaceRecognition() {
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detections, setDetections] = useState<faceapi.FaceDetection[]>([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });

  // Load face detection models
  useEffect(() => {
    const loadDetectionModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        console.log('Face detection models loaded successfully');
      } catch (error) {
        console.error('Failed to load face detection models:', error);
      }
    };

    loadDetectionModels();
  }, []);

  // Draw face detections on canvas
  useEffect(() => {
    const drawFaceDetections = () => {
      if (!canvasRef.current || detections.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, detections);
      }
    };

    drawFaceDetections();
  }, [detections, dimensions]);


  const resetDetectionState = useCallback((options: {
    keepPreview?: boolean;
    resetToDefault?: boolean
  } = {}) => {
    setDetections([]);
    setIsImageLoaded(false);
    setDimensions({ width: 0, height: 0 });

    const ctx = canvasRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (options.resetToDefault) {
      setIsDefaultImage(true);
      setImagePreview(null);
    } else {
      setIsDefaultImage(false);
      if (!options.keepPreview) setImagePreview(null);
    }
  }, []);


  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImageLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    resetDetectionState({ keepPreview: true });

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setIsImageLoading(false);
  }, [resetDetectionState]);


  const handleImageLoad = useCallback(async () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;

    setDimensions({ width: displayWidth, height: displayHeight });

    try {
      const detectedFaces = await faceapi.detectAllFaces(
        img,
        new faceapi.TinyFaceDetectorOptions()
      );

      const resizedDetections = faceapi.resizeResults(detectedFaces, {
        width: displayWidth,
        height: displayHeight
      });

      setDetections(resizedDetections);
      setIsImageLoaded(true);
    } catch (error) {
      console.error('Face detection failed:', error);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    resetDetectionState({ resetToDefault: true });
  }, [resetDetectionState]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                accept="image/*"
              />
              <Button
                onClick={triggerFileInput}
                btnClasses="uploadBtn"
                text="Upload Image"
              />
              <Button
                onClick={resetToDefault}
                btnClasses="uploadBtn"
                text="Delete image"
              />
            </div>
          </div>
        </div>
        <div className="p-5 flex-1 min-h-[175px]">
          <div className="image-preview-container flex flex-col items-center justify-center min-h-screen px-4">
            <div className="status-container">
              {isImageLoading && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Detecting Faces...</p>
                </div>
              )
              }

              <p className="face-count">
                {!isDefaultImage ? (
                  (
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
                  )
                ) : ''}
              </p>
            </div>
            <div className="canvas-wrapper">
              {isDefaultImage ? (
                <img
                  src="./assets/defaultImg.jpg"
                  alt="Default placeholder"
                  className="image-preview rounded-2xl"
                />
              ) : (
                  imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        ref={imageRef}
                        alt="Uploaded preview"
                        className="image-preview rounded-2xl"
                        onLoad={handleImageLoad}
                      />
                    </div>
                  )
              )}
              <canvas ref={canvasRef} className="canvas-overlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceRecognition;