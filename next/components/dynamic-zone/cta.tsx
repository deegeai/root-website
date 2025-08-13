"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../elements/button";
import { AmbientColor } from "../decorations/ambient-color";
import { Container } from "../container";
import Link from "next/link";
import { useFormspark } from "@formspark/use-formspark";

const FORMSPARK_FORM_ID = "jBxgyY6eL";

export const CTA = ({
  heading,
  sub_heading,
  CTAs,
  locale,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
}) => {
  const [email, setEmail] = useState("");
  const [submit, submitting] = useFormspark({
    formId: FORMSPARK_FORM_ID,
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");

    try {
      await submit({ email });
      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div id="waitlist" className="relative pt-6 pb-40">
      <AmbientColor />
      <Container className="flex flex-col md:flex-row justify-between items-center w-full px-8">
        <div className="flex flex-col">
          <motion.h2 className="text-white text-xl text-center md:text-left md:text-3xl font-bold mx-auto md:mx-0 max-w-xl ">
            {heading}
          </motion.h2>
          <p className="max-w-md mt-8 text-center md:text-left text-sm md:text-base mx-auto md:mx-0 text-neutral-400">
            {sub_heading}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-full bg-[#08090A] border border-[#76777D] placeholder-[#76777D] text-white px-4 outline-none focus:ring-1 focus:ring-[#76777D] text-sm w-80"
              autoComplete="email"
              disabled={submitting}
            />

            <Button
              type="submit"
              variant="simple"
              className="rounded-full border border-[#76777D] bg-[#08090A] text-white hover:bg-[#1E1F20] hover:border-[#76777D] transition-colors duration-200 pt-[0.55rem] pb-[0.625rem] px-4 h-10"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </form>

          {status === "success" && (
            <p className="mt-2 text-green-400 font-semibold">
              Your submission has been received!
            </p>
          )}
          {status === "error" && (
            <p className="mt-2 text-red-400 font-semibold">
              Sorry, something went wrong. Please try again.
            </p>
          )}

          <div className="mt-4 flex gap-4">
            {CTAs &&
              CTAs.map((cta, index) => {
                const isGreyButton = cta.variant === "simple";
                return (
                  <Button
                    as={Link}
                    key={index}
                    href={`/${locale}${cta.URL}`}
                    variant={cta.variant}
                    className={
                      isGreyButton
                        ? "rounded-full border border-[#76777D] bg-[#08090A] text-white hover:bg-[#1E1F20] hover:border-[#76777D] transition-colors duration-200 pt-[0.55rem] pb-[0.625rem] px-4"
                        : "py-3 rounded-full"
                    }
                  >
                    {cta.text}
                  </Button>
                );
              })}
          </div>
        </div>
      </Container>
    </div>
  );
};
