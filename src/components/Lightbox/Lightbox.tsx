import { useRef, useState } from "react";
import useKeyPress from "../../hooks/use-key-press";
import useOnClickOutside from "../../hooks/use-on-click-outside";

interface LightboxProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
}


// https://fslightbox.com/react
const Lightbox: React.FC<LightboxProps> = ({ trigger, content, closeOnEscape, closeOnOverlayClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const lightBoxRef = useRef(null);
    useKeyPress({
        key: "Escape",
        handler: closeOnEscape ? () => { setIsOpen(false) } : () => { }
    });

    useOnClickOutside({
        ref: lightBoxRef,
        handler: closeOnOverlayClick ? () => setIsOpen(false) : () => { },
    });


    return (
        <>
            <div className="lightbox-trigger" onClick={() => setIsOpen(true)}>
                {trigger}
            </div>
            {isOpen && (
                <div className="backdrop-dark" >
                    <div className="lightbox-content" ref={lightBoxRef}>{content}</div>
                </div>
            )}
        </>
    );
};

export default Lightbox;