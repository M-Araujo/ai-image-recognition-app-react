import Button from './ui/Button.tsx';
import { useState } from 'react';
import FileUpload from './FileUpload.tsx';

function FaceRecognition() {

  const [defaultImage, setDefaultImage] = useState<boolean>(true);
  /*const [uploadedImage, setUploadedImage] = useState<string>('');
  const [hasUploadedImage, setHasUploadedImage] = useState<boolean>(false);*/

  const uploadImage = (): void => {
    setDefaultImage(false);
  }

  const resetImage = (): void => {
    setDefaultImage(true);
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

              <Button onClick={uploadImage} btnClasses="uploadBtn" text="Upload Image" />
              <Button onClick={resetImage} btnClasses="uploadBtn" text="Delete image" />
            </div>
          </div>



        </div>
        <div className=" p-5 flex-1 min-h-[175px]">
          <div className="image-preview-container">
            <div className="canvas-wrapper">

              {defaultImage ?
                (
                  <img
                    src="./assets/defaultImg.jpg"
                    alt="Uploaded Image"
                    className="image-preview rounded-2xl" />
                ) : (
                  <FileUpload />
                )
              }

              <canvas className="canvas-overlay"></canvas>
            </div>
          </div>

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
                    <span className="text-green-500">
                🟢 Detected Faces: 999
                    </span>
                    <span className="text-red-500">
                      🔴 No Faces Detected
                    </span>
                </>
              )
              }



            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default FaceRecognition;
