import { useEffect, useState } from "react";


interface intersectionObserverProps {
    ref: React.RefObject<HTMLElement>;
    options?: IntersectionObserverInit;
}

const useObserver = ({ ref, options }: intersectionObserverProps) => {
    // State and setter for storing whether element is visible
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        // Create observer. IntersectionObserver takes a callback and an options object
        const observer = new IntersectionObserver(([entry]) => {
            // Update our state when observer callback fires
            setIsIntersecting(entry.isIntersecting);
        }, options);

        if (ref.current) {
            // Observe the target element
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // Unobserve the target element on clean up
                observer.unobserve(ref.current);
            }
        };
    }, []);

    // Return whether element is visible or not
    return isIntersecting;
};

export default useObserver;