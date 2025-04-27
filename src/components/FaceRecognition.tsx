
function FaceRecognition() {
  return (
    <>
      <div className="app-container">
        <div className="intro-container fade-in">
          <h1 className="intro-title">Welcome to My Face Detection App! 👋</h1>
          <p className="intro-text">
            This is an AI-powered face detection app built with Vue.js & Face-api.js. Upload
            an image, and the app will detect faces instantly!
          </p>
          <p className="intro-text">
            I'm Miriam Araújo, a passionate web developer focused on JavaScript, Vue.js, and
            AI applications.
          </p>
        </div>

        <div className="face-recognition-container fade-in">
          <h2 className="title">Face Detection</h2>

          <div className="button-group">


            <button className="custom-btn clear-btn">
              <i className="pi pi-trash"></i> Clear Image
            </button>
          </div>

          <div className="image-preview-container" v-if="src">
            <div className="canvas-wrapper">
              <img
                alt="Uploaded Image"
                className="image-preview fade-in"
              />
              <canvas className="canvas-overlay"></canvas>
            </div>
          </div>

          <div className="status-container">
            <div v-if="loading" className="loading-spinner">
              <div className="spinner"></div>
              <p>Detecting Faces...</p>
            </div>

            <p className="face-count">
              <span v-if="faceCount !== null && faceCount > 0" className="text-green-500">
                🟢 Detected Faces:
              </span>
              <span v-else-if="faceCount === 0" className="text-red-500">
                🔴 No Faces Detected
              </span>
              <span v-else> ⏳ Waiting for image...</span>
            </p>
          </div>
        </div>

        <footer className="footer fade-in">
          <p>🔗 Connect with me:</p>
          <div className="social-links">
            <a href="https://github.com/M-Araujo" target="_blank"
            ><i className="pi pi-github"></i> GitHub</a>
            <a href="https://www.linkedin.com/in/miriam-araujo-dev" target="_blank"
            ><i className="pi pi-linkedin"></i> LinkedIn</a>
            <a href="https://codepen.io/M-Araujo" target="_blank"><i className="pi pi-codepen"></i> CodePen</a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default FaceRecognition;