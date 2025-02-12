import { socket } from "./socket";
import { pc } from "./webrtc";

let remoteStream: MediaStream | null = null;

let callId = new URLSearchParams(window.location.search).get("id");
let userId = crypto.randomUUID();

if (!callId) {
  callId = crypto.randomUUID();
  window.history.pushState("", "", `/?id=${callId}`);
}

const webcamVideo = document.getElementById("webcam-video") as HTMLVideoElement | null;
const remoteVideo = document.getElementById("remote-video") as HTMLVideoElement | null;

webcamVideo && (webcamVideo.muted = true);

navigator.mediaDevices.getUserMedia(
  { 
    video: true, 
    audio: true 
  }
)
.then(async (localStream) => {
  remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });
  pc.ontrack = (event) => {
    remoteStream?.addTrack(event.track);
  
    console.log(event);

  };
  if (webcamVideo) webcamVideo.srcObject = localStream;
  if (remoteVideo) remoteVideo.srcObject = remoteStream;

  socket.emit("join-room", { callId, userId });
});

socket.on("user-connected", async () => {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  socket.emit("call-offer", userId, offer);
});

socket.on("user-offer", async (uid: any, offer: any) => {
  pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  socket.emit("call-answer", userId, answer);
});

socket.on("user-answer", async (uid: any, answer: any) => {
  const remoteDesc = new RTCSessionDescription(answer);
  await pc.setRemoteDescription(remoteDesc);
});
socket.on("user-disconnected", () => {
  remoteStream = new MediaStream();

  if (remoteVideo) remoteVideo.srcObject = remoteStream;
});

socket.on("new-icecandidate", async (candidate: any) => {
  await pc.addIceCandidate(candidate);
});

pc.addEventListener("icecandidate", (event) => {
  if (event.candidate) {
    socket.emit("new-icecandidate", event.candidate);
  }
});