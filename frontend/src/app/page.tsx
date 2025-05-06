"use client";

import About from "@/components/about";
import Hero from "@/components/hero";
import Instructions from "@/components/instructions";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-gray-950 to-gray-900 text-white min-h-screen ">
      {/* HERO SECTION */}
      < Hero />

      {/* ABOUT THE GAME */}
      < About />

      {/* INSTRUCTIONS ABOUT THE GAME*/}
      < Instructions />
      
    </main>
  );
}
