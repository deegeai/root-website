"use client";

import React, { MouseEvent as ReactMouseEvent, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { CanvasRevealEffect } from "../../ui/canvas-reveal-effect";
import Beam from "../../beam";

const indexLabels: Record<number, string> = {
  1: "Q3 25",
  2: "Q4 25",
  3: "Q1 26",
  4: "Q2 26",
};

export const Card = ({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  const width = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 400]), {
    stiffness: 500,
    damping: 90,
  });

  useMotionValueEvent(width, "change", () => {});

  const label = indexLabels[index] ?? ("0" + index);

  return (
    <div
      ref={ref}
      className="grid grid-cols-[auto_1fr_minmax(500px,2fr)] max-w-5xl mx-auto py-20 items-center gap-6"
    >
      <p className="text-9xl font-bold text-neutral-900">{label}</p>

      <motion.div
        className="h-px w-full hidden md:block bg-gradient-to-r from-neutral-800 to-neutral-600 rounded-full relative overflow-hidden self-center"
        style={{ width }}
      >
        <Beam className="top-0" />
      </motion.div>

      <div
        className="group px-9 pt-8 pb-10 rounded-3xl border border-neutral-800 bg-neutral-950 relative z-40 text-left"
        onMouseMove={handleMouseMove}
        style={{ minWidth: "500px" }}
      >
        <motion.div
          className="pointer-events-none absolute z-10 -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            maskImage: useMotionTemplate`
              radial-gradient(
                350px circle at ${mouseX}px ${mouseY}px,
                rgba(0,0,0,1),
                transparent 80%
              )
            `,
            WebkitMaskImage: useMotionTemplate`
              radial-gradient(
                350px circle at ${mouseX}px ${mouseY}px,
                rgba(0,0,0,1),
                transparent 80%
              )
            `,
          }}
        >
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [59, 130, 246],
              [135, 206, 250],
            ]}
            dotSize={3}
          />
        </motion.div>

        <p className="text-xl font-bold relative z-20 mt-2">{title}</p>
        <p className="text-neutral-400 mt-4 relative z-20">{description}</p>
      </div>
    </div>
  );
};
