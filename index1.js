const video = document.querySelector('.webcam');

const videoCanvas = document.querySelector('.video');
const videoCanvasCtx = videoCanvas.getContext('2d')

const faceCanvas = document.querySelector('.face');
const faceCanvasCtx = faceCanvas.getContext('2d')

const faceDetector = new FaceDetector();

async function populate() {

    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: 720,
            height: 540,
        }
    });
    videoCanvas.width = 720;
    videoCanvas.height = 540;

    faceCanvas.width = 720;
    faceCanvas.height = 540;

    video.srcObject = stream;
    await video.play();
}

function censor(boundingBox) {
    faceCanvasCtx.imageSmoothingEnabled = false;

    faceCanvasCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height)

    faceCanvasCtx.drawImage(
        video, 
        boundingBox.x, 
        boundingBox.y,
        boundingBox.width,
        boundingBox.height,
        boundingBox.x, 
        boundingBox.y,
        10,
        10
    )
    
    const width = boundingBox.width ;
    const height = boundingBox.height ;
    faceCanvasCtx.drawImage(
        faceCanvas, 
        boundingBox.x, 
        boundingBox.y,
        10,
        10,
        boundingBox.x,
        boundingBox.y,
        width,
        height
    );
}

function draw({boundingBox}) {
    const {left, top, width, height} = boundingBox;
    videoCanvasCtx.lineWidth = 2;
    videoCanvasCtx.strokeStyle = '#ffc600';

    videoCanvasCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height)
    censor(boundingBox);
    videoCanvasCtx.strokeRect(left, top, width, height);
}

async function detect() {
    const faces = await faceDetector.detect(video);
    faces.forEach(face => draw(face));
    requestAnimationFrame(detect);
}

populate().then(detect).catch(console.error);


