let mediaRecorder, canvas, ctx, animationFrameId, recordedChunks = [];
let audioContext, microphoneStream, audioDestination;

async function startRecording() {
    console.log("Starting enhanced recording...");

    if (!window.html2canvas) {
        console.error("html2canvas is not loaded. Make sure the script tag is included.");
        return;
    }

    // Create an off-screen canvas
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    // Function to capture webpage frame (including iframes)
    async function drawFrame() {
        try {
            // Capture main page and visible iframes
            const bodyImage = await html2canvas(document.body, {
                logging: false,
                useCORS: true,
                allowTaint: true,
                foreignObjectRendering: true,
                scale: 1,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight
            });

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bodyImage, 0, 0, canvas.width, canvas.height);

            // Try to capture video frames from iframes
            document.querySelectorAll('iframe').forEach(async (iframe) => {
                try {
                    // This only works for same-origin iframes
                    if (iframe.contentDocument) {
                        const iframeCanvas = await html2canvas(iframe.contentDocument.body, {
                            logging: false,
                            useCORS: true,
                            allowTaint: true,
                            scale: 1,
                            windowWidth: iframe.contentDocument.documentElement.scrollWidth,
                            windowHeight: iframe.contentDocument.documentElement.scrollHeight
                        });
                        
                        const rect = iframe.getBoundingClientRect();
                        ctx.drawImage(iframeCanvas, rect.left, rect.top, rect.width, rect.height);
                    }
                } catch (e) {
                    console.log("Couldn't capture iframe content:", e.message);
                }
            });
        } catch (e) {
            console.error("Error capturing frame:", e);
        }
        animationFrameId = requestAnimationFrame(drawFrame);
    }
    drawFrame();

    // Convert canvas to a video stream
    const videoStream = canvas.captureStream(30);

    // Setup audio context for mixing
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioDestination = audioContext.createMediaStreamDestination();

    // Capture microphone audio
    microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const microphoneSource = audioContext.createMediaStreamSource(microphoneStream);
    microphoneSource.connect(audioDestination);

    // Try to capture audio from video elements (including iframes)
    document.querySelectorAll('video, audio').forEach(mediaElement => {
        try {
            const mediaStream = mediaElement.captureStream 
                ? mediaElement.captureStream() 
                : mediaElement.mozCaptureStream 
                ? mediaElement.mozCaptureStream() 
                : null;
            
            if (mediaStream) {
                const mediaSource = audioContext.createMediaStreamSource(mediaStream);
                mediaSource.connect(audioDestination);
            }
        } catch (e) {
            console.log("Couldn't capture media element audio:", e.message);
        }
    });

    // Combine all streams
    const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
    ]);

    // Setup MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') 
        ? 'video/webm; codecs=vp9,opus' 
        : 'video/webm; codecs=vp8,opus';
    
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType });

    mediaRecorder.onstart = () => {
        console.log("✅ Recording has started.");
        document.getElementById("status").innerText = "Recording...";
        recordedChunks = [];
    };

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        console.log("⏹️ Recording has stopped.");
        document.getElementById("status").innerText = "Recording stopped";

        // Clean up
        if (microphoneStream) {
            microphoneStream.getTracks().forEach(track => track.stop());
        }
        if (audioContext) {
            audioContext.close();
        }

        // Save the recorded file locally
        const blob = new Blob(recordedChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `webpage-recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    mediaRecorder.start(1000); // Capture data every second
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
        audioContext.close();
    }
}