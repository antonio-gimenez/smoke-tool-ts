import { useEffect, useCallback } from "react";

function useOnClickOutside({ ref, handler }) {
  const clickOutsideListener = useCallback(
    (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    },
    [ref, handler]
  );

  useEffect(() => {
    document.addEventListener("mousedown", clickOutsideListener);
    document.addEventListener("touchstart", clickOutsideListener);

    return () => {
      document.removeEventListener("mousedown", clickOutsideListener);
      document.removeEventListener("touchstart", clickOutsideListener);
    };
  }, [clickOutsideListener]);
}

export default useOnClickOutside;
