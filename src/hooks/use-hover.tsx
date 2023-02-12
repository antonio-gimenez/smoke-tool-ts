
import { useEffect, useRef, useState } from "react";

type EventHandler = (isHovered: boolean) => void;

interface Props {
    initialRef: React.RefObject<HTMLElement>;
    handler: EventHandler;
    threshold?: number;
    timeout?: number;
}

function useHover(props: Props) {
    const { initialRef, handler, threshold = 0, timeout = 100 } = props;
    const ref = useRef<HTMLElement | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    useEffect(() => {
        const node = ref.current || initialRef.current;
        if (!node) {
            return;
        }

        if (node.offsetWidth < threshold || node.offsetHeight < threshold) {
            return;
        }

        let timeoutId: NodeJS.Timeout;

        const enterHandler = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsHovered(true);
                handler(true);
            }, timeout);
        };

        const leaveHandler = () => {
            clearTimeout(timeoutId);
            setIsHovered(false);
            handler(false);
        };

        const elements = [node, ...Array.from(node.querySelectorAll('*'))];
        elements.forEach(element => {
            element.addEventListener('mouseenter', enterHandler);
            element.addEventListener('mouseleave', leaveHandler);
        });

        return () => {
            elements.forEach(element => {
                element.removeEventListener('mouseenter', enterHandler);
                element.removeEventListener('mouseleave', leaveHandler);
            });
        };
    }, []);

    return [ref, isHovered] as const;
}


export default useHover;


