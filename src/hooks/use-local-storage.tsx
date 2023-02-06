import { useState, useEffect, useCallback } from "react";

interface localStorageProps {
  key: string;
  initialValue?: any;
}

function useLocalStorage({ key, initialValue }: localStorageProps): [any, (value: any) => void, () => void, () => boolean] {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const storageEventListener = useCallback(() => {
    const item = window.localStorage.getItem(key);
    setStoredValue(item ? JSON.parse(item) : initialValue);
  }, [key, initialValue]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("storage", storageEventListener);

    return () => {
      window.removeEventListener("storage", storageEventListener);
    };
  }, [storageEventListener]);

  const setValue = useCallback((value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      console.error(error);
    }
  }, [storedValue]);


  const itemExistsInLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key) ? true : false;
    }
    return false
  }, [key]);

  const removeItemFromLocalStorage = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  return [storedValue, setValue, removeItemFromLocalStorage, itemExistsInLocalStorage];
}

export default useLocalStorage;
