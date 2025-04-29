"use client";

import Typewriter from "typewriter-effect";

export default function TypingHeading() {
  return (
    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-center tracking-wide sm:tracking-wider mt-4 sm:mt-5 text-white px-4 italic">
      <Typewriter
        options={{
          autoStart: true,
          loop: false,
          delay: 80,
          deleteSpeed: 60,
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString('<span style="color:red;">BETRAY</span>')
            .pauseFor(1200)
            .deleteAll()
            .typeString(
              `TRUST IS REWARDING... <span style="font-style: italic; color:gray;">SOMETIMES</span>`
            )
            .start();
        }}
      />
    </h2>
  );
}

