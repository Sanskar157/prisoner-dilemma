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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { joinRoom } from "@/lib/api";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";

export default function JoinRoomCard() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoin = async (otpToJoin?: string) => {
    const code = otpToJoin || otp;
    try {
      const { roomId, playerId, alias } = await joinRoom(code);
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
      setError("Invalid OTP or room not found.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-2xl border-2 border-primary px-6 py-2 text-primary hover:bg-primary hover:text-background transition-colors cursor-pointer"
        >
          Join Room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] rounded-2xl border border-muted bg-[#1a1a1a] text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Join a Room
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter the 4-digit code shared by your friend.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <div className="grid grid-cols-4 items-center">
            <Label htmlFor="otp" className="text-right font-medium text-white">
              OTP
            </Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError("");
              }}
              placeholder="1234"
              maxLength={4}
              className="col-span-3 rounded-md border border-zinc-700 bg-zinc-800 text-white text-center font-mono tracking-widest uppercase placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center pt-1">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => handleJoin()}
            disabled={!otp.trim()}
            className="w-full rounded-xl bg-orange-700 text-white hover:bg-primary/90 transition-all cursor-pointer"
          >
            Let’s Go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
