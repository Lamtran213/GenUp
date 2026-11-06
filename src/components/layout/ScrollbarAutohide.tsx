"use client";

import { useEffect } from "react";

export function ScrollbarAutohide() {
  useEffect(() => {
    const timers = new WeakMap<EventTarget, ReturnType<typeof setTimeout>>();

    const onScroll = (e: Event) => {
      const target =
        e.target === document ? document.documentElement : (e.target as HTMLElement);
      if (!target || !target.classList) return;

      target.classList.add("is-scrolling");
      const prev = timers.get(target);
      if (prev) clearTimeout(prev);

      timers.set(
        target,
        setTimeout(() => {
          target.classList.remove("is-scrolling");
        }, 700)
      );
    };

    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  return null;
}

