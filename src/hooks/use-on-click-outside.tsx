import { useCallback, useEffect } from "react";

interface onClickOutsideProps {
  ref: React.RefObject<HTMLElement>;
  handler: (event: MouseEvent | TouchEvent) => void;
}

function useOnClickOutside({ ref, handler }: onClickOutsideProps) {
  const clickOutsideListener = useCallback(
    // useCallback is used to prevent the handler from being recreated on every render.
    (event: MouseEvent | TouchEvent
    ) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        // If the ref is not set or the ref contains the target, do nothing.
        return;
      }
      // Otherwise, call the handler.
      handler(event);
    },
    [ref, handler]
  );

  useEffect(() => {
    // Add the event listener when the component mounts.
    // Mousedown is used to detect clicks outside the ref.
    // Touchstart is used to detect taps outside the ref.
    document.addEventListener("mousedown", clickOutsideListener);
    document.addEventListener("touchstart", clickOutsideListener);

    return () => {
      // Remove the event listener when the component unmounts.
      document.removeEventListener("mousedown", clickOutsideListener);
      document.removeEventListener("touchstart", clickOutsideListener);
    };
  }, [clickOutsideListener]);
}

export default useOnClickOutside;
