"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import socket from "@/lib/socket";
import { useParams } from "next/navigation";

export default function GamePage() {
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [showGameStartModal, setShowGameStartModal] = useState(false);
  const [roundMessage, setRoundMessage] = useState<string | null>(null);
  const [alias, setAlias] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const params = useParams();
  const roomId = params.roomId as string;

  useEffect(() => {
    if (isGameActive && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isGameActive) {
      handleTimerExpired();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer, isGameActive]);

  const handleTimerExpired = () => {
    if (!alias || !roomId || hasMoved) return;

    socket.emit("playerMove", {
      move: "Betray",
      roomId,
      alias,
      reason: "timer_expired",
    });

    setHasMoved(true);
  };

  useEffect(() => {
    setIsMounted(true);
    const storedAlias = localStorage.getItem("alias");
    setAlias(storedAlias);

    socket.on("gameStart", () => {
      setShowGameStartModal(true);
      setTimer(30);
      setIsGameActive(true);
      setHasMoved(false);

      setTimeout(() => {
        setShowGameStartModal(false);
      }, 3000);
    });

    socket.on("roundResult", ({ round, result, moves }) => {
      if (!alias) return;

      const myAlias = alias;
      const myMove = moves[myAlias];
      const opponentAlias = myAlias === "red" ? "blue" : "red";
      const opponentMove = moves[opponentAlias];

      const myRoundScore = myAlias === "red" ? result.red : result.blue;
      const opponentRoundScore = myAlias === "red" ? result.blue : result.red;

      setMyScore((prev) => prev + myRoundScore);
      setOpponentScore((prev) => prev + opponentRoundScore);

      const message = `Round ${round + 1}: You chose ${myMove}, Opponent chose ${opponentMove}. You got ${myRoundScore}, Opponent got ${opponentRoundScore}`;

      setRoundMessage(message);

      setTimeout(() => {
        setRoundMessage(null);
      }, 3000);

      setTimer(30);
      setHasMoved(false);
    });

    socket.on("gameOver", () => {
      setIsGameActive(false);
    });

    return () => {
      socket.off("gameStart");
      socket.off("roundResult");
      socket.off("gameOver");

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [roomId, alias]);

  const handleMove = (move: string) => {
    if (!isGameActive || !roomId || !alias || hasMoved) return;

    socket.emit("playerMove", {
      move,
      roomId,
      alias,
    });

    setHasMoved(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 flex flex-col gap-4">
      {/* Scorecard and Timer */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-red-500">{myScore}</span>
          <span className="mx-2 text-white">:</span>
          <span className="text-blue-500">{opponentScore}</span>
        </h2>
        <div
          className={`text-lg ${timer <= 5 ? "bg-red-800" : "bg-zinc-800"} rounded-full px-4 py-2`}
        >
          Timer: {timer}s
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex flex-1 mt-4">
        {/* Left: Choices */}
        <div className="flex flex-col flex-1 items-center gap-4">
          <h2 className="text-xl font-semibold">Choose</h2>
          <Button
            className="w-40 h-16 bg-red-600 hover:bg-red-700 text-lg font-bold rounded-xl cursor-pointer"
            onClick={() => handleMove("Betray")}
            disabled={!isGameActive || hasMoved}
          >
            Betray
          </Button>
          <Button
            className="w-40 h-16 bg-green-600 hover:bg-green-700 text-lg font-bold rounded-xl cursor-pointer"
            onClick={() => handleMove("Cooperate")}
            disabled={!isGameActive || hasMoved}
          >
            Cooperate
          </Button>
        </div>
      </div>

      {/* Alias Display */}
      {isMounted && alias && (
        <div className="absolute top-4 right-4 text-xs italic">
          <span className={alias === "blue" ? "text-red-500" : "text-blue-400"}>
            You are{" "}
          </span>
          <span
            className={
              alias === "blue" ? "text-blue-400 font-bold" : "text-red-500 font-bold"
            }
          >
            {alias}
          </span>
        </div>
      )}

      {/* Game Start Modal */}
      {showGameStartModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="text-xl font-bold text-green-600">Game starts!</p>
          </div>
        </div>
      )}

      {/* Round Result Modal */}
      {roundMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-zinc-900 p-6 rounded-lg text-center">
            <p className="text-xl font-semibold text-white">{roundMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
