let offerSdp = document.getElementById("offer-sdp");
let myVideo = document.getElementById("my-video");
let remoteVideo = document.getElementById("remote-video");
let answerSdp = document.getElementById("answer-sdp");

let peer;

answerCall = () => {
  peer = new RTCPeerConnection();
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      if (myVideo) {
        const videoTracks = stream?.getVideoTracks() || [];
        const selectedVideoTrack = videoTracks[0];
        const audiolessStream = new MediaStream();
        audiolessStream.addTrack(selectedVideoTrack);
        myVideo.srcObject = audiolessStream;
      }
      startConnection(stream);
    });
};

startConnection = (stream) => {
  stream.getTracks().forEach((track) => peer.addTrack(track));

  peer.onTrack = (stream) => {
    console.log("recieved stream");
    remoteVideo.srcObject = stream;
  };

  peer.onicegatheringstatechange = (event) => {
    let connection = event.target;
    if (connection.iceGatheringState == "complete") {
      answerSdp.innerHTML = JSON.stringify(peer.localDescription);
    }
  };
  peer.onicecandidate = ({ candidate }) => {
    console.log(candidate);
  };

  peer
    .setRemoteDescription(JSON.parse(offerSdp.value))
    .then(() => peer.createAnswer())
    .then((answer) => peer.setLocalDescription(answer));
};
