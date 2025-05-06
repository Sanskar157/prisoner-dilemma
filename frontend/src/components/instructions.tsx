"use client";

import React, { useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const slides = [
  {
    title: "Choose to Cooperate",
    desc: "If both players cooperate, they both get a moderate reward.",
    img: "/choose_coop.jpg",
  },
  {
    title: "Choose to Betray",
    desc: "Betrayal might bring a higher reward... but only if the other player cooperates.",
    img: "/one-betrays.jpeg",
  },
  {
    title: "If Both Cooperate",
    desc: "Both win a decent amount – trust pays off.",
    img: "/Co-operate.jpg",
  },
  {
    title: "If One Betrays",
    desc: "The betrayer gets a high reward, while the cooperator suffers.",
    img: "/one-betrays.jpeg",
  },
  {
    title: "If Both Betray",
    desc: "Mutual betrayal leads to a bad outcome for both.",
    img: "/both-betray.jpeg",
  },
  {
    title: "Payoff Matrix",
    desc: "Here’s a matrix showing all possible outcomes in one glance.",
    img: "/mat.jpg",
  },
];



export default function HowToPlaySlider() {
  const [sliderRef,instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 2,
      spacing: 24,
    },
    loop: true,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next(); 
    }, 3000);
  
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <section className="w-full bg-gradient-to-br from-gray-950 to-gray-900 text-white py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How to Play
        </h2>

        <div ref={sliderRef} className="keen-slider">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="keen-slider__slide bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-lg flex flex-col items-center text-center"
              style={{ height: "400px" }}
            >
              <div className="w-full h-60 relative mb-6 ">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                {slide.title}
              </h3>
              <p className="text-gray-300 text-base md:text-lg px-2">
                {slide.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
