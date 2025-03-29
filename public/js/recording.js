const ws = new WebSocket("ws://67.223.117.3:5000");
let mediaRecorder, canvas, ctx, animationFrameId;

async function startRecording() {
    if (!window.html2canvas) {
        console.error("html2canvas is not loaded. Make sure the script tag is included in the HTML.");
        return;
    }

    console.log("Starting recording...");

    // Create an off-screen canvas
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    // Function to capture body
    async function drawFrame() {
        const bodyImage = await window.html2canvas(document.body);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bodyImage, 0, 0, canvas.width, canvas.height);
        animationFrameId = requestAnimationFrame(drawFrame);
    }
    drawFrame();

    // Convert canvas to video stream
    const videoStream = canvas.captureStream(30);

    // Capture microphone audio
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Combine streams
    const combinedStream = new MediaStream([...videoStream.getTracks(), ...audioStream.getTracks()]);

    // Setup MediaRecorder
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType: "video/webm; codecs=vp8,opus" });

    // ✅ Event listener to detect when recording starts
    mediaRecorder.onstart = () => {
        console.log("✅ Recording has started.");
        document.getElementById("status").innerText = "Recording...";
    };

    // Send recorded data to the server
    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
        }
    };

    // ✅ Event listener to detect when recording stops
    mediaRecorder.onstop = () => {
        console.log("⏹️ Recording has stopped.");
        document.getElementById("status").innerText = "Recording stopped";
    };

    mediaRecorder.start(1000); // Send data every second
}


function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
    ws.close();
    cancelAnimationFrame(animationFrameId); // Stop rendering loop
}
