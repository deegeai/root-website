"use client";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { Button } from "@/components/elements/button";
import { Logo } from "@/components/logo";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { LocaleSwitcher } from "../locale-switcher";

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

export const MobileNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
}: Props) => {
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();

  const [showBackground, setShowBackground] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 100) {
      setShowBackground(true);
    } else {
      setShowBackground(false);
    }
  });

  // Scroll smoothly to footer on waitlist button click
  const handleWaitlistClick = () => {
    setOpen(false); // close menu
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "flex justify-between bg-transparent items-center w-full rounded-md px-2.5 py-1.5 transition duration-200",
        showBackground &&
          " bg-neutral-900  shadow-[0px_-2px_0px_0px_var(--neutral-800),0px_2px_0px_0px_var(--neutral-800)]"
      )}
    >
      <Logo image={logo?.image} />

      <IoIosMenu className="text-white h-6 w-6" onClick={() => setOpen(!open)} />

      {open && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-start justify-start space-y-10 pt-5 text-xl text-zinc-600 transition duration-200 hover:text-zinc-800">
          <div className="flex items-center justify-between w-full px-5">
            <Logo locale={locale} image={logo?.image} />
            <div className="flex items-center space-x-2">
              <LocaleSwitcher currentLocale={locale} />
              <IoIosClose
                className="h-8 w-8 text-white"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[14px] px-8">
            {leftNavbarItems.map((navItem: any, idx: number) => {
              const isWaitlist =
                navItem.text.toLowerCase().includes("waitlist") ||
                navItem.URL === "#waitlist";

              if (isWaitlist) {
                return (
                  <button
                    key={`waitlist-btn-${idx}`}
                    onClick={() => handleWaitlistClick()}
                    className="relative max-w-[15rem] text-left text-2xl text-white bg-[#08090A] px-4 py-2 rounded-full hover:bg-[#1E1F20] transition-colors duration-200"
                  >
                    {navItem.text}
                  </button>
                );
              } else if (navItem.children && navItem.children.length > 0) {
                return navItem.children.map(
                  (childNavItem: any, childIdx: number) => (
                    <Link
                      key={`link=${childIdx}`}
                      href={`/${locale}${childNavItem.URL}`}
                      onClick={() => setOpen(false)}
                      className="relative max-w-[15rem] text-left text-2xl text-white"
                    >
                      {childNavItem.text}
                    </Link>
                  )
                );
              } else {
                return (
                  <Link
                    key={`link=${idx}`}
                    href={`/${locale}${navItem.URL}`}
                    onClick={() => setOpen(false)}
                    className="relative text-[26px] text-white"
                  >
                    {navItem.text}
                  </Link>
                );
              }
            })}
          </div>
          <div className="flex flex-row w-full items-start gap-2.5 px-8 py-4">
            {rightNavbarItems.map((item, index) => (
              <Button
                key={item.text}
                variant={index === rightNavbarItems.length - 1 ? "primary" : "simple"}
                as={Link}
                href={`/${locale}${item.URL}`}
              >
                {item.text}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
