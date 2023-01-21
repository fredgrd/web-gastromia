import React, { useEffect } from "react";

const useScrollListener = (onScroll: () => void) => {
  useEffect(() => {
    // Bind the event listener
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);
};

export default useScrollListener;
