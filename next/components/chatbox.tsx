"use client";
import React, { useState } from "react";
import { ArrowUp } from "lucide-react";

export default function Chatbox() {
  const [input, setInput] = useState("");

  return (
    <div style={{ width: "576px" }} className="relative mx-auto">
      <textarea
        className="resize-none w-full rounded-3xl pl-5 pr-12 pt-4 pb-16 bg-[#08090A] border border-[#474747] focus:border-[#828282] focus:outline-none focus:ring-0 placeholder:text-[#848484]"
        style={{ width: "576px", height: "102px", fontFamily: "'Roboto Mono', monospace", overflow: "hidden" }}
        placeholder="Enter a ticker or contract address..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="button"
        disabled={true}
        className="absolute bottom-4 right-2 rounded-full bg-[#848484] p-2 flex items-center justify-center shadow-md hover:bg-[#848484]"
        style={{ width: "36px", height: "36px" }}
        onClick={() => {
          console.log("Submit clicked with input:", input);
        }}
      >
        <ArrowUp color="#08090A" size={20} />
      </button>
      <style jsx>{`
        textarea::placeholder {
          font-family: 'Roboto Mono', monospace;
        }
      `}</style>
    </div>
  );
}
