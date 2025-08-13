"use client";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import React, { useRef, useState } from "react";
import { Subheading } from "../elements/subheading";
import { StickyScroll } from "@/components/ui/sticky-scroll";

export const Launches = ({
  sub_heading,
  launches,
  logoUrl,
}: {
  sub_heading: string;
  launches: any[];
  logoUrl: string;  // pass the logo URL as a prop
}) => {
  // Remove icon from launches
  const launchesWithDecoration = launches.map((entry) => ({
    ...entry,
    // No icon at all
    content: (
      <p className="text-4xl md:text-7xl font-bold text-neutral-800">
        {entry.mission_number}
      </p>
    ),
  }));

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgrounds = ["var(--charcoal)", "var(--zinc-900)", "var(--charcoal)"];

  const [gradient, setGradient] = useState(backgrounds[0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = launches.map((_, index) => index / launches.length);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setGradient(backgrounds[closestBreakpointIndex % backgrounds.length]);
  });

  return (
    <motion.div
      animate={{
        background: gradient,
      }}
      transition={{
        duration: 0.5,
      }}
      ref={ref}
      className="w-full relative h-full pt-20 md:pt-40"
    >
      <div className="px-6 pb-12">
        {/* Label with letter spacing */}
        <p className="text-sm text-[#76777D] text-center uppercase tracking-[0.2em] mb-8">
          [ UPDATES ]
        </p>

        {/* Logo centered */}
        <div className="flex justify-center pt-4">
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/NEWS_1e5fe4612c.svg`}
            alt="Launches Logo"
            className="mx-auto h-7 w-auto mb-7"
          />
        </div>

        {/* Subheading */}
        <Subheading className="text-center">{sub_heading}</Subheading>
      </div>
      
      {/* Launch cards */}
      <StickyScroll content={launchesWithDecoration} />
    </motion.div>
  );
};
