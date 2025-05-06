"use client";

import { useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createRoom, joinRoom } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import socket from "@/lib/socket";

export default function CreateRoomCard() {
  const [otp, setOtp] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreateRoom = async () => {
    try {
      const data = await createRoom();
      setOtp(data.otp);
      setRoomId(data.roomId);
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  const handleJoinCreatedRoom = async () => {
    try {
      const { playerId, alias } = await joinRoom(otp);
      localStorage.setItem("playerId", playerId);
      localStorage.setItem("alias", alias);

      if (!socket.connected) socket.connect();
      socket.emit("joinRoom", { roomId, playerId, alias }, (response: any) => {
        if (response.error) {
          console.error("Error in connecting", response.error);
          setError("Failed to connect to room.");
        } else {
          router.push(`/game/${roomId}`);
        }
      });
    } catch (err) {
      console.error("Failed to join room:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={handleCreateRoom}
          className="rounded-2xl border-2 border-primary px-6 py-2 text-primary hover:bg-primary hover:text-background transition-colors cursor-pointer"
        >
          Create Room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] rounded-2xl border border-muted bg-[#1a1a1a] text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Create a Room
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Share the OTP with a friend so they can join.
          </DialogDescription>
        </DialogHeader>

        {otp && (
          <>
            <div className="relative border rounded-md p-4 mt-4">
              <span className="block text-center text-3xl font-mono tracking-widest text-white">
                {otp}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(otp)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <Copy className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center pt-2">{error}</p>
            )}

            <DialogFooter className="pt-4">
              <Button
                onClick={handleJoinCreatedRoom}
                className="w-full rounded-xl bg-orange-700 text-white hover:bg-primary/90 transition-all cursor-pointer"
              >
                Let’s Go!
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
