import Button from './ui/Button.tsx';
import { useState, useRef, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';

function FaceRecognition() {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [defaultImage, setDefaultImage] = useState<boolean>(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [detections, setDetections] = useState<faceapi.FaceDetection[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('loading the face detection models');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        console.log('face detection models loaded');

      } catch (error) {
        console.log('error loading face detection models', error);
      }
    }
    loadModels();
  }, []);


  useEffect(() => {
    const drawDetections = () => {
      if (canvas.current && imageRef.current && detections.length > 0 && imageLoaded && dimensions.width > 0 && dimensions.height > 0) {
        const canvasElement = canvas.current as HTMLCanvasElement; // Explicitly cast
        const image = imageRef.current;
        const ctx = canvasElement?.getContext('2d'); // Use optional chaining
        if (ctx) {

          canvasElement.width = dimensions.width;
          canvasElement.height = dimensions.height;
          faceapi.matchDimensions(canvasElement, dimensions);
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          faceapi.draw.drawDetections(canvasElement, detections);

          /*const displaySize = { width: image.width, height: image.height };
          faceapi.matchDimensions(canvasElement, displaySize);
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          faceapi.draw.drawDetections(canvasElement, detections);*/
        }
      }
    };

    drawDetections();

  }, [detections, dimensions, imageLoaded]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDefaultImage(false);
    setImageLoaded(false);
    setDimensions({ width: 0, height: 0 });
    console.log('updating the image preview');
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  const handleImageLoaded = async () => {

    console.log('image loaded attempting face detection');
    if (imageRef.current) {

      const img = new Image();
      img.src = imageRef.current.src;
      img.onload = async () => {
        setDimensions({ width: img.width, height: img.height });
        setImageLoaded(true);
      }

      try {
        const results = await faceapi.detectAllFaces(
          imageRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        console.log('detection', results);

        setDetections(results);
      } catch (error) {
        console.log('error during face detection', error);
      }
    }
  }

  const resetImage = (): void => {
    setDefaultImage(true);
    setDetections([]);
    setDimensions({ width: 0, height: 0 });
  }

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
                  <span > ⏳ Waiting for image...</span>
                ) : (
                    <>
                      {detections && detections.length > 0
                        ?
                        (
                          <span className="text-green-500">
                            🟢 Detected Faces: {detections.length}
                          </span>

                        ) : (
                          <span className="text-red-500">
                            🔴 No Faces Detected
                          </span>
                        )
                      }


                  </>
                )
                }

              </p>
            </div>

            <div className="canvas-wrapper">

              {defaultImage ?
                (
                  <img
                    src="./assets/defaultImg.jpg"
                    alt="Uploaded Image"
                    className="image-preview rounded-2xl" />
                ) : (
                  <>

                    {
                      preview && (
                        <div className="mt-4">
                          <img
                            src={preview}
                            ref={imageRef}
                            onLoad={handleImageLoaded}
                            alt="Preview"
                            className="image-preview rounded-2xl"
                          />
                        </div>
                      )
                    }
                  </>
                )
              }

              <canvas ref={canvas} className="canvas-overlay"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default FaceRecognition;
