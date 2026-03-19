"use client";

import { useEffect, useState } from "react";

const NARROW_LAYOUT_QUERY = "(max-width: 1023px)";

export function useIsNarrowLayout() {
  // Always start false to match SSR output, then sync in useEffect
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(NARROW_LAYOUT_QUERY);
    const update = () => setIsNarrow(mediaQuery.matches);

    update();

    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isNarrow;
}
