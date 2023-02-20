import { useState, useEffect } from "react";

type Axis = "x" | "y";

type UseScrollStateOptions = {
    initialState: boolean;
    offset?: number;
    axis?: Axis;
};

type UseScrollStateReturn = [boolean];

function useScrollState({
    initialState,
    offset = 20,
    axis = "y",
}: UseScrollStateOptions): UseScrollStateReturn {
    const [isScrolled, setIsScrolled] = useState(initialState);

    useEffect(() => {
        function handleScroll() {
            const scrollOffset = axis === "y" ? window.scrollY : window.scrollX;
            if (scrollOffset > offset) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [axis, offset]);

    return [isScrolled];
}

export default useScrollState;