import React from "react";
import { Boxes } from "./ui/BackgroundBoxes"; // Adjust path
import { cn } from "../../lib/utils"; // Adjust path

export function BackgroundBoxesDemo() {
  return (
    <div className="h-96 relative w-full overflow-hidden bg-neutral-900 flex flex-col items-center justify-center rounded-lg"> {/* Matches your neutral-950 theme */}
      <div className="absolute inset-0 w-full h-full bg-neutral-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <h1 className={cn("md:text-4xl text-xl text-neutral-100 relative z-20")}>
        AETOS Intelligence Dashboard {/* Customize to your app */}
      </h1>
      <p className="text-center mt-2 text-neutral-400 relative z-20">
        Enter a topic to unlock strategic insights with animated flair.
      </p>
    </div>
  );
}