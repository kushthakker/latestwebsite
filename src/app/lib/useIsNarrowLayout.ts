"use client";

import { useEffect, useState } from "react";

const NARROW_LAYOUT_QUERY = "(max-width: 1023px)";

export function useIsNarrowLayout() {
  const [isNarrow, setIsNarrow] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(NARROW_LAYOUT_QUERY).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(NARROW_LAYOUT_QUERY);
    const update = () => setIsNarrow(mediaQuery.matches);

    update();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return isNarrow;
}
