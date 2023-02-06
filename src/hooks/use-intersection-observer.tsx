import { useState, useEffect } from "react";

interface IntersectionObserverProps {
    ref: React.RefObject<HTMLElement>;
    options?: IntersectionObserverInit;
}

const useIntersectionObserver = ({ ref, options }: IntersectionObserverProps) => {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return isIntersecting;
};

export default useIntersectionObserver;