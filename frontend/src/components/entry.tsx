"use client";

import Image from "next/image";
import CreateRoomCard from "./createRoom";
import JoinRoomCard from "./joinRoom";

export default function Entry() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-600 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-6 border border-gray-700 mt-8">
      
      {/* Character Image */}
      <div className="flex justify-center">
        <Image
          src="/Prisoners.jpg"
          alt="Character"
          width={350}
          height={300}
          className="rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md"
        />
      </div>

      <div className="flex justify-center gap-6">
        < JoinRoomCard />
        < CreateRoomCard />
      </div>
      
      
      
      </div>
  );
}
