"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type CursorState = "normal" | "link" | "image" | "drag" | "view" | "read";

export function CustomCursor() {
  const [state, setState] = useState<CursorState>("normal");
  const [visible, setVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.body.classList.add("custom-cursor");
    setVisible(true);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='read']")) setState("read");
      else if (target.closest("[data-cursor='view']")) setState("view");
      else if (target.closest("[data-cursor='drag']")) setState("drag");
      else if (target.closest("[data-cursor='image']")) setState("image");
      else if (target.closest("a, button, [role='button']")) setState("link");
      else setState("normal");
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleOver);

    return () => {
      document.body.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [cursorX, cursorY]);

  if (!visible) return null;

  const labels: Record<CursorState, string | null> = {
    normal: null,
    link: null,
    image: "VIEW",
    drag: "DRAG",
    view: "VIEW",
    read: "READ",
  };

  const label = labels[state];
  const isExpanded = state !== "normal" && state !== "link";

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        animate={{
          width: isExpanded ? 64 : 12,
          height: isExpanded ? 64 : 12,
          x: isExpanded ? -32 : -6,
          y: isExpanded ? -32 : -6,
        }}
        transition={{ duration: 0.2 }}
        className="rounded-full border border-white flex items-center justify-center"
      >
        {label && (
          <span className="text-[8px] text-white tracking-widest font-medium">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
