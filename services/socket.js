import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (user) => {
  if (!user) return null;

  if (!socket) {

    let url;
    // Assign namespace based on user type
    if (user.role === "courier") {
      url = "https://hunterxpress-backend.onrender.com/courier";
    } else if (user.role === "customer") {
      url = "https://hunterxpress-backend.onrender.com/customer";
    } else {
      console.warn("Unknown user type, socket not connected");
      return null;
    }

    socket = io(url, {
      transports: ["websocket"],
      autoConnect: true,
      query: { userId: user._id}
    });

    socket.on("connect", () => {
      console.log(`${user.role} socket connected:`, socket.id);
    });

    socket.on("disconnect", () => {
      console.log(`${user.role} socket disconnected`);
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