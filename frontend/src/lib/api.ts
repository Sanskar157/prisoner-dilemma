import axios from "axios";

const route = "http://localhost:5000"

export async function createRoom() {
  const res = await axios.post(`${route}/api/create-room`);
  console.log("res",res)
  return res.data; 
}

export async function joinRoom(otp: string) {
  try {
    const response = await axios.post(`${route}/api/join-room`, {
      otp: otp,
    });
    

    return response.data;
  } catch (err: any) {
    console.error("Join room error:", err);
    throw new Error(err.response?.data?.message || "Failed to join room");
  }
}
