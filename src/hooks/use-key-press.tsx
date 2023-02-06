import { useEffect, useCallback } from "react";

/**
 * @param key - The key to be pressed.
 * @param handler - The function to be called when the key is pressed.  
 */


interface KeyPressProps {
  key: string;
  handler: (event: KeyboardEvent) => void;
}

const useKeyPress = ({ key, handler }: KeyPressProps) => {
  const keyDownListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        handler(event);
      }
    },
    [key, handler]
  );

  useEffect(() => {
    if (typeof handler === "function") {
      document.addEventListener("keydown", keyDownListener);
    }
    return () => {
      document.removeEventListener("keydown", keyDownListener);
    };
  }, [keyDownListener]);
};

export default useKeyPress;
