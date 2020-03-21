import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const options = {
  fps: 30,
  width: 640,
  height: 480,
  mirror: true,
}

function initCanvas() {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas)
  canvas.setAttribute('width', options.width);
  canvas.setAttribute('height', options.height);

  const context = canvas.getContext('2d');

  // mirror video
  if (options.mirror) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }
  return [canvas, context]
}

const onFrame = () => {
}


function start(video, canvas, context) {
  video.play();

  const renderTimer = setInterval(function() {
    try {
      context.drawImage(video, 0, 0, video.width, video.height);
      onFrame(canvas);
    } catch (error) {
      console.log(error)
    }
  }, Math.round(1000 / options.fps));
}

const noop = () => {}

function App() {
  useEffect(() =>  {
        const video = document.createElement("video");
        video.setAttribute('width', options.width);
        video.setAttribute('height', options.height);
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true,
                audio: false,
            }, function(stream) {
                console.log("success")

                if (video.mozSrcObject !== undefined) { // hack for Firefox < 19
                    video.mozSrcObject = stream;
                } else {
                    video.srcObject = stream;
                }

                const [canvas, context]= initCanvas();
                start(video, canvas, context)
            }, noop);
        } else {
          alert('not supported')
        }
    }, []
  )

  return (
      <>
      <h1 id="info">Please allow this page to access your camera.</h1>

      <div id="notSupported">
      <h1>Your browser does not support the Camera API.</h1>
      <img src="images/screenshot.png" align="center" />
      </div>

      <pre id="ascii"></pre>
      </>
  );
}

export default App;
