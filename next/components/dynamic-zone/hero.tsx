"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ShootingStars from "../decorations/shooting-star";
import StarBackground from "../decorations/star-background";

import { Subheading } from "../elements/subheading";
import { Button } from "../elements/button";
import { motion } from "framer-motion";

import Chatbox from "@/components/chatbox"; // adjust path if needed

export const Hero = ({
  sub_heading,
  CTAs,
  locale,
}: {
  sub_heading: string;
  CTAs: any[];
  locale: string;
}) => {
  const logoUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/hero_e13881a0d6.svg`;

  return (
    <div className="h-screen overflow-hidden relative flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <StarBackground />
        <ShootingStars />
      </motion.div>

      {/* Logo Image */}
      <div className="relative z-10 py-3">
        <Image
          src={logoUrl}
          alt="Deege AI Logo"
          width={600}
          height={150}
          priority
        />
      </div>

      {/* Subheading */}
      <Subheading className="text-center mt-0 md:mt-6 text-base md:text-xl text-muted max-w-3xl mx-auto relative z-10">
        {sub_heading}
      </Subheading>

      {/* Chatbox */}
      <div className="relative z-10 mt-12">
        <Chatbox />
      </div>

      {/* CTA Buttons - commented out */}
      {/*
      <div className="flex space-x-2 items-center mt-8 relative z-10">
        {CTAs &&
          CTAs.map((cta) => (
            <Button
              key={cta?.id}
              as={Link}
              href={`/${locale}${cta.URL}`}
              {...(cta.variant && { variant: cta.variant })}
            >
              {cta.text}
            </Button>
          ))}
      </div>
      */}

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-80 w-full bg-gradient-to-t from-charcoal to-transparent" />
    </div>
  );
};
