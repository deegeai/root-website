"use client";
import React from "react";
import { Subheading } from "../../elements/subheading";
import { Container } from "../../container";
import { Card } from "./card";

export const HowItWorks = ({
  sub_heading,
  steps,
}: {
  sub_heading: string;
  steps: any;
}) => {
  return (
    <div className="mt-28">
      <Container className="py-20 max-w-7xl mx-auto relative z-40">
        {/* Label with letter spacing */}
        <p className="text-sm text-[#76777D] text-center uppercase tracking-[0.2em] mb-8">
          [ ROADMAP ]
        </p>

        {/* Logo image centered */}
        <div className="flex justify-center pt-4">
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/NEXT_0e2327e4db.svg`}
            alt="Company Logo"
            className="h-7 w-auto mb-7"
          />
        </div>

        {/* Subheading */}
        <Subheading className="max-w-3xl mx-auto text-center mb-16">
          {sub_heading}
        </Subheading>

        {/* Cards */}
        {steps &&
          steps.map(
            (item: { title: string; description: string }, index: number) => (
              <Card
                title={item.title}
                description={item.description}
                index={index + 1}
                key={"card" + index}
              />
            )
          )}
      </Container>
    </div>
  );
};
