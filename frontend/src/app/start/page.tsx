"use client";

import Entry from "@/components/entry";
import TypingHeading from "@/components/typingHeading";

export default function Start() {
  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-start px-4 py-10">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-center">
        Prisoner's Dilemma
      </h1>

      {/* Subheading (optional) */}
      <p className="text-lg md:text-xl text-gray-400 text-center mb-12 max-w-xl">
        A real-time social experiment in trust and betrayal.
      </p>

      {/* Typing heading (fun element) */}
      <TypingHeading />

      {/* Room Entry Component */}
      <div className="mt-6">
        <Entry />
      </div>
    </section>
  );
}

