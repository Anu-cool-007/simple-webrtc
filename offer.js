const offerSdp = document.getElementById("offer-sdp");
const myVideo = document.getElementById("my-video");
const remoteVideo = document.getElementById("remote-video");
const answerSdp = document.getElementById("answer-sdp");

const peer = new RTCPeerConnection();

startCall = () => {
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
  stream.getTracks().forEach((track) => peer.addTrack(track, stream));

  peer.addEventListener(
    "track",
    (e) => {
      remoteVideo.srcObject = e.streams[0];
    },
    false
  );

  peer.onicecandidate = ({ candidate }) => {
    offerSdp.innerHTML = JSON.stringify(peer.localDescription);
  };

  peer.createOffer().then((offer) => peer.setLocalDescription(offer));
};

acceptAnswer = () => {
  peer.setRemoteDescription(JSON.parse(answerSdp.value));
};
