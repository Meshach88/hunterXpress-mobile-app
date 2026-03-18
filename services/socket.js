import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {

  if (!socket) {

    socket = io("https://67cb-102-89-22-210.ngrok-free.app", {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

  }
  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {

  if (socket) {
    socket.disconnect();
    socket = null;
  }

};