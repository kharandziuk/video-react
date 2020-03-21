import React, { useEffect } from 'react';
import './scss/style.scss';
import { Container, Row, Col } from 'reactstrap';

const options = {
  fps: 30,
  width: 640,
  height: 480,
  mirror: true,
}

const elements = new Array(5).fill(0);

function initCanvas() {
  const canvas = document.createElement("canvas");
  // document.body.appendChild(canvas)
  let videos = document.querySelectorAll('.video');
  for (let video of videos) {
    video.appendChild(canvas)
  }
  canvas.setAttribute('width', options.width);
  canvas.setAttribute('height', options.height);
  canvas.classList.add('embed-responsive-item')

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
      <header className="py-3">
        <Container className="d-flex">
          <span>BlaBlaBar</span>
        </Container>
      </header>
      <Container>
        <Row className="justify-content-center">
          {elements.map( (_, i) => (
            <Col md="6" lg="4" key={i}>
              <div id={i+1} className="embed-responsive embed-responsive-4by3 p-3 bg-light video mb-3 rounded" />
            </Col>
          ))}
        </Row>
        <div id="notSupported" className="d-none">
          <h1>Your browser does not support the Camera API.</h1>
        </div>
      </Container>
    </>
);
}

export default App;
