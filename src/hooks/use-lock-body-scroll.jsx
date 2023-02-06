import { useLayoutEffect } from "react";

function useLockBodyScroll({ lock = false }) {
  useLayoutEffect(() => {
    if (!lock) return;
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when component unmounts
    return () => {
      // Add a delay to ensure that the body overflow isn't set too quickly
      setTimeout(() => {
        document.body.style.overflow = originalStyle;
      }, 100);
    };
  }, [lock]);
}

export default useLockBodyScroll;
