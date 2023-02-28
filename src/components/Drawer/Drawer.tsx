

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import useKey from "../../hooks/useKey";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import useScrollLock from "../../hooks/useScrollLock";
import { generateUUID } from "../../utils/utils";

interface DrawerProps {
    children: React.ReactNode;
    position?: "left" | "right";
    id?: string;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    closeKey?: string;
    open?: boolean;
    header?: React.ReactNode;
    trigger?: React.ReactNode;
}
const Drawer = ({
    children,
    position = "right",
    id = generateUUID(),
    closeOnOverlayClick = true,
    closeOnEscape = true,
    closeKey = "Escape",
    open = false,
    header,
    trigger,
}: DrawerProps) => {

    const drawerRef = useRef<HTMLDivElement>(document.createElement("div"));
    const portalRef = useRef<HTMLDivElement>(document.createElement("div"));
    const [isOpen, setIsOpen] = useState(open || false);

    useEffect(() => {
        drawerRef.current = document.createElement("div");
        // portalRef.current = document.createElement("div");
    }, []);

    useOnClickOutside({
        ref: drawerRef,
        handler: closeOnOverlayClick ? () => setIsOpen(false) : () => { },
    });

    useKey({
        key: closeKey,
        handler: closeOnEscape ? () => setIsOpen(false) : () => { },
    });


    useScrollLock(document, isOpen);

    const drawerHeader = header ? (
        <div className="drawer-header">
            <span className="title">
                {header}
            </span>
            <CloseIcon onClick={() => setIsOpen(false)} />
        </div>
    ) : (
        <span>Close</span>
    );


    const drawerTrigger = trigger ? (
        <div onClick={() => setIsOpen(true)}>
            {trigger}
        </div>
    ) : (
        <div onClick={() => setIsOpen(true)}>
            <span>Open</span>
        </div>
    );

    const drawerContent = (
        <div className="drawer-overlay">
            <aside className={`drawer drawer-${position}`} ref={drawerRef} id={id}>
                {drawerHeader}
                {children}
            </aside>
        </div>
    );


    return (
        <>
            {drawerTrigger}
            <div ref={portalRef}>
                {isOpen && createPortal(drawerContent, portalRef.current)}
            </div>
        </>

    )
}


export default Drawer