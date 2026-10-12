"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

type CursorState = "normal" | "link" | "image" | "drag" | "view" | "read" | "explore";

export function CustomCursor() {
  const [state, setState] = useState<CursorState>("normal");
  const [visible, setVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 480, damping: 42 });
  const springY = useSpring(cursorY, { stiffness: 480, damping: 42 });

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
      if (target.closest("[data-cursor='explore']")) setState("explore");
      else if (target.closest("[data-cursor='read']")) setState("read");
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
    explore: "MAP",
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
          width: isExpanded ? 52 : 8,
          height: isExpanded ? 52 : 8,
          x: isExpanded ? -26 : -4,
          y: isExpanded ? -26 : -4,
          rotate: isExpanded ? 0 : 45,
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="border border-paper bg-transparent flex items-center justify-center"
      >
        {label && (
          <span className="font-coords text-[6px] text-paper tracking-[0.18em]">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
