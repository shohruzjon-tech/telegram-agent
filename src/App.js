import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photo, setPhoto] = useState("");

  const getVideoStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

  useEffect(() => {
    if (!isCameraOn) {
      getVideoStream();
    }
  }, []);

  function canvasToBlob(canvas, callback) {
    canvas.toBlob((blob) => callback(blob), "image/png");
  }

  const takePhoto = async () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/png"));
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob);
      await fetch("https://telegram-t-0fbf0de345a3.herokuapp.com/upload", {
        method: "POST",
        body: formData,
      });
    }, "image/png");
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraOn(false);
    }
  };

  return (
    <div>
      {!isCameraOn && <button onClick={getVideoStream}>Start Camera</button>}
      {isCameraOn && <button onClick={takePhoto}>Take Photo</button>}
      {isCameraOn && <button onClick={stopCamera}>Stop Camera</button>}
      <video
        ref={videoRef}
        autoPlay
        style={{ display: isCameraOn ? "block" : "none" }}
      ></video>
      {photo && <img src={photo} alt="Captured" />}
    </div>
  );
};

export default App;
