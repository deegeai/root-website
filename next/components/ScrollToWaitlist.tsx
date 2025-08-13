"use client";
import { useEffect } from "react";

export default function ScrollToWaitlist() {
  useEffect(() => {
    if (window.location.hash === "#waitlist") {
      const el = document.getElementById("waitlist");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return null; // This component doesn't render anything visible
}
