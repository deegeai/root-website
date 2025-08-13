"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/elements/button";
import { NavbarItem } from "./navbar-item";
import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "next-view-transitions";

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  rightNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  logo: any;
  locale: string;
};

export const DesktopNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
}: Props) => {
  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });

  // Helper to handle waitlist button click
  const handleWaitlistClick = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      className={cn(
        "w-full flex relative justify-between py-3 pl-6 pr-4 rounded-full transition duration-200 mx-auto",
        "border-none shadow-none outline-none"
      )}
      animate={{
        width: showBackground ? "80%" : "100%",
        background: showBackground ? "rgba(8, 8, 10, 0.01)" : "transparent",
        backdropFilter: showBackground ? "blur(12px)" : "none",
        WebkitBackdropFilter: showBackground ? "blur(12px)" : "none",
        boxShadow: "none",
        border: "none",
        outline: "none",
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <AnimatePresence>
        {showBackground && (
          <motion.div
            key={String(showBackground)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
            }}
            className="absolute inset-0 h-full w-full pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent,white)] rounded-full"
            style={{
              backgroundColor: "rgba(8, 8, 10, 0.01)",
            }}
          />
        )}
      </AnimatePresence>
      <div className="flex flex-row gap-2 items-center">
        <Logo locale={locale} image={logo?.image} />
        <div className="flex items-center gap-1.5">
          {leftNavbarItems.map((item) => {
            const isWaitlist =
              item.text.toLowerCase().includes("waitlist") || item.URL === "#waitlist";

            if (isWaitlist) {
              return (
                <Button
                  key={item.text}
                  variant="simple"
                  onClick={() => handleWaitlistClick()}
                  className="rounded-full border border-[#76777D] bg-[#08090A] text-white hover:bg-[#1E1F20] hover:border-[#76777D] transition-colors duration-200 pt-[0.55rem] pb-[0.625rem] px-4"
                >
                  {item.text}
                </Button>
              );
            } else {
              return (
                <NavbarItem
                  href={`/${locale}${item.URL}` as never}
                  key={item.text}
                  target={item.target}
                >
                  {item.text}
                </NavbarItem>
              );
            }
          })}
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        {rightNavbarItems.map((item, index) => (
          <Button
            key={item.text}
            variant={index === rightNavbarItems.length - 1 ? "primary" : "simple"}
            as={Link}
            href={`/${locale}${item.URL}`}
            className={
              index === rightNavbarItems.length - 1
                ? "rounded-full border border-[#76777D] bg-[#08090A] text-white hover:bg-[#1E1F20] hover:border-[#76777D] transition-colors duration-200 pt-[0.55rem] pb-[0.625rem] px-4"
                : "rounded-full pt-[0.55rem] pb-[0.625rem] px-4"
            }
          >
            {item.text}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};
