"use client";
import React from "react";
import Image from "next/image"; // ✅ Next.js Image for better handling
import { TestimonialsSlider } from "./slider";
import { Subheading } from "../../elements/subheading";
import { AmbientColor } from "../../decorations/ambient-color";

export const Testimonials = ({
  sub_heading,
  testimonials,
}: {
  sub_heading: string;
  testimonials: object;
}) => {
  return (
    <div className="relative">
      <AmbientColor />

      <div className="pb-20">
        {/* Label with increased letter spacing */}
        <p className="text-sm text-[#76777D] text-center uppercase tracking-[0.2em] mb-8 mt-10">
          [ Testimonials ]
        </p>

        {/* Logo instead of heading */}
        <div className="flex justify-center pt-4">
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/COPILOT_437f8fee32.svg`}
            alt="Company Logo"
            className="mx-auto h-7 w-auto mb-7"
          />
        </div>

        <Subheading>{sub_heading}</Subheading>
      </div>

      {testimonials && (
        <div className="relative md:py-20 pb-20">
          <TestimonialsSlider testimonials={testimonials} />
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t from-charcoal to-transparent"></div>
    </div>
  );
};
