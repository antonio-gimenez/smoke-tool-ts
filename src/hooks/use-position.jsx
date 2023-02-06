import { useState, useEffect } from "react";

function usePosition(triggerRef) {
  const [position, setPosition] = useState({});

  useEffect(() => {
    function position() {
      if (!triggerRef.current) {
        console.warn("triggerRef is not defined");
        return;
      }

      const triggerRect = triggerRef.current.getBoundingClientRect();

      setPosition({
        left: triggerRect.left + window.scrollX + "px",
        top: triggerRect.bottom + window.scrollY + "px",
      });
    }

    const handleResize = () => position();

    position();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", position);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", position);
    };
  }, [triggerRef]);

  return position;
}

export default usePosition;
