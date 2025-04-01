// let mediaRecorder;
// let canvasStream;
let ws;
const startStreamGroup = document.getElementById("startStreamGroup");
const stopStreamGroup = document.getElementById("stopStreamGroup");

async function startStreaming() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 },
      audio: true,
    });

    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    function drawFrame() {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawFrame);
    }
    drawFrame();
    startStreamGroup.classList.toggle("hidden");
    stopStreamGroup.classList.toggle("hidden");
    canvasStream = canvas.captureStream(30);
    const mimeTypes = [
      'video/webm; codecs=vp9',
      'video/webm; codecs=vp8',
      'video/webm',
    ];
    
    let supportedType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
    
    if (!supportedType) {
      console.error("No supported MediaRecorder format available.");
      return;
    }
    
    mediaRecorder = new MediaRecorder(canvasStream, { mimeType: supportedType });
    
    // mediaRecorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm; codecs=vp9' });

    // Open WebSocket connection to send the video data to the backend
    // ws = new WebSocket('ws://67.223.117.3:2124');
    ws = new WebSocket('ws://localhost:5000');


    ws.onopen = () => console.log("WebSocket connected");

    ws.onerror = (err) => console.error("WebSocket error:", err);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
        ws.send(event.data);
      }
    };

    mediaRecorder.start(1000); // Send data every second
    console.log("Streaming started!");

  } catch (error) {
    console.error("Error:", error);
  }
}

function stopStreaming() {
  if (mediaRecorder?.state !== 'inactive') {
    mediaRecorder.stop();
    canvasStream.getTracks().forEach(track => track.stop());
    ws.close();
    console.log("Streaming stopped!");
    startStreamGroup.classList.toggle("hidden");
    stopStreamGroup.classList.toggle("hidden");
  }
}

// document.getElementById("startStream").addEventListener("click", startStreaming);
// document.getElementById("stopStream").addEventListener("click", stopStreaming);
