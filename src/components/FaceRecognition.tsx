import Button from './ui/Button.tsx';
import { useState, useRef, useEffect, useCallback } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Loader2, AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadDetectionModels = async () => {

      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(import.meta.env.BASE_URL + "models");

      } catch (error) {
        console.error("❌ Error loading Face-api.js models", error);
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
    setError(null);
    setIsImageLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageLoading(true);

    const validationError = imageValidation(file);
    if (validationError) {
      setError(validationError);
      setIsImageLoading(false);
      return;
    }

    resetDetectionState({ keepPreview: true });

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

  }, [resetDetectionState]);


  const handleImageLoad = useCallback(async () => {
    if (!imageRef.current) return;
    setIsImageLoading(true);
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
    } finally {
      setIsImageLoaded(true);
      setIsImageLoading(false);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    resetDetectionState({ resetToDefault: true });
  }, [resetDetectionState]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);


  const imageValidation = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPEG or PNG image.';
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return 'Image too large, please keep it under 5MB.';
    }
    return null;
  }

  const LoadingIndicator = () => {
    return (
      <>
        <div className="flex flex-col items-center space-y-2">
          <Loader2 id="loader" className="animate-spin h-8 w-8 text-gray-600" />
          <p className="text-sm text-gray-700"></p>
        </div>
      </>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto bg-white rounded-2xl mt-20">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="p-5 flex-1 min-h-[175px]">

          <div className="intro-container flex flex-col items-center justify-center px-4 p-4 align-baseline inline-block">
            <h1 className="intro-title text-3xl text-center mb-6">
              Welcome to My Face Detection App!
            </h1>
            <div className="max-w-prose space-y-4">
              <div className="max-w-prose space-y-4 text-left">

                <p className="intro-text">
                  This is an AI-powered face-detection app built with React & Face-api.js.
                  Upload an image, and the app will detect faces instantly!
                </p>
                <p className="text-sm text-gray-500 italic">
                  🔒 All face‐detection happens locally in your browser. No images or data are uploaded or stored anywhere.
                </p>

                <p className="intro-text">
                  I’m Miriam Araújo—a frontend developer with over 7 years of experience in web development. Lately I’ve been focusing on React, building this project to sharpen my skills.
                </p>
                <p className="intro-text">
                  🚀 <strong>Project goal:</strong> Gain hands-on experience with React’s modern ecosystem (functional components, state management, side effects) by tackling a practical face-detection challenge.
                </p>
                <p className="intro-text">
                  🔗 Feel free to reach out on&nbsp;
                  <a
                    href="https://www.linkedin.com/in/miriam-araujo-dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn
                  </a>
                </p>
              </div>


              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                accept="image/*"
                data-testid="file-input"
              />

              <div className="button-group">
                <Button
                  onClick={triggerFileInput}
                  btnClasses="uploadBtn"
                  text="Upload Image"
                />
                <Button
                  onClick={resetToDefault}
                  btnClasses="clearBtn"
                  text="Clear image"
                />
              </div>

              {error && (
                <div className="mt-2 flex items-center bg-red-50 border-l-4 border-red-500 text-red-700 p-2 rounded">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

            </div>
          </div>
        </div>
        <div className="p-5 flex-1 flex">
          <div className="image-preview-container flex flex-col items-center justify-center flex-1 px-4 p-4">
            <div className="status-container">
              <div className="status-container">
                {isImageLoading && <LoadingIndicator />}

                {!isDefaultImage && !isImageLoading && isImageLoaded && (
                  <p className="face-count">
                    {detections.length > 0
                      ? <span className="text-green-500">🟢 Detected Faces: {detections.length}</span>
                      : <span className="text-red-500">🔴 No Faces Detected</span>
                    }
                  </p>
                )}
              </div>
            </div>
            <div className="canvas-wrapper">
              {isDefaultImage ? (
                <img
                  src="./assets/defaultImg.jpg"
                  alt="Default placeholder"
                  className="image-preview rounded-2xl max-h-80"
                />
              ) : (
                  imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        ref={imageRef}
                        alt="Uploaded preview"
                        className="image-preview rounded-2xl max-h-80"
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