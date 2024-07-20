import { socket } from "./socket";
import { pc } from "./webrtc";

let remoteStream: MediaStream | null = null;

let callId = new URLSearchParams(window.location.search).get("id");
let userId = crypto.randomUUID();

if (!callId) {
  callId = crypto.randomUUID();
  window.history.pushState("", "", `/?id=${callId}`);
}
